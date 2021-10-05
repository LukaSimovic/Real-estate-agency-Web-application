import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import korisnikRouter from './routes/korisnik.routes';
import multer from 'multer';
import nekretninaRouter from './routes/nekretnine.routes';
import konverzacijaRouter from './routes/konverzacija.routes';

const storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, '../frontend/app/src/assets/korisnici');
    },
    filename: (req, file, callBack) => {
        callBack(null, file.originalname)
    }
  })
  

  const storage2 = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, '../frontend/app/src/assets/nekretnine');
    },
    filename: (req, file, callBack) => {
        callBack(null, file.originalname)
    }
  })
  
const uploadMulter = multer({ storage: storage })
const uploadMulter2 = multer({ storage: storage2 })


const app = express();


app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/eNekretnina');
const connection = mongoose.connection;
connection.once('open', ()=>{
    console.log('Povezivanje sa bazom eNekretnina uspesno!')
});

const router = express.Router();
router.use('/registrovan', korisnikRouter);
router.use('/nekretnina', nekretninaRouter);
router.use('/konverzacija', konverzacijaRouter);

app.post('/file', uploadMulter.single('file'), (req, res, next) => {
    const file = req.file;
    console.log(file.filename);
    if (!file) {
      const error = new Error('No File')
      //error.httpStatusCode = 400
      return next(error)
    }
      res.send(file);
  })

app.post('/multipleFiles', uploadMulter2.array('files'), (req, res, next) => {
    const files = req.files;
    console.log(files);
    if (!files) {
      const error = new Error('No File')
      //error.httpStatusCode = 400
      return next(error)
    }
      res.send({status:  'ok'});
  })

app.use('/', router);
app.listen(4000, () => console.log(`Express server running on port 4000`));

export default uploadMulter;