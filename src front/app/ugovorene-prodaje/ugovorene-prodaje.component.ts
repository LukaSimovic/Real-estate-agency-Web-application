import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { KonverzacijaService } from '../konverzacija.service';
import { Konverzacija } from '../models/konverzacija';
import { Korisnik } from '../models/korisnik';
import { Nekretnina } from '../models/nekretnina';
import { NekretninaService } from '../nekretnina.service';

@Component({
  selector: 'app-ugovorene-prodaje',
  templateUrl: './ugovorene-prodaje.component.html',
  styleUrls: ['./ugovorene-prodaje.component.css']
})
export class UgovoreneProdajeComponent implements OnInit {

  constructor(private ruter:Router,
    private konverzServis:KonverzacijaService,
    private nekrServis:NekretninaService) { }

  ngOnInit(): void {
    this.korisnik = JSON.parse(localStorage.getItem('ulogovan'));
    if(this.korisnik.tip!="ag" && this.korisnik.tip!="admin"){
      localStorage.removeItem('ulogovan');
      this.ruter.navigate(['']);
    }

    this.konverzServis.dohvatiKonverzacijeNaCekanju().subscribe((data1:Konverzacija[])=>{
      this.cekanjePotvrde = data1;
      this.konverzServis.dohvatiUgovoreneKonverzacije().subscribe((data2:Konverzacija[])=>{
        this.ugovoreneProdaje =data2;

        for(let i=0; i<this.cekanjePotvrde.length; i++){
          let pom:Konverzacija = this.cekanjePotvrde[i];
          if(pom.ponuda.gotovina==0){
            this.cekanjePotvrde[i].gotovinaStr = "U gotovini";
          }else{
            this.cekanjePotvrde[i].gotovinaStr = "Kredit"
          }
          this.nekrServis.dohvatiNekrPoID(pom.idNekr).subscribe((dataN:Nekretnina)=>{
            this.cekanjePotvrde[i].nazivNekr = dataN.naziv;
          })
        }

        for(let i=0; i<this.ugovoreneProdaje.length; i++){
          let pom:Konverzacija = this.ugovoreneProdaje[i];
          if(pom.ponuda.gotovina==0){
            this.ugovoreneProdaje[i].gotovinaStr = "U gotovini";
          }else{
            this.ugovoreneProdaje[i].gotovinaStr = "Kredit"
          }

          this.nekrServis.dohvatiNekrPoID(pom.idNekr).subscribe((dataN:Nekretnina)=>{
            this.ugovoreneProdaje[i].nazivNekr = dataN.naziv;

            if(this.ugovoreneProdaje[i].vlasnik=="agencija"){
              this.ugovoreneProdaje[i].prihodAgen = this.ugovoreneProdaje[i].ponuda.cena;
            }else{
                this.ugovoreneProdaje[i].prihodAgen = this.ugovoreneProdaje[i].ponuda.cena/100*this.ugovoreneProdaje[i].proc_agencije;
              
            }
           

            this.prihod+=this.ugovoreneProdaje[i].prihodAgen;
          })
        }
      })
    })
  }

  korisnik:Korisnik
  prihod:number=0;

  ugovoreneProdaje:Konverzacija[];
  cekanjePotvrde:Konverzacija[];



  potvrdi(kov){

    this.nekrServis.dohvatiNekrPoID(kov.idNekr).subscribe((data:Nekretnina)=>{
      let pom:Nekretnina = data;
      let proc:number;
      if(pom.izdavanje==1){
        proc = parseInt(localStorage.getItem('proc_izdavanje'));
      }else{
        proc = parseInt(localStorage.getItem('proc_prodaja'));
      }
      this.konverzServis.agentOdobrio(kov.id,proc).subscribe(resp=>{
        if(resp['message']=='ok'){
          if(pom.izdavanje==1){
            this.nekrServis.izdajNekretninu(kov.idNekr,kov.ponuda.datum_pocetka,
              kov.ponuda.datum_kraja,kov.ponuda.cena).subscribe(resp=>{
                if(resp['message']=='OK'){
                  //odbij ostale sto se preklapaju
                  this.odbijOstaleIzdavanje(kov.idNekr,kov.id,kov);
                  this.konverzServis.dohvatiKonverzacijeNaCekanju().subscribe((data1:Konverzacija[])=>{
                    this.cekanjePotvrde = data1;
                    this.konverzServis.dohvatiUgovoreneKonverzacije().subscribe((data2:Konverzacija[])=>{
                      this.ugovoreneProdaje =data2;
                      this.prihod=0;
                      for(let i=0; i<this.cekanjePotvrde.length; i++){
                        let pom:Konverzacija = this.cekanjePotvrde[i];
                        if(pom.ponuda.gotovina==0){
                          this.cekanjePotvrde[i].gotovinaStr = "U gotovini";
                        }else{
                          this.cekanjePotvrde[i].gotovinaStr = "Kredit"
                        }
                        this.nekrServis.dohvatiNekrPoID(pom.idNekr).subscribe((dataN:Nekretnina)=>{
                          this.cekanjePotvrde[i].nazivNekr = dataN.naziv;
                        })
                      }
              
                      for(let i=0; i<this.ugovoreneProdaje.length; i++){
                        let pom:Konverzacija = this.ugovoreneProdaje[i];
                        if(pom.ponuda.gotovina==0){
                          this.ugovoreneProdaje[i].gotovinaStr = "U gotovini";
                        }else{
                          this.ugovoreneProdaje[i].gotovinaStr = "Kredit"
                        }
              
                        this.nekrServis.dohvatiNekrPoID(pom.idNekr).subscribe((dataN:Nekretnina)=>{
                          this.ugovoreneProdaje[i].nazivNekr = dataN.naziv;
              
                          if(this.ugovoreneProdaje[i].vlasnik=="agencija"){
                            this.ugovoreneProdaje[i].prihodAgen = this.ugovoreneProdaje[i].ponuda.cena;
                          }else{
                              this.ugovoreneProdaje[i].prihodAgen = this.ugovoreneProdaje[i].ponuda.cena/100*this.ugovoreneProdaje[i].proc_agencije;
                          }
                         
              
                          this.prihod+=this.ugovoreneProdaje[i].prihodAgen;
                        })
                      }
                    })
                  })
                }
              })
          }else{ //prodato na 1
            this.nekrServis.prodajNekretninu(kov.idNekr).subscribe(resp=>{
              if(resp['message']=='OK'){
                //odbij ostale
                this.odbijOstaleProdato(kov.idNekr,kov.id,kov);
                this.konverzServis.dohvatiKonverzacijeNaCekanju().subscribe((data1:Konverzacija[])=>{
                  this.cekanjePotvrde = data1;
                  this.konverzServis.dohvatiUgovoreneKonverzacije().subscribe((data2:Konverzacija[])=>{
                    this.ugovoreneProdaje =data2;
                    this.prihod=0;

                    for(let i=0; i<this.cekanjePotvrde.length; i++){
                      let pom:Konverzacija = this.cekanjePotvrde[i];
                      if(pom.ponuda.gotovina==0){
                        this.cekanjePotvrde[i].gotovinaStr = "U gotovini";
                      }else{
                        this.cekanjePotvrde[i].gotovinaStr = "Kredit"
                      }
                      this.nekrServis.dohvatiNekrPoID(pom.idNekr).subscribe((dataN:Nekretnina)=>{
                        this.cekanjePotvrde[i].nazivNekr = dataN.naziv;
                      })
                    }
            
                    for(let i=0; i<this.ugovoreneProdaje.length; i++){
                      let pom:Konverzacija = this.ugovoreneProdaje[i];
                      if(pom.ponuda.gotovina==0){
                        this.ugovoreneProdaje[i].gotovinaStr = "U gotovini";
                      }else{
                        this.ugovoreneProdaje[i].gotovinaStr = "Kredit"
                      }
            
                      this.nekrServis.dohvatiNekrPoID(pom.idNekr).subscribe((dataN:Nekretnina)=>{
                        this.ugovoreneProdaje[i].nazivNekr = dataN.naziv;
            
                        if(this.ugovoreneProdaje[i].vlasnik=="agencija"){
                          this.ugovoreneProdaje[i].prihodAgen = this.ugovoreneProdaje[i].ponuda.cena;
                        }else{
                          this.ugovoreneProdaje[i].prihodAgen = this.ugovoreneProdaje[i].ponuda.cena/100*this.ugovoreneProdaje[i].proc_agencije;
                        }
                       
            
                        this.prihod+=this.ugovoreneProdaje[i].prihodAgen;
                      })
                    }
                  })
                })
              }
            })
          }
        }
      })

    })
    

  }

  odbijOstaleProdato(idNekr,idKonv,konv){
    this.konverzServis.dohvatiKonverzacijuPoNekretnini(idNekr).subscribe((data:Konverzacija[])=>{

      for(let i=0; i<data.length; i++){ //proci kroz svaku i postaviti odobreno_agent na -1 i odbijam ponudu!
        let pom:Konverzacija = data[i];
        if(pom.id != idKonv){
          let datum = new Date();
          let datumStr =datum.getDate()+"."+(datum.getMonth()+1)+"."+datum.getFullYear()+" "+datum.getHours()+":"+datum.getMinutes()+":"+datum.getSeconds();
          let idPoruke =pom.poruke.length+1;

          this.konverzServis.agentOdbio(pom.id,"Agencija odbila ponudu!",datumStr,"agencija",idPoruke).subscribe(resp=>{
            if(resp['message']!='ok'){
              alert('greska!')
            }
          })
        }
      }
    })
  }

  odbijOstaleIzdavanje(idNekr,idKonv,konv){
    let mojdatumpoc:Date = new Date(konv.ponuda.datum_pocetka);
    let mojdatumkraj:Date = new Date(konv.ponuda.datum_kraja);
    this.konverzServis.dohvatiKonverzacijuPoNekretnini(idNekr).subscribe((data:Konverzacija[])=>{
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
                this.konverzServis.agentOdbio(pom.id,"Agencija odbila ponudu!",datumStr,"agencija",idPoruke).subscribe(resp=>{
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
                this.konverzServis.agentOdbio(pom.id,"Agencija odbila ponudu!",datumStr,"agencija",idPoruke).subscribe(resp=>{
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



  odbij(konv){

    this.konverzServis.agentOdbio2(konv.id).subscribe(resp=>{
      if(resp['message']=='ok'){
        this.konverzServis.dohvatiKonverzacijeNaCekanju().subscribe((data1:Konverzacija[])=>{
          this.cekanjePotvrde = data1;
          this.konverzServis.dohvatiUgovoreneKonverzacije().subscribe((data2:Konverzacija[])=>{
            this.ugovoreneProdaje =data2;
            this.prihod=0;
            for(let i=0; i<this.cekanjePotvrde.length; i++){
              let pom:Konverzacija = this.cekanjePotvrde[i];
              if(pom.ponuda.gotovina==0){
                this.cekanjePotvrde[i].gotovinaStr = "U gotovini";
              }else{
                this.cekanjePotvrde[i].gotovinaStr = "Kredit"
              }
              this.nekrServis.dohvatiNekrPoID(pom.idNekr).subscribe((dataN:Nekretnina)=>{
                this.cekanjePotvrde[i].nazivNekr = dataN.naziv;
              })
            }
    
            for(let i=0; i<this.ugovoreneProdaje.length; i++){
              let pom:Konverzacija = this.ugovoreneProdaje[i];
              if(pom.ponuda.gotovina==0){
                this.ugovoreneProdaje[i].gotovinaStr = "U gotovini";
              }else{
                this.ugovoreneProdaje[i].gotovinaStr = "Kredit"
              }
    
              this.nekrServis.dohvatiNekrPoID(pom.idNekr).subscribe((dataN:Nekretnina)=>{
                this.ugovoreneProdaje[i].nazivNekr = dataN.naziv;
    
                if(this.ugovoreneProdaje[i].vlasnik=="agencija"){
                  this.ugovoreneProdaje[i].prihodAgen = this.ugovoreneProdaje[i].ponuda.cena;
                }else{
                  this.ugovoreneProdaje[i].prihodAgen = this.ugovoreneProdaje[i].ponuda.cena/100*this.ugovoreneProdaje[i].proc_agencije;
                }
               
    
                this.prihod+=this.ugovoreneProdaje[i].prihodAgen;
              })
            }
          })
        })
      }
    })
  }



  
  /* Set the width of the side navigation to 250px and the left margin of the page content to 250px and add a black background color to body */
  openNav() {
    if(this.korisnik.tip=="admin"){
     document.getElementById("mySidenav").style.width = "200px";
     document.getElementById("main").style.marginLeft = "200px";
    }else{
     document.getElementById("mySidenav2").style.width = "200px";
     document.getElementById("main").style.marginLeft = "200px";
    }
  
   }
 
   /* Set the width of the side navigation to 0 and the left margin of the page content to 0, and the background color of body to white */
   closeNav() {
     if(this.korisnik.tip=="admin"){
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
