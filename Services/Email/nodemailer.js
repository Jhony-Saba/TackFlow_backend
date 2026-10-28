const nodemailer = require("nodemailer");

async function createTransporter() {
  return nodemailer.createTransport({
    streamTransport: true,
    buffer: true,
    newline: "unix",
  });
}

module.exports = {
  createTransporter,
};