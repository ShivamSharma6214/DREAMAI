import nodemailer from 'nodemailer';

/**
 * Send match notification emails to users whose dreams connected
 */
export async function sendMatchEmail(
  userEmails: string[],
  story: string,
  matchId: string
): Promise<void> {
  const gmailUser = process.env.GMAIL_USER;
  const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;

  if (!gmailUser || !gmailAppPassword) {
    console.error('Gmail credentials not configured (GMAIL_USER or GMAIL_APP_PASSWORD missing)');
    return;
  }

  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailAppPassword,
      },
    });

    // Determine base URL for links
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const dashboardUrl = `${baseUrl}/dashboard`;

    // Email HTML template
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            border-radius: 10px 10px 0 0;
            text-align: center;
          }
          .content {
            background: #f9fafb;
            padding: 30px;
            border-radius: 0 0 10px 10px;
          }
          .story {
            background: white;
            padding: 20px;
            border-left: 4px solid #667eea;
            margin: 20px 0;
            border-radius: 4px;
            white-space: pre-wrap;
          }
          .button {
            display: inline-block;
            background: #667eea;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            margin-top: 20px;
            font-weight: bold;
          }
          .footer {
            text-align: center;
            color: #6b7280;
            font-size: 12px;
            margin-top: 30px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>✨ Your Dream Connected! ✨</h1>
        </div>
        <div class="content">
          <p>Your dream has connected with others across the collective unconscious. Here's the story that emerged from your shared visions:</p>

          <div class="story">${story}</div>

          <p>This connection was discovered through the symbolic patterns and themes your dreams share with others.</p>

          <p style="text-align: center;">
            <a href="${dashboardUrl}" class="button">View Your Dashboard</a>
          </p>

          <div class="footer">
            <p>Match ID: ${matchId}</p>
            <p>DreamAI - Connecting the collective unconscious</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email to each user
    const emailPromises = userEmails.map(async (email) => {
      try {
        await transporter.sendMail({
          from: `"DreamAI" <${gmailUser}>`,
          to: email,
          subject: 'Your dream connected with others on DreamAI',
          html: htmlContent,
        });
        console.log(`Match notification sent to ${email}`);
      } catch (error) {
        console.error(`Failed to send email to ${email}:`, error);
        // Don't throw - fail silently for individual emails
      }
    });

    await Promise.allSettled(emailPromises);
  } catch (error) {
    console.error('Email sending error:', error);
    // Fail silently - don't throw
  }
}
