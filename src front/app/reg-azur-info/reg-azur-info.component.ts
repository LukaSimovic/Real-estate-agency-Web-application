import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { KorisnikService } from '../korisnik.service';
import { Korisnik } from '../models/korisnik';

@Component({
  selector: 'app-reg-azur-info',
  templateUrl: './reg-azur-info.component.html',
  styleUrls: ['./reg-azur-info.component.css']
})
export class RegAzurInfoComponent implements OnInit {

  constructor(private http: HttpClient,
    private ruta: ActivatedRoute,
    private ruter:Router,
    private korisnikServis: KorisnikService,
    notifierService: NotifierService) {
      this.notifier=notifierService;
     }

     sifra:string;
     sif:string;
  ngOnInit(): void {
     this.sifra = this.ruta.snapshot.paramMap.get('sifra');
     this.sif = this.sifra[0];
    if(this.sif=="0"){ //dosao admin da menja od ki
      let ki = this.sifra.substr(1,this.sifra.length-1);
      this.korisnikUlogovan=JSON.parse(localStorage.getItem('ulogovan'));
      this.korisnikServis.dohvatiKorisnika(ki).subscribe((data:Korisnik)=>{
        this.korisnikAzuriranje=data;
        this.noviPodaci.push(this.korisnikAzuriranje.ime);
        this.noviPodaci.push(this.korisnikAzuriranje.prezime);
        this.noviPodaci.push(this.korisnikAzuriranje.korisnicko_ime);
        this.noviPodaci.push(this.korisnikAzuriranje.slika);
        this.noviPodaci.push(this.korisnikAzuriranje.email);
        this.noviPodaci.push(this.korisnikAzuriranje.drzava);
        this.noviPodaci.push(this.korisnikAzuriranje.grad);
      })
    }else{ //dosao user da menja svoje
      this.korisnikUlogovan=JSON.parse(localStorage.getItem('ulogovan'));
      this.korisnikAzuriranje=this.korisnikUlogovan;
      this.noviPodaci.push(this.korisnikAzuriranje.ime);
      this.noviPodaci.push(this.korisnikAzuriranje.prezime);
      this.noviPodaci.push(this.korisnikAzuriranje.korisnicko_ime);
      this.noviPodaci.push(this.korisnikAzuriranje.slika);
      this.noviPodaci.push(this.korisnikAzuriranje.email);
      this.noviPodaci.push(this.korisnikAzuriranje.drzava);
      this.noviPodaci.push(this.korisnikAzuriranje.grad);
    }

    if(this.korisnikUlogovan.tip!="ag" && this.korisnikUlogovan.tip!="admin" && this.korisnikUlogovan.tip!="reg"){
      localStorage.removeItem('ulogovan');
      this.ruter.navigate(['']);
    }
   
  }

  notifier: NotifierService  

  korisnikUlogovan: Korisnik;
  korisnikAzuriranje: Korisnik ={'korisnicko_ime':null, 'ime':null,'prezime':null, 'grad':null,'drzava':null, 'slika':'nopicture.png','email':null, 'lozinka':null,
      'status':null, 'tip':null, 'tipStr':null, 'blokirani':null};

  prikazUputstva:boolean;
  stiklirano: boolean[] = [false,false,false,false,false,false,false];
  stikliranoF: boolean;

  btnUputstvo(){
    this.prikazUputstva= !this.prikazUputstva
  }

  images;
  putanjaDoIzvorneSlike: string;
  noviPodaci:string[] = [];
  klik: number = 0;

  klikCB(num){
    this.klik++;
    if(this.stiklirano[num]==true){
      this.klik-=2;
      if(num==0){
        this.noviPodaci[0]=this.korisnikAzuriranje.ime;
      }else if(num==1){
        this.noviPodaci[1]=this.korisnikAzuriranje.prezime;
      }else if(num==2){
        this.noviPodaci[2]=this.korisnikAzuriranje.korisnicko_ime;
      }else if(num==3){
        this.noviPodaci[3]=this.korisnikAzuriranje.slika;
      }else if(num==4){
        this.noviPodaci[4]=this.korisnikAzuriranje.email;
      }else if(num==5){
        this.noviPodaci[5]=this.korisnikAzuriranje.drzava;
      }else if(num==6){
        this.noviPodaci[6]=this.korisnikAzuriranje.grad;
      }

    }else{
      if(num==3){
        this.noviPodaci[3]="";
      }
    }

  }

  selectImage(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.images = file;
      this.noviPodaci[3]=file.name;
      
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



  sacuvajPromene(){
    if(this.klik==0){
      this.notifier.notify('warning', "Niste azurirali nijedan podatak!");
    }else{
      if(this.noviPodaci[3]==""){
        this.notifier.notify('error', "Morate izabrati novu sliku!");
      }else{
        this.korisnikServis.azuriranjeRegKor(this.noviPodaci, this.korisnikAzuriranje.korisnicko_ime).subscribe(resp=>{
          if(resp['message']=='OK'){
            this.onSubmit();
           

            for(let i=0; i<7; i++){
              this.stiklirano[i]=false;
            }
            this.klik=0;
  
            this.korisnikServis.dohvatiKorisnika(this.noviPodaci[2]).subscribe((kor:Korisnik)=>{
              this.korisnikAzuriranje = kor;

              if(this.sif=="1"){
                localStorage.setItem('ulogovan', JSON.stringify(this.korisnikAzuriranje));
                this.korisnikUlogovan=this.korisnikAzuriranje;
              }

              this.noviPodaci.push(this.korisnikAzuriranje.ime);
              this.noviPodaci.push(this.korisnikAzuriranje.prezime);
              this.noviPodaci.push(this.korisnikAzuriranje.korisnicko_ime);
              this.noviPodaci.push(this.korisnikAzuriranje.slika);
              this.noviPodaci.push(this.korisnikAzuriranje.email);
              this.noviPodaci.push(this.korisnikAzuriranje.drzava);
              this.noviPodaci.push(this.korisnikAzuriranje.grad);
            })

            this.notifier.hideAll();
            this.notifier.notify('success', 'Podaci su uspesno azurirani!');
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
      }
      
    }
   
  }

  povrNaPoc(){
    if(this.korisnikUlogovan.tip=="reg"){
      this.ruter.navigate(['pretraga']);
    }else if(this.korisnikUlogovan.tip=="admin"){
      this.ruter.navigate(['grafikoni'])
    }else{
      this.ruter.navigate(['grafikoni'])
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
