import express from 'express'
import Konverzacija from '../models/konverzacija';

export class KonverzacijaController{
    

   dohvatiKonverzaciju=(req: express.Request, res: express.Response)=>{
    let vlasnik = req.body.vlasnik;
    let kupac = req.body.kupac;
    let idNekr = req.body.idNekr;

    Konverzacija.findOne({'vlasnik':vlasnik, 'kupac':kupac, 'idNekr':idNekr}, (err, konv)=>{
        if(err) console.log(err);
        else res.json(konv);
    })
    }

    dohvatiUgovoreneKonverzacije=(req: express.Request, res: express.Response)=>{
        Konverzacija.find({'odobreno_agent':1, 'odobreno_vlasnik':1}, (err, konv)=>{
            if(err) console.log(err);
            else res.json(konv);
        })
    }

    dohvatiKonverzacijeNaCekanju=(req: express.Request, res: express.Response)=>{
        Konverzacija.find({'odobreno_agent':0, 'odobreno_vlasnik':1}, (err, konv)=>{
            if(err) console.log(err);
            else res.json(konv);
        })
    }



    dohvatiKonverzacijuPoID=(req: express.Request, res: express.Response)=>{
        let id = req.body.id;
      
        Konverzacija.findOne({'id':id}, (err, konv)=>{
            if(err) console.log(err);
            else res.json(konv);
        })
    }

    dohvatiKonverzacijuPoNekretnini=(req: express.Request, res: express.Response)=>{
        let idNekr = req.body.idNekr;
      
        Konverzacija.find({'idNekr':idNekr}, (err, konv)=>{
            if(err) console.log(err);
            else res.json(konv);
        })
    }

    dohvatiMojeKonverzacije=(req: express.Request, res: express.Response)=>{
        let korisnicko_ime = req.body.korisnicko_ime;
       
    
        Konverzacija.find({$or:[{'vlasnik':korisnicko_ime}, {'kupac':korisnicko_ime}]}, (err, konv)=>{
            if(err) console.log(err);
            else res.json(konv);
        })
    }

  

   
    arhivirajKodVlasnika=(req: express.Request, res: express.Response)=>{
        let id = req.body.id;
       
    
        Konverzacija.collection.updateOne({'id':id}, {$set:{'arhivirano_vlasnik':1}}, (err, konv)=>{
            if(err) console.log(err);
            else res.json({'message':'ok'})

        })
    }
    arhivirajKodKupca=(req: express.Request, res: express.Response)=>{
        let id = req.body.id;
       
    
        Konverzacija.collection.updateOne({'id':id}, {$set:{'arhivirano_kupac':1}}, (err, konv)=>{
            if(err) console.log(err);
            else res.json({'message':'ok'})

        })
    }

   
    odarhivirajKodVlasnika=(req: express.Request, res: express.Response)=>{
        let id = req.body.id;
       
    
        Konverzacija.collection.updateOne({'id':id}, {$set:{'arhivirano_vlasnik':0}}, (err, konv)=>{
            if(err) console.log(err);
            else res.json({'message':'ok'})

        })
    }
    odarhivirajKodKupca=(req: express.Request, res: express.Response)=>{
        let id = req.body.id;
       
    
        Konverzacija.collection.updateOne({'id':id}, {$set:{'arhivirano_kupac':0}}, (err, konv)=>{
            if(err) console.log(err);
            else res.json({'message':'ok'})

        })
    }

    blokirajKupca=(req: express.Request, res: express.Response)=>{
        let id = req.body.id;
       
    
        Konverzacija.collection.updateOne({'id':id}, {$set:{'arhivirano_vlasnik':1, 'blokiran_kupac':1}}, (err, konv)=>{
            if(err) console.log(err);
            else res.json({'message':'ok'})

        })
    }

    blokirajVlasnika=(req: express.Request, res: express.Response)=>{
        let id = req.body.id;
    
        Konverzacija.collection.updateOne({'id':id}, {$set:{'arhivirano_kupac':1,'blokiran_vlasnik':1}}, (err, konv)=>{
            if(err) console.log(err);
            else res.json({'message':'ok'})

        })
    }

    blokirajVlasnikaOdmah=(req: express.Request, res: express.Response)=>{
        let idNekr = req.body.idNekr;
        let kupac = req.body.kupac;
        let vlasnik = req.body.vlasnik;
        Konverzacija.collection.updateOne({'idNekr':idNekr, 'kupac':kupac, 'vlasnik':vlasnik}, {$set:{'arhivirano_kupac':1,'blokiran_vlasnik':1}}, (err, konv)=>{
            if(err) console.log(err);
            else res.json({'message':'ok'})

        })
    }

    odblokirajKupca=(req: express.Request, res: express.Response)=>{
        let id = req.body.id;
       
    
        Konverzacija.collection.updateOne({'id':id}, {$set:{'arhivirano_vlasnik':0, 'blokiran_kupac':0}}, (err, konv)=>{
            if(err) console.log(err);
            else res.json({'message':'ok'})

        })
    }

    odblokirajVlasnika=(req: express.Request, res: express.Response)=>{
        let id = req.body.id;
    
        Konverzacija.collection.updateOne({'id':id}, {$set:{'arhivirano_kupac':0,'blokiran_vlasnik':0}}, (err, konv)=>{
            if(err) console.log(err);
            else res.json({'message':'ok'})

        })
    }



    napraviKonverzaciju=(req: express.Request, res: express.Response)=>{
        
        Konverzacija.find({}, (err,konverzacije)=>{
            let id:number = konverzacije.length +1;
            let konv = new Konverzacija(req.body);
            konv.id = id;
            
            konv.save().then(resp=>{
                res.json({'message':'ok'})
            }).catch(err=>{
                console.log(err);
            });
        })

    }

    upisiPoruku=(req: express.Request, res: express.Response)=>{

        let vlasnik = req.body.vlasnik;
        let kupac = req.body.kupac;
        let idNekr = req.body.idNekr;
        let tekst= req.body.tekst;
        let poslao = req.body.poslao;
        let datum = req.body.datum;
        let idPoruke = req.body.idPoruke;
        let neprocitano_vlasnik = req.body.neprocitano_vlasnik;
        let neprocitano_kupac = req.body.neprocitano_kupac;
        
        const poruka = {
            idPoruke:idPoruke,
            tekst:tekst,
            poslao:poslao,
            datum:datum
        }
        Konverzacija.collection.updateOne({'vlasnik':vlasnik, 'kupac':kupac, 'idNekr':idNekr},
                    {$set:{'arhivirano':0, 'neprocitano_vlasnik':neprocitano_vlasnik, 'neprocitano_kupac':neprocitano_kupac},$push:{'poruke':poruka}},(err, resp)=>{
            if(err) console.log(err);
            else res.json({'message':'ok'});
        })
    }

    upisiPonudu=(req: express.Request, res: express.Response)=>{

        let vlasnik = req.body.vlasnik;
        let kupac = req.body.kupac;
        let idNekr = req.body.idNekr;
        let tekst= req.body.tekst;
        let poslao = req.body.poslao;
        let datum = req.body.datum;
        let idPoruke = req.body.idPoruke;
        let cena= req.body.cena;
        let gotovina = req.body.gotovina;
        let datum_pocetka = req.body.datum_pocetka;
        let datum_kraja = req.body.datum_kraja;

        
        const poruka = {
            idPoruke:idPoruke,
            tekst:tekst,
            poslao:poslao,
            datum:datum
        }
        const ponuda = {
            datum_pocetka:datum_pocetka,
            datum_kraja:datum_kraja,
            gotovina:gotovina,
            cena:cena
        }
        Konverzacija.collection.updateOne({'vlasnik':vlasnik, 'kupac':kupac, 'idNekr':idNekr},
                    {$set:{'arhivirano':0,'idPonude':idPoruke, 'ponuda':ponuda, 'neprocitano_vlasnik':1}, $push:{'poruke':poruka}},(err, resp)=>{
            if(err) console.log(err);
            else res.json({'message':'ok'});
        })
    }

    vlasnikProcitao=(req: express.Request, res: express.Response)=>{
        let id = req.body.id

        Konverzacija.collection.updateOne({'id':id},
                    {$set:{'neprocitano_vlasnik':0}},(err, resp)=>{
            if(err) console.log(err);
            else res.json({'message':'ok'});
        })
    }

    kupacProcitao=(req: express.Request, res: express.Response)=>{
        let id = req.body.id

        Konverzacija.collection.updateOne({'id':id},
                    {$set:{'neprocitano_kupac':0}},(err, resp)=>{
            if(err) console.log(err);
            else res.json({'message':'ok'});
        })
    }

    vlasnikOdobrio=(req: express.Request, res: express.Response)=>{
        let id = req.body.id

        Konverzacija.collection.updateOne({'id':id},
                    {$set:{'odobreno_vlasnik':1}},(err, resp)=>{
            if(err) console.log(err);
            else res.json({'message':'ok'});
        })
    }
    vlasnikOdbio=(req: express.Request, res: express.Response)=>{
        let id = req.body.id

        Konverzacija.collection.updateOne({'id':id},
                    {$set:{'odobreno_vlasnik':-1}},(err, resp)=>{
            if(err) console.log(err);
            else res.json({'message':'ok'});
        })
    }

    agentOdobrio=(req: express.Request, res: express.Response)=>{
        let id = req.body.id
        let proc = req.body.proc;
        Konverzacija.collection.updateOne({'id':id},
                    {$set:{'odobreno_agent':1, 'proc_agencije':proc}},(err, resp)=>{
            if(err) console.log(err);
            else res.json({'message':'ok'});
        })
    }

    agentOdbio=(req: express.Request, res: express.Response)=>{
        let id = req.body.id;

        let datum = req.body.datum;
        let poslao = req.body.poslao;
        let idPoruke = req.body.idPoruke;
        let tekst= req.body.tekst;
        

        const poruka={
            datum:datum,
            idPoruke:idPoruke,
            tekst:tekst,
            poslao:poslao
        }

        Konverzacija.collection.updateOne({'id':id},
                    {$set:{'arhivirano':0,'odobreno_agent':-1, 'neprocitano_kupac':1},$push:{'poruke':poruka}},(err, resp)=>{
            if(err) console.log(err);
            else res.json({'message':'ok'});
        })
    }

    agentOdbio2=(req: express.Request, res: express.Response)=>{
        let id = req.body.id;
        
        Konverzacija.collection.updateOne({'id':id},
                    {$set:{'odobreno_agent':-1}},(err, resp)=>{
            if(err) console.log(err);
            else res.json({'message':'ok'});
        })
    }

    upisiPrihvatanje=(req: express.Request, res: express.Response)=>{

        let id = req.body.id;
        let tekst= req.body.tekst;
        let poslao = req.body.poslao;
        let datum = req.body.datum;
        let idPoruke = req.body.idPoruke;
        

        
        const poruka = {
            idPoruke:idPoruke,
            tekst:tekst,
            poslao:poslao,
            datum:datum
        }
        
        Konverzacija.collection.updateOne({'id':id},
                    {$set:{'arhivirano':0,'neprocitano_kupac':1}, $push:{'poruke':poruka}},(err, resp)=>{
            if(err) console.log(err);
            else res.json({'message':'ok'});
        })
    }

    upisiOdbijanje=(req: express.Request, res: express.Response)=>{

        let id = req.body.id;
        let tekst= req.body.tekst;
        let poslao = req.body.poslao;
        let datum = req.body.datum;
        let idPoruke = req.body.idPoruke;
        

        
        const poruka = {
            idPoruke:idPoruke,
            tekst:tekst,
            poslao:poslao,
            datum:datum
        }
        
        Konverzacija.collection.updateOne({'id':id},
                    {$set:{'arhivirano':0,'neprocitano_kupac':1}, $push:{'poruke':poruka}},(err, resp)=>{
            if(err) console.log(err);
            else res.json({'message':'ok'});
        })
    }

    

}