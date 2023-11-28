const emailBody = (token: string, buttonText: string, firstname: string) => {
  const resetUrl = `https://passporter-client.vercel.app/reset-password?token=${token}`;
  const emailText = `<!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset</title>
    <style>

        
    body {
                background-color: #fff;
                font-family: 'Arial', sans-serif;
color: #333;
            }
    
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                border: 1px solid #ccc;
            }
    
            .header {
                text-align: center;
                margin-bottom: 20px;
            }
    
            .header h1 {
                font-size: 24px;
                font-weight: bold;
                color: #0d7836;
            }
    
            .content {
                line-height: 1.5;
            }
    
            .button-container {
                text-align: center;
                margin-top: 20px;
            }
    
            .button-container a {
                display: inline-block;
                padding: 10px 20px;
                background-color: #0d7836;
                color: #fff;
                text-decoration: none;
                border-radius: 5px;
            }
    
            .footer {
                text-align: center;
                margin-top: 20px;
            }
    
            .footer p {
                font-size: 12px;
            }

            .note {
              margin-top: 20px;
              font-size: 12px;
              color: #777;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Change Your Password!</h1>
            </div>
    
            <div class="content">
                <p>Hello ${firstname},</p>
    
                <p>You recently requested a password reset for your account, please click the following link to reset your password:</p>
    
                <div class="button-container">
                    <a href=${resetUrl}>
                    ${buttonText}
                    </a>
                </div>
    
                <p>Please note that this link will expire in 10 minutes.</p>
    
                <p class="note">If you have any questions or concerns, please contact our support team at support@passporter.com.</p>
            </div>
    
            <div class="footer">
                <p>&copy; 2023 Passporter</p>
            </div>
        </div>
    </body>
  
  </html>
    `;

  return emailText;
};

export default emailBody;
