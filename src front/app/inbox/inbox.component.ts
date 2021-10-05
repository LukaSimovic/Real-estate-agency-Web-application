import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { KonverzacijaService } from '../konverzacija.service';
import { KorisnikService } from '../korisnik.service';
import { Konverzacija } from '../models/konverzacija';
import { Korisnik } from '../models/korisnik';
import { Nekretnina } from '../models/nekretnina';
import { NekretninaService } from '../nekretnina.service';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.css']
})
export class InboxComponent implements OnInit {

  constructor(private ruter:Router,
    private korisServis:KorisnikService,
    private nekrServis:NekretninaService,
    private konverzServis:KonverzacijaService,
    notifierService: NotifierService) {
      this.notifier=notifierService;
     }

     notifier: NotifierService;

  ngOnInit(): void {
    this.korisnik = JSON.parse(localStorage.getItem('ulogovan'));
    if(this.korisnik.tip!="ag" && this.korisnik.tip!="reg"){
      localStorage.removeItem('ulogovan');
      this.ruter.navigate(['']);
    }

    this.nekrServis.dohvatiOdobreneNeprodateNekretnine().subscribe((data:Nekretnina[])=>{
      this.nekretnine=data;
    })

    let mk:string;
    if(this.korisnik.tip=="reg"){
      mk = this.korisnik.korisnicko_ime;
    }else{
      mk = "agencija";
    }

    this.konverzServis.dohvatiMojeKonverzacije(mk).subscribe((data:Konverzacija[])=>{
      data.sort(this.sortHelper);
      this.mojeKonverzacije=data;
      this.vremePoslPoruke = [];
      this.mojeNearhivKonverzacije = [];
      this.mojeArhivKonverzacije = [];
      for(let i=0; i<this.mojeKonverzacije.length; i++){
        this.vremePoslPoruke.push(this.mojeKonverzacije[i].poruke[this.mojeKonverzacije[i].poruke.length-1].datum);
        this.nekrServis.dohvatiNekrPoID(this.mojeKonverzacije[i].idNekr).subscribe((data:Nekretnina)=>{
          this.mojeKonverzacije[i].nazivNekr = data.naziv;

          //odrediti da li je za i-tu konverzaciju ulogovani vlasnik ili kupac,
          // a onda u zavisnosti od toga proveriti arhivirano_vlasnik ili arhivirano_kupac
          if(this.korisnik.tip=="ag"){ //sigurno vlasnik
            if(this.mojeKonverzacije[i].arhivirano_vlasnik==1){
              this.mojeArhivKonverzacije.push(this.mojeKonverzacije[i]);
            }else{
              this.mojeNearhivKonverzacije.push(this.mojeKonverzacije[i]);
            }
          }else{
            if(this.mojeKonverzacije[i].vlasnik=="agencija"){ //ulogovan reg, a vlasnik agencija => sigurno kupac
              if(this.mojeKonverzacije[i].arhivirano_kupac==1){
                this.mojeArhivKonverzacije.push(this.mojeKonverzacije[i]);
              }else{
                this.mojeNearhivKonverzacije.push(this.mojeKonverzacije[i]);
              }
            } else{ //dva reg korisnika
              if(this.mojeKonverzacije[i].vlasnik==this.korisnik.korisnicko_ime){ //vlasnik
                if(this.mojeKonverzacije[i].arhivirano_vlasnik==1){
                  this.mojeArhivKonverzacije.push(this.mojeKonverzacije[i]);
                }else{
                  this.mojeNearhivKonverzacije.push(this.mojeKonverzacije[i]);
                }
              }else{ //kupac
                if(this.mojeKonverzacije[i].arhivirano_kupac==1){
                  this.mojeArhivKonverzacije.push(this.mojeKonverzacije[i]);
                }else{
                  this.mojeNearhivKonverzacije.push(this.mojeKonverzacije[i]);
                }
              }
            }
          }
        })    
      }
    })

  }

 

  sortHelper(a,b){
    var d:string[] =  (a.poruke[a.poruke.length-1].datum).split(" ");
    var d1:string[] = d[0].split(".")
    var d2:string[] = d[1].split(":")
    var g1 = parseInt(d1[2]); var m1 = parseInt(d1[1]); var dd1=parseInt(d1[0]);
     var sati1=parseInt(d2[0]); var min1=parseInt(d2[1]); var sec1=parseInt(d2[2]);
    var a1:number = g1*365*24*60*60 + m1*30*24*60*60+dd1*24*60*60+sati1*60*60+min1*60+sec1;
    var dr:string[] =  (b.poruke[b.poruke.length-1].datum).split(" ");
    var dr1:string[] = dr[0].split(".")
    var dr2:string[] = dr[1].split(":")
    var gr1 = parseInt(dr1[2]); var mr1 = parseInt(dr1[1]); var ddr1=parseInt(dr1[0]);
     var satir1=parseInt(dr2[0]); var minr1=parseInt(dr2[1]); var secr1=parseInt(dr2[2]);
    var b1:number = gr1*365*24*60*60 + mr1*30*24*60*60+ddr1*24*60*60+satir1*60*60+minr1*60+secr1;

    return b1 - a1;
  }

  korisnik:Korisnik;
  mojeKonverzacije:Konverzacija[];
  mojeArhivKonverzacije:Konverzacija[] = [];
  mojeNearhivKonverzacije:Konverzacija[] = [];
  

  vremePoslPoruke:string[] = [];
  vremePoslArhivPoruke:string[] = [];

  nekretnine:Nekretnina[];
  izborNaslova:string;

  zapocni(){
    //alert(this.izborNaslova);
    if(this.korisnik.tip=="ag"){
      this.notifier.notify('error', 'Radnik firme ne moze da zapocinje nove konverzacije!');
      return;
    }

   

    let delovi:string[] = this.izborNaslova.split(".");
    let naslov:string = delovi[0];

    this.nekrServis.dohvatiNekrPoID(delovi[0]).subscribe((data:Nekretnina)=>{
      let nekr = data;

      this.konverzServis.dohvatiKonverzaciju(nekr.vlasnik,this.korisnik.korisnicko_ime, nekr.id).subscribe((data2:Konverzacija)=>{
        if(data2){
          this.notifier.notify('error', 'Konverzacija za ovu nekretninu vec postoji! Potrazite je u inboxu!');
          return;
        }else{
          localStorage.setItem('nekretnina', naslov);
          this.ruter.navigate(['konverzacija/0'])
        }
      })

    })

  }

 
  neprocUslov(i){
    if(this.korisnik.korisnicko_ime==this.mojeKonverzacije[i].kupac && this.mojeKonverzacije[i].neprocitano_kupac==1){
      return true;
    }
    if(this.korisnik.korisnicko_ime==this.mojeKonverzacije[i].vlasnik && this.mojeKonverzacije[i].neprocitano_vlasnik==1){
      return true;
    }
    if(this.korisnik.tip=="ag" && this.mojeKonverzacije[i].vlasnik=="agencija" && this.mojeKonverzacije[i].neprocitano_vlasnik==1){
      return true;
    }

    return false;

  }

  neprocArhivUslov(i){
    if(this.korisnik.korisnicko_ime==this.mojeArhivKonverzacije[i].kupac && this.mojeArhivKonverzacije[i].neprocitano_kupac==1){
      return true;
    }
    if(this.korisnik.korisnicko_ime==this.mojeArhivKonverzacije[i].vlasnik && this.mojeArhivKonverzacije[i].neprocitano_vlasnik==1){
      return true;
    }
    if(this.korisnik.tip=="ag" && this.mojeArhivKonverzacije[i].vlasnik=="agencija" && this.mojeArhivKonverzacije[i].neprocitano_vlasnik==1){
      return true;
    }

    return false;

  }

  prikazKonv:number=1;
  prikaz(num){
    this.prikazKonv=num;
  }


  udji(i){
    localStorage.setItem('konverzacija', this.mojeKonverzacije[i].id.toString());
    this.ruter.navigate(['konverzacija/1']);
  }

  udjiArhiv(i){
    localStorage.setItem('konverzacija', this.mojeArhivKonverzacije[i].id.toString());
    this.ruter.navigate(['konverzacija/1']);
  }

  arhiviraj(i){

    //racunamo da li arhiviramo kod kupca ili vlasnika
    if(this.korisnik.tip=="ag"){ //sigurno arhiviramo kod vlasnika
      this.konverzServis.arhivirajKodVlasnika(this.mojeKonverzacije[i].id).subscribe(resp=>{
        if(resp['message']=='ok'){
          let mk:string;
          if(this.korisnik.tip=="reg"){
            mk = this.korisnik.korisnicko_ime;
          }else{
            mk = "agencija";
          }
      
          this.konverzServis.dohvatiMojeKonverzacije(mk).subscribe((data:Konverzacija[])=>{
            data.sort(this.sortHelper);
            this.mojeKonverzacije=data;
            this.vremePoslPoruke = [];
            this.mojeNearhivKonverzacije = [];
            this.mojeArhivKonverzacije = [];
            for(let i=0; i<this.mojeKonverzacije.length; i++){
              this.vremePoslPoruke.push(this.mojeKonverzacije[i].poruke[this.mojeKonverzacije[i].poruke.length-1].datum);
              this.nekrServis.dohvatiNekrPoID(this.mojeKonverzacije[i].idNekr).subscribe((data:Nekretnina)=>{
                this.mojeKonverzacije[i].nazivNekr = data.naziv;
      
                //odrediti da li je za i-tu konverzaciju ulogovani vlasnik ili kupac,
                // a onda u zavisnosti od toga proveriti arhivirano_vlasnik ili arhivirano_kupac
                if(this.korisnik.tip=="ag"){ //sigurno vlasnik
                  if(this.mojeKonverzacije[i].arhivirano_vlasnik==1){
                    this.mojeArhivKonverzacije.push(this.mojeKonverzacije[i]);
                  }else{
                    this.mojeNearhivKonverzacije.push(this.mojeKonverzacije[i]);
                  }
                }else{
                  if(this.mojeKonverzacije[i].vlasnik=="agencija"){ //ulogovan reg, a vlasnik agencija => sigurno kupac
                    if(this.mojeKonverzacije[i].arhivirano_kupac==1){
                      this.mojeArhivKonverzacije.push(this.mojeKonverzacije[i]);
                    }else{
                      this.mojeNearhivKonverzacije.push(this.mojeKonverzacije[i]);
                    }
                  } else{ //dva reg korisnika
                    if(this.mojeKonverzacije[i].vlasnik==this.korisnik.korisnicko_ime){ //vlasnik
                      if(this.mojeKonverzacije[i].arhivirano_vlasnik==1){
                        this.mojeArhivKonverzacije.push(this.mojeKonverzacije[i]);
                      }else{
                        this.mojeNearhivKonverzacije.push(this.mojeKonverzacije[i]);
                      }
                    }else{ //kupac
                      if(this.mojeKonverzacije[i].arhivirano_kupac==1){
                        this.mojeArhivKonverzacije.push(this.mojeKonverzacije[i]);
                      }else{
                        this.mojeNearhivKonverzacije.push(this.mojeKonverzacije[i]);
                      }
                    }
                  }
                }
              })    
            }
          })
        }
      })
    }else{
      if(this.mojeKonverzacije[i].vlasnik=="agencija"){ //ulogovan reg, a vlasnik agencija => arhiviramo kod kupca
        this.konverzServis.arhivirajKodKupca(this.mojeKonverzacije[i].id).subscribe(resp=>{
          if(resp['message']=='ok'){
            let mk:string;
            if(this.korisnik.tip=="reg"){
              mk = this.korisnik.korisnicko_ime;
            }else{
              mk = "agencija";
            }
        
            this.konverzServis.dohvatiMojeKonverzacije(mk).subscribe((data:Konverzacija[])=>{
              data.sort(this.sortHelper);
              this.mojeKonverzacije=data;
              this.vremePoslPoruke = [];
              this.mojeNearhivKonverzacije = [];
              this.mojeArhivKonverzacije = [];
              for(let i=0; i<this.mojeKonverzacije.length; i++){
                this.vremePoslPoruke.push(this.mojeKonverzacije[i].poruke[this.mojeKonverzacije[i].poruke.length-1].datum);
                this.nekrServis.dohvatiNekrPoID(this.mojeKonverzacije[i].idNekr).subscribe((data:Nekretnina)=>{
                  this.mojeKonverzacije[i].nazivNekr = data.naziv;
        
                  //odrediti da li je za i-tu konverzaciju ulogovani vlasnik ili kupac,
                  // a onda u zavisnosti od toga proveriti arhivirano_vlasnik ili arhivirano_kupac
                  if(this.korisnik.tip=="ag"){ //sigurno vlasnik
                    if(this.mojeKonverzacije[i].arhivirano_vlasnik==1){
                      this.mojeArhivKonverzacije.push(this.mojeKonverzacije[i]);
                    }else{
                      this.mojeNearhivKonverzacije.push(this.mojeKonverzacije[i]);
                    }
                  }else{
                    if(this.mojeKonverzacije[i].vlasnik=="agencija"){ //ulogovan reg, a vlasnik agencija => sigurno kupac
                      if(this.mojeKonverzacije[i].arhivirano_kupac==1){
                        this.mojeArhivKonverzacije.push(this.mojeKonverzacije[i]);
                      }else{
                        this.mojeNearhivKonverzacije.push(this.mojeKonverzacije[i]);
                      }
                    } else{ //dva reg korisnika
                      if(this.mojeKonverzacije[i].vlasnik==this.korisnik.korisnicko_ime){ //vlasnik
                        if(this.mojeKonverzacije[i].arhivirano_vlasnik==1){
                          this.mojeArhivKonverzacije.push(this.mojeKonverzacije[i]);
                        }else{
                          this.mojeNearhivKonverzacije.push(this.mojeKonverzacije[i]);
                        }
                      }else{ //kupac
                        if(this.mojeKonverzacije[i].arhivirano_kupac==1){
                          this.mojeArhivKonverzacije.push(this.mojeKonverzacije[i]);
                        }else{
                          this.mojeNearhivKonverzacije.push(this.mojeKonverzacije[i]);
                        }
                      }
                    }
                  }
                })    
              }
            })
          }
        })
      }else{
        if(this.korisnik.korisnicko_ime==this.mojeKonverzacije[i].vlasnik){ //arhiviramo kod vlasnika
          this.konverzServis.arhivirajKodVlasnika(this.mojeKonverzacije[i].id).subscribe(resp=>{
            if(resp['message']=='ok'){
              let mk:string;
              if(this.korisnik.tip=="reg"){
                mk = this.korisnik.korisnicko_ime;
              }else{
                mk = "agencija";
              }
          
              this.konverzServis.dohvatiMojeKonverzacije(mk).subscribe((data:Konverzacija[])=>{
                data.sort(this.sortHelper);
                this.mojeKonverzacije=data;
                this.vremePoslPoruke = [];
                this.mojeNearhivKonverzacije = [];
                this.mojeArhivKonverzacije = [];
                for(let i=0; i<this.mojeKonverzacije.length; i++){
                  this.vremePoslPoruke.push(this.mojeKonverzacije[i].poruke[this.mojeKonverzacije[i].poruke.length-1].datum);
                  this.nekrServis.dohvatiNekrPoID(this.mojeKonverzacije[i].idNekr).subscribe((data:Nekretnina)=>{
                    this.mojeKonverzacije[i].nazivNekr = data.naziv;
          
                    //odrediti da li je za i-tu konverzaciju ulogovani vlasnik ili kupac,
                    // a onda u zavisnosti od toga proveriti arhivirano_vlasnik ili arhivirano_kupac
                    if(this.korisnik.tip=="ag"){ //sigurno vlasnik
                      if(this.mojeKonverzacije[i].arhivirano_vlasnik==1){
                        this.mojeArhivKonverzacije.push(this.mojeKonverzacije[i]);
                      }else{
                        this.mojeNearhivKonverzacije.push(this.mojeKonverzacije[i]);
                      }
                    }else{
                      if(this.mojeKonverzacije[i].vlasnik=="agencija"){ //ulogovan reg, a vlasnik agencija => sigurno kupac
                        if(this.mojeKonverzacije[i].arhivirano_kupac==1){
                          this.mojeArhivKonverzacije.push(this.mojeKonverzacije[i]);
                        }else{
                          this.mojeNearhivKonverzacije.push(this.mojeKonverzacije[i]);
                        }
                      } else{ //dva reg korisnika
                        if(this.mojeKonverzacije[i].vlasnik==this.korisnik.korisnicko_ime){ //vlasnik
                          if(this.mojeKonverzacije[i].arhivirano_vlasnik==1){
                            this.mojeArhivKonverzacije.push(this.mojeKonverzacije[i]);
                          }else{
                            this.mojeNearhivKonverzacije.push(this.mojeKonverzacije[i]);
                          }
                        }else{ //kupac
                          if(this.mojeKonverzacije[i].arhivirano_kupac==1){
                            this.mojeArhivKonverzacije.push(this.mojeKonverzacije[i]);
                          }else{
                            this.mojeNearhivKonverzacije.push(this.mojeKonverzacije[i]);
                          }
                        }
                      }
                    }
                  })    
                }
              })
            }
          })
        }else{ //arhiviramo kod kupca
          this.konverzServis.arhivirajKodKupca(this.mojeKonverzacije[i].id).subscribe(resp=>{
            if(resp['message']=='ok'){
              let mk:string;
              if(this.korisnik.tip=="reg"){
                mk = this.korisnik.korisnicko_ime;
              }else{
                mk = "agencija";
              }
          
              this.konverzServis.dohvatiMojeKonverzacije(mk).subscribe((data:Konverzacija[])=>{
                data.sort(this.sortHelper);
                this.mojeKonverzacije=data;
                this.vremePoslPoruke = [];
                this.mojeNearhivKonverzacije = [];
                this.mojeArhivKonverzacije = [];
                for(let i=0; i<this.mojeKonverzacije.length; i++){
                  this.vremePoslPoruke.push(this.mojeKonverzacije[i].poruke[this.mojeKonverzacije[i].poruke.length-1].datum);
                  this.nekrServis.dohvatiNekrPoID(this.mojeKonverzacije[i].idNekr).subscribe((data:Nekretnina)=>{
                    this.mojeKonverzacije[i].nazivNekr = data.naziv;
          
                    //odrediti da li je za i-tu konverzaciju ulogovani vlasnik ili kupac,
                    // a onda u zavisnosti od toga proveriti arhivirano_vlasnik ili arhivirano_kupac
                    if(this.korisnik.tip=="ag"){ //sigurno vlasnik
                      if(this.mojeKonverzacije[i].arhivirano_vlasnik==1){
                        this.mojeArhivKonverzacije.push(this.mojeKonverzacije[i]);
                      }else{
                        this.mojeNearhivKonverzacije.push(this.mojeKonverzacije[i]);
                      }
                    }else{
                      if(this.mojeKonverzacije[i].vlasnik=="agencija"){ //ulogovan reg, a vlasnik agencija => sigurno kupac
                        if(this.mojeKonverzacije[i].arhivirano_kupac==1){
                          this.mojeArhivKonverzacije.push(this.mojeKonverzacije[i]);
                        }else{
                          this.mojeNearhivKonverzacije.push(this.mojeKonverzacije[i]);
                        }
                      } else{ //dva reg korisnika
                        if(this.mojeKonverzacije[i].vlasnik==this.korisnik.korisnicko_ime){ //vlasnik
                          if(this.mojeKonverzacije[i].arhivirano_vlasnik==1){
                            this.mojeArhivKonverzacije.push(this.mojeKonverzacije[i]);
                          }else{
                            this.mojeNearhivKonverzacije.push(this.mojeKonverzacije[i]);
                          }
                        }else{ //kupac
                          if(this.mojeKonverzacije[i].arhivirano_kupac==1){
                            this.mojeArhivKonverzacije.push(this.mojeKonverzacije[i]);
                          }else{
                            this.mojeNearhivKonverzacije.push(this.mojeKonverzacije[i]);
                          }
                        }
                      }
                    }
                  })    
                }
              })
            }
          })
        }
      }
    }

  }

  odarhiviraj(i){

    
    //racunamo da li arhiviramo kod kupca ili vlasnika
    if(this.korisnik.tip=="ag"){ //sigurno arhiviramo kod vlasnika
      this.konverzServis.odarhivirajKodVlasnika(this.mojeKonverzacije[i].id).subscribe(resp=>{
        if(resp['message']=='ok'){
          let mk:string;
          if(this.korisnik.tip=="reg"){
            mk = this.korisnik.korisnicko_ime;
          }else{
            mk = "agencija";
          }
      
          this.konverzServis.dohvatiMojeKonverzacije(mk).subscribe((data:Konverzacija[])=>{
            data.sort(this.sortHelper);
            this.mojeKonverzacije=data;
            this.vremePoslPoruke = [];
            this.mojeNearhivKonverzacije = [];
            this.mojeArhivKonverzacije = [];
            for(let i=0; i<this.mojeKonverzacije.length; i++){
              this.vremePoslPoruke.push(this.mojeKonverzacije[i].poruke[this.mojeKonverzacije[i].poruke.length-1].datum);
              this.nekrServis.dohvatiNekrPoID(this.mojeKonverzacije[i].idNekr).subscribe((data:Nekretnina)=>{
                this.mojeKonverzacije[i].nazivNekr = data.naziv;
      
                //odrediti da li je za i-tu konverzaciju ulogovani vlasnik ili kupac,
                // a onda u zavisnosti od toga proveriti arhivirano_vlasnik ili arhivirano_kupac
                if(this.korisnik.tip=="ag"){ //sigurno vlasnik
                  if(this.mojeKonverzacije[i].arhivirano_vlasnik==1){
                    this.mojeArhivKonverzacije.push(this.mojeKonverzacije[i]);
                  }else{
                    this.mojeNearhivKonverzacije.push(this.mojeKonverzacije[i]);
                  }
                }else{
                  if(this.mojeKonverzacije[i].vlasnik=="agencija"){ //ulogovan reg, a vlasnik agencija => sigurno kupac
                    if(this.mojeKonverzacije[i].arhivirano_kupac==1){
                      this.mojeArhivKonverzacije.push(this.mojeKonverzacije[i]);
                    }else{
                      this.mojeNearhivKonverzacije.push(this.mojeKonverzacije[i]);
                    }
                  } else{ //dva reg korisnika
                    if(this.mojeKonverzacije[i].vlasnik==this.korisnik.korisnicko_ime){ //vlasnik
                      if(this.mojeKonverzacije[i].arhivirano_vlasnik==1){
                        this.mojeArhivKonverzacije.push(this.mojeKonverzacije[i]);
                      }else{
                        this.mojeNearhivKonverzacije.push(this.mojeKonverzacije[i]);
                      }
                    }else{ //kupac
                      if(this.mojeKonverzacije[i].arhivirano_kupac==1){
                        this.mojeArhivKonverzacije.push(this.mojeKonverzacije[i]);
                      }else{
                        this.mojeNearhivKonverzacije.push(this.mojeKonverzacije[i]);
                      }
                    }
                  }
                }
              })    
            }
          })
        }
      })
    }else{
      if(this.mojeKonverzacije[i].vlasnik=="agencija"){ //ulogovan reg, a vlasnik agencija => arhiviramo kod kupca
        this.konverzServis.odarhivirajKodKupca(this.mojeKonverzacije[i].id).subscribe(resp=>{
          if(resp['message']=='ok'){
            let mk:string;
            if(this.korisnik.tip=="reg"){
              mk = this.korisnik.korisnicko_ime;
            }else{
              mk = "agencija";
            }
        
            this.konverzServis.dohvatiMojeKonverzacije(mk).subscribe((data:Konverzacija[])=>{
              data.sort(this.sortHelper);
              this.mojeKonverzacije=data;
              this.vremePoslPoruke = [];
              this.mojeNearhivKonverzacije = [];
              this.mojeArhivKonverzacije = [];
              for(let i=0; i<this.mojeKonverzacije.length; i++){
                this.vremePoslPoruke.push(this.mojeKonverzacije[i].poruke[this.mojeKonverzacije[i].poruke.length-1].datum);
                this.nekrServis.dohvatiNekrPoID(this.mojeKonverzacije[i].idNekr).subscribe((data:Nekretnina)=>{
                  this.mojeKonverzacije[i].nazivNekr = data.naziv;
        
                  //odrediti da li je za i-tu konverzaciju ulogovani vlasnik ili kupac,
                  // a onda u zavisnosti od toga proveriti arhivirano_vlasnik ili arhivirano_kupac
                  if(this.korisnik.tip=="ag"){ //sigurno vlasnik
                    if(this.mojeKonverzacije[i].arhivirano_vlasnik==1){
                      this.mojeArhivKonverzacije.push(this.mojeKonverzacije[i]);
                    }else{
                      this.mojeNearhivKonverzacije.push(this.mojeKonverzacije[i]);
                    }
                  }else{
                    if(this.mojeKonverzacije[i].vlasnik=="agencija"){ //ulogovan reg, a vlasnik agencija => sigurno kupac
                      if(this.mojeKonverzacije[i].arhivirano_kupac==1){
                        this.mojeArhivKonverzacije.push(this.mojeKonverzacije[i]);
                      }else{
                        this.mojeNearhivKonverzacije.push(this.mojeKonverzacije[i]);
                      }
                    } else{ //dva reg korisnika
                      if(this.mojeKonverzacije[i].vlasnik==this.korisnik.korisnicko_ime){ //vlasnik
                        if(this.mojeKonverzacije[i].arhivirano_vlasnik==1){
                          this.mojeArhivKonverzacije.push(this.mojeKonverzacije[i]);
                        }else{
                          this.mojeNearhivKonverzacije.push(this.mojeKonverzacije[i]);
                        }
                      }else{ //kupac
                        if(this.mojeKonverzacije[i].arhivirano_kupac==1){
                          this.mojeArhivKonverzacije.push(this.mojeKonverzacije[i]);
                        }else{
                          this.mojeNearhivKonverzacije.push(this.mojeKonverzacije[i]);
                        }
                      }
                    }
                  }
                })    
              }
            })
          }
        })
      }else{
        if(this.korisnik.korisnicko_ime==this.mojeKonverzacije[i].vlasnik){ //arhiviramo kod vlasnika
          this.konverzServis.odarhivirajKodVlasnika(this.mojeKonverzacije[i].id).subscribe(resp=>{
            if(resp['message']=='ok'){
              let mk:string;
              if(this.korisnik.tip=="reg"){
                mk = this.korisnik.korisnicko_ime;
              }else{
                mk = "agencija";
              }
          
              this.konverzServis.dohvatiMojeKonverzacije(mk).subscribe((data:Konverzacija[])=>{
                data.sort(this.sortHelper);
                this.mojeKonverzacije=data;
                this.vremePoslPoruke = [];
                this.mojeNearhivKonverzacije = [];
                this.mojeArhivKonverzacije = [];
                for(let i=0; i<this.mojeKonverzacije.length; i++){
                  this.vremePoslPoruke.push(this.mojeKonverzacije[i].poruke[this.mojeKonverzacije[i].poruke.length-1].datum);
                  this.nekrServis.dohvatiNekrPoID(this.mojeKonverzacije[i].idNekr).subscribe((data:Nekretnina)=>{
                    this.mojeKonverzacije[i].nazivNekr = data.naziv;
          
                    //odrediti da li je za i-tu konverzaciju ulogovani vlasnik ili kupac,
                    // a onda u zavisnosti od toga proveriti arhivirano_vlasnik ili arhivirano_kupac
                    if(this.korisnik.tip=="ag"){ //sigurno vlasnik
                      if(this.mojeKonverzacije[i].arhivirano_vlasnik==1){
                        this.mojeArhivKonverzacije.push(this.mojeKonverzacije[i]);
                      }else{
                        this.mojeNearhivKonverzacije.push(this.mojeKonverzacije[i]);
                      }
                    }else{
                      if(this.mojeKonverzacije[i].vlasnik=="agencija"){ //ulogovan reg, a vlasnik agencija => sigurno kupac
                        if(this.mojeKonverzacije[i].arhivirano_kupac==1){
                          this.mojeArhivKonverzacije.push(this.mojeKonverzacije[i]);
                        }else{
                          this.mojeNearhivKonverzacije.push(this.mojeKonverzacije[i]);
                        }
                      } else{ //dva reg korisnika
                        if(this.mojeKonverzacije[i].vlasnik==this.korisnik.korisnicko_ime){ //vlasnik
                          if(this.mojeKonverzacije[i].arhivirano_vlasnik==1){
                            this.mojeArhivKonverzacije.push(this.mojeKonverzacije[i]);
                          }else{
                            this.mojeNearhivKonverzacije.push(this.mojeKonverzacije[i]);
                          }
                        }else{ //kupac
                          if(this.mojeKonverzacije[i].arhivirano_kupac==1){
                            this.mojeArhivKonverzacije.push(this.mojeKonverzacije[i]);
                          }else{
                            this.mojeNearhivKonverzacije.push(this.mojeKonverzacije[i]);
                          }
                        }
                      }
                    }
                  })    
                }
              })
            }
          })
        }else{ //arhiviramo kod kupca
          this.konverzServis.odarhivirajKodKupca(this.mojeKonverzacije[i].id).subscribe(resp=>{
            if(resp['message']=='ok'){
              let mk:string;
              if(this.korisnik.tip=="reg"){
                mk = this.korisnik.korisnicko_ime;
              }else{
                mk = "agencija";
              }
          
              this.konverzServis.dohvatiMojeKonverzacije(mk).subscribe((data:Konverzacija[])=>{
                data.sort(this.sortHelper);
                this.mojeKonverzacije=data;
                this.vremePoslPoruke = [];
                this.mojeNearhivKonverzacije = [];
                this.mojeArhivKonverzacije = [];
                for(let i=0; i<this.mojeKonverzacije.length; i++){
                  this.vremePoslPoruke.push(this.mojeKonverzacije[i].poruke[this.mojeKonverzacije[i].poruke.length-1].datum);
                  this.nekrServis.dohvatiNekrPoID(this.mojeKonverzacije[i].idNekr).subscribe((data:Nekretnina)=>{
                    this.mojeKonverzacije[i].nazivNekr = data.naziv;
          
                    //odrediti da li je za i-tu konverzaciju ulogovani vlasnik ili kupac,
                    // a onda u zavisnosti od toga proveriti arhivirano_vlasnik ili arhivirano_kupac
                    if(this.korisnik.tip=="ag"){ //sigurno vlasnik
                      if(this.mojeKonverzacije[i].arhivirano_vlasnik==1){
                        this.mojeArhivKonverzacije.push(this.mojeKonverzacije[i]);
                      }else{
                        this.mojeNearhivKonverzacije.push(this.mojeKonverzacije[i]);
                      }
                    }else{
                      if(this.mojeKonverzacije[i].vlasnik=="agencija"){ //ulogovan reg, a vlasnik agencija => sigurno kupac
                        if(this.mojeKonverzacije[i].arhivirano_kupac==1){
                          this.mojeArhivKonverzacije.push(this.mojeKonverzacije[i]);
                        }else{
                          this.mojeNearhivKonverzacije.push(this.mojeKonverzacije[i]);
                        }
                      } else{ //dva reg korisnika
                        if(this.mojeKonverzacije[i].vlasnik==this.korisnik.korisnicko_ime){ //vlasnik
                          if(this.mojeKonverzacije[i].arhivirano_vlasnik==1){
                            this.mojeArhivKonverzacije.push(this.mojeKonverzacije[i]);
                          }else{
                            this.mojeNearhivKonverzacije.push(this.mojeKonverzacije[i]);
                          }
                        }else{ //kupac
                          if(this.mojeKonverzacije[i].arhivirano_kupac==1){
                            this.mojeArhivKonverzacije.push(this.mojeKonverzacije[i]);
                          }else{
                            this.mojeNearhivKonverzacije.push(this.mojeKonverzacije[i]);
                          }
                        }
                      }
                    }
                  })    
                }
              })
            }
          })
        }
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
      this.ruter.navigate(['']);
    }

}
