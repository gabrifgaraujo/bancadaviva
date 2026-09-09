const SibApiV3Sdk = require("sib-api-v3-sdk");

// Brevo (ex-Sendinblue) — email transacional via API HTTP.
// Render free bloqueia portas SMTP (465/587), então NADA de nodemailer aqui,
// e nada de Resend sem domínio verificado.
const client = SibApiV3Sdk.ApiClient.instance;
client.authentications["api-key"].apiKey = process.env.BREVO_API_KEY;

const transactionalApi = new SibApiV3Sdk.TransactionalEmailsApi();

async function enviarEmail({ destinatario, assunto, html }) {
  await transactionalApi.sendTransacEmail({
    sender: { email: process.env.EMAIL_USER, name: "BancadaViva" },
    to: [{ email: destinatario }],
    subject: assunto,
    htmlContent: html,
  });
}

module.exports = { enviarEmail };
