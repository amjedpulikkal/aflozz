const nodemailer = require("nodemailer")
 const jwt = require("./JWT")


const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "aflozz010@gmail.com",
    pass: "rczk fcfb eqpp emmy"
  }

})

function sendmail(userEmail, otp, name) {
  console.log("email");
  console.log(userEmail);
  const maile = {
    from: "aflozz010@gmail.com",
    to: userEmail,
    subject: "Hello from Aflozz",
    text: "This is a test email sent using Nodemailer.",
    html: ` 
        <body>
          <div style="display: flex; align-items: center; justify-content: center; flex-direction: column; margin-top: 1.25rem; font-family: Nunito, sans-serif"  container>
            <section style="max-width: 42rem; background-color: #fff;">
              <div style="height: 200px; background-color: #365cce; width: 100%; color: #fff; display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 1.25rem;">
                <div style="display: flex; flex-direction: column; gap: 1.25rem;">
                <div  style="font-size: 24px; font-weight: bold; text-transform: capitalize; text-align :center">
                    Verify your E-mail Address
                  </div>
                </div>
              </div>
              <main style="margin-top: 2rem; padding-left: 1.25rem; padding-right: 1.25rem;">
                <h4 style="color: #374151;">Hello ${name},</h4>
                <p style="line-height: 1.5; color: #4b5563;">
                  Please use the following One Time Password(OTP)
                </p>
                <div style="display: flex; align-items: center; text-align: cente; justify-content: center; margin-top: 1rem; gap: 20px; font-size: 40px;">
                  <p>
                  ${otp}
                  </p>
                </div>
                <p style="margin-top: 0.5rem; line-height: 1.75; color: #4b5563;">
                  This passcode will only be valid for the next
                <p style="margin-top: 2rem; color: #4b5563; ">
                  Thank you, <br />
                  Aflozz Team
                </p>
              </main>
            </section>
          </div>
        </body>`
  }

  return new Promise((res, rej) => {

    transport.sendMail(maile, (err, info) => {
      console.log(err)
      console.log(info);
      return err ? rej(false) : res(true)
    })
  })
}



function sendmailForPassword(userEmail,name) {
  const link = jwt.create_token({Email:userEmail})
  console.log(link);
  console.log(userEmail);
  const maile = {
    from: "aflozz010@gmail.com",
    to: userEmail,
    subject: "Hello from Aflozz",
    text: "This is a test email sent using Nodemailer.",
    html: ` 
        <body>
          <div style="display: flex; align-items: center; justify-content: center; flex-direction: column; margin-top: 1.25rem; font-family: Nunito, sans-serif"  container>
            <section style="max-width: 42rem; background-color: #fff;">
              <div style="height: 200px; background-color: #365cce; width: 100%; color: #fff; display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 1.25rem;">
                <div style="display: flex; flex-direction: column; gap: 1.25rem;">
                <div  style="font-size: 24px; font-weight: bold; text-transform: capitalize; text-align :center">
                    Verify your E-mail Address
                  </div>
                </div>
              </div>
              <main style="margin-top: 2rem; padding-left: 1.25rem; padding-right: 1.25rem;">
                <h4 style="color: #374151;">Hello ${name},</h4>
                <p style="margin-top: 0.5rem; line-height: 1.75; color: #4b5563;">
                  This passcode will only be valid for the next
                  <span style="font-weight: bold;"> 2 minutes</span>. If the passcode
                  does not work, you can use this login verification link:
                </p>
                <a href="https://www.aflozz.shop/forgot/password/${link}" style="padding-left: 1.25rem; padding-right: 1.25rem; padding-top: 0.5rem; padding-bottom: 0.5rem; margin-top: 1.5rem; font-size: 14px; font-weight: bold; text-transform: capitalize; background-color: #f97316; color: #fff; transition-property: background-color; transition-duration: 300ms; transform: none; border-radius: 0.375rem; border-width: 1px; border: none; outline: none; cursor: pointer;">
                  Verify email
                </a>
                <p style="margin-top: 2rem; color: #4b5563; ">
                  Thank you, <br />
                  Aflozz Team
                </p>
              </main>
            </section>
          </div>
        </body>`
  }

  return new Promise((res, rej) => {

    transport.sendMail(maile, (err, info) => {
      console.log(info);
      return err ? rej(false) : res(true)
    })
  })
}



module.exports = {sendmail,sendmailForPassword}
