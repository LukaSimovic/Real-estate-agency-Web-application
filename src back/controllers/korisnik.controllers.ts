import express from 'express'
import Korisnik from '../models/korisnik';

export class KorisnikController{
    prijava=(req: express.Request, res: express.Response)=>{
        let korisnicko_ime = req.body.korisnicko_ime;
        let lozinka = req.body.lozinka;

        Korisnik.findOne({'korisnicko_ime':korisnicko_ime, 'lozinka':lozinka},
        (err,korisnik)=>{
            if(err) console.log(err);
            else res.json(korisnik);
        })
    }

    registracija=(req: express.Request, res: express.Response)=>{
       let kor = new Korisnik(req.body);
       kor.save().then(kor=>{
           res.json({'message':'OK'});
       }).catch(err=>{
           res.json({'message':err});
       });
    }


    promenaLozinke=(req: express.Request, res: express.Response)=>{
        let korisnicko_ime = req.body.korisnicko_ime;
        let lozinka = req.body.lozinka;
       

        Korisnik.collection.updateOne({'korisnicko_ime': korisnicko_ime}, {$set: {"lozinka": lozinka}}, (err,lozinka)=>{
            if(err) res.json({'message':err});
            else res.json({'message':'OK'});

        });
    }

    azuriranje=(req: express.Request, res: express.Response)=>{
        let staroKI = req.body.staroKI;
        let ime = req.body.ime;
        let prezime = req.body.prezime;
        let korisnicko_ime = req.body.korisnicko_ime;
        let slika = req.body.slika;
        let email = req.body.email;
        let drzava = req.body.drzava;
        let grad  = req.body.grad;

        Korisnik.collection.updateOne({'korisnicko_ime': staroKI}, {$set: {"ime": ime, "prezime":prezime, "korisnicko_ime": korisnicko_ime, "slika":slika, "email":email, "drzava":drzava, "grad":grad}}, (err,ime)=>{
            if(err) res.json({'message':err});
            else res.json({'message':'OK'});

        });

    }

    dohvatiKorisnikaPoKI=(req: express.Request, res: express.Response)=>{
        let korisnicko_ime = req.body.korisnicko_ime;
        Korisnik.findOne({'korisnicko_ime':korisnicko_ime},
        (err,korisnik)=>{
            if(err) console.log(err);
            else res.json(korisnik);
        })
    }

    dohvatiOdobreneRegKorisnike=(req: express.Request, res: express.Response)=>{
        Korisnik.find({'status':'O', 'tip':'reg'},
        (err,korisnici)=>{
            if(err) console.log(err);
            else res.json(korisnici);
        })
    }


    dohvatiOdobreneAgente=(req: express.Request, res: express.Response)=>{
        Korisnik.find({'status':'O', 'tip':'ag'},
        (err,korisnici)=>{
            if(err) console.log(err);
            else res.json(korisnici);
        })
    }

    dohvatiKorisnikeNaCekanju=(req: express.Request, res: express.Response)=>{
        Korisnik.find({'status':'N'},
        (err,korisnici)=>{
            if(err) console.log(err);
            else res.json(korisnici);
        })
    }

    izbrisiKorisnika=(req: express.Request, res: express.Response)=>{
        let ki = req.body.ki;
        Korisnik.collection.deleteOne({'korisnicko_ime':ki}, (err,ki)=>{
            if(err) res.json({'message':err});
            else res.json({'message':'OK'});
        })
    }


    odobriKorisnika=(req: express.Request, res: express.Response)=>{
        let ki = req.body.ki;
        Korisnik.collection.updateOne({'korisnicko_ime': ki}, {$set: {"status": "O"}}, (err,ki)=>{
            if(err) res.json({'message':err});
            else res.json({'message':'OK'});

        });

    }
    
    
    blokirajKorisnika=(req: express.Request, res: express.Response)=>{
        let ja = req.body.ja;
        let on = req.body.on;
        
        Korisnik.collection.updateOne({'korisnicko_ime':ja}, {$push:{'blokirani':on}}, (err,resp)=>{
            if(err) res.json({'message':err});
            else res.json({'message':'OK'});
        })
    }
    
    odblokirajKorisnika=(req: express.Request, res: express.Response)=>{
        let ja = req.body.ja;
        let on = req.body.on;
        
        Korisnik.collection.updateOne({'korisnicko_ime':ja}, {$pull:{'blokirani':on}}, (err,resp)=>{
            if(err) res.json({'message':err});
            else res.json({'message':'OK'});
        })
    }
    
}