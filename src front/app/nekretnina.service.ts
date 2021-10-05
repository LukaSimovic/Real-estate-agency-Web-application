import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NekretninaService {
  
  uri = "http://localhost:4000"

  constructor(private http: HttpClient) { }

  dohvatiOdobreneNekretnine(){
    return this.http.get(`${this.uri}/nekretnina/dohvatiOdobreneNekretnine`);
  }

  dohvatiOdobreneNeprodateNekretnine(){
    return this.http.get(`${this.uri}/nekretnina/dohvatiOdobreneNeprodateNekretnine`);
  }
  
  
  dohvatiPromovisaneNekretnine(){
    return this.http.get(`${this.uri}/nekretnina/dohvatiPromovisaneNekretnine`);
  }

  dohvatiNeodobreneNekretnine(){
    return this.http.get(`${this.uri}/nekretnina/dohvatiNeodobreneNekretnine`);
  }

  dohvatiSveNekretnine(){
    return this.http.get(`${this.uri}/nekretnina/dohvatiSveNekretnine`);
  }
  

  pretraziNekretnine(gr,mi,ma){
    const podaci = {
      grad: gr,
      mincena: mi,
      maxcena: ma
    }
    return this.http.post(`${this.uri}/nekretnina/pretraziNekretnine`, podaci);
  }

  dohvatiKorisnikoveNekretnine(ki){
    const podaci = {
      ki:ki
    }
    return this.http.post(`${this.uri}/nekretnina/dohvatiKorisnikoveNekretnine`, podaci);
  }

  izbrisiNekretninu(id){
    const podaci = {
      id:id
    }
    return this.http.post(`${this.uri}/nekretnina/izbrisiNekretninu`, podaci);
  }

  

  dohvatiNekrPoID(id){
    const podaci = {
      id:id
    }
    return this.http.post(`${this.uri}/nekretnina/dohvatiNekrPoID`, podaci);
  }
  
/*
  dohvatiNekrPoNazivu(naziv){
    const podaci = {
      naziv:naziv
    }
    return this.http.post(`${this.uri}/nekretnina/dohvatiNekrPoNazivu`, podaci);
  }
*/
  odobriNekretninu(id){
    const podaci = {
      id:id
    }
    return this.http.post(`${this.uri}/nekretnina/odobriNekretninu`, podaci);
  }

  promovisiNekretninu(id){
    const podaci = {
      id:id
    }
    return this.http.post(`${this.uri}/nekretnina/promovisiNekretninu`, podaci);
  }

  ukloniProm(id){
    const podaci = {
      id:id
    }
    return this.http.post(`${this.uri}/nekretnina/ukloniProm`, podaci);
  }

  dodajPregled(id){
    const podaci = {
      id:id
    }
    return this.http.post(`${this.uri}/nekretnina/dodajPregled`, podaci);
  }

  izdajNekretninu(idNekr, datum_pocetka,datum_kraja,cena){
    const podaci = {
      idNekr:idNekr,
      datum_pocetka:datum_pocetka,
      datum_kraja:datum_kraja,
      cena:cena
    }
    return this.http.post(`${this.uri}/nekretnina/izdajNekretninu`, podaci);
  }
  
  upisiNoviKorisnikovPregled(id,novo_vreme_pregleda,korisnik){
    const podaci = {
      id:id,
      novo_vreme_pregleda:novo_vreme_pregleda,
      korisnik:korisnik
    }
    return this.http.post(`${this.uri}/nekretnina/upisiNoviKorisnikovPregled`, podaci);
  }

  izbaciKorisnikovPregled(id,korisnik){
    const podaci = {
      id:id,
      korisnik:korisnik
    }
    return this.http.post(`${this.uri}/nekretnina/izbaciKorisnikovPregled`, podaci);
  }

  

  prviKorisnikovPregled(id,vreme_pregleda,korisnik){
    const podaci = {
      id:id,
      vreme_pregleda:vreme_pregleda,
      korisnik:korisnik
    }
    return this.http.post(`${this.uri}/nekretnina/prviKorisnikovPregled`, podaci);
  }

  prodajNekretninu(idNekr){
    const podaci = {
      idNekr:idNekr
    }
    return this.http.post(`${this.uri}/nekretnina/prodajNekretninu`, podaci);
  }
  
  

  azuriranjeNekretnine(noviPodaci, noviPodaciFajloviS, noviPodaciFajloviV ,naz){
    let k  = parseInt(noviPodaci[4]);
    let s = parseInt(noviPodaci[5]);
    let bs = parseInt(noviPodaci[6]);
    let kv = parseInt(noviPodaci[7]);
    let c= parseInt(noviPodaci[9]);
    let i = parseInt(noviPodaci[10]);
    let n = parseInt(noviPodaci[11]);
    const podaci = {
      stariNaziv:naz,
      naziv:noviPodaci[0],
      grad:noviPodaci[1],
      galerija:noviPodaciFajloviS,
      videogalerija:noviPodaciFajloviV,
      opstina:noviPodaci[2],
      adresa:noviPodaci[3],
      kuca:k,
      sprat: s,
      broj_spratova: bs,
      kvadratura:kv,
      broj_soba: noviPodaci[8],
      cena: c,
      izdavanje: i,
      namesten: n

    }
    return this.http.post(`${this.uri}/nekretnina/azuriranjeNekretnine`, podaci);
  }
  

  dodavanjeNekretnine(id,naziv,grad,opstina,adresa,kuca, sprat,broj_spratova, kvadratura, broj_soba, namesten, galerija,videogalerija, izdavanje, cena, vlasnik, odobreno){
    let promovisano=0;
    let prodato=0;
    let broj_pregleda:number = 0;
    let posl_pregledi = [];
    const podaci={
      id:id,
      naziv:naziv,
      grad:grad,
      opstina:opstina,
      adresa:adresa,
      kuca:kuca,
      sprat:sprat,
      broj_spratova:broj_spratova,
      kvadratura:kvadratura,
      broj_soba:broj_soba,
      namesten:namesten,
      galerija:galerija,
      videogalerija:videogalerija,
      izdavanje:izdavanje,
      cena:cena,
      vlasnik:vlasnik,
      promovisano:promovisano,
      odobreno:odobreno,
      broj_pregleda:broj_pregleda,
      posl_pregledi:posl_pregledi,
      prodato:prodato

    }
    return this.http.post(`${this.uri}/nekretnina/dodavanjeNekretnine`, podaci);
  }
}
