/* eslint-disable @typescript-eslint/indent */
import { createTransport, getTestMessageUrl } from 'nodemailer';

const transport = createTransport({
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

function makeResetEmail(token: string, email: string): string {
  return `
    <div style="
    padding: 20px;
    font-family: sans-serif;
    color: gray;
    line-height: 2;
    font-size: 16px;"
    >
    <p>You can reset your password <a href="${
      process.env.FRONTEND_URL
    }/reset?token=${token}&email=${encodeURIComponent(email)}">here</a></p>
    <p></p>
    <p>Your friends at Letter Sender</p>
    </div>
    `;
}

export async function sendPasswordResetEmail(
  token: string,
  to: string
): Promise<void> {
  // email user a token
  const info = await transport.sendMail({
    to,
    from: 'test@exmple.com',
    subject: 'Letter Sender password reset request',
    html: makeResetEmail(token, to),
  });

  if (process.env.MAIL_USER.includes('ethereal.email')) {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    console.log(`Mail Sent. Preview at: ${getTestMessageUrl(info)}`);
  }
}
