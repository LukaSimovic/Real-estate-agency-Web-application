import express from 'express'
import { KorisnikController } from '../controllers/korisnik.controllers';

const korisnikRouter = express.Router();

korisnikRouter.route('/prijava').post(
    (req,res)=> new KorisnikController().prijava(req,res)
);
korisnikRouter.route('/registracija').post(
    (req,res)=> new KorisnikController().registracija(req,res)
);

korisnikRouter.route('/azuriranje').post(
    (req,res)=> new KorisnikController().azuriranje(req,res)
);
korisnikRouter.route('/dohvatiKorisnika').post(
    (req,res)=> new KorisnikController().dohvatiKorisnikaPoKI(req,res)
);

korisnikRouter.route('/promeniLozinku').post(
    (req,res)=> new KorisnikController().promenaLozinke(req,res)
);

korisnikRouter.route('/dohvatiOdobreneRegKorisnike').get(
    (req,res)=> new KorisnikController().dohvatiOdobreneRegKorisnike(req,res)
);

korisnikRouter.route('/dohvatiOdobreneAgente').get(
    (req,res)=> new KorisnikController().dohvatiOdobreneAgente(req,res)
);

korisnikRouter.route('/izbrisiKorisnika').post(
    (req,res)=> new KorisnikController().izbrisiKorisnika(req,res)
);

korisnikRouter.route('/dohvatiKorisnikeNaCekanju').get(
    (req,res)=> new KorisnikController().dohvatiKorisnikeNaCekanju(req,res)
);

korisnikRouter.route('/odobriKorisnika').post(
    (req,res)=> new KorisnikController().odobriKorisnika(req,res)
);

korisnikRouter.route('/blokirajKorisnika').post(
    (req,res)=> new KorisnikController().blokirajKorisnika(req,res)
);

korisnikRouter.route('/odblokirajKorisnika').post(
    (req,res)=> new KorisnikController().odblokirajKorisnika(req,res)
);






export default korisnikRouter;