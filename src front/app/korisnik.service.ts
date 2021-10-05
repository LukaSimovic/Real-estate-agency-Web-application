import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class KorisnikService {

  uri = "http://localhost:4000"

  constructor(private http: HttpClient) { }

  prijava(korisnicko_ime, lozinka){
    const podaci = {
      korisnicko_ime: korisnicko_ime,
      lozinka: lozinka
    }
    return this.http.post(`${this.uri}/registrovan/prijava`, podaci);
  }

  promeniLozinku(korisnicko_ime, lozinka){
    const podaci = {
      korisnicko_ime: korisnicko_ime,
      lozinka: lozinka
    }
    return this.http.post(`${this.uri}/registrovan/promeniLozinku`, podaci);
  }

  registracija(ime,prezime,korisnicko_ime, lozinka, email,grad,drzava, slika, tip){
    let status:string = "N";
    const podaci={
      ime:ime,
      prezime:prezime,
      korisnicko_ime:korisnicko_ime,
      lozinka:lozinka,
      email:email,
      drzava:drzava,
      grad:grad,
      slika:slika,
      tip:tip,
      status:status
    }
    return this.http.post(`${this.uri}/registrovan/registracija`, podaci);
  }

  azuriranjeRegKor(podaci, st){
    const pod = {
      staroKI: st,
      ime: podaci[0],
      prezime: podaci[1],
      korisnicko_ime:podaci[2],
      email:podaci[4],
      drzava:podaci[5],
      grad:podaci[6],
      slika:podaci[3],
    }
    return this.http.post(`${this.uri}/registrovan/azuriranje`, pod);
  }

  dohvatiKorisnika(korisnicko_ime){
    const podaci = {
      korisnicko_ime: korisnicko_ime
    }
    return this.http.post(`${this.uri}/registrovan/dohvatiKorisnika`, podaci);
  }

  dohvatiOdobreneRegKorisnike(){
    return this.http.get(`${this.uri}/registrovan/dohvatiOdobreneRegKorisnike`);
  }

  dohvatiOdobreneAgente(){
    return this.http.get(`${this.uri}/registrovan/dohvatiOdobreneAgente`);
  }

  dohvatiKorisnikeNaCekanju(){
    return this.http.get(`${this.uri}/registrovan/dohvatiKorisnikeNaCekanju`);
  }

  izbrisiKorisnika(ki){
    const podaci = {
      ki: ki
    }
    return this.http.post(`${this.uri}/registrovan/izbrisiKorisnika`, podaci);
  }

  odobriKorisnika(ki){
    const podaci = {
      ki: ki
    }
    return this.http.post(`${this.uri}/registrovan/odobriKorisnika`, podaci);
  }

  blokirajKorisnika(korisnicko_ime, on){
    const podaci = {
      ja: korisnicko_ime,
      on: on
    }
    return this.http.post(`${this.uri}/registrovan/blokirajKorisnika`, podaci);
  }


  
  odblokirajKorisnika(korisnicko_ime, on){
    const podaci = {
      ja: korisnicko_ime,
      on: on
    }
    return this.http.post(`${this.uri}/registrovan/odblokirajKorisnika`, podaci);
  }
  
  
  

}
