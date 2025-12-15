const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // 推荐在 .env 中配置以下项:
    // EMAIL_HOST=smtp.qq.com
    // EMAIL_PORT=465
    // EMAIL_SECURE=true
    // EMAIL_USER=your_email@qq.com
    // EMAIL_PASS=your_smtp_auth_code (授权码，不是登录密码)

    const host = process.env.EMAIL_HOST || 'smtp.qq.com';
    const port = process.env.EMAIL_PORT ? Number(process.env.EMAIL_PORT) : 465;
    const secure = process.env.EMAIL_SECURE ? process.env.EMAIL_SECURE === 'true' : (port === 465);

    const transporter = nodemailer.createTransport({
        host,
        port,
        secure,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    // 尝试验证连接配置（可帮助排查配置错误）
    try {
        await transporter.verify();
    } catch (verifyErr) {
        // 抛出带上下文的错误，调用方可捕获并记录
        throw new Error(`邮件服务器验证失败: ${verifyErr.message}`);
    }

    const mailOptions = {
        from: process.env.EMAIL_FROM || `E-Shop Purchasing <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject || '通知',
        // 优先使用 HTML（如果提供），否则使用纯文本
        text: options.text || options.message || '',
        html: options.html || undefined,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        return info; // 返回信息，便于调用方记录或调试
    } catch (sendErr) {
        throw new Error(`发送邮件失败: ${sendErr.message}`);
    }
};

module.exports = sendEmail;
