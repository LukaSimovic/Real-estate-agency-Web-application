import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { KonverzacijaService } from '../konverzacija.service';
import { KorisnikService } from '../korisnik.service';
import { Konverzacija } from '../models/konverzacija';
import { Korisnik } from '../models/korisnik';
import { Nekretnina } from '../models/nekretnina';
import { Poruka } from '../models/poruka';
import { NekretninaService } from '../nekretnina.service';

@Component({
  selector: 'app-konverzacija',
  templateUrl: './konverzacija.component.html',
  styleUrls: ['./konverzacija.component.css']
})
export class KonverzacijaComponent implements OnInit {

  constructor(private ruter:Router,
    private nekrServis:NekretninaService,
    private ruta: ActivatedRoute,
    private korisnikServis:KorisnikService,
    private konverServis:KonverzacijaService,
    notifierService: NotifierService) {
      this.notifier=notifierService;
     }

     notifier: NotifierService;
     sif:number;

  ngOnInit(): void {
    this.sif = parseInt(this.ruta.snapshot.paramMap.get('sif'));
    this.korisnik = JSON.parse(localStorage.getItem('ulogovan'));
    if(this.korisnik.tip!="reg" && this.korisnik.tip!="ag"){
      localStorage.removeItem('ulogovan');
      this.ruter.navigate(['']);
    }

    //usao tako sto kupac klikce na kontaktiraj vlasnika
    if(this.sif==0){
      this.nekrServis.dohvatiNekrPoID(parseInt(localStorage.getItem('nekretnina'))).subscribe((data:Nekretnina)=>{
        this.nekretnina=data;
        this.idNekr=this.nekretnina.id;
        this.vlasnik=this.nekretnina.vlasnik;
        this.kupac = this.korisnik.korisnicko_ime;

         //kupac
    this.korisnikServis.dohvatiKorisnika(this.kupac).subscribe((data:Korisnik)=>{
      this.blokiraniKupca = data.blokirani;
      for(let i=0; i<this.blokiraniKupca.length; i++){
        if(this.blokiraniKupca[i]==this.vlasnik){
          this.blokiran_vlasnik=1;
          break;
        }
      }
    })
    

    //vlasnik
    if(this.vlasnik=="agencija")
    {
     
        this.korisnikServis.dohvatiOdobreneAgente().subscribe((data:Korisnik)=>{
          this.blokiraniVlasnika = data[0].blokirani;
          for(let i=0; i<this.blokiraniVlasnika.length; i++){
            if(this.blokiraniVlasnika[i]==this.kupac){
              this.blokiran_kupac=1;
              break;
            }
          }
        })
      
    }else{
      this.korisnikServis.dohvatiKorisnika(this.vlasnik).subscribe((data:Korisnik)=>{
        this.blokiraniVlasnika = data.blokirani;
        for(let i=0; i<this.blokiraniVlasnika.length; i++){
          if(this.blokiraniVlasnika[i]==this.kupac){
            this.blokiran_kupac=1;
            break;
          }
        }
      })
    }
  
        if(this.nekretnina.izdavanje==1){
          if(localStorage.getItem('datum_pocetka') && localStorage.getItem('datum_kraja')){
            this.datum_pocetka = JSON.parse(localStorage.getItem('datum_pocetka'));
            this.datum_kraja = JSON.parse(localStorage.getItem('datum_kraja'))
          }
        }else{
          this.nacin_placanja = parseInt(localStorage.getItem('nacin_placanja'));
        }
  
        this.konverServis.dohvatiKonverzaciju(this.nekretnina.vlasnik, this.korisnik.korisnicko_ime, this.nekretnina.id).subscribe((data:Konverzacija)=>{
          if(data){
            //vec postoji konverzacija
            this.konverzacija=data;
          }else{
            //ne postoji konverzacija
            this.konverzacija=null;
          }
        })
      })
    }else if(this.sif==1){ //preko inboxa
     this.konverServis.dohvatiKonverzacijuPoID(parseInt(localStorage.getItem('konverzacija'))).subscribe((data:Konverzacija)=>{
       this.konverzacija=data;
       this.nekrServis.dohvatiNekrPoID(this.konverzacija.idNekr).subscribe((data:Nekretnina)=>{
        this.nekretnina=data;
        this.idNekr=this.nekretnina.id;
         this.vlasnik=this.nekretnina.vlasnik; //agencija ili user
         this.kupac = this.konverzacija.kupac;

          //kupac
    this.korisnikServis.dohvatiKorisnika(this.kupac).subscribe((data:Korisnik)=>{
      this.blokiraniKupca = data.blokirani;
      for(let i=0; i<this.blokiraniKupca.length; i++){
        if(this.blokiraniKupca[i]==this.vlasnik){
          this.blokiran_vlasnik=1;
          break;
        }
      }
    })
    

    //vlasnik
    if(this.vlasnik=="agencija"){
     
      this.korisnikServis.dohvatiOdobreneAgente().subscribe((data:Korisnik)=>{
        this.blokiraniVlasnika = data[0].blokirani;
        for(let i=0; i<this.blokiraniVlasnika.length; i++){
          if(this.blokiraniVlasnika[i]==this.kupac){
            this.blokiran_kupac=1;
            break;
          }
        }
      })
    }else{
      this.korisnikServis.dohvatiKorisnika(this.vlasnik).subscribe((data:Korisnik)=>{
        this.blokiraniVlasnika = data.blokirani;
        for(let i=0; i<this.blokiraniVlasnika.length; i++){
          if(this.blokiraniVlasnika[i]==this.kupac){
            this.blokiran_kupac=1;
            break;
          }
        }
      })
    }

         if(this.korisnik.korisnicko_ime==this.vlasnik && this.konverzacija.neprocitano_vlasnik==1){
           this.konverServis.vlasnikProcitao(this.konverzacija.id).subscribe(resp=>{
             if(resp['message']='ok'){
               this.konverServis.dohvatiKonverzacijuPoID(this.konverzacija.id).subscribe((data:Konverzacija)=>{
                 this.konverzacija=data;
               })
             }
           })
         }
         if(this.vlasnik=="agencija" && this.korisnik.tip=="ag" && this.konverzacija.neprocitano_vlasnik==1){
          this.konverServis.vlasnikProcitao(this.konverzacija.id).subscribe(resp=>{
            if(resp['message']='ok'){
              this.konverServis.dohvatiKonverzacijuPoID(this.konverzacija.id).subscribe((data:Konverzacija)=>{
                this.konverzacija=data;
              })
            }
          })
         }
         if(this.korisnik.korisnicko_ime==this.kupac && this.konverzacija.neprocitano_kupac==1){
          this.konverServis.kupacProcitao(this.konverzacija.id).subscribe(resp=>{
            if(resp['message']='ok'){
              this.konverServis.dohvatiKonverzacijuPoID(this.konverzacija.id).subscribe((data:Konverzacija)=>{
                this.konverzacija=data;
              })
            }
          })
         }
      })
     })
     
    }

   
   
  }

  korisnik:Korisnik;
  nekretnina:Nekretnina = {id:null,naziv:"", grad:"", opstina:"", adresa:"", kuca:null, sprat:null,broj_spratova:null,kvadratura:null,
  broj_soba:null,namesten:null,videogalerija:null,broj_pregleda:null,posl_pregledi:null,
  izdavanje:null,izdajeprodajeStr:null,galerija:null,cena:null,vlasnik:null, promovisano:null,odobreno:null,randomSlika:null,kucastanStr:null, namestenStr:null, prodato:null, izdato:null};
  konverzacija:Konverzacija= {id:null,idNekr:null, idPonude:null,vlasnik:null,kupac:null,poruke:null, ponuda:null, gotovinaStr:null,
    neprocitano_kupac:null,neprocitano_vlasnik:null,odobreno_agent:null,odobreno_vlasnik:null,nazivNekr:null, proc_agencije:null,
    prihodAgen:null,arhivirano_kupac:null,arhivirano_vlasnik:null,blokiran_kupac:null,blokiran_vlasnik:null };
  novapor:string;

  vlasnik:string;
  kupac:string;
  idNekr:number;

  //za izdavanje
  datum_pocetka:Date;
  datum_kraja:Date
  //za prodaju
  nacin_placanja:number;

  //blokirani
  blokiraniKupca:string[];
  blokiraniVlasnika:string[];

  posalji(){
    if(!this.novapor){     
       this.notifier.notify('error', 'Tekst poruke ne sme biti prazan!')
       return;
    }else if(this.novapor==""){
      this.notifier.notify('error', 'Tekst poruke ne sme biti prazan!')
      return;
    }

    if(this.konverzacija){ //samo upisi poruku

      let datum = new Date();
      let datumStr =datum.getDate()+"."+(datum.getMonth()+1)+"."+datum.getFullYear()+" "+datum.getHours()+":"+datum.getMinutes()+":"+datum.getSeconds();

      let idPoruke = this.konverzacija.poruke.length+1;
      let neproc_vl=0;
      let neproc_kup=0;
      if(this.korisnik.korisnicko_ime==this.kupac){
        neproc_vl=1;
      }
      if(this.korisnik.korisnicko_ime==this.vlasnik){
        neproc_kup=1;
      }
      if(this.korisnik.tip=="ag" && this.vlasnik=="agencija"){
        neproc_kup=1;
      }
      let poslao;
      if(this.korisnik.tip=="reg"){
        poslao = this.korisnik.korisnicko_ime;
      }else{
        poslao= "agent "+ this.korisnik.korisnicko_ime;
      }
      this.konverServis.upisiPoruku(this.vlasnik, this.kupac,this.idNekr,
        this.novapor, poslao, datumStr, idPoruke,neproc_vl,neproc_kup).subscribe(resp=>{
          if(resp['message']=='ok'){
            this.konverServis.dohvatiKonverzaciju(this.vlasnik, this.kupac,this.idNekr)
            .subscribe((data:Konverzacija)=>{
              this.konverzacija=data;
              this.novapor="";
            })

          }else{
            alert('greska pri upisu poruke!');
          }
        })

    }else{ //prvo napravi konverzaciju, pa upisi poruku sa id=1

      let datum = new Date();
      let datumStr =datum.getDate()+"."+(datum.getMonth()+1)+"."+datum.getFullYear()+" "+datum.getHours()+":"+datum.getMinutes()+":"+datum.getSeconds();
      let neproc_vl=0;
      let neproc_kup=0;
      if(this.korisnik.korisnicko_ime==this.kupac){
        neproc_vl=1;
      }
      if(this.korisnik.korisnicko_ime==this.vlasnik){
        neproc_kup=1;
      }
      if(this.korisnik.tip=="ag" && this.vlasnik=="agencija"){
        neproc_kup=1;
      }
      this.konverServis.napraviKonverzaciju(this.nekretnina.vlasnik, this.korisnik.korisnicko_ime, this.nekretnina.id).subscribe(resp=>{
        if(resp['message']=='ok'){

          this.konverServis.upisiPoruku(this.nekretnina.vlasnik, this.korisnik.korisnicko_ime, this.nekretnina.id,
            this.novapor, this.korisnik.korisnicko_ime, datumStr, 1,neproc_vl,neproc_kup).subscribe(resp=>{
              if(resp['message']=='ok'){
                this.konverServis.dohvatiKonverzaciju(this.nekretnina.vlasnik, this.korisnik.korisnicko_ime, this.nekretnina.id)
                .subscribe((data:Konverzacija)=>{
                  this.konverzacija=data;
                  this.novapor="";
                })

              }else{
                alert('greska pri upisu poruke!');
              }
            })
        }else{
          alert('greska pri pravljenju konverzacije!');
        }
      })

    }

  }

  proveriDatume(){
    let dp = new Date(this.datum_pocetka);
    let dk = new Date(this.datum_kraja);

    if(dp.valueOf()>=dk.valueOf()){
      this.notifier.notify('error', 'Datum kraja mora biti nakon datuma pocetka!')
    }else{
      //preklapanje datuma

      for(let i=0; i<this.nekretnina.izdato.length; i++){
        let datpoc = this.nekretnina.izdato[i].datum_pocetka;
        let delovi:string[]  = datpoc.split("-");
        let dan1 = parseInt(delovi[2]); let mesec1 = parseInt(delovi[1]); let god1 = parseInt(delovi[0]);
        let datkraj = this.nekretnina.izdato[i].datum_kraja;
        delovi = datkraj.split("-");
        let dan2 = parseInt(delovi[2]); let mesec2 = parseInt(delovi[1]); let god2 = parseInt(delovi[0]);
        let d1:Date = new Date(god1,mesec1-1,dan1,2,0,0);
        let d2: Date = new Date(god2,mesec2-1, dan2,2,0,0);
        let d1ms:number =d1.valueOf(); let d2ms:number = d2.valueOf();
      
        if(dp.valueOf() < d1ms){
          if(dk.valueOf() < d1ms){
            continue;
          }else{
            this.notifier.notify('error', 'Nekretnina je iznajmljena u periodu koji ste izabrali!')
            return false;
          }
        }else if(dp.valueOf()>= d1ms && dp.valueOf()<=d2ms){
          this.notifier.notify('error', 'Nekretnina je iznajmljena u periodu koji ste izabrali!')
          return false;
        }else if(dp.valueOf()>d2ms){
          continue;
        }
      }
      
      return true;
    }
  }


  dajPonudu(){
    let datum = new Date();
    let datumStr =datum.getDate()+"."+(datum.getMonth()+1)+"."+datum.getFullYear()+" "+datum.getHours()+":"+datum.getMinutes()+":"+datum.getSeconds();
    let tekstPonude:string;
    let dp = new Date(this.datum_pocetka);
    let dk = new Date(this.datum_kraja);
    let cena:number = ((dk.valueOf() - dp.valueOf())/1000/60/60/24)*(this.nekretnina.cena / 30);
    let gotovina:number=-1; 
    if(this.nekretnina.izdavanje==1){
      if(this.datum_pocetka && this.datum_kraja){
        if(this.proveriDatume()==true){
          tekstPonude = "Dajem ponudu:\nDatum pocetka:"+this.datum_pocetka+"\nDatum kraja:"+this.datum_kraja+"\nCena:"+cena;
        }else{
          return;
        }

      }else{
        this.notifier.notify('error', 'Niste izabrali datume pocetka i kraja izdavanja! Vratite se na stranicu nekretnine!');
        return;
      }
    }else{ //prodaja
      gotovina=this.nacin_placanja;
      cena = this.nekretnina.cena;
      let gotstr;
      if(gotovina==0){
        gotstr="U gotovini"
      }else if(gotovina==1){
        gotstr="Uzimam kredit"
      }else{
        this.notifier.notify('error', 'Niste izabrali nacin placanja nekretnine! Vratite se na stranicu nekretnine!');
        return;

      }
      tekstPonude = "Dajem ponudu!\nNacin placanja:"+gotstr+" \n Cena: "+this.nekretnina.cena;
    }
    if(this.konverzacija){ //samo upisi poruku
      let idPoruke = this.konverzacija.poruke.length+1;
      
      this.konverServis.upisiPonudu(this.nekretnina.vlasnik, this.korisnik.korisnicko_ime, this.nekretnina.id,
        tekstPonude, this.korisnik.korisnicko_ime, datumStr, idPoruke,this.datum_pocetka,this.datum_kraja,cena,gotovina).subscribe(resp=>{
          if(resp['message']=='ok'){
            this.konverServis.dohvatiKonverzaciju(this.nekretnina.vlasnik, this.korisnik.korisnicko_ime, this.nekretnina.id)
            .subscribe((data:Konverzacija)=>{
              this.konverzacija=data;
              this.novapor="";

            })

          }else{
            alert('greska pri upisu poruke!');
          }
        })

    }else{ //prvo napravi konverzaciju, pa upisi poruku sa id=1
      this.konverServis.napraviKonverzaciju(this.nekretnina.vlasnik, this.korisnik.korisnicko_ime, this.nekretnina.id).subscribe(resp=>{
        if(resp['message']=='ok'){

          this.konverServis.upisiPonudu(this.nekretnina.vlasnik, this.korisnik.korisnicko_ime, this.nekretnina.id,
            tekstPonude, this.korisnik.korisnicko_ime, datumStr, 1,this.datum_pocetka,this.datum_kraja,cena,gotovina).subscribe(resp=>{
              if(resp['message']=='ok'){
                this.konverServis.dohvatiKonverzaciju(this.nekretnina.vlasnik, this.korisnik.korisnicko_ime, this.nekretnina.id)
                .subscribe((data:Konverzacija)=>{
                  this.konverzacija=data;
                  this.novapor="";
                })

              }else{
                alert('greska pri upisu poruke!');
              }
            })
        }else{
          alert('greska pri pravljenju konverzacije!');
        }
      })

    }
  }

  prihvatiPonudu(){
    //ponuda svakako postoji cim postoji dugme, treba promeniti odobrio_vlasnik na 1, ako je vlasnik agencija odmah i agencija na 1
    //generisati poruku

    let datum = new Date();
    let datumStr =datum.getDate()+"."+(datum.getMonth()+1)+"."+datum.getFullYear()+" "+datum.getHours()+":"+datum.getMinutes()+":"+datum.getSeconds();

    let idPoruke = this.konverzacija.poruke.length+1;
    let poslao;
    if(this.korisnik.tip=="ag"){
     poslao = "agent "+this.korisnik.korisnicko_ime;
    }else{
      poslao = this.korisnik.korisnicko_ime;
    }

    this.konverServis.upisiPrihvatanje(this.konverzacija.id, "Prihvatam ponudu!", datumStr, poslao,idPoruke).subscribe(resp=>{
      if(resp['message']=='ok'){
        this.konverServis.vlasnikOdobrio(this.konverzacija.id).subscribe(resp=>{
          if(resp['message']=='ok'){

            if(this.vlasnik=="agencija"){ //odmah i izmeni nekretninu i odbiti ostale ponude!

              
              this.konverServis.agentOdobrio(this.konverzacija.id,100).subscribe(resp=>{
                if(resp['message']=='ok'){
                  if(this.nekretnina.izdavanje==1){
                    this.nekrServis.izdajNekretninu(this.idNekr,this.konverzacija.ponuda.datum_pocetka,
                      this.konverzacija.ponuda.datum_kraja,this.konverzacija.ponuda.cena).subscribe(resp=>{
                        if(resp['message']=='OK'){
                          //odbij ostale sto se preklapaju
                          this.odbijOstaleIzdavanje(this.idNekr,this.konverzacija.id);
                          this.konverServis.dohvatiKonverzacijuPoID(this.konverzacija.id).subscribe((data:Konverzacija)=>{
                            this.konverzacija=data;
                          })
                        }
                      })
                  }else{ //prodato na 1
                    this.nekrServis.prodajNekretninu(this.idNekr).subscribe(resp=>{
                      if(resp['message']=='OK'){
                        //odbij ostale
                        this.odbijOstaleProdato(this.idNekr,this.konverzacija.id);
                        this.konverServis.dohvatiKonverzacijuPoID(this.konverzacija.id).subscribe((data:Konverzacija)=>{
                          this.konverzacija=data;
                        })
                      }
                    })
                  }
                }
              })
             

            }else{ //samo izmeni polja konverzacije
              this.konverServis.dohvatiKonverzacijuPoID(this.konverzacija.id).subscribe((data:Konverzacija)=>{
                this.konverzacija=data;
              })
            }

           
          }
        })
      }
    })
  }

  odbijPonudu(){
    //napraviti poruku odbijam ponudu
    //promeniti odobreno_vlasnik na -1

    let datum = new Date();
    let datumStr =datum.getDate()+"."+(datum.getMonth()+1)+"."+datum.getFullYear()+" "+datum.getHours()+":"+datum.getMinutes()+":"+datum.getSeconds();

    let idPoruke = this.konverzacija.poruke.length+1;
    let poslao;
    if(this.korisnik.tip=="ag"){
     poslao = "agent "+this.korisnik.korisnicko_ime;
    }else{
      poslao = this.korisnik.korisnicko_ime;
    }

    this.konverServis.upisiOdbijanje(this.konverzacija.id,"Odbijam ponudu!", datumStr,poslao,idPoruke).subscribe(resp=>{
      if(resp['message']=='ok'){
        this.konverServis.vlasnikOdbio(this.konverzacija.id).subscribe(resp=>{
          if(resp['message']=='ok'){
            this.konverServis.dohvatiKonverzacijuPoID(this.konverzacija.id).subscribe((data:Konverzacija)=>{
              this.konverzacija=data;
            })
          }
        })
      }
    })

  }

  odbijOstaleProdato(idNekr,idKonv){
    this.konverServis.dohvatiKonverzacijuPoNekretnini(idNekr).subscribe((data:Konverzacija[])=>{

      for(let i=0; i<data.length; i++){ //proci kroz svaku i postaviti odobreno_agent na -1 i odbijam ponudu!
        let pom:Konverzacija = data[i];
        if(pom.id != idKonv){
          let datum = new Date();
          let datumStr =datum.getDate()+"."+(datum.getMonth()+1)+"."+datum.getFullYear()+" "+datum.getHours()+":"+datum.getMinutes()+":"+datum.getSeconds();
          let idPoruke =pom.poruke.length+1;
          let poslao = "agent "+this.korisnik.korisnicko_ime;

          this.konverServis.agentOdbio(pom.id,"Agencija odbila ponudu!",datumStr,poslao,idPoruke).subscribe(resp=>{
            if(resp['message']!='ok'){
              alert('greska!')
            }
          })
        }
      }
    })
  }

  odbijOstaleIzdavanje(idNekr,idKonv){
    let mojdatumpoc:Date = new Date(this.konverzacija.ponuda.datum_pocetka);
    let mojdatumkraj:Date = new Date(this.konverzacija.ponuda.datum_kraja);
    this.konverServis.dohvatiKonverzacijuPoNekretnini(idNekr).subscribe((data:Konverzacija[])=>{
      for(let i=0; i<data.length; i++){
        let pom:Konverzacija = data[i];
        if(pom.id!=idKonv){

          if(pom.ponuda){

            let dpoc:Date = new Date(pom.ponuda.datum_pocetka); let dkraj:Date = new Date(pom.ponuda.datum_kraja);

            if(mojdatumpoc.valueOf()<dpoc.valueOf()){
              if(mojdatumkraj.valueOf()<dpoc.valueOf()){
                continue;
              }else{
                //odbiti ovu ponudu pom
                let datum = new Date();
                let datumStr =datum.getDate()+"."+(datum.getMonth()+1)+"."+datum.getFullYear()+" "+datum.getHours()+":"+datum.getMinutes()+":"+datum.getSeconds();
                let idPoruke =pom.poruke.length+1;
                let poslao = "agent "+this.korisnik.korisnicko_ime;
                this.konverServis.agentOdbio(pom.id,"Agencija odbila ponudu!",datumStr,poslao,idPoruke).subscribe(resp=>{
                  if(resp['message']!='ok'){
                    alert("greska!");
                  }
                })
              }
            }else if(mojdatumpoc.valueOf()>=dpoc.valueOf() && mojdatumpoc.valueOf()<=dkraj.valueOf()){
              //odbiti ovu ponudu pom
              let datum = new Date();
                let datumStr =datum.getDate()+"."+(datum.getMonth()+1)+"."+datum.getFullYear()+" "+datum.getHours()+":"+datum.getMinutes()+":"+datum.getSeconds();
                let idPoruke =pom.poruke.length+1;
                let poslao = "agent "+this.korisnik.korisnicko_ime;
                this.konverServis.agentOdbio(pom.id,"Agencija odbila ponudu!",datumStr,poslao,idPoruke).subscribe(resp=>{
                  if(resp['message']!='ok'){
                    alert("greska!");
                  }
                })
            }

          }
          
        }
      }
    })
  }

  

  uslovPrikazPrihPonude(){
    if(this.blokiran_vlasnik==0 && this.blokiran_kupac==0){
      if(this.korisnik.korisnicko_ime==this.vlasnik && this.konverzacija.idPonude!=-1){
        return true;
      }else if(this.korisnik.tip=="ag" && this.vlasnik=="agencija" && this.konverzacija.idPonude!=-1){
        return true;
      }else{
        return false;
      }
    }else{
      return false;
    }
   
  }

  uslovPrikazDavanjaPonude(){
    
    if(this.blokiran_kupac==0 && this.blokiran_vlasnik==0 && this.korisnik.korisnicko_ime==this.kupac){
      return true;
    }else{
      return false;
    }
  }

  potpisLevo(p:Poruka){ //kupac,vlasnik
    if(this.korisnik.tip=="ag"){ //ulogovan admin prica sigurno sa kupcem
      return "kupac";
    }
    else{ //ulogovan je reg 
      if(this.vlasnik=="agencija"){ //reg prica sa agencijom, ona je sigurno vlasnik
        return "vlasnik";
      }else{ //reg prica sa regom
        if(this.korisnik.korisnicko_ime==this.vlasnik){ //ako je ulogovani vlasnik, prica sa kupcem
          return "kupac";
        }else{ //ulogovani nije vlasnik, znaci onda prica sa vlasnikom
          return "vlasnik";
        }
      }
    }

  }
  potpisDesno(p){
    return p.poslao;
  }
  

  uslovPorukaDesno(por:Poruka){
    if(this.korisnik.korisnicko_ime==por.poslao){
      return true;
    }
    if(this.korisnik.tip=="ag" && por.poslao.includes("agent")){
      return true;
    }
    return false;
  }

  uslovPorukaLevo(por){
    if(this.korisnik.tip=="reg" && this.korisnik.korisnicko_ime!=por.poslao){
      return true;
    }
    if(this.korisnik.tip=="ag" && this.konverzacija.kupac==por.poslao){
      return true;
    }
    return false;

  }

  uslovPorukaLevoVlasnik(por){
    if(this.korisnik.tip=="reg" && por.poslao==this.konverzacija.vlasnik && this.korisnik.korisnicko_ime!=por.poslao){
      return true;
    }
  }

  povratakInbox(){
    if(localStorage.getItem('nekretnina')){
      localStorage.removeItem('nekretnina');
    }
    if(localStorage.getItem('datum_pocetka') && localStorage.getItem('datum_kraja')){
      localStorage.removeItem('datum_pocetka');
      localStorage.removeItem('datum_kraja');
    }
    if(localStorage.getItem('nacin_placanja')){
      localStorage.removeItem('nacin_placanja');
    }
    if(localStorage.getItem('konverzacija')){
      localStorage.removeItem('konverzacija');
    }
    
    this.ruter.navigate(['inbox']);
  }

  povratakNekr(){
    if(localStorage.getItem('nekretnina')){
      localStorage.removeItem('nekretnina');
    }
    if(localStorage.getItem('datum_pocetka') && localStorage.getItem('datum_kraja')){
      localStorage.removeItem('datum_pocetka');
      localStorage.removeItem('datum_kraja');
    }
    if(localStorage.getItem('nacin_placanja')){
      localStorage.removeItem('nacin_placanja');
    }
    if(localStorage.getItem('konverzacija')){
      localStorage.removeItem('konverzacija');
    }
    let sifra= "0-"+this.nekretnina.id;
    let ruta = "strNekretnine/"+sifra;
    this.ruter.navigate([ruta]);
  }

  blokiran_kupac:number=0;
  blokiran_vlasnik:number=0;
  blokirajKorisnika(){
    if(this.konverzacija){ //vec postoji 

      //ko smo mi, blokiramo onog drugog
      if(this.korisnik.tip=="ag"){ //sigurno blokiramo kupca
        this.konverServis.blokirajKupca(this.konverzacija.id).subscribe(resp=>{
          if(resp['message']=='ok'){ 
            //svi agenti moraju da blokiraju kupca
            this.korisnikServis.dohvatiOdobreneAgente().subscribe((data:Korisnik[])=>{
              for(let i=0; i<data.length; i++){
                this.korisnikServis.blokirajKorisnika(data[i].korisnicko_ime, this.konverzacija.kupac).subscribe(resp=>{
                  if(resp['message']!='OK'){
                   alert("greska!");
                  }
                })
              }
              this.blokiran_kupac=1;
            })
            
          }
        })
      }else{
        if(this.konverzacija.vlasnik=="agencija"){
          this.notifier.notify('error', 'Ne mozete blokirati ovog vlasnika!');
          return;
        }else{
          if(this.korisnik.korisnicko_ime==this.konverzacija.vlasnik){ //blokiraj kupca
            this.konverServis.blokirajKupca(this.konverzacija.id).subscribe(resp=>{
              if(resp['message']=='ok'){
                this.korisnikServis.blokirajKorisnika(this.korisnik.korisnicko_ime, this.konverzacija.kupac).subscribe(resp=>{
                  if(resp['message']=='OK'){
                    this.blokiran_kupac=1;
    
                  }
                })
              }
            })

          }else{ //blokiraj vlasnika
            this.konverServis.blokirajVlasnika(this.konverzacija.id).subscribe(resp=>{
              if(resp['message']=='ok'){
                this.korisnikServis.blokirajKorisnika(this.korisnik.korisnicko_ime, this.nekretnina.vlasnik).subscribe(resp=>{
                  if(resp['message']=='OK'){
                    this.blokiran_vlasnik=1;
    
                  }
                })
              }
            })
          }
        }
      }

     

    }else{ //prvo napravi konverzaciju
      if(this.vlasnik=="agencija"){
        this.notifier.notify('error', 'Ne mozete blokirati ovog vlasnika!');
        return;
      }
      this.konverServis.napraviKonverzaciju(this.nekretnina.vlasnik,this.korisnik.korisnicko_ime, this.nekretnina.id).subscribe(resp=>{
        if(resp['message']=='ok'){

          //u ovom slucaju, sigurno kupac blokira vlasnika
        
          this.konverServis.blokirajVlasnikaOdmah(this.nekretnina.id,this.korisnik.korisnicko_ime, this.nekretnina.vlasnik).subscribe(resp=>{
            if(resp['message']=='ok'){
              this.korisnikServis.blokirajKorisnika(this.korisnik.korisnicko_ime, this.nekretnina.vlasnik).subscribe(resp=>{
                if(resp['message']=='OK'){
                  this.blokiran_vlasnik=1;

                }
              })
            }
          })
          
        }

      })
    }
  }

  nijeNikoBlokiran(){
    if(this.blokiran_kupac==1 || this.blokiran_vlasnik==1){
      return false;
    }
    return true;
  }

  prikazBtnOdblokiraj(){
    if(this.blokiran_vlasnik==1 && this.korisnik.korisnicko_ime==this.kupac){
      return true;
    }
    if(this.blokiran_kupac==1 && this.korisnik.tip=="ag" && this.vlasnik=="agencija"){
      return true;
    }
    if(this.blokiran_kupac==1 && this.korisnik.tip=="reg" && this.vlasnik==this.korisnik.korisnicko_ime){
      return true;
    }

    return false;
  }

  odblokirajKorisnika(){

    if(this.konverzacija){
      if(this.blokiran_kupac==1){
        this.konverServis.odblokirajKupca(this.konverzacija.id).subscribe(resp=>{
          if(resp['message']=='ok'){
            if(this.vlasnik=="agencija"){  
             //ako je vlasnik agencija i treba da se odblokira kupac treba da ga odblokiraju svi agenti

              this.korisnikServis.dohvatiOdobreneAgente().subscribe((data:Korisnik[])=>{
                for(let i=0; i<data.length; i++){
                  this.korisnikServis.odblokirajKorisnika(data[i].korisnicko_ime,this.kupac).subscribe(resp=>{
                    if(resp['message']=='OK'){
                      this.blokiran_vlasnik=0;
                      this.blokiran_kupac=0;
                    }
                  })
                }
              })

            }else{
              this.korisnikServis.odblokirajKorisnika(this.vlasnik,this.kupac).subscribe(resp=>{
                if(resp['message']=='OK'){
                  this.blokiran_vlasnik=0;
                  this.blokiran_kupac=0;
                }
              })
            }
           
          }
        })
      }else{ //blokiran vlasnik =1
        this.konverServis.odblokirajVlasnika(this.konverzacija.id).subscribe(resp=>{
          if(resp['message']=='ok'){
            this.korisnikServis.odblokirajKorisnika(this.kupac,this.vlasnik).subscribe(resp=>{
              if(resp['message']=='OK'){
                this.blokiran_vlasnik=0;
                this.blokiran_kupac=0;
              }
            })
          }
        })
      }
  
     
    }else{
      //samo nizove korisnika sredi
      if(this.blokiran_kupac==1){
            let vl;
            if(this.vlasnik=="agencija"){  //ako je vlasnik agencija i treba da se odblokira kupac
              vl = this.korisnik.korisnicko_ime; //to znaci da je agent sigurno ulogovan
            }else{
              vl = this.vlasnik
            }
            this.korisnikServis.odblokirajKorisnika(vl,this.kupac).subscribe(resp=>{
              if(resp['message']=='OK'){
                this.blokiran_vlasnik=0;
                this.blokiran_kupac=0;
              }
            })
      }else{ //blokiran vlasnik =1
            this.korisnikServis.odblokirajKorisnika(this.kupac,this.vlasnik).subscribe(resp=>{
              if(resp['message']=='OK'){
                this.blokiran_vlasnik=0;
                this.blokiran_kupac=0;
              }
            })
      }
    }

    
  }

   
  /* Set the width of the side navigation to 250px and the left margin of the page content to 250px and add a black background color to body */
  openNav() {
    if(this.korisnik.tip=="reg"){
      document.getElementById("mySidenav").style.width = "200px";
      document.getElementById("main").style.marginLeft = "200px";
    }else{
      document.getElementById("mySidenav2").style.width = "200px";
      document.getElementById("main").style.marginLeft = "200px";
    }
   
  }
  
    /* Set the width of the side navigation to 0 and the left margin of the page content to 0, and the background color of body to white */
    closeNav() {
      if(this.korisnik.tip=="reg"){
        document.getElementById("mySidenav").style.width = "0";
        document.getElementById("main").style.marginLeft = "0";
      }else{
        document.getElementById("mySidenav2").style.width = "0";
        document.getElementById("main").style.marginLeft = "0";
      }
    }
  
  
    myFunction() {
      document.getElementById("myDropdown").classList.toggle("show");
    }
    prikaziDropdownMeniKor(){
      if( document.getElementById('dropdownCont3').style.display=='block'){
        document.getElementById('dropdownCont3').style.display='none';
      }else{
        document.getElementById('dropdownCont3').style.display='block';
  
      }
    }
    
    prikaziDropdownMeniPod(){
     
      if( document.getElementById('dropdownCont2').style.display=='block'){
        document.getElementById('dropdownCont2').style.display='none';
      }else{
        document.getElementById('dropdownCont2').style.display='block';
  
      }
    }

    prikaziDropdownMeniZaht(){
      if( document.getElementById('dropdownCont').style.display=='block'){
        document.getElementById('dropdownCont').style.display='none';
      }else{
        document.getElementById('dropdownCont').style.display='block';
  
      }
    }

    prikaziDropdownMeniNekr(){
      if( document.getElementById('dropdownCont4').style.display=='block'){
        document.getElementById('dropdownCont4').style.display='none';
      }else{
        document.getElementById('dropdownCont4').style.display='block';
  
      }
    }
  
    odjaviSe(){
      localStorage.removeItem('ulogovan');
      if(localStorage.getItem('nekretnina')){
        localStorage.removeItem('nekretnina');
      }
      if(localStorage.getItem('datum_pocetka') && localStorage.getItem('datum_kraja')){
        localStorage.removeItem('datum_pocetka');
        localStorage.removeItem('datum_kraja');
      }
      if(localStorage.getItem('nacin_placanja')){
        localStorage.removeItem('nacin_placanja');
      }
      if(localStorage.getItem('konverzacija')){
        localStorage.removeItem('konverzacija');
      }
      this.ruter.navigate(['']);
    }

}
