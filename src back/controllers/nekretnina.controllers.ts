import express from 'express'
import Nekretnina from '../models/nekretnina'

export class NekretninaController{

   dohvatiSveNekretnine=(req: express.Request, res: express.Response)=>{
    Nekretnina.find({}, (err, nekretnine)=>{
        if(err) console.log(err);
        else res.json(nekretnine);
    })
    }

    
    dohvatiOdobreneNekretnine=(req: express.Request, res: express.Response)=>{
        Nekretnina.find({'odobreno':1}, (err, nekretnine)=>{
            if(err) console.log(err);
            else res.json(nekretnine);
        })
    }

    dohvatiOdobreneNeprodateNekretnine=(req: express.Request, res: express.Response)=>{
        Nekretnina.find({'odobreno':1, 'prodato':0}, (err, nekretnine)=>{
            if(err) console.log(err);
            else res.json(nekretnine);
        })
    }

    dohvatiPromovisaneNekretnine=(req: express.Request, res: express.Response)=>{
        Nekretnina.find({'prodato':0,'odobreno':1, 'promovisano':1}, (err, nekretnine)=>{
            if(err) console.log(err);
            else res.json(nekretnine);
        })
    }

    dohvatiKorisnikoveNekretnine=(req: express.Request, res: express.Response)=>{
        let ki = req.body.ki;
        Nekretnina.find({'vlasnik':ki}, (err, nekretnine)=>{
            if(err) console.log(err);
            else res.json(nekretnine);
        })
    }

    dohvatiNeodobreneNekretnine=(req: express.Request, res: express.Response)=>{
        Nekretnina.find({'odobreno':0}, (err, nekretnine)=>{
            if(err) console.log(err);
            else res.json(nekretnine);
        })
    }

    dohvatiNekrPoNazivu=(req: express.Request, res: express.Response)=>{
        let naziv = req.body.naziv;
        Nekretnina.findOne({'naziv':naziv}, (err, nekr)=>{
            if(err) console.log(err);
            else res.json(nekr);
        })
    }

    dohvatiNekrPoID=(req:express.Request, res:express.Response)=>{
        let id = req.body.id;
        Nekretnina.findOne({'id':id}, (err, nekretnine)=>{
            if(err) console.log(err);
            else res.json(nekretnine);
        })
    }

    izbrisiNekretninu=(req: express.Request, res: express.Response)=>{
        let id = req.body.id;
        Nekretnina.collection.deleteOne({'id':id}, (err,naziv)=>{
            if(err) res.json({'message':err});
            else res.json({'message':'OK'});
        })
    }

    pretraziNekretnine=(req: express.Request, res: express.Response)=>{
        let grad = req.body.grad;
        let mincena = req.body.mincena;
        let maxcena = req.body.maxcena;
        let mincenabr;
        let maxcenabr;
        if(mincena==""){
            mincenabr=0;
        }else{
            mincenabr=parseInt(mincena);
        }


        if(grad!=""){
            if(maxcena!=""){ //grad,maxcena
                maxcenabr = parseInt(maxcena);
                Nekretnina.find({'prodato':0, 'grad':grad,'odobreno':1, 'cena':{$gt:mincenabr, $lt:maxcenabr}}, (err, nekretnine)=>{
                    if(err) console.log(err);
                    else res.json(nekretnine);
                })
            }else{ //grad
                Nekretnina.find({'prodato':0,'grad':grad, 'odobreno':1,'cena':{$gt:mincenabr}}, (err, nekretnine)=>{
                    if(err) console.log(err);
                    else res.json(nekretnine);
                })
            }
        }else{
            if(maxcena!=""){ //maxcena
                maxcenabr = parseInt(maxcena);
                Nekretnina.find({'prodato':0,'odobreno':1,'cena':{$gt:mincenabr, $lt:maxcenabr}}, (err, nekretnine)=>{
                    if(err) console.log(err);
                    else res.json(nekretnine);
                })
            }else{ //nista
                Nekretnina.find({'prodato':0,'odobreno':1,'cena':{$gt:mincenabr}}, (err, nekretnine)=>{
                    if(err) console.log(err);
                    else res.json(nekretnine);
                })
            }
        }
    }

    dodavanjeNekretnine=(req: express.Request, res: express.Response)=>{
        let nekr = new Nekretnina(req.body);
        nekr.save().then(nekr=>{
            res.json({'message':'OK'});
        }).catch(err=>{
            console.log(err);
        });
     }

     

     azuriranjeNekretnine=(req: express.Request, res: express.Response)=>{
         let stariNaziv = req.body.stariNaziv;
         let naziv = req.body.naziv;
         let adresa = req.body.adresa;
         let grad = req.body.grad;
         let opstina = req.body.opstina;
         let sprat = req.body.sprat;
         let broj_soba = req.body.broj_soba;
         let broj_spratova = req.body.broj_spratova;
         let namesten = req.body.namesten;
         let kuca = req.body.kuca;
         let izdavanje = req.body.izdavanje;
         let galerija = req.body.galerija;
         let videogalerija = req.body.videogalerija
         let cena = req.body.cena;
         let kvadratura = req.body.kvadratura;

         Nekretnina.collection.updateOne({'naziv': stariNaziv}, {$set: {"naziv": naziv, "grad":grad, "opstina": opstina, "adresa":adresa, "sprat":sprat, "broj_soba":broj_soba, 
         "broj_spratova":broj_spratova,"cena": cena, "kvadratura":kvadratura, "namesten": namesten, "izdavanje":izdavanje, "kuca":kuca, "galerija":galerija, "videogalerija":videogalerija}}, (err,ime)=>{
            if(err) res.json({'message':err});
            else res.json({'message':'OK'});

        });
     }

     odobriNekretninu=(req: express.Request, res: express.Response)=>{
         let id = req.body.id;
         Nekretnina.collection.updateOne({'id': id}, {$set: {"odobreno": 1}}, (err,ime)=>{
            if(err) res.json({'message':err});
            else res.json({'message':'OK'});

        });
     }

     promovisiNekretninu=(req: express.Request, res: express.Response)=>{
        let id = req.body.id;
        Nekretnina.collection.updateOne({'id': id}, {$set: {"promovisano": 1}}, (err,ime)=>{
           if(err) res.json({'message':err});
           else res.json({'message':'OK'});

       });
    }
    ukloniProm=(req: express.Request, res: express.Response)=>{
        let id = req.body.id;
        Nekretnina.collection.updateOne({'id': id}, {$set: {"promovisano": 0}}, (err,ime)=>{
           if(err) res.json({'message':err});
           else res.json({'message':'OK'});

       });
    }

    izdajNekretninu=(req: express.Request, res: express.Response)=>{
        let idNekr = req.body.idNekr;
        let datum_pocetka= req.body.datum_pocetka;
        let datum_kraja = req.body.datum_kraja;
        let cena = req.body.cena;

        const ponuda={
            datum_pocetka:datum_pocetka,
            datum_kraja:datum_kraja,
            cena:cena
        }
      
        Nekretnina.collection.updateOne({'id':idNekr}, {$push:{'izdato':ponuda}}, (err,resp)=>{
            if(err) res.json({'message':err});
            else res.json({'message':'OK'});
        })
    }

    prodajNekretninu=(req: express.Request, res: express.Response)=>{
        let idNekr = req.body.idNekr;
        
        Nekretnina.collection.updateOne({'id':idNekr}, {$set:{'prodato':1}}, (err,resp)=>{
            if(err) res.json({'message':err});
            else res.json({'message':'OK'});
        })
    }

    dodajPregled=(req: express.Request, res: express.Response)=>{
        let idNekr = req.body.id;
        
        Nekretnina.collection.updateOne({'id':idNekr}, {$inc:{'broj_pregleda':1}}, (err,resp)=>{
            if(err) console.log(err);
            else res.json({'message':'OK'});
        })
    }

    prviKorisnikovPregled=(req: express.Request, res: express.Response)=>{
        let idNekr = req.body.id;
        let vreme_pregleda= req.body.vreme_pregleda;
        let korisnik = req.body.korisnik;

        const pregled={
            vreme_pregleda:vreme_pregleda,
            korisnik:korisnik
        }
      
        Nekretnina.collection.updateOne({'id':idNekr}, {$push:{'posl_pregledi':pregled}}, (err,resp)=>{
            if(err) res.json({'message':err});
            else res.json({'message':'OK'});
        })
    }

    izbaciKorisnikovPregled=(req: express.Request, res: express.Response)=>{
        let idNekr = req.body.id;
        let korisnik = req.body.korisnik;

        const pregled={
            korisnik:korisnik
        }
      
        Nekretnina.collection.updateOne({'id':idNekr}, {$pull:{'posl_pregledi':pregled}}, (err,resp)=>{
            if(err) res.json({'message':err});
            else res.json({'message':'OK'});
        })
    }

    upisiNoviKorisnikovPregled=(req: express.Request, res: express.Response)=>{
        let idNekr = req.body.id;
        let novo_vreme_pregleda= req.body.novo_vreme_pregleda;
        let korisnik = req.body.korisnik;

        Nekretnina.collection.updateOne({'id':idNekr, 'posl_pregledi.korisnik':korisnik}, {$set:{'posl_pregledi.vreme_pregleda':novo_vreme_pregleda}}, (err,resp)=>{
            if(err) res.json({'message':err});
            else res.json({'message':'OK'});
        })
    }


   
}