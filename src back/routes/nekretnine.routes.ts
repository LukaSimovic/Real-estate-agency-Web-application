import express from 'express'
import { NekretninaController } from '../controllers/nekretnina.controllers';

const nekretninaRouter = express.Router();

nekretninaRouter.route('/dohvatiOdobreneNekretnine').get(
    (req,res)=> new NekretninaController().dohvatiOdobreneNekretnine(req,res)
);

nekretninaRouter.route('/dohvatiPromovisaneNekretnine').get(
    (req,res)=> new NekretninaController().dohvatiPromovisaneNekretnine(req,res)
);

nekretninaRouter.route('/dohvatiNeodobreneNekretnine').get(
    (req,res)=> new NekretninaController().dohvatiNeodobreneNekretnine(req,res)
);


nekretninaRouter.route('/pretraziNekretnine').post(
    (req,res)=> new NekretninaController().pretraziNekretnine(req,res)
);

nekretninaRouter.route('/dodavanjeNekretnine').post(
    (req,res)=> new NekretninaController().dodavanjeNekretnine(req,res)
);

nekretninaRouter.route('/dohvatiSveNekretnine').get(
    (req,res)=> new NekretninaController().dohvatiSveNekretnine(req,res)
);

nekretninaRouter.route('/dohvatiKorisnikoveNekretnine').post(
    (req,res)=> new NekretninaController().dohvatiKorisnikoveNekretnine(req,res)
);

nekretninaRouter.route('/izbrisiNekretninu').post(
    (req,res)=> new NekretninaController().izbrisiNekretninu(req,res)
);

nekretninaRouter.route('/dohvatiNekrPoNazivu').post(
    (req,res)=> new NekretninaController().dohvatiNekrPoNazivu(req,res)
);

nekretninaRouter.route('/dohvatiNekrPoID').post(
    (req,res)=> new NekretninaController().dohvatiNekrPoID(req,res)
);

nekretninaRouter.route('/azuriranjeNekretnine').post(
    (req,res)=> new NekretninaController().azuriranjeNekretnine(req,res)
);

nekretninaRouter.route('/odobriNekretninu').post(
    (req,res)=> new NekretninaController().odobriNekretninu(req,res)
);

nekretninaRouter.route('/promovisiNekretninu').post(
    (req,res)=> new NekretninaController().promovisiNekretninu(req,res)
);

nekretninaRouter.route('/ukloniProm').post(
    (req,res)=> new NekretninaController().ukloniProm(req,res)
);

nekretninaRouter.route('/izdajNekretninu').post(
    (req,res)=> new NekretninaController().izdajNekretninu(req,res)
);
nekretninaRouter.route('/prodajNekretninu').post(
    (req,res)=> new NekretninaController().prodajNekretninu(req,res)
);

nekretninaRouter.route('/dohvatiOdobreneNeprodateNekretnine').get(
    (req,res)=> new NekretninaController().dohvatiOdobreneNeprodateNekretnine(req,res)
);

nekretninaRouter.route('/dodajPregled').post(
    (req,res)=> new NekretninaController().dodajPregled(req,res)
);

nekretninaRouter.route('/prviKorisnikovPregled').post(
    (req,res)=> new NekretninaController().prviKorisnikovPregled(req,res)
);

nekretninaRouter.route('/upisiNoviKorisnikovPregled').post(
    (req,res)=> new NekretninaController().upisiNoviKorisnikovPregled(req,res)
);

nekretninaRouter.route('/izbaciKorisnikovPregled').post(
    (req,res)=> new NekretninaController().izbaciKorisnikovPregled(req,res)
);

export default nekretninaRouter;