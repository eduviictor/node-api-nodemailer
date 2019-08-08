const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require("nodemailer");
const base64ToImage = require("base64-to-image");

const app = express();
app.use(bodyParser.json({ limit: "10mb", extended: true }));
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
  const path = "./images/";
  const optionsImage = {
    "fileName": "image",
  };
  
  const base64 = obj.base64Image;
  // console.log(base64);
  const test = await base64ToImage(base64, path, optionsImage);
  console.log("test", test)

  const mailOptions = {
    from: "eduvictornobrega@gmail.com",
    to: ["eduvictornobrega@gmail.com", "georef2019@gmail.com"],
    subject: "Denúncia GEO_REF",
    attachments: [{ filename: "image.jpeg", path: "./images/image.jpeg" }],
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