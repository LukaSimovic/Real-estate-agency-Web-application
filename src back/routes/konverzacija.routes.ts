import express from 'express'
import { KonverzacijaController } from '../controllers/konverzacija.controller';

const konverzacijaRouter = express.Router();

konverzacijaRouter.route('/dohvatiKonverzaciju').post(
    (req,res)=> new KonverzacijaController().dohvatiKonverzaciju(req,res)
);

konverzacijaRouter.route('/dohvatiKonverzacijuPoID').post(
    (req,res)=> new KonverzacijaController().dohvatiKonverzacijuPoID(req,res)
);

konverzacijaRouter.route('/dohvatiMojeKonverzacije').post(
    (req,res)=> new KonverzacijaController().dohvatiMojeKonverzacije(req,res)
);


konverzacijaRouter.route('/napraviKonverzaciju').post(
    (req,res)=> new KonverzacijaController().napraviKonverzaciju(req,res)
);

konverzacijaRouter.route('/upisiPoruku').post(
    (req,res)=> new KonverzacijaController().upisiPoruku(req,res)
);

konverzacijaRouter.route('/upisiPonudu').post(
    (req,res)=> new KonverzacijaController().upisiPonudu(req,res)
);
konverzacijaRouter.route('/vlasnikProcitao').post(
    (req,res)=> new KonverzacijaController().vlasnikProcitao(req,res)
);
konverzacijaRouter.route('/kupacProcitao').post(
    (req,res)=> new KonverzacijaController().kupacProcitao(req,res)
);

konverzacijaRouter.route('/vlasnikOdobrio').post(
    (req,res)=> new KonverzacijaController().vlasnikOdobrio(req,res)
);
konverzacijaRouter.route('/agentOdobrio').post(
    (req,res)=> new KonverzacijaController().agentOdobrio(req,res)
);
konverzacijaRouter.route('/agentOdbio').post(
    (req,res)=> new KonverzacijaController().agentOdbio(req,res)
);
konverzacijaRouter.route('/upisiPrihvatanje').post(
    (req,res)=> new KonverzacijaController().upisiPrihvatanje(req,res)
);

konverzacijaRouter.route('/vlasnikOdbio').post(
    (req,res)=> new KonverzacijaController().vlasnikOdbio(req,res)
);
konverzacijaRouter.route('/upisiOdbijanje').post(
    (req,res)=> new KonverzacijaController().upisiOdbijanje(req,res)
);

konverzacijaRouter.route('/dohvatiKonverzacijuPoNekretnini').post(
    (req,res)=> new KonverzacijaController().dohvatiKonverzacijuPoNekretnini(req,res)
);

konverzacijaRouter.route('/dohvatiKonverzacijeNaCekanju').get(
    (req,res)=> new KonverzacijaController().dohvatiKonverzacijeNaCekanju(req,res)
);

konverzacijaRouter.route('/dohvatiUgovoreneKonverzacije').get(
    (req,res)=> new KonverzacijaController().dohvatiUgovoreneKonverzacije(req,res)
);

konverzacijaRouter.route('/agentOdbio2').post(
    (req,res)=> new KonverzacijaController().agentOdbio2(req,res)
);



konverzacijaRouter.route('/blokirajKupca').post(
    (req,res)=> new KonverzacijaController().blokirajKupca(req,res)
);

konverzacijaRouter.route('/blokirajVlasnika').post(
    (req,res)=> new KonverzacijaController().blokirajVlasnika(req,res)
);

konverzacijaRouter.route('/blokirajVlasnikaOdmah').post(
    (req,res)=> new KonverzacijaController().blokirajVlasnikaOdmah(req,res)
);

konverzacijaRouter.route('/odblokirajVlasnika').post(
    (req,res)=> new KonverzacijaController().odblokirajVlasnika(req,res)
);

konverzacijaRouter.route('/odblokirajKupca').post(
    (req,res)=> new KonverzacijaController().odblokirajKupca(req,res)
);

konverzacijaRouter.route('/arhivirajKodVlasnika').post(
    (req,res)=> new KonverzacijaController().arhivirajKodVlasnika(req,res)
);

konverzacijaRouter.route('/arhivirajKodKupca').post(
    (req,res)=> new KonverzacijaController().arhivirajKodKupca(req,res)
);

konverzacijaRouter.route('/odarhivirajKodVlasnika').post(
    (req,res)=> new KonverzacijaController().odarhivirajKodVlasnika(req,res)
);

konverzacijaRouter.route('/odarhivirajKodKupca').post(
    (req,res)=> new KonverzacijaController().odarhivirajKodKupca(req,res)
);




export default konverzacijaRouter;