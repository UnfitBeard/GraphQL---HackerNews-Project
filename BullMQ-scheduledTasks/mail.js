import nodemailer from "nodemailer";

(async () => {
  // Create a test account (recommended for Ethereal)

  const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    auth: {
      user: "dicksonmayoyo1@gmail.com",
      pass: "@Kdirving123",
    },
  });

  try {
    const info = await transporter.sendMail({
      from: '"Maddison Foo Koch" <maddison53@ethereal.email>',
      to: "njunge995@gmail.com",
      subject: "Hello ✔",
      text: "Hello world?",
      html: "<b>Hello world?</b>",
    });

    console.log("Message sent:", info.messageId);
  } catch (err) {
    console.error("Error sending mail:", err);
  }
})();