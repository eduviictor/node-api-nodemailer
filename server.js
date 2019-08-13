const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require("nodemailer");
const base64ToImage = require("base64-to-image");
const firebase = require("firebase");

const firebaseConfig = {
  apiKey: "AIzaSyDnQBexSZKrUuwnaIf-X6T4RpAv4gkVvOc",
  authDomain: "crud-react-firebase-6b0bd.firebaseapp.com",
  databaseURL: "https://crud-react-firebase-6b0bd.firebaseio.com",
  projectId: "crud-react-firebase-6b0bd",
  storageBucket: "crud-react-firebase-6b0bd.appspot.com",
  messagingSenderId: "358021316590",
  appId: "1:358021316590:web:85dc9f0a2bb4d931"
};

firebase.initializeApp(firebaseConfig);

let db = firebase.firestore();



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
    <h4>Cidade: </h4><span>${obj.cidade}</span>\n
    <h4>Latitude: <span>${obj.latitude}</span></h4>\n
    <h4>Longitude: <span>${obj.longitude}</span></h4>\n
    ${!obj.informacoesAdicionais ? '' : '<h1>Informações adicionais: </h1> <p>' + obj.informacoesAdicionais + '</p>'}`
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if(err){
      console.log(err);
    }else{
      console.log(info);
    }
  });
  res.json(obj);
});

app.post("/report", async (req, res) => {
  const obj = req.body;
  let docRef = db.collection("avaliacoes").doc();

  let setObj = await docRef.set({
    respostas: obj.respostas,
    informacoesAdicionais: obj.infoAdicionais,
    rating: obj.rating
  });

  console.log("objeto enviado", setObj);
  return res.json(setObj);
});

app.get("/listReports", (req, res) => {
  
  db.collection("avaliacoes").get().then(async snapShot => {
    let array = [];
    await snapShot.forEach(doc => {
      // console.log(doc.id, "=>", doc.data());
      const obj = doc.data();
      const newObj = { ...obj, id: doc.id };
      array.push(newObj);
    });
    return res.json(array);
  }).catch(err => {
    console.log("Error", err);
    return res.send("Error");
  })
  
  // return res.json(array);
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));