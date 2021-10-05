import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { KorisnikService } from '../korisnik.service';
import { Korisnik } from '../models/korisnik';
import { Nekretnina } from '../models/nekretnina';
import { NekretninaService } from '../nekretnina.service';

@Component({
  selector: 'app-promovisanje',
  templateUrl: './promovisanje.component.html',
  styleUrls: ['./promovisanje.component.css']
})
export class PromovisanjeComponent implements OnInit {

  constructor(private ruter:Router,
    private korisnikServis:KorisnikService,
    private nekrServis:NekretninaService) { }

  ngOnInit(): void {
    this.korisnik = JSON.parse(localStorage.getItem('ulogovan'));
    if(this.korisnik.tip!="ag"){
      localStorage.removeItem('ulogovan');
      this.ruter.navigate(['']);
    }
    this.nekrServis.dohvatiOdobreneNeprodateNekretnine().subscribe((data:Nekretnina[])=>{
      this.odobreneNekretnine=data;

      for(let i=0; i<this.odobreneNekretnine.length; i++){
        if(this.odobreneNekretnine[i].kuca==1){
          this.odobreneNekretnine[i].kucastanStr="Kuća";
        }else{
          this.odobreneNekretnine[i].kucastanStr=this.odobreneNekretnine[i].broj_soba + " stan";
        }
  
        if(this.odobreneNekretnine[i].izdavanje==1){
          this.odobreneNekretnine[i].izdajeprodajeStr="Izdavanje";
        }else{
          this.odobreneNekretnine[i].izdajeprodajeStr="Prodaja";
        }
      }
    })


  }

  korisnik:Korisnik
  odobreneNekretnine:Nekretnina[];

  promNekr(id){
    this.nekrServis.promovisiNekretninu(id).subscribe(resp=>{
      if(resp['message']=='OK'){
        this.nekrServis.dohvatiOdobreneNeprodateNekretnine().subscribe((data:Nekretnina[])=>{
          
          this.odobreneNekretnine=data;


          for(let i=0; i<this.odobreneNekretnine.length; i++){
            if(this.odobreneNekretnine[i].kuca==1){
              this.odobreneNekretnine[i].kucastanStr="Kuća";
            }else{
              this.odobreneNekretnine[i].kucastanStr=this.odobreneNekretnine[i].broj_soba + " stan";
            }
      
            if(this.odobreneNekretnine[i].izdavanje==1){
              this.odobreneNekretnine[i].izdajeprodajeStr="Izdavanje";
            }else{
              this.odobreneNekretnine[i].izdajeprodajeStr="Prodaja";
            }
          }
        })
      }
    })
  }

  ukloniProm(id){
    this.nekrServis.ukloniProm(id).subscribe(resp=>{
      if(resp['message']=='OK'){
        this.nekrServis.dohvatiOdobreneNeprodateNekretnine().subscribe((data:Nekretnina[])=>{
          this.odobreneNekretnine=data;
          for(let i=0; i<this.odobreneNekretnine.length; i++){
            if(this.odobreneNekretnine[i].kuca==1){
              this.odobreneNekretnine[i].kucastanStr="Kuća";
            }else{
              this.odobreneNekretnine[i].kucastanStr=this.odobreneNekretnine[i].broj_soba + " stan";
            }
      
            if(this.odobreneNekretnine[i].izdavanje==1){
              this.odobreneNekretnine[i].izdajeprodajeStr="Izdavanje";
            }else{
              this.odobreneNekretnine[i].izdajeprodajeStr="Prodaja";
            }
          }
        })
      }
    })
  }

  
   /* Set the width of the side navigation to 250px and the left margin of the page content to 250px and add a black background color to body */
   openNav() {
    document.getElementById("mySidenav").style.width = "200px";
    document.getElementById("main").style.marginLeft = "200px";
    }
  
    /* Set the width of the side navigation to 0 and the left margin of the page content to 0, and the background color of body to white */
    closeNav() {
      document.getElementById("mySidenav").style.width = "0";
      document.getElementById("main").style.marginLeft = "0";
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
