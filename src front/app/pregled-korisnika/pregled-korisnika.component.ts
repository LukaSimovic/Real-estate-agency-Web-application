import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { KorisnikService } from '../korisnik.service';
import { Korisnik } from '../models/korisnik';

@Component({
  selector: 'app-pregled-korisnika',
  templateUrl: './pregled-korisnika.component.html',
  styleUrls: ['./pregled-korisnika.component.css']
})
export class PregledKorisnikaComponent implements OnInit {
  constructor(private ruter:Router,
    private korisnikServis:KorisnikService) { }

  ngOnInit(): void {
    this.korisnik = JSON.parse(localStorage.getItem('ulogovan'));
    if(this.korisnik.tip!="admin"){
      localStorage.removeItem('ulogovan');
      this.ruter.navigate(['']);
    }
    this.korisnikServis.dohvatiOdobreneRegKorisnike().subscribe((data:Korisnik[])=>{
      this.odobreniRegKorisnici=data;
    })

    this.korisnikServis.dohvatiOdobreneAgente().subscribe((data:Korisnik[])=>{
      this.odobreniAgenti=data;
    })
  }

  korisnik:Korisnik;
  odobreniRegKorisnici: Korisnik[];
  odobreniAgenti:Korisnik[];

  izbrisiKorisnika(ki){
    this.korisnikServis.izbrisiKorisnika(ki).subscribe(resp=>{
  
      if(resp['message']=='OK'){
        this.korisnikServis.dohvatiOdobreneRegKorisnike().subscribe((data:Korisnik[])=>{
          this.odobreniRegKorisnici=data;
        })
    
        this.korisnikServis.dohvatiOdobreneAgente().subscribe((data:Korisnik[])=>{
          this.odobreniAgenti=data;
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
