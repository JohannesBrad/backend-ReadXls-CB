import express from "express";
import bodyParser from "body-parser"
import XLSX from "xlsx"
import path from 'path';
import { fileURLToPath } from 'url';

import multer from 'multer'


//const doc = multer({ dest: 'doc/' })

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `${__dirname}/doc`)
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.originalname)
    }
  })
  
  const upload = multer({ storage: storage })


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express()
const port = 3080

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Creación de endpoint 01 
/* app.get("/", (req,res) => {
    res.send("Respuesta , todo ok")
}),  */

// Creación de endpoint 02
/* app.get("/", (req, res) => {
    res.send(
        {
            mensaje: "Mensaje",
            status: 200
        }),
        res.sendStatus(200)
}) */

// Creación de endpoint 03
app.get("/", (req, res) => {
    res.status(200).json({
        mensaje: "todo ok...!"
    })
}),

    //app.post("/enviando", (req, res) => {
        app.post("/enviando", upload.single("file"), (req, res) => {
        console.log(req.file);
        //
        console.log(`${__dirname}/doc/user.xlsx`);
        const excel = XLSX.readFile(
            //`${__dirname}/doc/user.xlsx`
            `${__dirname}/doc/${req.file.originalname}`
        );
        var nombreHoja = excel.SheetNames; // regresa un array
        let datos = XLSX.utils.sheet_to_json(excel.Sheets[nombreHoja[0]]);
        console.log(datos);

        //
        res.json({
            mensaje: "desde POST"
        })
    })


/* app.listen(3080, () => {
    console.log("iniciando...");
}) */

app.listen(port, () => {
    console.log(`todo ok desde ${port}`);
})