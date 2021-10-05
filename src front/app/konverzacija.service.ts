import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class KonverzacijaService {

  uri = "http://localhost:4000"

  constructor(private http: HttpClient) { }

  dohvatiKonverzaciju(vlasnik, kupac, idNekr){
    const podaci = {
      vlasnik: vlasnik,
      kupac: kupac,
      idNekr:idNekr
    }
    return this.http.post(`${this.uri}/konverzacija/dohvatiKonverzaciju`, podaci);
  }

  dohvatiUgovoreneKonverzacije(){
   
    return this.http.get(`${this.uri}/konverzacija/dohvatiUgovoreneKonverzacije`);
  }

  dohvatiKonverzacijeNaCekanju(){
   
    return this.http.get(`${this.uri}/konverzacija/dohvatiKonverzacijeNaCekanju`);
  }

  
  dohvatiKonverzacijuPoID(id){
    const podaci = {
      id:id
    }
    return this.http.post(`${this.uri}/konverzacija/dohvatiKonverzacijuPoID`, podaci);
  }

  
  
  
  agentOdbio2(id){
    const podaci = {
      id:id
    }
    return this.http.post(`${this.uri}/konverzacija/agentOdbio2`, podaci);
  }

  
  arhivirajKodVlasnika(id){
    const podaci = {
      id:id
    }
    return this.http.post(`${this.uri}/konverzacija/arhivirajKodVlasnika`, podaci);
  }

  
  odarhivirajKodVlasnika(id){
    const podaci = {
      id:id
    }
    return this.http.post(`${this.uri}/konverzacija/odarhivirajKodVlasnika`, podaci);
  }

  arhivirajKodKupca(id){
    const podaci = {
      id:id
    }
    return this.http.post(`${this.uri}/konverzacija/arhivirajKodKupca`, podaci);
  }

  
  odarhivirajKodKupca(id){
    const podaci = {
      id:id
    }
    return this.http.post(`${this.uri}/konverzacija/odarhivirajKodKupca`, podaci);
  }
  

  dohvatiMojeKonverzacije(korisnicko_ime){
    const podaci = {
      korisnicko_ime:korisnicko_ime
    }
    return this.http.post(`${this.uri}/konverzacija/dohvatiMojeKonverzacije`, podaci);
  }

  blokirajKupca(id){
    const podaci = {
      id:id
    }
    return this.http.post(`${this.uri}/konverzacija/blokirajKupca`, podaci);
  }

  blokirajVlasnika(id){
    const podaci = {
      id:id
    }
    return this.http.post(`${this.uri}/konverzacija/blokirajVlasnika`, podaci);
  }
  
  odblokirajKupca(id){
    const podaci = {
      id:id
    }
    return this.http.post(`${this.uri}/konverzacija/odblokirajKupca`, podaci);
  }

  odblokirajVlasnika(id){
    const podaci = {
      id:id
    }
    return this.http.post(`${this.uri}/konverzacija/odblokirajVlasnika`, podaci);
  }

  

  blokirajVlasnikaOdmah(idNekr,kupac,vlasnik){
    const podaci = {
      idNekr:idNekr,
      kupac:kupac,
      vlasnik:vlasnik
    }
    return this.http.post(`${this.uri}/konverzacija/blokirajVlasnikaOdmah`, podaci);
  }

  kupacProcitao(id){
    const podaci = {
      id:id
    }
    return this.http.post(`${this.uri}/konverzacija/kupacProcitao`, podaci);
  }

  vlasnikProcitao(id){
    const podaci = {
      id:id
    }
    return this.http.post(`${this.uri}/konverzacija/vlasnikProcitao`, podaci);
  }

  vlasnikOdobrio(id){
    const podaci = {
      id:id
    }
    return this.http.post(`${this.uri}/konverzacija/vlasnikOdobrio`, podaci);
  }

  agentOdobrio(id,proc){
    const podaci = {
      id:id,
      proc:proc
    }
    return this.http.post(`${this.uri}/konverzacija/agentOdobrio`, podaci);
  }

  agentOdbio(id,tekst,datum,poslao,idPoruke){
    const podaci = {
      id:id,
      idPoruke:idPoruke,
      tekst:tekst,
      datum:datum,
      poslao:poslao
    }
    return this.http.post(`${this.uri}/konverzacija/agentOdbio`, podaci);
  }

  upisiPrihvatanje(id,tekst,datum,poslao,idPoruke){
    const podaci = {
      id:id,
      idPoruke:idPoruke,
      tekst:tekst,
      datum:datum,
      poslao:poslao
    }
    return this.http.post(`${this.uri}/konverzacija/upisiPrihvatanje`, podaci);
  }

  vlasnikOdbio(id){
    const podaci = {
      id:id
    }
    return this.http.post(`${this.uri}/konverzacija/vlasnikOdbio`, podaci);
  }

  dohvatiKonverzacijuPoNekretnini(idNekr){
    const podaci = {
      idNekr:idNekr
    }
    return this.http.post(`${this.uri}/konverzacija/dohvatiKonverzacijuPoNekretnini`, podaci);
  }
  

  upisiOdbijanje(id,tekst,datum,poslao,idPoruke){
    const podaci = {
      id:id,
      idPoruke:idPoruke,
      tekst:tekst,
      datum:datum,
      poslao:poslao
    }
    return this.http.post(`${this.uri}/konverzacija/upisiOdbijanje`, podaci);
  }

  

  upisiPoruku(vlasnik, kupac, idNekr,tekst,poslao,datum,idPoruke,neprocitano_vlasnik, neprocitano_kupac){
   
    const podaci = {
      vlasnik: vlasnik,
      kupac: kupac,
      idNekr:idNekr,
      idPoruke:idPoruke,
      tekst:tekst,
      poslao:poslao,
      datum:datum,
      neprocitano_vlasnik:neprocitano_vlasnik,
      neprocitano_kupac:neprocitano_kupac
    }
    return this.http.post(`${this.uri}/konverzacija/upisiPoruku`, podaci);
  }

  upisiPonudu(vlasnik, kupac, idNekr,tekst,poslao,datum,idPoruke,datum_pocetka,datum_kraja,cena,gotovina){
   
    const podaci = {
      vlasnik: vlasnik,
      kupac: kupac,
      idNekr:idNekr,
      idPoruke:idPoruke,
      tekst:tekst,
      poslao:poslao,
      datum:datum,
      cena:cena,
      gotovina:gotovina,
      datum_pocetka:datum_pocetka,
      datum_kraja:datum_kraja
    }
    return this.http.post(`${this.uri}/konverzacija/upisiPonudu`, podaci);
  }


  

  napraviKonverzaciju(vlasnik, kupac, idNekr){
    let blokiran_kupac:number=0;
    let blokiran_vlasnik:number=0;
    let idPonude:number = -1;
    let neprocitano_kupac: number = 0;
    let neprocitano_vlasnik: number = 0;
    let odobreno_agent:number = 0;
    let odobreno_vlasnik:number =0;
    let arhivirano_kupac:number=0;
    let arhivirano_vlasnik:number=0;
    let proc_agencije:number=0;
    let poruke = [];

    const podaci = {
      blokiran_kupac:blokiran_kupac,
      blokiran_vlasnik:blokiran_vlasnik,
      vlasnik: vlasnik,
      kupac: kupac,
      idNekr:idNekr,
      idPonude:idPonude,
      neprocitano_kupac:neprocitano_kupac,
      neprocitano_vlasnik:neprocitano_vlasnik,
      odobreno_agent:odobreno_agent,
      odobreno_vlasnik:odobreno_vlasnik,
      poruke:poruke,
      arhivirano_kupac:arhivirano_kupac,
      arhivirano_vlasnik:arhivirano_vlasnik,
      proc_agencije:proc_agencije
    }
    return this.http.post(`${this.uri}/konverzacija/napraviKonverzaciju`, podaci);
  }

  



  
}
