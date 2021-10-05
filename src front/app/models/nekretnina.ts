import { Nekr_izdato } from "./nekretnina_izdato";
import { Nekr_pregledano } from "./nekretnina_pregledano";

export class Nekretnina{
    id:number;
    naziv:string;
    grad:string;
    opstina:string;
    adresa:string;
    kuca:number;
    sprat:number;
    broj_spratova:number;
    kvadratura:number;
    broj_soba:string;
    galerija:Array<String>;
    videogalerija:Array<String>;
    namesten:number;
    izdavanje:number;
    vlasnik:string;
    promovisano:number;
    cena:number;
    odobreno:number;
    kucastanStr:string;
    izdajeprodajeStr:string;
    randomSlika:String;
    namestenStr:string;
    izdato:Array<Nekr_izdato>;
    prodato:number;
    broj_pregleda:number;
    posl_pregledi:Array<Nekr_pregledano>;
}