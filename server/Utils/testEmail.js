require("dotenv").config();

const sendEmail = require("./sendEmail");

const testEmail = async () => {
  try {
    const info = await sendEmail({
      to: process.env.EMAIL_USER,
      subject: "M.R.K TRADERS ERP - Email Test",

      text: "Your M.R.K TRADERS ERP email system is working successfully.",

      html: `
        <div style="
          max-width: 520px;
          margin: auto;
          font-family: Arial, sans-serif;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          overflow: hidden;
        ">

          <div style="
            background: #15803d;
            padding: 25px;
            text-align: center;
            color: white;
          ">
            <h2 style="margin: 0;">
              M.R.K TRADERS
            </h2>

            <p style="margin: 8px 0 0;">
              ERP Security System
            </p>
          </div>

          <div style="padding: 30px;">
            <h3>Email Configuration Successful ✅</h3>

            <p>
              Your M.R.K TRADERS ERP email system is now working correctly.
            </p>

            <p>
              This email service will be used for:
            </p>

            <ul>
              <li>Login OTP</li>
              <li>Forgot Password OTP</li>
              <li>Account Verification</li>
              <li>Security Notifications</li>
            </ul>

            <p style="margin-top: 30px; color: #6b7280;">
              M.R.K TRADERS ERP
            </p>
          </div>

        </div>
      `,
    });

    console.log("✅ EMAIL SENT SUCCESSFULLY");
    console.log("Message ID:", info.messageId);

    process.exit(0);
  } catch (error) {
    console.error("❌ EMAIL SEND FAILED");
    console.error(error.message);

    process.exit(1);
  }
};

testEmail();