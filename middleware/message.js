const verifyHTMLTemplate = `<!DOCTYPE html>
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
                            </body>`;

const verifyTextTemplate = `Email Confirmation \n\n
                            Please verify your email to gain access to 12 Labours portal. \n\n
                            Your link is active for [tokenExpiry]. After that, you will need to resend the verification email. \n\n\
                            Please copy and paste the below link in your browser to activate your account. \n\n
                            [confirmLink]`;

const verifySubjectTemplate = "Please verify your email";

const resetHTMLTemplate = `<!DOCTYPE html>
                            <body>
                                <div style='padding:10px'>
                                    <h3>Reset Password</h3>
                                    <br />
                                    <div>We have received a request to reset your password.</div>
                                    <br />
                                    <div>A temporary password has been generated for you: </div>
                                    <br />
                                    <div style="background-color: lightgray; width: fit-content;">
                                        <p style="font-size: larger;">[tempPass]</p>
                                    </div>
                                    <br />
                                    <div>We highly recommend changing the temporary password as soon as possible.</div>
                                    <br />
                                    <div>You can reset your password by clicking the below link:</div>
                                    <br />
                                    <br />
                                    <div>
                                        <a href="[resetLink]">Click here to reset your password</a>
                                    </div>
                                    <br />
                                    <br />
                                    <div>This link will expire after [tokenExpiry].</div>
                                </div>
                            </body>`;

const resetTextTemplate = `Reset Password \n\n
                          We have received a request to reset your password. \n\n
                          A temporary password has been generated for you: \n\n
                          [tempPass] \n\n
                          We highly recommend changing the temporary password as soon as possible. \n\n
                          Please copy and paste the below link in your browser to reset your password: \n\n
                          [resetLink] \n\n
                          This link will expire after [tokenExpiry].`;

const resetSubjectTemplate = "Please reset your password";

module.exports = {
  verifyHTMLTemplate,
  verifyTextTemplate,
  verifySubjectTemplate,
  resetHTMLTemplate,
  resetTextTemplate,
  resetSubjectTemplate,
};
