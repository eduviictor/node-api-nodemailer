const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
app.use(bodyParser.json());
app.use(cors());

// const uri = process.env.SMTP;
let transporter = nodemailer.createTransport({
  service: "Mailjet",
  port: 587,
  auth: {
    user: process.env.USER,
    pass: process.env.PASS
  }
});


app.post("/send", async (req, res) => {
  const obj = req.body;
  // console.log(process.env);


  const mailOptions = {
    from: "eduvictornobrega@gmail.com",
    to: "eduvictornobrega@gmail.com",
    subject: "Denúncia GEO_REF",
    html: `<h1>Problema: </h1> <p>${obj.problema}</p>\n
    <h1>Endereço: </h1><p>${obj.enderecoProblema}</p>\n
    ${!obj.informacoesAdicionais ? '' : '<h1>Informações adicionais: </h1> <p>' + obj.informacoesAdicionais + '</p>'}`
  };

  // console.log(obj);

  transporter.sendMail(mailOptions, (err, info) => {
    if(err){
      console.log(err);
    }else{
      console.log(info);
    }
  });
  res.json(obj);
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));