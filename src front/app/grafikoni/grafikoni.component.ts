import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { KorisnikService } from '../korisnik.service';
import { Korisnik } from '../models/korisnik';
import { Nekretnina } from '../models/nekretnina';
import { NekretninaService } from '../nekretnina.service';

@Component({
  selector: 'app-grafikoni',
  templateUrl: './grafikoni.component.html',
  styleUrls: ['./grafikoni.component.css']
})
export class GrafikoniComponent implements OnInit {


  constructor(private ruter:Router,
    private korisnikServis:KorisnikService,
    private nekrServis:NekretninaService,
    notifierService: NotifierService) {
      this.notifier=notifierService;
     }

     notifier: NotifierService;

  ngOnInit(): void {
    this.korisnik = JSON.parse(localStorage.getItem('ulogovan'));
    this.proc_prodaja = parseInt(localStorage.getItem('proc_prodaja'));
    this.proc_izdavanje = parseInt(localStorage.getItem('proc_izdavanje'));
    if(this.korisnik.tip!="ag" && this.korisnik.tip!="admin"){
      localStorage.removeItem('ulogovan');
      this.ruter.navigate(['']);
    }
    this.nekrServis.dohvatiOdobreneNeprodateNekretnine().subscribe((data:Nekretnina[])=>{
      this.odobreneNekretnine=data;

      this.nekrServis.dohvatiPromovisaneNekretnine().subscribe((data2:Nekretnina[])=>{
        this.promovisaneNekretnine=data2;

        this.brStanIzd=this.brKucaIzd=this.brStanProd=this.brKucaProd=0;
        for(let i=0; i<this.odobreneNekretnine.length; i++){

          //GRAFIKONI 3,5
          if(this.odobreneNekretnine[i].izdavanje==1){ //3
            if(this.odobreneNekretnine[i].cena<=100){
              this.brNekrUCenovnomRanguIzdavanje[0]++;
              if(this.odobreneNekretnine[i].kuca==1){
                this.brKucaUCRIzdavanje[0]++;
              }else{
                this.brStanUCRIzdavanje[0]++;
              }
            }else if(this.odobreneNekretnine[i].cena<=200){
              this.brNekrUCenovnomRanguIzdavanje[1]++;
              if(this.odobreneNekretnine[i].kuca==1){
                this.brKucaUCRIzdavanje[1]++;
              }else{
                this.brStanUCRIzdavanje[1]++;
              }
            }else if(this.odobreneNekretnine[i].cena<=300){
              this.brNekrUCenovnomRanguIzdavanje[2]++;
              if(this.odobreneNekretnine[i].kuca==1){
                this.brKucaUCRIzdavanje[2]++;
              }else{
                this.brStanUCRIzdavanje[2]++;
              }
            }else{
              this.brNekrUCenovnomRanguIzdavanje[3]++;
              if(this.odobreneNekretnine[i].kuca==1){
                this.brKucaUCRIzdavanje[3]++;
              }else{
                this.brStanUCRIzdavanje[3]++;
              }
            }

          }else{ //5
            if(this.odobreneNekretnine[i].cena<=100000){
              this.brNekrUCenovnomRanguProdaja[0]++;
              if(this.odobreneNekretnine[i].kuca==1){
                this.brKucaUCRProdaja[0]++;
              }else{
                this.brStanUCRProdaja[0]++;
              }
            }else if(this.odobreneNekretnine[i].cena<=200000){
              this.brNekrUCenovnomRanguProdaja[1]++;
              if(this.odobreneNekretnine[i].kuca==1){
                this.brKucaUCRProdaja[1]++;
              }else{
                this.brStanUCRProdaja[1]++;
              }
            }else if(this.odobreneNekretnine[i].cena<=300000){
              this.brNekrUCenovnomRanguProdaja[2]++;
              if(this.odobreneNekretnine[i].kuca==1){
                this.brKucaUCRProdaja[2]++;
              }else{
                this.brStanUCRProdaja[2]++;
              }
            }else{
              this.brNekrUCenovnomRanguProdaja[3]++;
              if(this.odobreneNekretnine[i].kuca==1){
                this.brKucaUCRProdaja[3]++;
              }else{
                this.brStanUCRProdaja[3]++;
              }
            }
          }

          //GRAFIKON 1
          let grad: string = this.odobreneNekretnine[i].grad;
          let find:boolean = false;
          let index;
          for(let j=0; j<this.naziviGradova.length; j++){
            if(grad==this.naziviGradova[j]){
              index=j;
              find=true;
              break;
            }
          }
          if(find==false){
            this.naziviGradova.push(grad);
            this.brNekrPoGradu.push(1);
            if(this.odobreneNekretnine[i].kuca==1){
              this.brkucaPoGradu.push(1);
              this.brStanPoGradu.push(0);
            }else{
              this.brkucaPoGradu.push(0);
              this.brStanPoGradu.push(1);
            }
          }else{
            this.brNekrPoGradu[index]++;
            if(this.odobreneNekretnine[i].kuca==1){
              this.brkucaPoGradu[index]++;
            }else{
              this.brStanPoGradu[index]++;
            }
          }

          //GRAFIKON 2
          if(this.odobreneNekretnine[i].kuca==1){
            if(this.odobreneNekretnine[i].izdavanje==1){
                this.brKucaIzd++;
                this.brIzd++;
            }else{
                this.brKucaProd++;
                this.brProd++;
            }
            
          }else{
            if(this.odobreneNekretnine[i].izdavanje==1){
                this.brStanIzd++;
                this.brIzd++;
            }else{
                this.brStanProd++;
                this.brProd++;
            }
          }

          //GRAFIKON 3
          if(this.odobreneNekretnine[i].promovisano==1){
            this.brProm++;
            if(this.odobreneNekretnine[i].kuca==1){
                this.brKucaProm++;
            }else{
                this.brStanProm++;
            }

          }else{
            this.brNeprom++;
            if(this.odobreneNekretnine[i].kuca==1){
              this.brKucaNeprom++;
            }else{
              this.brStanNeprom++;
            }
          }
        }

         this.barChartData42=[
          {data:[this.brStanProm, this.brKucaProm], label:"Promovisano"},
          {data:[this.brStanNeprom, this.brKucaNeprom], label:"Neromovisano"}
        ];
        this.barChartData41=[
          {data:[this.brProm], label:"Promovisano"},
          {data:[this.brNeprom], label:"Neromovisano"}
        ];
        this.barChartData22=[
          {data:[this.brStanProd, this.brKucaProd], label:"Prodaja"},
          {data:[this.brStanIzd, this.brKucaIzd], label:"Izdavanje"}
        ];
        this.barChartData21=[
          {data:[this.brProd], label:"Prodaja"},
          {data:[this.brIzd], label:"Izdavanje"}
        ];
        this.barChartData11=[
          {data: this.brNekrPoGradu, label:"Broj nekretnina"} 
        ];
        this.barChartData12=[
          {data: this.brkucaPoGradu, label:"Broj kuća"} ,
          {data: this.brStanPoGradu, label:"Broj stanova"}
        ];
        this.barChartData31=[
          {data:[this.brNekrUCenovnomRanguIzdavanje[0]], label:"<=100€",hoverBackgroundColor:'rgba(255, 99, 132, 0.9)', backgroundColor: 'rgba(255, 99, 132, 0.6)'},
          {data:[this.brNekrUCenovnomRanguIzdavanje[1]], label:"100€ - 200€",hoverBackgroundColor:'rgba(54, 162, 235, 0.9)',  backgroundColor: 'rgba(54, 162, 235, 0.6)'},
          {data:[this.brNekrUCenovnomRanguIzdavanje[2]], label:"200€ - 300€",hoverBackgroundColor:'rgba(255, 206, 86, 0.9)', backgroundColor: 'rgba(255, 206, 86, 0.6)'},
          {data:[this.brNekrUCenovnomRanguIzdavanje[3]], label:">300€",hoverBackgroundColor:'rgba(153, 102, 255, 0.9)', backgroundColor: 'rgba(153, 102, 255, 0.6)', }
        ];
        this.barChartData32=[
          {data:[this.brStanUCRIzdavanje[0], this.brKucaUCRIzdavanje[0]], label:"<=100€",hoverBackgroundColor:'rgba(255, 99, 132, 0.9)', backgroundColor: 'rgba(255, 99, 132, 0.6)'},
          {data:[this.brStanUCRIzdavanje[1], this.brKucaUCRIzdavanje[1]], label:"100€ - 200€",hoverBackgroundColor:'rgba(54, 162, 235, 0.9)', backgroundColor: 'rgba(54, 162, 235, 0.6)'},
          {data:[this.brStanUCRIzdavanje[2], this.brKucaUCRIzdavanje[2]], label:"200€ - 300€",hoverBackgroundColor:'rgba(255, 206, 86, 0.9)', backgroundColor: 'rgba(255, 206, 86, 0.6)'},
          {data:[this.brStanUCRIzdavanje[3], this.brKucaUCRIzdavanje[3]], label:">300€", hoverBackgroundColor:'rgba(153, 102, 255, 0.9)',backgroundColor: 'rgba(153, 102, 255, 0.6)'}
        ];
        this.barChartData51=[
          {data:[this.brNekrUCenovnomRanguProdaja[0]], label:"<=100€",hoverBackgroundColor:'rgba(255, 99, 132, 0.9)', backgroundColor: 'rgba(255, 99, 132, 0.6)'},
          {data:[this.brNekrUCenovnomRanguProdaja[1]], label:"100€ - 200€",hoverBackgroundColor:'rgba(54, 162, 235, 0.9)', backgroundColor: 'rgba(54, 162, 235, 0.6)'},
          {data:[this.brNekrUCenovnomRanguProdaja[2]], label:"200€ - 300€",hoverBackgroundColor:'rgba(255, 206, 86, 0.9)', backgroundColor: 'rgba(255, 206, 86, 0.6)'},
          {data:[this.brNekrUCenovnomRanguProdaja[3]], label:">300€",hoverBackgroundColor:'rgba(153, 102, 255, 0.9)', backgroundColor: 'rgba(153, 102, 255, 0.6)'}
        ];
        this.barChartData52=[
          {data:[this.brStanUCRProdaja[0], this.brKucaUCRProdaja[0]], label:"<=100€",hoverBackgroundColor:'rgba(255, 99, 132, 0.9)', backgroundColor: 'rgba(255, 99, 132, 0.6)'},
          {data:[this.brStanUCRProdaja[1], this.brKucaUCRProdaja[1]], label:"100€ - 200€",hoverBackgroundColor:'rgba(54, 162, 235, 0.9)', backgroundColor: 'rgba(54, 162, 235, 0.6)'},
          {data:[this.brStanUCRProdaja[2], this.brKucaUCRProdaja[2]], label:"200€ - 300€",hoverBackgroundColor:'rgba(255, 206, 86, 0.9)', backgroundColor: 'rgba(255, 206, 86, 0.6)'},
          {data:[this.brStanUCRProdaja[3], this.brKucaUCRProdaja[3]], label:">300€",hoverBackgroundColor:'rgba(153, 102, 255, 0.9)',  backgroundColor: 'rgba(153, 102, 255, 0.6)'}
        ];
      })

      
    })
    

    
  }

  korisnik:Korisnik;
  odobreneNekretnine:Nekretnina[] = [];
  promovisaneNekretnine:Nekretnina[] = [];

  proc_prodaja:number;
  proc_izdavanje:number;

  sacuvajProcente(){

    const reg2=/^(-?\d+)$/;
    if(!reg2.test(this.proc_prodaja.toString())){
      this.notifier.notify('error', "Procenat za prodaju mora biti broj!");
      return;
    }
    if(!reg2.test(this.proc_izdavanje.toString())){
      this.notifier.notify('error', "Procenat za izdavanje mora biti broj!");
      return;
    }

    localStorage.setItem('proc_prodaja', this.proc_prodaja.toString())
    localStorage.setItem('proc_izdavanje', this.proc_izdavanje.toString())
    this.notifier.notify('success', "Uspesno ste sacuvali procente!");
  }

  prikaz2:number=1;
  prikaz1:number=1;
  prikaz3:number=1;
  prikaz4:number=1;
  prikaz5:number=1;


  brProm:number=0;
  brNeprom:number=0;
  brStanProm:number=0;
  brKucaProm:number=0;
  brStanNeprom:number=0;
  brKucaNeprom:number=0;

  brIzd:number=0;
  brProd:number=0;
  brKucaIzd:number =0;
  brStanProd:number =0;
  brStanIzd:number =0;
  brKucaProd:number =0;


  naziviGradova:string[] = [];
  brNekrPoGradu:number[] = [];
  brStanPoGradu:number[] = [];
  brkucaPoGradu:number[] = [];

  brNekrUCenovnomRanguIzdavanje:number[] = [0,0,0,0];
  brNekrUCenovnomRanguProdaja:number[] = [0,0,0,0];
  brStanUCRIzdavanje:number[]=[0,0,0,0];
  brKucaUCRIzdavanje:number[]=[0,0,0,0];
  brStanUCRProdaja:number[]=[0,0,0,0];
  brKucaUCRProdaja:number[]=[0,0,0,0];

 
  public barChartOptions={
    scaleShowVerticalLines: false,
    responsive:true,
    scales: {
      yAxes: [{
          ticks: {
              beginAtZero: true,
              stepSize: 1
          }
      }]
  }
  };
  public barChartType='bar';
  public barChartLegendT = true;
  public barChartLegendF=false;

  public barChartLabels31=['Ukupno'];
  public barChartData31=[
    {data:[this.brNekrUCenovnomRanguIzdavanje[0]], label:"<=100€", hoverBackgroundColor:'rgba(255, 99, 132, 1)',backgroundColor: 'rgba(255, 99, 132, 0.8)'},
    {data:[this.brNekrUCenovnomRanguIzdavanje[1]], label:"100€ - 200€",hoverBackgroundColor:'rgba(54, 162, 235, 1)', backgroundColor: 'rgba(54, 162, 235, 0.8)'},
    {data:[this.brNekrUCenovnomRanguIzdavanje[2]], label:"200€ - 300€",hoverBackgroundColor:'rgba(255, 206, 86, 1)',  backgroundColor: 'rgba(255, 206, 86, 0.8)'},
    {data:[this.brNekrUCenovnomRanguIzdavanje[3]], label:">300€",hoverBackgroundColor:'rgba(153, 102, 255, 1)',  backgroundColor: 'rgba(153, 102, 255, 0.8)'}
  ];
  public barChartLabels32=['Stan', 'Kuća'];
  public barChartData32=[
    {data:[this.brStanUCRIzdavanje[0], this.brKucaUCRIzdavanje[0]], label:"<=100€",hoverBackgroundColor:'rgba(255, 99, 132, 1)', backgroundColor: 'rgba(255, 99, 132, 0.5)'},
    {data:[this.brStanUCRIzdavanje[1], this.brKucaUCRIzdavanje[1]], label:"100€ - 200€",hoverBackgroundColor:'rgba(54, 162, 235, 1)', backgroundColor: 'rgba(54, 162, 235, 0.5)'},
    {data:[this.brStanUCRIzdavanje[2], this.brKucaUCRIzdavanje[2]], label:"200€ - 300€",hoverBackgroundColor:'rgba(255, 206, 86, 1)', backgroundColor: 'rgba(255, 206, 86, 0.5)'},
    {data:[this.brStanUCRIzdavanje[3], this.brKucaUCRIzdavanje[3]], label:">300€", hoverBackgroundColor:'rgba(153, 102, 255, 1)',backgroundColor: 'rgba(153, 102, 255, 0.5)'}
  ];

  public barChartLabels51=['Ukupno'];
  public barChartData51=[
    {data:[this.brNekrUCenovnomRanguProdaja[0]], label:"<=100€",hoverBackgroundColor:'rgba(255, 99, 132, 1)', backgroundColor: 'rgba(255, 99, 132, 0.2)'},
    {data:[this.brNekrUCenovnomRanguProdaja[1]], label:"100€ - 200€",hoverBackgroundColor:'rgba(54, 162, 235, 1)', backgroundColor: 'rgba(54, 162, 235, 0.2)'},
    {data:[this.brNekrUCenovnomRanguProdaja[2]], label:"200€ - 300€",hoverBackgroundColor:'rgba(255, 206, 86, 1)', backgroundColor: 'rgba(255, 206, 86, 0.2)'},
    {data:[this.brNekrUCenovnomRanguProdaja[3]], label:">300€", hoverBackgroundColor:'rgba(153, 102, 255, 1)', backgroundColor: 'rgba(153, 102, 255, 0.2)'}
  ];
  public barChartLabels52=['Stan', 'Kuća'];
  public barChartData52=[
    {data:[this.brStanUCRProdaja[0], this.brKucaUCRProdaja[0]], label:"<=100€", hoverBackgroundColor:'rgba(255, 99, 132, 1)', backgroundColor: 'rgba(255, 99, 132, 0.2)'},
    {data:[this.brStanUCRProdaja[1], this.brKucaUCRProdaja[1]], label:"100€ - 200€",hoverBackgroundColor:'rgba(54, 162, 235, 1)', backgroundColor: 'rgba(54, 162, 235, 0.2)'},
    {data:[this.brStanUCRProdaja[2], this.brKucaUCRProdaja[2]], label:"200€ - 300€",hoverBackgroundColor:'rgba(255, 206, 86, 1)', backgroundColor: 'rgba(255, 206, 86, 0.2)'},
    {data:[this.brStanUCRProdaja[3], this.brKucaUCRProdaja[3]], label:">300€", hoverBackgroundColor:'rgba(153, 102, 255, 1)', backgroundColor: 'rgba(153, 102, 255, 0.2)'}
  ];


  public barChartLabels41=['Ukupno'];
  public barChartData41=[
    {data:[this.brProm], label:"Promovisano"},
    {data:[this.brNeprom], label:"Neromovisano"}
  ];
  
  public barChartLabels42=['Stanovi', 'Kuce'];
  public barChartData42=[
    {data:[this.brStanProm, this.brKucaProm], label:"Promovisano"},
    {data:[this.brStanNeprom, this.brKucaNeprom], label:"Neromovisano"}
  ];

  public barChartLabels22=['Stanovi', 'Kuće'];
  public barChartData22=[
    {data:[this.brStanProd, this.brKucaProd], label:"Prodaja"},
    {data:[this.brStanIzd, this.brKucaIzd], label:"Izdavanje"}
  ];
  public barChartLabels21=['Ukupno'];
  public barChartData21=[
    {data:[this.brProd], label:"Prodaja"},
    {data:[this.brIzd], label:"Izdavanje"}
  ];

  public barChartLabels11= this.naziviGradova;
  public barChartData11=[
    {data: this.brNekrPoGradu, label:"Broj nekretnina"} 
  ];
  public barChartLabels12= this.naziviGradova;
  public barChartData12=[
    {data: this.brkucaPoGradu, label:"Broj kuća"} ,
    {data: this.brStanPoGradu, label:"Broj stanova"}
  ];

  spoji(num){
    if(num==1){
      this.prikaz1 = 1;
    }else if(num==2){
      this.prikaz2=1;
    }else if(num==3){
      this.prikaz3=1;
    }else if(num==4){
      this.prikaz4=1;
    }else if(num==5){
      this.prikaz5=1;
    }

  }
  razdvoji(num){
    if(num==1){
      this.prikaz1 = 2;
    }else if(num==2){
      this.prikaz2 = 2;
    }else if(num==3){
      this.prikaz3 = 2;
    }else if(num==4){
      this.prikaz4=2;
    }else if(num==5){
      this.prikaz5=2;
    }

  }


  
   /* Set the width of the side navigation to 250px and the left margin of the page content to 250px and add a black background color to body */
   openNav() {
    if(this.korisnik.tip=="ag"){
      document.getElementById("mySidenav2").style.width = "200px";
      document.getElementById("main").style.marginLeft = "200px";
    }else{
      document.getElementById("mySidenav").style.width = "200px";
      document.getElementById("main").style.marginLeft = "200px";
    }
    
    }
  
    /* Set the width of the side navigation to 0 and the left margin of the page content to 0, and the background color of body to white */
    closeNav() {
      if(this.korisnik.tip=="ag"){
        document.getElementById("mySidenav2").style.width = "0";
        document.getElementById("main").style.marginLeft = "0";
      }else{
        document.getElementById("mySidenav").style.width = "0";
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
