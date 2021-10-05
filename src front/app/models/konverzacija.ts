import { Ponuda } from "./ponuda";
import { Poruka } from "./poruka";

export class Konverzacija{
    id:number;
    vlasnik:string;
    kupac:string;
    idNekr:number;
    idPonude:number;
    poruke:Array<Poruka>;
    neprocitano_vlasnik:number;
    neprocitano_kupac:number;
    blokiran_vlasnik:number;
    blokiran_kupac:number;
    arhivirano_kupac:number;
    arhivirano_vlasnik:number;
    odobreno_vlasnik:number;
    odobreno_agent:number
    ponuda:Ponuda;
    nazivNekr:string;
    gotovinaStr:string;
    prihodAgen:number;
    proc_agencije:number;
}