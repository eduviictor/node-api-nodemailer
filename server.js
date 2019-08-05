const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.post("/send", async (req, res) => {
  const obj = req.body;
  console.log(process.env);
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_GMAIL,
      pass: process.env.PASSWORD_GMAIL
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_GMAIL,
    to: "eduvictornobrega@gmail.com",
    subject: "Denúncia GEO_REF",
    html: `<h1>Problema: </h1> <p>${obj.problema}</p>\n
    <h1>Endereço: </h1><p>${obj.enderecoProblema}</p>\n
    ${!obj.informacoesAdicionais ? '' : '<h1>Informações adicionais: </h1> <p>' + obj.informacoesAdicionais + '</p>'}`
  };

  console.log(obj);

  transporter.sendMail(mailOptions, (err, info) => {
    if(err){
      console.log(err);
    }else{
      console.log(info);
    }
  });
  res.json(obj);
});

app.listen(!process.env.PORT ? 3001 : process.env.PORT, () => console.log("Server running on port 3001"));