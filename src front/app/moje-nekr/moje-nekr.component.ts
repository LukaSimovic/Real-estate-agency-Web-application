import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Korisnik } from '../models/korisnik';
import { Nekretnina } from '../models/nekretnina';
import { NekretninaService } from '../nekretnina.service';

@Component({
  selector: 'app-moje-nekr',
  templateUrl: './moje-nekr.component.html',
  styleUrls: ['./moje-nekr.component.css']
})
export class MojeNekrComponent implements OnInit {

 

    constructor(private ruter: Router,
      private nekrServis: NekretninaService) { }
  
    ngOnInit(): void {
      this.korisnik = JSON.parse(localStorage.getItem('ulogovan'));
      if(this.korisnik.tip!="ag" && this.korisnik.tip!="reg"){
        localStorage.removeItem('ulogovan');
        this.ruter.navigate(['']);
      }
      let vlasnik;
      if(this.korisnik.tip=="ag"){
        vlasnik="agencija";
      }else{
        vlasnik=this.korisnik.korisnicko_ime;
      }
      this.nekrServis.dohvatiKorisnikoveNekretnine(vlasnik).subscribe((data:Nekretnina[])=>{
        this.mojeNekretnine=data;
       
        for(let i=0; i<this.mojeNekretnine.length; i++){
          if(this.mojeNekretnine[i].kuca==1){
            this.mojeNekretnine[i].kucastanStr="Kuća";
          }else{
            this.mojeNekretnine[i].kucastanStr=this.mojeNekretnine[i].broj_soba + " stan";
          }
    
          if(this.mojeNekretnine[i].izdavanje==1){
            this.mojeNekretnine[i].izdajeprodajeStr="Izdavanje";
          }else{
            this.mojeNekretnine[i].izdajeprodajeStr="Prodaja";
          }
        }
      })
    }
  
    korisnik:Korisnik
  
    mojeNekretnine: Nekretnina[];
  
    izbrisiNekr(id){
  
      this.nekrServis.izbrisiNekretninu(id).subscribe(resp=>{
  
        if(resp['message']=='OK'){
          let vl;
          if(this.korisnik.tip=="ag"){
            vl = "agencija";
          }else{
            vl= this.korisnik.korisnicko_ime;
          }
          this.nekrServis.dohvatiKorisnikoveNekretnine(vl).subscribe((data:Nekretnina[])=>{
            this.mojeNekretnine=data;
            for(let i=0; i<this.mojeNekretnine.length; i++){

              if(this.mojeNekretnine[i].kuca==1){
                this.mojeNekretnine[i].kucastanStr="Kuća";
              }else{
                this.mojeNekretnine[i].kucastanStr=this.mojeNekretnine[i].broj_soba + " stan";
              }
        
              if(this.mojeNekretnine[i].izdavanje==1){
                this.mojeNekretnine[i].izdajeprodajeStr="Izdavanje";
              }else{
                this.mojeNekretnine[i].izdajeprodajeStr="Prodaja";
              }
            }
          })
        }else{
          alert('Brisanje nije uspelo!');
        }
      })
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
