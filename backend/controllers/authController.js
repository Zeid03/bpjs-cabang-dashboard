// backend/controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const prisma = require('../src/prisma');

// === Validation Schemas ===
const loginSchema = z.object({
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(8, 'Password minimal 8 karakter').max(72),
});

const changePwdSchema = z.object({
  oldPassword: z.string().min(8),
  newPassword: z.string().min(8),
});

const forgotSchema = z.object({
  email: z.string().email(),
});

const resetSchema = z.object({
  token: z.string().min(24),
  newPassword: z.string().min(8),
});

// === Helpers ===
function signToken(user) {
  const payload = {
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role || 'admin',
    iss: process.env.JWT_ISSUER,
    aud: process.env.JWT_AUD,
  };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
}

// Buat transporter SMTP sekali, reuse di tiap request
const smtpTransporter = (() => {
  // Jika variabel SMTP tidak diisi, kembalikan null → fallback ke console.log
  if (!process.env.SMTP_HOST && !process.env.SMTP_USER) return null;

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT || 465),
    secure: String(process.env.SMTP_SECURE || 'true') === 'true',
    auth: process.env.SMTP_USER
      ? {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        }
      : undefined,
  });
})();

// === Controllers ===
async function login(req, res) {
  try {
    const parse = loginSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({ message: 'Input tidak valid', issues: parse.error.flatten() });
    }
    const { email, password } = parse.data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Email atau password salah' });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ message: 'Email atau password salah' });

    const token = signToken(user);

    return res.json({
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role || 'admin' },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Login gagal' });
  }
}

async function changePassword(req, res) {
  try {
    const parsed = changePwdSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: 'Input tidak valid', issues: parsed.error.flatten() });
    }
    const { oldPassword, newPassword } = parsed.data;
    const userId = req.user?.id;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });

    const ok = await bcrypt.compare(oldPassword, user.passwordHash);
    if (!ok) return res.status(400).json({ message: 'Password lama salah' });

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash },
    });

    return res.json({ message: 'Password berhasil diperbarui' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Gagal memperbarui password' });
  }
}

async function forgotPassword(req, res) {
  try {
    const parsed = forgotSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: 'Input tidak valid', issues: parsed.error.flatten() });
    }
    const { email } = parsed.data;

    const user = await prisma.user.findUnique({ where: { email } });
    // Jangan bocorkan keberadaan email
    if (!user) return res.json({ message: 'Jika email terdaftar, tautan reset telah dikirim' });

    const token = crypto.randomBytes(24).toString('hex'); // 48 chars
    const ttlMs = Number(process.env.RESET_TOKEN_TTL_MS || 60 * 60 * 1000); // default 1 jam
    const expires = new Date(Date.now() + ttlMs);

    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken: token, resetExpires: expires },
    });

    const appUrl = process.env.APP_URL || process.env.FRONTEND_URL || 'http://localhost:5173';
    const link = `${appUrl.replace(/\/+$/,'')}/reset?token=${token}`;

    // Kirim email jika SMTP tersedia, kalau tidak → tetap log link (untuk dev)
    if (smtpTransporter) {
      try {
        await smtpTransporter.sendMail({
          from: process.env.SMTP_FROM || process.env.SMTP_USER,
          to: email,
          subject: 'Reset Password BPJS Dashboard',
          text: `Halo ${user.name || 'Admin'},\n\nKlik tautan berikut untuk mengatur ulang password:\n${link}\n\nTautan berlaku hingga ${expires.toLocaleString()}.`,
          html: `
            <p>Halo ${user.name || 'Admin'},</p>
            <p>Klik tautan berikut untuk mengatur ulang password:</p>
            <p><a href="${link}" target="_blank" rel="noopener noreferrer">${link}</a></p>
            <p><small>Tautan berlaku hingga ${expires.toLocaleString()}.</small></p>
          `,
        });
      } catch (e) {
        console.error('[MAIL ERROR]', e);
        // Fallback log supaya tetap bisa dites saat dev
        console.log('[RESET LINK]', link);
      }
    } else {
      console.log('[RESET LINK]', link);
    }

    return res.json({ message: 'Jika email terdaftar, tautan reset telah dikirim' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Gagal memproses lupa password' });
  }
}

async function resetPassword(req, res) {
  try {
    const parsed = resetSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: 'Input tidak valid', issues: parsed.error.flatten() });
    }
    const { token, newPassword } = parsed.data;

    const user = await prisma.user.findFirst({
      where: { resetToken: token, resetExpires: { gt: new Date() } },
    });
    if (!user) return res.status(400).json({ message: 'Token reset tidak valid atau kadaluarsa' });

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash, resetToken: null, resetExpires: null },
    });

    return res.json({ message: 'Password berhasil direset. Silakan login.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Gagal mereset password' });
  }
}

module.exports = { login, changePassword, forgotPassword, resetPassword };
