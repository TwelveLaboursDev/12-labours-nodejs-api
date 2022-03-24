const htmlTemplate=
`<!DOCTYPE html>
<body>
  <div style='padding:10px'>
    <h3>Email Confirmation</h3>
    <br/><br/>
    <div>Please verify your email to gain access to 12 Labours portal.</div>
    <br/><br/>
    <div>Your link is active for [tokenExpiry]. After that, you will need to resend the verification email.</div>
    <br/><br/>
    <div>
      <a href='[confirmLink]'>Click here to confirm email.</a>
    </div>
  </div>
</body>`

const textTemplate=
  `Email Confirmation \n\n\n
  Please verify your email to gain access to 12 Labours portal. \n\n
  Your link is active for [tokenExpiry]. After that, you will need to resend the verification email.\n\n\\n
  Please copy and paste the below link in your browser to activate your account.\n\n
  [confirmLink]`

const subjectTemplate='Please verify your email'


module.exports={subjectTemplate,textTemplate,htmlTemplate}