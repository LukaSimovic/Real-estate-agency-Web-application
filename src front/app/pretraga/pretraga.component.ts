import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { Korisnik } from '../models/korisnik';
import { Nekretnina } from '../models/nekretnina';
import { NekretninaService } from '../nekretnina.service';

@Component({
  selector: 'app-pretraga',
  templateUrl: './pretraga.component.html',
  styleUrls: ['./pretraga.component.css']
})
export class PretragaComponent implements OnInit {

  constructor(private ruter: Router,
    private nekretninaServis: NekretninaService,
    notifierService: NotifierService) {
      this.notifier=notifierService;
     }

    notifier: NotifierService

  ngOnInit(): void {
    if(JSON.parse(localStorage.getItem('ulogovan')).tip=="gost"){
      this.ulogGost=0;
    }else{
      if(JSON.parse(localStorage.getItem('ulogovan')).tip=="reg"){
        this.korisnik=JSON.parse(localStorage.getItem('ulogovan'));
        this.ulogGost=1;
      }else if(JSON.parse(localStorage.getItem('ulogovan')).tip=="admin"){
        this.korisnik=JSON.parse(localStorage.getItem('ulogovan'));
        this.ulogGost=2;
      }
      else if(JSON.parse(localStorage.getItem('ulogovan')).tip=="ag"){
        this.korisnik=JSON.parse(localStorage.getItem('ulogovan'));
        this.ulogGost=3;
      }
    } 
    this.nekretninaServis.dohvatiOdobreneNeprodateNekretnine().subscribe((data:Nekretnina[])=>{
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
        this.odobreneNekretnine[i].randomSlika = this.odobreneNekretnine[i].galerija[Math.floor(Math.random()*this.odobreneNekretnine[i].galerija.length)];
      }
    })

    this.nekretninaServis.dohvatiPromovisaneNekretnine().subscribe((data:Nekretnina[])=>{
      this.promovisaneNekretnine=data;
      this.brPromNekr=data.length;
      this.indeksiProm = [];
      for(let i=0; i<data.length; i++){
        this.promNekrSlike.push(this.promovisaneNekretnine[i].galerija[0]);
        this.indeksiProm.push(this.promovisaneNekretnine[i].id);
      }
      //alert(this.indeksiProm);
    })


  }

  korisnik:Korisnik;
  ulogGost:number;

  //promovisane nekretnine
  brPromNekr:number=0;
  brPrveSlike:number=0;
  promNekrSlike:String[]= [];
  indeksiProm:number[]=[];


  //nizovi
  promovisaneNekretnine:Nekretnina[];
  odobreneNekretnine: Nekretnina[];
  pretrazeneNekretnine: Nekretnina[];

  //pretraga
  pretragaBools: boolean[] = [false,false,false];
  gradPretraga:string;
  minCenaPretraga:string;
  maxCenaPretraga:string;
  pretragaOn=false;
  kriterijumGrad:string;
  kriterijumMincena:string;
  kriterijumMaxcena:string;

  ponistiPretragu(){
    this.pretragaOn=false;
    this.pretragaBools[0]=false;
    this.pretragaBools[1]=false;
    this.pretragaBools[2]=false;
    this.gradPretraga=this.minCenaPretraga=this.maxCenaPretraga=this.kriterijumMincena=this.kriterijumGrad=this.kriterijumMaxcena="";

  }

  pretrazi(){
    this.pretragaOn = true;
    if(this.pretragaOn==true){ //vrsi pretragu
      if(this.pretragaBools[0]==false && this.pretragaBools[1]==false && this.pretragaBools[2]==false){
        this.notifier.notify('error', 'Morate izabrati makar jedan kriterijum pretrage!');
        this.pretragaOn = false;

      }else{
        if(this.pretragaBools[0]==false){
          this.gradPretraga="";
          this.kriterijumGrad="";
        }else{
          this.kriterijumGrad="Grad: "+this.gradPretraga;
        }

        if(this.pretragaBools[1]==false){
          this.minCenaPretraga="";
          this.kriterijumMincena="";
        }else{
          this.kriterijumMincena="Min cena: "+this.minCenaPretraga;
        }

        if(this.pretragaBools[2]==false){
          this.maxCenaPretraga="";
          this.kriterijumMaxcena="";
        }else{
          this.kriterijumMaxcena="Max cena: "+this.maxCenaPretraga;
        }
  
  
        this.nekretninaServis.pretraziNekretnine(this.gradPretraga, this.minCenaPretraga, this.maxCenaPretraga).subscribe((data:Nekretnina[])=>{
          this.pretrazeneNekretnine=data;
          for(let i=0; i<this.pretrazeneNekretnine.length; i++){
            if(this.pretrazeneNekretnine[i].kuca==1){
              this.pretrazeneNekretnine[i].kucastanStr="Kuća";
            }else{
              this.pretrazeneNekretnine[i].kucastanStr=this.pretrazeneNekretnine[i].broj_soba + " stan";
            }
      
            if(this.pretrazeneNekretnine[i].izdavanje==1){
              this.pretrazeneNekretnine[i].izdajeprodajeStr="Izdavanje";
            }else{
              this.pretrazeneNekretnine[i].izdajeprodajeStr="Prodaja";
            }
    
            this.pretrazeneNekretnine[i].randomSlika = this.pretrazeneNekretnine[i].galerija[Math.floor(Math.random()*this.pretrazeneNekretnine[i].galerija.length)];
          }
        })
      }
     
    }
  }

  klikProm(i){
    if(this.ulogGost==0){
      this.notifier.notify('error', 'Gosti ne mogu da posecuju nekretnine!');
    }else if(this.korisnik.tip=="reg"){
      //alert("Promovisana nekretnina!");
      let sifra= "1-"+this.indeksiProm[i];
      let ruta = "strNekretnine/"+sifra;
      this.ruter.navigate([ruta]);
    }else{
      this.notifier.notify('error', 'Samo obicni korisnici mogu da posecuju nekretnine!');
    }
  }

  kliknuo(id){
    
    if(this.ulogGost==0){
      this.notifier.notify('error', 'Gosti ne mogu da posecuju nekretnine!');
    }else if(this.korisnik.tip=="reg"){
      //alert("KLIK");
      let sifra= "1-"+id;
      let ruta = "strNekretnine/"+sifra;
      this.ruter.navigate([ruta]);
    }else{
      this.notifier.notify('error', 'Samo obicni korisnici mogu da posecuju nekretnine!');
    }
    
  }

  /* Set the width of the side navigation to 250px and the left margin of the page content to 250px and add a black background color to body */
  openNav() {
    if(this.ulogGost==0){
      document.getElementById("mySidenav2").style.width = "200px";
    }else if(this.korisnik.tip=="reg"){
      document.getElementById("mySidenav").style.width = "200px";
    }else if(this.korisnik.tip=="admin"){
      document.getElementById("mySidenav3").style.width = "200px";
    }else if(this.korisnik.tip=="ag"){
      document.getElementById("mySidenav4").style.width = "200px";
    }
    document.getElementById("main").style.marginLeft = "200px";
  }

  /* Set the width of the side navigation to 0 and the left margin of the page content to 0, and the background color of body to white */
  closeNav() {
    if(this.ulogGost==0){
      document.getElementById("mySidena2").style.width = "0";
    }else if(this.korisnik.tip=="reg"){
      document.getElementById("mySidenav").style.width = "0";
    }else if(this.korisnik.tip=="admin"){
      document.getElementById("mySidenav3").style.width = "0";
    }else if(this.korisnik.tip=="ag"){
      document.getElementById("mySidenav4").style.width = "0";
    }
    document.getElementById("main").style.marginLeft = "0";
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
  registrujSe(){
    localStorage.removeItem('ulogovan');
    this.ruter.navigate(['signup']);
  }

  promNekrLevo(){
   
    for(let i=0; i<5; i++){
      this.indeksiProm[i] = this.promovisaneNekretnine[(i+1+this.brPrveSlike)%(this.promovisaneNekretnine.length)].id;
      this.promNekrSlike[i]=this.promovisaneNekretnine[(i+1+this.brPrveSlike)%(this.promovisaneNekretnine.length)].galerija[0];
    }

    this.brPrveSlike=(this.brPrveSlike+1)%(this.promovisaneNekretnine.length);
  }
  
  promNekrDesno(){
    for(let i=0; i<5; i++){
      if(i==0 && this.brPrveSlike==0){
        this.promNekrSlike[i]=this.promovisaneNekretnine[this.promovisaneNekretnine.length-1].galerija[0];
        this.indeksiProm[i] = this.promovisaneNekretnine[this.promovisaneNekretnine.length-1].id;
      }else{
        this.promNekrSlike[i]=this.promovisaneNekretnine[(i-1+this.brPrveSlike)%(this.promovisaneNekretnine.length)].galerija[0];
        this.indeksiProm[i] = this.promovisaneNekretnine[(i-1+this.brPrveSlike)%(this.promovisaneNekretnine.length)].id;
      }
    }

    if(this.brPrveSlike==0){
      this.brPrveSlike=this.promovisaneNekretnine.length-1;
    }else{
      this.brPrveSlike--;
    }
  }

}
