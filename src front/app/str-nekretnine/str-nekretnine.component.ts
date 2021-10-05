import { HttpClient } from '@angular/common/http';
import { not } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { KonverzacijaService } from '../konverzacija.service';
import { KorisnikService } from '../korisnik.service';
import { Konverzacija } from '../models/konverzacija';
import { Korisnik } from '../models/korisnik';
import { Nekretnina } from '../models/nekretnina';
import { Nekr_pregledano } from '../models/nekretnina_pregledano';
import { NekretninaService } from '../nekretnina.service';

@Component({
  selector: 'app-str-nekretnine',
  templateUrl: './str-nekretnine.component.html',
  styleUrls: ['./str-nekretnine.component.css']
})
export class StrNekretnineComponent implements OnInit {

  constructor(private ruter:Router,
    private korisnikServis:KorisnikService,
    private konverServis:KonverzacijaService,
    private ruta: ActivatedRoute,
    private nekrServis: NekretninaService, private http:HttpClient,
    notifierService: NotifierService) {
      this.notifier=notifierService;
     }

     notifier: NotifierService;
     korisnik:Korisnik;
     id:number;
     sifra:string;
     konverzacija:Konverzacija
     nekretnina:Nekretnina= {id:null,naziv:"", grad:"", opstina:"", adresa:"", kuca:null, sprat:null,broj_spratova:null,kvadratura:null,
     broj_soba:null,namesten:null,videogalerija:null,izdavanje:null,izdajeprodajeStr:null,galerija:null, broj_pregleda:null,posl_pregledi:null,
   cena:null,vlasnik:null, promovisano:null,odobreno:null,randomSlika:null,kucastanStr:null, namestenStr:null, prodato:null, izdato:null};
   
  ngOnInit(): void { 
    this.prikazSlike=1;
    this.nemaSlike=1;
    this.nemaVidea=1;
    this.korisnik = JSON.parse(localStorage.getItem('ulogovan'));
    if(this.korisnik.tip!="reg"){
      localStorage.removeItem('ulogovan');
      this.ruter.navigate(['']);
    }

   
    
    this.sifra = this.ruta.snapshot.paramMap.get('sif');
    let delovi:string[] = this.sifra.split("-");
    this.id = parseInt(delovi[1]);
    this.nekrServis.dohvatiNekrPoID(this.id).subscribe((data:Nekretnina)=>{
      this.nekretnina = data;

      this.konverServis.dohvatiKonverzaciju(this.nekretnina.vlasnik,this.korisnik.korisnicko_ime, this.nekretnina.id).subscribe((data:Konverzacija)=>{
        this.konverzacija=data;
      })

        if(this.nekretnina.kuca==1){
          this.nekretnina.kucastanStr="Kuća";
        }else{
          this.nekretnina.kucastanStr=this.nekretnina.broj_soba + " stan";
        }
  
        if(this.nekretnina.izdavanje==1){
          this.nekretnina.izdajeprodajeStr="Izdavanje";
        }else{
          this.nekretnina.izdajeprodajeStr="Prodaja";
        }

        if(this.nekretnina.galerija.length==0){
          this.nemaSlike==1;
        }else{
          this.nemaSlike=0;
        }
        if(this.nekretnina.videogalerija.length==0){
          this.nemaVidea==1;
        }else{
          this.nemaVidea=0;
        }

        this.brojacVidea=0;
        this.brojacSlike=0;


        //povecanje broja pregleda stranice se gleda samo ako se dolazi sa stranice pretrage
        if(delovi[0]=="1"){
          let find:number=0;
        let sada:Date = new Date();
        let tada:Date;
          for(let i=0; i<this.nekretnina.posl_pregledi.length; i++){
    
            if(this.nekretnina.posl_pregledi[i].korisnik==this.korisnik.korisnicko_ime){
              find=1;
              tada = new Date(this.nekretnina.posl_pregledi[i].vreme_pregleda);
              break;
            }
          }
        
       
        if(find==1){ //vec pregledao, uporedi ga
          //alert("postoji pregled!");
          //alert("sada: "+sada+"\ntada: "+tada);
          if(sada.valueOf() - tada.valueOf() >= 1000*60*60*24){ //proslo je makar 24 sata
            //upisi novi pregled i inc brojac
            this.nekrServis.izbaciKorisnikovPregled(this.id, this.korisnik.korisnicko_ime).subscribe(resp=>{
              if(resp['message']=='OK'){
                
                this.nekrServis.prviKorisnikovPregled(this.id,sada, this.korisnik.korisnicko_ime).subscribe(resp=>{
                  if(resp['message']=='OK'){
                    this.nekrServis.dodajPregled(this.id).subscribe(resp=>{
                      if(resp['message']=='OK'){
                        this.nekrServis.dohvatiNekrPoID(this.id).subscribe((data:Nekretnina)=>{
                          this.nekretnina = data;
                        })
                      }else{
                        alert('GRESKA PRI UVECAVANJU BROJA PREGLEDA!');
                      }
                    })
                  }
                })
                
              }
            })
          }else{
            //alert("nije proslo 24 sata od poslednjeg pregleda, ne menjaj nista!");
          }
    
        }else{ //nije pregledao, dodaj ga
          this.nekrServis.prviKorisnikovPregled(this.id, sada,this.korisnik.korisnicko_ime).subscribe(resp=>{
            if(resp['message']=='OK'){
              this.nekrServis.dodajPregled(this.id).subscribe(resp=>{
                if(resp['message']=='OK'){
                  this.nekrServis.dohvatiNekrPoID(this.id).subscribe((data:Nekretnina)=>{
                    this.nekretnina = data;
                  })
                }else{
                  alert('GRESKA PRI UVECAVANJU BROJA PREGLEDA!');
                }
              })
              
            }
          })
        }

        }
        

       
    })

  }

  preglediNekr:Nekr_pregledano[] ;
  prikazSlike:number=1;
  brojacSlike:number;
  brojacVidea:number;
  nemaSlike:number;
  nemaVidea:number;
  datum_pocetka:Date;
  datum_kraja:Date;
  nacin_placanja:number;

  nisamVlasnik(){
    if(this.nekretnina.vlasnik != this.korisnik.korisnicko_ime){
      return true;

    }else{
      return false;
    }
  }


  sledecaSlika(){
    if(this.prikazSlike==1){
      this.brojacSlike = (this.brojacSlike+1)%this.nekretnina.galerija.length;
    }else{
      this.brojacVidea = (this.brojacVidea+1)%this.nekretnina.videogalerija.length;
    }
  }

  prikaziSlike(){
    this.prikazSlike=1;
  }
  prikaziVidee(){
    this.prikazSlike=0;
  }

  /*
  dajPonudu(){
    if(this.nekretnina.izdavanje==1){
      if(this.datum_pocetka==null || this.datum_kraja==null){ //neki datum nije izabran
        this.notifier.notify('error', 'Morate izabrati datume!')
      }else{ //datum kraja pre pocetka
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
            let d1:Date = new Date(god1,mesec1-1,dan1, 2,0,0);
            let d2: Date = new Date(god2,mesec2-1, dan2,2,0,0);
            let d1ms:number =d1.valueOf(); let d2ms:number = d2.valueOf();
           
            if(dp.valueOf() < d1ms){
              if(dk.valueOf() < d1ms){
                continue;
              }else{
                this.notifier.notify('error', 'Nekretnina je iznajmljena u periodu koji ste izabrali!')
                return;
              }
            }else if(dp.valueOf()>= d1ms && dp.valueOf()<=d2ms){
              this.notifier.notify('error', 'Nekretnina je iznajmljena u periodu koji ste izabrali!')
              return;
            }else if(dp.valueOf()>d2ms){
              continue;
            }
          }
          //upisi ponudu u konverzaciju
          let datum = new Date();
          let datumStr =datum.getDate()+"."+(datum.getMonth()+1)+"."+datum.getFullYear()+" "+datum.getHours()+":"+datum.getMinutes()+":"+datum.getSeconds();
         
          let cena:number = ((dk.valueOf() - dp.valueOf())/1000/60/60/24)*(this.nekretnina.cena / 30);
          let gotovina:number=-1;
          let tekstPonude:string  = "Dajem ponudu:\nDatum pocetka:"+this.datum_pocetka+"\nDatum kraja:"+this.datum_kraja+"\nCena:"+cena;
          if(this.konverzacija){ //samo upisi poruku
            let idPoruke = this.konverzacija.poruke.length+1;
            
            this.konverServis.upisiPonudu(this.nekretnina.vlasnik, this.korisnik.korisnicko_ime, this.nekretnina.id,
              tekstPonude, this.korisnik.korisnicko_ime, datumStr, idPoruke,this.datum_pocetka,this.datum_kraja,cena,gotovina).subscribe(resp=>{
                if(resp['message']=='ok'){
                  this.konverServis.dohvatiKonverzaciju(this.nekretnina.vlasnik, this.korisnik.korisnicko_ime, this.nekretnina.id)
                  .subscribe((data:Konverzacija)=>{
                    this.konverzacija=data;
                    this.notifier.notify('success', 'Ponuda uspesno poslata!');
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
                        this.notifier.notify('success', 'Ponuda uspesno poslata!');
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
      }
    }else{ //PRODAJA
      if(this.nacin_placanja==null){
        this.notifier.notify('error', 'Morate izabrati nacin placanja!');
        return;
      }else{
        let datum = new Date();
        let datumStr =datum.getDate()+"."+(datum.getMonth()+1)+"."+datum.getFullYear()+" "+datum.getHours()+":"+datum.getMinutes()+":"+datum.getSeconds();
        let cena = this.nekretnina.cena;
        let gotovina = this.nacin_placanja;
        let gotstr;
          if(gotovina==0){
            gotstr="U gotovini"
          }else{
            gotstr="Uzimam kredit"
          }
        let tekstPonude = "Dajem ponudu!\nNacin placanja:"+gotstr+" \n Cena: "+this.nekretnina.cena;
        if(this.konverzacija){ //samo upisi poruku
          let idPoruke = this.konverzacija.poruke.length+1;
         
          this.konverServis.upisiPonudu(this.nekretnina.vlasnik, this.korisnik.korisnicko_ime, this.nekretnina.id,
            tekstPonude, this.korisnik.korisnicko_ime, datumStr, idPoruke,this.datum_pocetka,this.datum_kraja,cena,gotovina).subscribe(resp=>{
              if(resp['message']=='ok'){
                this.konverServis.dohvatiKonverzaciju(this.nekretnina.vlasnik, this.korisnik.korisnicko_ime, this.nekretnina.id)
                .subscribe((data:Konverzacija)=>{
                  this.konverzacija=data;
                  this.notifier.notify('success', 'Ponuda uspesno poslata!');
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
                      this.notifier.notify('success', 'Ponuda uspesno poslata!');
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
    }
    
  }
  */

  kontaktiraj(){

    localStorage.setItem('nekretnina', this.nekretnina.id.toString())
    if(this.datum_pocetka && this.datum_kraja){
      localStorage.setItem('datum_pocetka', JSON.stringify(this.datum_pocetka))
      localStorage.setItem('datum_kraja', JSON.stringify(this.datum_kraja))
    }
    if(this.nacin_placanja!=null){
      localStorage.setItem('nacin_placanja', this.nacin_placanja.toString());
    }
    this.ruter.navigate(['konverzacija/0']);
   
  }

  povratak(){
    this.ruter.navigate(['pretraga']);
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
