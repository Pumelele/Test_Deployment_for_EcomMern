import nodemailer from 'nodemailer';

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      // port: '587',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    export const sendEmailController = (req, res) => {
      try {
      
        const { name, email, phone, msg,} = req.body;
        
    
        //validation
        if (!name || !email || !msg || !phone) {
          return res.status(500).send({
            success: false,
            message: "Please Provide All Fields",
          });
        }
        //email matter
        transporter.sendMail({
          to: "plqatatest@outlook.com",
          from: "plqatatest@outlook.com",
          subject: "Regarding Mern Portfolio App",
          html: `
            <h5>Detail Information</h5>
            <ul>
              <li><p>Name : ${name}</p></li>
              <li><p>Email : ${email}</p></li>
              <li><p>Contact : ${phone}</p></li>
              <li><p>Message : ${msg}</p></li>
            </ul>
          `,
        });
    
        return res.status(200).send({
          success: true,
          message: "Your Qoute has been sent",
        });
      } catch (error) {
        console.log(error);
        return res.status(500).send({
          success: false,
          message: "Send Email API Error",
          error,
        });
      }
    };

   
 