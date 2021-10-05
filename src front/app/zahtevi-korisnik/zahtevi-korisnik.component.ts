import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { KorisnikService } from '../korisnik.service';
import { Korisnik } from '../models/korisnik';

@Component({
  selector: 'app-zahtevi-korisnik',
  templateUrl: './zahtevi-korisnik.component.html',
  styleUrls: ['./zahtevi-korisnik.component.css']
})
export class ZahteviKorisnikComponent implements OnInit {
  constructor(private ruter:Router,
    private korisnikServis:KorisnikService) { }

  ngOnInit(): void {
    this.korisnik = JSON.parse(localStorage.getItem('ulogovan'));
    if(this.korisnik.tip!="admin"){
      localStorage.removeItem('ulogovan');
      this.ruter.navigate(['']);
    }
    this.korisnikServis.dohvatiKorisnikeNaCekanju().subscribe((data:Korisnik[])=>{
      this.naCekanju=data;

      for(let i=0; i<this.naCekanju.length; i++){
        if(this.naCekanju[i].tip=="reg"){
          this.naCekanju[i].tipStr="Tip: Obican korisnik";
        }else{
          this.naCekanju[i].tipStr="Tip: Agent";

        }
      }
    })
  }

  korisnik:Korisnik
  naCekanju:Korisnik[];


  izbrisiKorisnika(ki){
    this.korisnikServis.izbrisiKorisnika(ki).subscribe(resp=>{
  
      if(resp['message']=='OK'){
        this.korisnikServis.dohvatiKorisnikeNaCekanju().subscribe((data:Korisnik[])=>{
          this.naCekanju=data;
        })
    

      }
    })

  }

  odobriKorisnika(ki){

    this.korisnikServis.odobriKorisnika(ki).subscribe(resp=>{
  
      if(resp['message']=='OK'){
        this.korisnikServis.dohvatiKorisnikeNaCekanju().subscribe((data:Korisnik[])=>{
          this.naCekanju=data;
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
