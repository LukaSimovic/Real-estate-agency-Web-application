import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { KorisnikService } from '../korisnik.service';
import { Korisnik } from '../models/korisnik';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  constructor(private korisnikServis: KorisnikService,
    private ruter: Router,
    private http:HttpClient,
    notifierService: NotifierService) {
      this.notifier=notifierService;
     }

     ulog:string;

  ngOnInit(): void {
    if(localStorage.getItem('ulogovan')){
      this.korisnik = JSON.parse(localStorage.getItem('ulogovan'));
      if(this.korisnik.tip=="admin"){
        this.ulog="0";
      }else{
        localStorage.removeItem('ulogovan');
        this.ruter.navigate(['']);
      }
    }else{
      this.ulog="2";
    }
  }

  korisnik:Korisnik;
  notifier: NotifierService;

	showNotification( type: string, message: string ): void {
		this.notifier.notify( type, message );
	}
 
  registracija(){

    const reg=/(.)\1\1\1/;
    if(reg.test(this.lozinka)){
      this.notifier.notify('error', 'Lozinka ne sme sadrzati vise od tri uzastopna karaktera!')
      return;
    }
    
    if(this.lozinka==this.lozinkaPotvrda){
      if(!this.slika){
        this.slika="nopicture.png";
      }
      this.korisnikServis.registracija(this.ime,this.prezime,this.korisnicko_ime, this.lozinka, this.email, this.grad, this.drzava, this.slika, this.tip).subscribe(resp=>{
        if(resp['message']=='OK'){
          this.onSubmit();
          this.notifier.hideAll();
          this.notifier.notify('success', 'Zahtev za registraciju je poslat!');
        }else{
          let greska: string = JSON.stringify(resp['message'].keyValue);
          if(greska.includes("korisnicko_ime")){
            this.notifier.hideAll();
            this.notifier.notify('error', 'Korisnicko ime je zauzeto! Odaberite neko drugo.');
          }else{
            this.notifier.hideAll();
            this.notifier.notify('error', 'Korisnik sa ovom email adresom je vec registrovan! Odaberite neku drugu.');
          }
        }
      })
    }else{		
      this.notifier.hideAll();
      this.notifier.notify('error', 'Lozinke se ne poklapaju!');
    }

    
  }

  praznoIme:boolean;
  korisnicko_ime:string;
  ime:string;
  prezime:string;
  email:string;
  drzava:string;
  grad:string;
  lozinka:string;
  lozinkaPotvrda:string;
  message:string;
  messageGreska:string;
  slika:string;
  putanjaDoIzvorneSlike:string;
  tip:string;
  images;


  gost(){
    let korGost: Korisnik = {korisnicko_ime:"g", ime:"g", prezime:"g", lozinka:null, slika:null, tip:"gost", 
    email:null, grad:null, drzava:null, status:null, tipStr:null, blokirani:null};
    localStorage.setItem('ulogovan', JSON.stringify(korGost));
    this.ruter.navigate(['pretraga']);

  }


  selectImage(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.images = file;
      this.slika=file.name;
      
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload=(event:any)=>{
        this.putanjaDoIzvorneSlike = event.target.result;
      }
      
    }  
  }

  onSubmit(){
    const formData = new FormData();
    formData.append('file', this.images);

    this.http.post<any>('http://localhost:4000/file', formData).subscribe(
      (res) => console.log(res),
      (err) => console.log(err)
    );
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
        document.getElementById("myDropdown").classList.toggle("active");
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
