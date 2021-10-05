import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { KorisnikService } from '../korisnik.service';
import { Korisnik } from '../models/korisnik';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private korisnikServis: KorisnikService,
    private ruter: Router,
    private titleServis: Title,
    private notifier:NotifierService) { }

  ngOnInit(): void {
    this.titleServis.setTitle("eNekretnina");
  }

  korisnicko_ime:string;
  lozinka:string;

  prijava(){
    if(this.korisnicko_ime==null || this.lozinka==null){
      this.notifier.hideAll();
      this.notifier.notify('error', 'Molimo Vas, unesite podatke!');
    }
    else{
      this.korisnikServis.prijava(this.korisnicko_ime, this.lozinka).subscribe((kor: Korisnik)=>{
        if(kor){
          if(kor.status=='O'){
            localStorage.setItem('ulogovan', JSON.stringify(kor));
            if(!localStorage.getItem('proc_prodaja') && !localStorage.getItem('proc_izdavanje')){
              let proc:number = 2;
              localStorage.setItem('proc_prodaja', proc.toString())
               proc = 30;
               localStorage.setItem('proc_izdavanje', proc.toString())
            }
            if(kor.tip=='reg'){
              this.ruter.navigate(['pretraga']);
            }else if(kor.tip=='ag'){
              this.ruter.navigate(['grafikoni']);
            }else{
              this.ruter.navigate(['grafikoni']);
            }
          }else{
            this.notifier.hideAll();
            this.notifier.notify('warning', 'Vas zahtev za registraciju jos uvek nije prihvacen. Izvinite na cekanju.');
          }     
        }else{
          this.notifier.hideAll();
          this.notifier.notify('error', 'Pogresno uneti podaci. Pokusajte opet!');
        }
      })
    }
    
  }

  gost(){
    let korGost: Korisnik = {blokirani:null,korisnicko_ime:"g", ime:"g", prezime:"g", lozinka:null, slika:null, tip:"gost", email:null, grad:null, drzava:null, status:null, tipStr:null};
    localStorage.setItem('ulogovan', JSON.stringify(korGost));
    this.ruter.navigate(['pretraga']);

  }

}
