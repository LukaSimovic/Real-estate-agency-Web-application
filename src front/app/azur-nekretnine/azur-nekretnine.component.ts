import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { KorisnikService } from '../korisnik.service';
import { Korisnik } from '../models/korisnik';
import { Nekretnina } from '../models/nekretnina';
import { NekretninaService } from '../nekretnina.service';

@Component({
  selector: 'app-azur-nekretnine',
  templateUrl: './azur-nekretnine.component.html',
  styleUrls: ['./azur-nekretnine.component.css']
})
export class AzurNekretnineComponent implements OnInit {

  constructor(private ruter:Router,
    private korisnikServis:KorisnikService,
    private ruta: ActivatedRoute,
    private nekrServis: NekretninaService, private http:HttpClient,
    notifierService: NotifierService) {
      this.notifier=notifierService;
     }

     notifier: NotifierService;
     korisnik:Korisnik;

  ngOnInit(): void { 
    this.korisnik = JSON.parse(localStorage.getItem('ulogovan'));
    if(this.korisnik.tip!="ag" && this.korisnik.tip!="reg"){
      localStorage.removeItem('ulogovan');
      this.ruter.navigate(['']);
    }
    
    this.id = parseInt(this.ruta.snapshot.paramMap.get('id'));
    this.nekrServis.dohvatiNekrPoID(this.id).subscribe((data:Nekretnina)=>{
      this.nekretnina = data;

        if(this.nekretnina.kuca==1){
          this.nekretnina.kucastanStr="Kuća";
        }else{
          this.nekretnina.kucastanStr="Stan";
        }
  
        if(this.nekretnina.izdavanje==1){
          this.nekretnina.izdajeprodajeStr="Izdavanje";
        }else{
          this.nekretnina.izdajeprodajeStr="Prodaja";
        }

        if(this.nekretnina.namesten==1){
          this.nekretnina.namestenStr="Da";
        }else{
          this.nekretnina.namestenStr="Ne";
        }
      
        if(this.nekretnina.namesten==1){
          this.namestenB=true;
        }else{
          this.namestenB=false;
        }
      this.noviPodaci.push(this.nekretnina.naziv);
      this.noviPodaci.push(this.nekretnina.grad);
      this.noviPodaci.push(this.nekretnina.opstina);
      this.noviPodaci.push(this.nekretnina.adresa);
      this.noviPodaci.push((this.nekretnina.kuca).toString());
      this.noviPodaci.push((this.nekretnina.sprat).toString());
      this.noviPodaci.push((this.nekretnina.broj_spratova).toString());
      this.noviPodaci.push((this.nekretnina.kvadratura).toString());
      this.noviPodaci.push(this.nekretnina.broj_soba);
      this.noviPodaci.push((this.nekretnina.cena).toString());
      this.noviPodaci.push((this.nekretnina.izdavanje).toString());
      this.noviPodaci.push((this.nekretnina.namesten).toString());
      for(let i=0; i<this.nekretnina.galerija.length; i++){
        this.noviPodaciFajloviSlike.push(this.nekretnina.galerija[i]);
      }
      for(let i=0; i<this.nekretnina.videogalerija.length; i++){
        this.noviPodaciFajloviVideo.push(this.nekretnina.videogalerija[i]);
      }


    })
    
  }

  nekretnina: Nekretnina = {id:null,naziv:"", grad:"", opstina:"", adresa:"", kuca:null, sprat:null,broj_spratova:null,kvadratura:null,broj_soba:null,namesten:null,videogalerija:null,
  izdavanje:null,izdajeprodajeStr:null,galerija:null,cena:null,vlasnik:null, promovisano:null,odobreno:null,randomSlika:null,kucastanStr:null,
   namestenStr:null, prodato:null, izdato:null, broj_pregleda:null,posl_pregledi:null};
  stiklirano:boolean[]=[false,false,false,false,false,false,false,false,false,false,false,false];
  noviPodaci:string[] = [];
  noviPodaciFajloviSlike:String[] = [];
  noviPodaciFajloviVideo:String[] = [];
  id:number;

  namestenB:boolean;
  klik: number = 0;

  klikCB(num){
    this.klik++;
    if(this.stiklirano[num]==true){
      this.klik-=2;
      if(num==0){
        this.noviPodaci[0]=this.nekretnina.naziv;
      }else if(num==1){
        this.noviPodaci[1]=this.nekretnina.grad;
      }else if(num==2){
        this.noviPodaci[2]=this.nekretnina.opstina;
      }else if(num==3){
        this.noviPodaci[3]=this.nekretnina.adresa
      }else if(num==4){
        this.noviPodaci[4]=(this.nekretnina.kuca).toString();
        if(this.noviPodaci[4]=='0'){
          this.nekretnina.kucastanStr='Stan';
        }
        else{
          this.nekretnina.kucastanStr='Kuca';
        }
      }
      else if(num==5){
        this.noviPodaci[5]=(this.nekretnina.sprat).toString();
      }else if(num==6){
        this.noviPodaci[6]=(this.nekretnina.broj_spratova).toString();
      }else if(num==7){
        this.noviPodaci[7]=(this.nekretnina.kvadratura).toString();
      }else if(num==8){
        this.noviPodaci[8]=this.nekretnina.broj_soba;
      }else if(num==9){
        this.noviPodaci[9]=(this.nekretnina.cena).toString();
      }else if(num==10){
        this.noviPodaci[10]=(this.nekretnina.izdavanje).toString();
        if(this.noviPodaci[10]=='0'){
          this.nekretnina.izdajeprodajeStr='Prodaja';
        }
        else{
          this.nekretnina.izdajeprodajeStr='Izdavanje';
        }
      
      }else if(num==11){
        this.noviPodaci[11]=(this.nekretnina.namesten).toString();
        if(this.noviPodaci[11]=='0'){
          this.nekretnina.namestenStr='Ne';
          this.namestenB=false;
        }
        else{
          this.nekretnina.namestenStr='Da';
          this.namestenB=true;
        }
      }
      else if(num==12){
        this.noviPodaciFajloviSlike = [];
        this.noviPodaciFajloviVideo=[];
        for(let i=0; i<this.nekretnina.galerija.length; i++){
          this.noviPodaciFajloviSlike.push(this.nekretnina.galerija[i]);
        }
        for(let i=0; i<this.nekretnina.videogalerija.length; i++){
          this.noviPodaciFajloviVideo.push(this.nekretnina.videogalerija[i]);
        }
      }
    }
  }

  cbNam(){
    if(this.namestenB==false){
      this.noviPodaci[11]="1";
    }else{
      this.noviPodaci[11]="0";
    }
  }


  sacuvajPromene(){
    if(this.klik==0){
      this.notifier.notify('warning', "Niste azurirali nijedan podatak!");
    }else{
        if(this.noviPodaci[4]=="1"){
          this.noviPodaci[5]="-2";
        }

        if(parseInt(this.noviPodaci[5])>parseInt(this.noviPodaci[6])+1){
          this.notifier.notify('error', 'Stan ne moze da se nalazi na zadatom spratu!');

        }else{
          this.nekrServis.azuriranjeNekretnine(this.noviPodaci, this.noviPodaciFajloviSlike,this.noviPodaciFajloviVideo, this.nekretnina.naziv).subscribe(resp=>{
            if(resp['message']=='OK'){
              this.onSubmit();
             
              
              for(let i=0; i<13; i++){
                this.stiklirano[i]=false;
              }
              
              this.klik=0;
    
              this.nekrServis.dohvatiNekrPoID(this.id).subscribe((data:Nekretnina)=>{
                this.nekretnina = data;
                if(this.nekretnina.kuca==1){
                  this.nekretnina.kucastanStr="Kuća";
                }else{
                  this.nekretnina.kucastanStr="Stan";
                }
          
                if(this.nekretnina.izdavanje==1){
                  this.nekretnina.izdajeprodajeStr="Izdavanje";
                }else{
                  this.nekretnina.izdajeprodajeStr="Prodaja";
                }
        
                if(this.nekretnina.namesten==1){
                  this.nekretnina.namestenStr="Da";
                }else{
                  this.nekretnina.namestenStr="Ne";
                }
                if(this.nekretnina.namesten==1){
                  this.namestenB=true;
                }else{
                  this.namestenB=false;
                }
              
              })
  
              this.notifier.hideAll();
              this.notifier.notify('success', 'Podaci su uspesno azurirani!');
    
            }else{
              this.notifier.hideAll();
              this.notifier.notify('error', 'Greska pri azuriranju podataka!');
            }
          
          })
        }

        
  }
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

    multipleImages=[];

    selectMultipleImages(event) {
      
      let ime:string;
      if (event.target.files.length > 0) {
        this.multipleImages = event.target.files;
        for(let img of this.multipleImages){
          ime = img.name;
          let posltacka= ime.lastIndexOf(".");
          if(ime.substr(posltacka)==".mp4"){
            this.noviPodaciFajloviVideo.push(ime);
          }else{
            this.noviPodaciFajloviSlike.push(ime);
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
