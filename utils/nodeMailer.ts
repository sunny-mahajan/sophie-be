import logger from "@lib/logger";
import nodemailer from "nodemailer";
const {
  FRONTEND_URL,
  MAIL_HOST,
  MAIL_PORT,
  MAIL_USERNAME,
  MAIL_PASSWORD,
  MAIL_FROM_EMAIL,
  MAIL_FROM_NAME,
  MAIL_LOGO,
} = process.env;

const fromEmail = MAIL_FROM_EMAIL || "no-reply@sophie.com";
const fromName = MAIL_FROM_NAME || "Sophie";

const auth = { user: MAIL_USERNAME, pass: MAIL_PASSWORD };

const nodeMailerTransportConfig = {
  host: MAIL_HOST || "",
  port: MAIL_PORT ? parseInt(MAIL_PORT) : 587,
  secure: false,
  ...(MAIL_HOST?.includes("localhost") ? {} : { auth }),
  ...(MAIL_HOST?.includes("localhost")
    ? {
        tls: {
          rejectUnauthorized: false, // optional
        },
      }
    : {}),
};

export const transporter = nodemailer.createTransport(
  nodeMailerTransportConfig
);

export async function sendInvitationEmail(
  email: string,
  token: string
): Promise<void> {
  try {
    const mailOptions = {
      from: {
        name: fromName,
        address: fromEmail,
      },
      to: email,
      subject: "Invitation to Join Our Platform",
      html: `<!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Welcome to Our Platform</title>
            <link
              href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap"
              rel="stylesheet"
            />
            <style>
              * {
                box-sizing: border-box;
              }
            </style>
          </head>
          <body
            style="
              font-family: 'Inter', Arial, sans-serif;
              line-height: 1.6;
              margin: 0;
              padding: 0;
              background-color: #f3f8f9;
              min-height: 600px;
              position: relative;
              padding: 40px;
              display: flex;
              align-items: center;
              justify-content: center;
            "
          >
            <table width="100%" border="0" cellspacing="0" cellpadding="0">
              <tr>
                <td align="center">
                  <table
                    cellpadding="0"
                    cellspacing="0"
                    width="100%"
                    style="
                      position: absolute;
                      transform: translate(-50%, -50%);
                      left: 50%;
                      top: 50%;
                      max-width: 600px;
                      width: 95%;
                      background-color: #ffffff;
                      border-radius: 8px;
                      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                      text-align: center;
                    "
                  >
                    <tr>
                      <td style="padding: 40px 70px; height: 350px">
                        <table cellpadding="0" cellspacing="0" width="100%">
                          <tr>
                            <td style="padding-bottom: 30px">
                              <img
                                style="display: inline-block; width: 120px"
                                src="${MAIL_LOGO}"
                                alt="Sophie Logo"
                              />
                            </td>
                          </tr>
                          <tr>
                            <td style="padding-bottom: 20px">
                              <h1
                                style="
                                  color: #333333;
                                  font-size: 24px;
                                  margin: 0;
                                  font-weight: 600;
                                  text-align: center;
                                "
                              >
                                You're Invited to Join Sophie!
                              </h1>
                            </td>
                          </tr>
                          <tr>
                            <td
                              style="
                                color: #000;
                                padding-bottom: 20px;
                                font-size: 14px;
                                text-align: left;
                              "
                            >
                              <p style="margin: 0 0 10px">Hi there,</p>
                              <p style="margin: 0 0 0">
                                You've been invited to join Sophie - the smart way to
                                manage tasks, SOPs, and workflows effortlessly.
                              </p>
                              <p style="margin: 0 0 10px">
                                Get started now and collaborate seamlessly with your
                                team.
                              </p>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding-bottom: 20px; text-align: left">
                              <a
                                href="${FRONTEND_URL}/auth/sign-up?token=${token}"
                                style="
                                  display: inline-block;
                                  background-color: #5242ed;
                                  color: #ffffff;
                                  text-decoration: none;
                                  padding: 10px 20px;
                                  border-radius: 5px;
                                  font-size: 14px;
                                  font-weight: 500;
                                "
                                >Accept Invitation</a
                              >
                            </td>
                          </tr>
                          <tr>
                            <td
                              style="padding-top: 20px; border-top: 1px solid #eeeeee"
                            >
                              <p
                                style="
                                  color: #000;
                                  font-size: 11px;
                                  text-align: center;
                                  margin: 0;
                                "
                              >
                                © ${new Date().getFullYear()} Sophie. All rights
                                reserved.
                              </p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
        `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    logger.error(error);
    throw new Error(
      "Failed to send email invitation. Please try again later or contact support if the issue persists."
    );
  }
}

export async function sendResetPasswordEmail(
  email: string,
  name: string,
  token: string
): Promise<void> {
  try {
    const mailOptions = {
      from: {
        name: fromName,
        address: fromEmail,
      },
      to: email,
      subject: "Reset Your Sophie Password",
      html: `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Reset Your Password</title>
            <link
              href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap"
              rel="stylesheet"
            />
          </head>
          <body
            style="
              font-family: 'Inter', Arial, sans-serif;
              line-height: 1.6;
              margin: 0;
              padding: 0;
              min-height: 544px;
              position: relative;
              padding: 50px;
              display: flex;
              justify-content: center;
              align-items: center;
              background-color: #959595;
            "
          >
            <table
              cellpadding="0"
              cellspacing="0"
              width="100%"
              style="
                position: absolute;
                transform: translate(-50%, -50%);
                left: 50%;
                top: 50%;
                max-width: 600px;
                width: 95%;
                margin: 0 auto;
                background-color: #ffffff;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              "
            >
              <tr>
                <td style="padding: 30px">
                  <table cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td style="padding-bottom: 30px">
                        <img
                          src="${MAIL_LOGO}"
                          alt="Sophie Logo"
                          style="display: inline-block; width: 100px"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td style="padding-bottom: 20px">
                        <h1
                          style="
                            color: #333333;
                            font-size: 20px;
                            margin: 0;
                            font-weight: 600;
                          "
                        >
                          Reset Your Password
                        </h1>
                      </td>
                    </tr>
                    <tr>
                      <td style="color: #000; font-size: 14px">
                        <p style="margin: 0 0 15px">Hello ${name},</p>
                        <p style="margin: 0 0 15px">
                          We received a request to reset your password. Click the button
                          below to set a new password:
                        </p>
                        <p style="margin: 0 0 30px">
                          This link will expire in 15 minutes for security reasons. If you
                          didn’t request a password reset, please ignore this email, and
                          your password will remain unchanged.
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding-bottom: 40px; text-align: center">
                        <a
                          href="${FRONTEND_URL}/auth/reset-password?token=${token}"
                          style="
                            display: inline-block;
                            background-color: #106210;
                            color: #ffffff;
                            text-decoration: none;
                            padding: 10px 20px;
                            border-radius: 5px;
                            font-weight: 600;
                          "
                          >Reset your password</a
                        >
                      </td>
                    </tr>
                    <tr>
                      <td style="padding-top: 20px; border-top: 1px solid #eeeeee">
                        <p
                          style="
                            color: #000;
                            font-size: 11px;
                            text-align: center;
                            margin: 0;
                          "
                        >
                          © ${new Date().getFullYear()} Sophie. All rights reserved.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    logger.error(error);
    throw new Error(
      "Failed to send Reset Password email. Please try again later or contact support if the issue persists."
    );
  }
}

export async function sendWelcomeEmail(
  email: string,
  name: string
): Promise<void> {
  try {
    const mailOptions = {
      from: {
        name: fromName,
        address: fromEmail,
      },
      to: email,
      subject: "Welcome to Sophie",
      html: `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Welcome to Sophie</title>
            <link
              href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap"
              rel="stylesheet"
            />
          </head>
          <body
            style="
              font-family: 'Inter', Arial, sans-serif;
              line-height: 1.6;
              margin: 0;
              padding: 0;
              background-color: #f3f8f9;
              min-height: 350px;
              position: relative;
              padding: 80px 40px;              
              display: flex;
              align-items: center;
              justify-content: center;
            "
          >
            <table
              cellpadding="0"
              cellspacing="0"
              width="100%"
              style="
                max-width: 600px;
                width: 95%;
                background-color: #ffffff;
                border-radius: 8px;
                margin: 0 auto;
                text-align: center
              "
            >
              <tr>
                <td style="padding: 30px;">
                  <table cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td style="padding-bottom: 30px">
                        <img
                          src="${MAIL_LOGO}"
                          alt="Sophie Logo"
                          style="display: inline-block; width: 100px"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td style="padding-bottom: 20px">
                        <h1
                          style="
                            color: #333333;
                            font-size: 20px;
                            margin: 0;
                            font-weight: 600;
                          "
                        >
                          Welcome to Sophie
                        </h1>
                      </td>
                    </tr>
                    <tr>
                      <td style="color: #000; padding-bottom: 20px; font-size: 14px">
                        <p style="margin: 0 0 15px">Hello ${name}</p>
                        <p style="margin: 0 0 20px">
                          We are excited to have you join the Platform. Reach out to help@sophie.com for any assistance.
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding-top: 20px; border-top: 1px solid #eeeeee">
                        <p
                          style="
                            color: #000;
                            font-size: 11px;
                            text-align: center;
                            margin: 0;
                          "
                        >
                          © ${new Date().getFullYear()} Sophie. All rights reserved.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    logger.error(error);
    throw new Error(
      "Failed to send Welcome email. Please try again later or contact support if the issue persists."
    );
  }
}
