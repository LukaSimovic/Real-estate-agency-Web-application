import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { Korisnik } from '../models/korisnik';
import { Nekretnina } from '../models/nekretnina';
import { NekretninaService } from '../nekretnina.service';

@Component({
  selector: 'app-dodaj-nekretninu',
  templateUrl: './dodaj-nekretninu.component.html',
  styleUrls: ['./dodaj-nekretninu.component.css']
})
export class DodajNekretninuComponent implements OnInit {

  constructor(private ruter: Router,
    private nekretninaServis:NekretninaService,
    private http:HttpClient,
    notifierService: NotifierService) {
      this.notifier=notifierService;
     }


  ngOnInit(): void {
    this.korisnik = JSON.parse(localStorage.getItem('ulogovan'));
    if(this.korisnik.tip!="ag" && this.korisnik.tip!="admin" && this.korisnik.tip!="reg"){
      localStorage.removeItem('ulogovan');
      this.ruter.navigate(['']);
    }
  }

  notifier:NotifierService

  korisnik:Korisnik

  id:number;
  naziv:string;
  grad:string;
  opstina:string;
  adresa:string;
  tip:string;
  br_spratova:string;
  kvadratura:string;
  br_soba:string;
  sprat:string;
  namesten:boolean;
  izdavanje:string;
  cena:string;
  odobreno:string;
  fajloviSlike:string[]=[];
  fajloviVideo:string[]=[];

  sveNekretnine:Nekretnina[];



  dodajNekretninu(){
    if((this.fajloviSlike.length+this.fajloviVideo.length)>=3){

      if(this.tip){
        if(this.tip=='1'){
          this.sprat="-2";
        }
        if(parseInt(this.sprat)<=parseInt(this.br_spratova)+1){
          let nam;
          if(this.namesten==true){
            nam=1;
          }else{
            nam=0;
          }
          let vlasnik;
          if(this.korisnik.tip=="admin" || this.korisnik.tip=="ag"){
            this.odobreno="1";
            vlasnik = "agencija";
          }else{
            this.odobreno="0";
            vlasnik = this.korisnik.korisnicko_ime;
          }

          this.nekretninaServis.dohvatiSveNekretnine().subscribe((data:Nekretnina[])=>{
            this.sveNekretnine=data;
            this.id = this.sveNekretnine[this.sveNekretnine.length-1].id+1;
            this.nekretninaServis.dodavanjeNekretnine(this.id, this.naziv,this.grad,this.opstina,this.adresa,this.tip,this.sprat, this.br_spratova, this.kvadratura, this.br_soba,nam,this.fajloviSlike,this.fajloviVideo,this.izdavanje,this.cena,vlasnik, this.odobreno).subscribe(resp=>{
              if(resp['message']=='OK'){
                this.notifier.hideAll();
                this.notifier.notify('success', 'Zahtev za registraciju je poslat!');
                this.onSubmit();
              }else{
                this.notifier.hideAll();
                this.notifier.notify('error', 'Greska! Pogresno uneti podaci!');
              }
            })
          })         
          
        }else{
          this.notifier.notify('error', 'Stan ne moze da se nalazi na zadatom spratu!');
        }
      }else{
        this.notifier.notify('error', 'Morate izabrati da li je nekretnina stan ili kuca!');

      }
     
    }else{
      this.notifier.notify('error', 'Morate izabrati minimum 3 fajla!');
    }

  }


  prikazUsprat:boolean = false;
  prikazUbrSoba:boolean =false;
  btnUsprat(){
    this.prikazUsprat = !this.prikazUsprat;
  }
  btnUbrSoba(){
    this.prikazUbrSoba = !this.prikazUbrSoba;
  }

    /* Set the width of the side navigation to 250px and the left margin of the page content to 250px and add a black background color to body */
    openNav() {
      if(this.korisnik.tip=="admin"){
        document.getElementById("mySidenav2").style.width = "200px";
        document.getElementById("main").style.marginLeft = "200px";
      }else if(this.korisnik.tip=="reg"){
        document.getElementById("mySidenav").style.width = "200px";
        document.getElementById("main").style.marginLeft = "200px";
      }else{
        document.getElementById("mySidenav3").style.width = "200px";
        document.getElementById("main").style.marginLeft = "200px";
      }
      }
    
      /* Set the width of the side navigation to 0 and the left margin of the page content to 0, and the background color of body to white */
      closeNav() {
        if(this.korisnik.tip=="admin"){
          document.getElementById("mySidenav2").style.width = "0";
          document.getElementById("main").style.marginLeft = "0";
        }else if(this.korisnik.tip=="reg"){
          document.getElementById("mySidenav").style.width = "0";
          document.getElementById("main").style.marginLeft = "0";
        }else{
          document.getElementById("mySidenav3").style.width = "0";
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

    multipleImages=[];

    selectMultipleImage(event) {
      let ime:string;
      if (event.target.files.length > 0) {
        this.multipleImages = event.target.files;
        for(let img of this.multipleImages){
          ime = img.name;
          let posltacka= ime.lastIndexOf(".");
          if(ime.substr(posltacka)==".mp4"){
            this.fajloviVideo.push(ime);
          }else{
            this.fajloviSlike.push(ime);
          }
          
        }
      
      } 
      
    }

    onSubmit(){
      
      const formData = new FormData();
      for(let img of this.multipleImages){
        formData.append('files', img);
      }
  
      this.http.post<any>('http://localhost:4000/multipleFiles', formData).subscribe(
        (res) => console.log(res),
        (err) => console.log(err)
      );
      
    }
}
