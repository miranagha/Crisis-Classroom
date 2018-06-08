var async = require('async');
var nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');

const sqlite3 = require('sqlite3').verbose();

const filename = './database/crisisdb.sqlit';
let db = new sqlite3.Database(filename);

const ResetPassword = (req, res) => {
  async.waterfall(
    [
      (done) => {
        const { resetPasswordToken, password } = req.body;
        var sql =
          'select email, resetPasswordToken, resetPasswordExpires from users where resetPasswordToken=?';
        db.all(sql, [resetPasswordToken], (err, rows) => {
          const [user] = rows;
          if (err) {
            return res.status(400).json({
              msg:
                'Ops! Sorry something happened on the server, please try again later.',
            });
          } else if (Date.now() > user.resetPasswordExpires) {
            return res.send('Sorry this link is expired');
          } else {
            bcrypt.hash(password, 10, (err, hash) => {
              if (err) {
                return res.status(400).json({
                  msg:
                    'Ops! Sorry something happened on the server, please try again later.',
                });
              }
              var sql = `UPDATE users set password=?, resetPasswordExpires=? where resetPasswordToken=?`;
              db.run(
                sql,
                [hash, Date.now(), user.resetPasswordToken],
                (err) => {
                  done(err, user);
                }
              );
            });
          }
        });
      },
      (user, done) => {
        var smtpTransport = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
            user: process.env.USER_GMAIL,
            pass: process.env.GMAIL_PASS,
          },
        });
        var mailOptions = {
          to: user.email,
          from: process.env.USER_GMAIL,
          subject: 'Your password has been changed',
          text:
            'Hello,\n\n' +
            'This is a confirmation that the password for your account ' +
            user.email +
            ' has just been changed.\n',
        };
        smtpTransport.sendMail(mailOptions, (err) => {
          if (err) {
            return res.status(400).json({
              msg:
                'Ops! Sorry something happened on the server, please try again later.',
            });
          }
          return res.send(`Success! Your password has been changed.`);
        });
      },
    ],
    (err) => {
      if (err) {
        return res.status(400).json({
          msg:
            'Ops! Sorry something happened on the server, please try again later.',
        });
      }
    }
  );
};

module.exports = ResetPassword;
