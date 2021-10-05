import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { KorisnikService } from '../korisnik.service';
import { Korisnik } from '../models/korisnik';
import { Nekretnina } from '../models/nekretnina';
import { NekretninaService } from '../nekretnina.service';

@Component({
  selector: 'app-zahtevi-nekretnina',
  templateUrl: './zahtevi-nekretnina.component.html',
  styleUrls: ['./zahtevi-nekretnina.component.css']
})
export class ZahteviNekretninaComponent implements OnInit {

  constructor(private ruter:Router,
    private korisnikServis:KorisnikService,
    private nekretninaServis:NekretninaService) { }

  ngOnInit(): void {
    this.korisnik = JSON.parse(localStorage.getItem('ulogovan'));
    if(this.korisnik.tip!="ag" && this.korisnik.tip!="admin"){
      localStorage.removeItem('ulogovan');
      this.ruter.navigate(['']);
    }
    this.nekretninaServis.dohvatiNeodobreneNekretnine().subscribe((data:Nekretnina[])=>{
      this.neodobreneNekretnine=data;

      for(let i=0; i<this.neodobreneNekretnine.length; i++){
        if(this.neodobreneNekretnine[i].kuca==1){
          if(this.neodobreneNekretnine[i].namesten==1){
            this.neodobreneNekretnine[i].kucastanStr="Namestena "+this.neodobreneNekretnine[i].broj_soba + " kuća";
          }else{
            this.neodobreneNekretnine[i].kucastanStr="Nenamestena "+this.neodobreneNekretnine[i].broj_soba + " kuća";
          }
        }else{
          if(this.neodobreneNekretnine[i].namesten==1){
            this.neodobreneNekretnine[i].kucastanStr="Namesten "+this.neodobreneNekretnine[i].broj_soba + " stan";
          }else{
            this.neodobreneNekretnine[i].kucastanStr="Nenamesten "+this.neodobreneNekretnine[i].broj_soba + " stan";
          }
        }
  
        if(this.neodobreneNekretnine[i].izdavanje==1){
          this.neodobreneNekretnine[i].izdajeprodajeStr="Izdavanje";
        }else{
          this.neodobreneNekretnine[i].izdajeprodajeStr="Prodaja";
        }

        this.brojacSlika.push(0);
        this.brojacVidea.push(0);
        if(this.neodobreneNekretnine[i].videogalerija.length!=0){
          this.notifNemaVidea.push(0);
        }else{
          this.notifNemaVidea.push(1);
        }
        if(this.neodobreneNekretnine[i].galerija.length!=0){
          this.notifNemaSlike.push(0);
        }else{
          this.notifNemaSlike.push(1);
        }
        this.prikazSV.push(0); //prvo se prikazuju slike
      }
    })
   
  }

  korisnik:Korisnik;
  neodobreneNekretnine:Nekretnina[];


  odobriNekretninu(id){
    this.nekretninaServis.odobriNekretninu(id).subscribe(resp=>{
      if(resp['message']=='OK'){
        this.nekretninaServis.dohvatiNeodobreneNekretnine().subscribe((data:Nekretnina[])=>{
          this.neodobreneNekretnine=data;
        })
    

      }
    })
  }

  izbrisiNekretninu(id){
    this.nekretninaServis.izbrisiNekretninu(id).subscribe(resp=>{
      if(resp['message']=='OK'){
        this.nekretninaServis.dohvatiNeodobreneNekretnine().subscribe((data:Nekretnina[])=>{
          this.neodobreneNekretnine=data;
        })
    

      }
    })
  }

  brojacSlika:number[] = [];
  brojacVidea:number[]=[];
  sledecaSlika(i){
    if(this.prikazSV[i]==1){
      this.brojacVidea[i] = (this.brojacVidea[i]+1)%this.neodobreneNekretnine[i].videogalerija.length;
    }else{
      this.brojacSlika[i] = (this.brojacSlika[i]+1)%this.neodobreneNekretnine[i].galerija.length;
    }
  }

  prikazSV:number[]=[]; //prvo se prikazuju slike
  prikaziSlike(i){
    this.prikazSV[i]=0; //slika

  }

  notifNemaVidea:number[]=[];
  notifNemaSlike:number[]=[];
  prikaziVidee(i){
      this.prikazSV[i]=1; //video
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
