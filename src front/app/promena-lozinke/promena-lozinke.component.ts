import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { KorisnikService } from '../korisnik.service';
import { Korisnik } from '../models/korisnik';

@Component({
  selector: 'app-promena-lozinke',
  templateUrl: './promena-lozinke.component.html',
  styleUrls: ['./promena-lozinke.component.css']
})
export class PromenaLozinkeComponent implements OnInit {

  constructor( private korisnikServis: KorisnikService,
    private ruter: Router,
    private ruta: ActivatedRoute,
    notifierService: NotifierService) {
      this.notifier=notifierService;
     }

     sifra:string;
     sif:string;

  ngOnInit(): void {
    this.show1=false;
    this.show2=false;
    this.show3=false;

    this.sifra = this.ruta.snapshot.paramMap.get('sifra');
    this.sif = this.sifra[0];
   if(this.sif=="0"){ //dosao admin da menja od ki
     let ki = this.sifra.substr(1,this.sifra.length-1);
     this.korisnikUlogovan=JSON.parse(localStorage.getItem('ulogovan'));
     this.korisnikServis.dohvatiKorisnika(ki).subscribe((data:Korisnik)=>{
       this.korisnikAzuriranje=data;
      
     })
   }else{ //dosao user da menja svoje
     this.korisnikUlogovan=JSON.parse(localStorage.getItem('ulogovan'));
     this.korisnikAzuriranje=this.korisnikUlogovan;
    
   }

    if(this.korisnikUlogovan.tip!="ag" && this.korisnikUlogovan.tip!="admin" && this.korisnikUlogovan.tip!="reg"){
      localStorage.removeItem('ulogovan');
      this.ruter.navigate(['']);
    }
  
  }

  notifier : NotifierService

  korisnikUlogovan: Korisnik;
  korisnikAzuriranje:Korisnik;

  staraLoz: string;
  novaLoz: string;
  pNovaLoz: string;

  show1:boolean;
  show2:boolean;
  show3:boolean;

  toggle(num){
   if(num==1){
     this.show1=!this.show1;
   }else if(num==2){
    this.show2=!this.show2;

   }else{
    this.show3=!this.show3;

   }
  }

  promeni(){
    const reg=/(.)\1\1\1/;
    if(reg.test(this.novaLoz)){
      this.notifier.hideAll();
      this.notifier.notify('error', 'Lozinka ne sme sadrzati vise od tri uzastopna karaktera!')
      return;
    }

    if(this.korisnikAzuriranje.lozinka!=this.staraLoz){
      this.notifier.notify('error', 'Stara lozinka nije ispravna, pokusajte opet!')
    }else{
      if(this.novaLoz!=this.pNovaLoz){
        this.notifier.notify('error', 'Greska pri potvrde nove lozinke, pokusajte opet!')
      }else{
        this.korisnikServis.promeniLozinku(this.korisnikAzuriranje.korisnicko_ime, this.novaLoz).subscribe(resp=>{
          if(resp['message']=='OK'){
            if(this.sif=="1"){
              localStorage.removeItem('ulogovan');
              this.ruter.navigate(['']);
            }else{
              this.notifier.notify('success', 'Uspesno promenjena lozinka korisniku ' + this.korisnikAzuriranje.korisnicko_ime);
              this.korisnikServis.dohvatiKorisnika(this.korisnikAzuriranje.korisnicko_ime).subscribe((data:Korisnik)=>{
                this.korisnikAzuriranje=data;
               
              })
              this.show1=this.show2=this.show3=false;
              this.staraLoz=this.novaLoz=this.pNovaLoz="";
            }
          } 
        })
      
      }
    }
  }

  otkaziPromLoz(){
    if(this.sif=="0"){ //admin menja od nekog drugog
      this.ruter.navigate(['pregledKorisnika']);
    }else{
      if(this.korisnikUlogovan.tip=="admin"){
        this.ruter.navigate(['grafikoni']);
      }else if(this.korisnikUlogovan.tip=='ag'){
        this.ruter.navigate(['grafikoni']);
      }else{
        this.ruter.navigate(['pretraga']);
      }
    }
    
  }

    /* Set the width of the side navigation to 250px and the left margin of the page content to 250px and add a black background color to body */
    openNav() {
      if(this.korisnikUlogovan.tip=="admin"){
        document.getElementById("mySidenav2").style.width = "200px";
        document.getElementById("main").style.marginLeft = "200px";
      }else if(this.korisnikUlogovan.tip=="reg"){
        document.getElementById("mySidenav").style.width = "200px";
        document.getElementById("main").style.marginLeft = "200px";
      }else{
        document.getElementById("mySidenav3").style.width = "200px";
        document.getElementById("main").style.marginLeft = "200px";
      }
      }
    
      /* Set the width of the side navigation to 0 and the left margin of the page content to 0, and the background color of body to white */
      closeNav() {
        if(this.korisnikUlogovan.tip=="admin"){
          document.getElementById("mySidenav2").style.width = "0";
          document.getElementById("main").style.marginLeft = "0";
        }else if(this.korisnikUlogovan.tip=="reg"){
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
}
