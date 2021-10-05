import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AzurNekretnineComponent } from './azur-nekretnine/azur-nekretnine.component';
import { DodajNekretninuComponent } from './dodaj-nekretninu/dodaj-nekretninu.component';
import { GrafikoniComponent } from './grafikoni/grafikoni.component';
import { InboxComponent } from './inbox/inbox.component';
import { KonverzacijaComponent } from './konverzacija/konverzacija.component';
import { LoginComponent } from './login/login.component';
import { MojeNekrComponent } from './moje-nekr/moje-nekr.component';
import { PregledKorisnikaComponent } from './pregled-korisnika/pregled-korisnika.component';
import { PretragaComponent } from './pretraga/pretraga.component';
import { PromenaLozinkeComponent } from './promena-lozinke/promena-lozinke.component';
import { PromovisanjeComponent } from './promovisanje/promovisanje.component';
import { RegAzurInfoComponent } from './reg-azur-info/reg-azur-info.component';
import { SignupComponent } from './signup/signup.component';
import { StrNekretnineComponent } from './str-nekretnine/str-nekretnine.component';
import { UgovoreneProdajeComponent } from './ugovorene-prodaje/ugovorene-prodaje.component';
import { ZahteviKorisnikComponent } from './zahtevi-korisnik/zahtevi-korisnik.component';
import { ZahteviNekretninaComponent } from './zahtevi-nekretnina/zahtevi-nekretnina.component';

const routes: Routes = [
  {path:'', component: LoginComponent},
  {path:'grafikoni', component: GrafikoniComponent},
  {path: 'signup', component: SignupComponent},
  {path:'azuriranjeKorisnika/:sifra', component: RegAzurInfoComponent},
  {path: 'promenaLozinke/:sifra', component: PromenaLozinkeComponent},
  {path:'azurNekretnine/:id', component:AzurNekretnineComponent},
  {path:'dodajNekretninu', component:DodajNekretninuComponent},
  {path:'pretraga', component:PretragaComponent},
  {path:'mojeNekretnine', component: MojeNekrComponent},
  {path:'pregledKorisnika', component: PregledKorisnikaComponent},
  {path:'zahteviKorisnik', component: ZahteviKorisnikComponent},
  {path:'zahteviNekretnina', component: ZahteviNekretninaComponent},
  {path:'promovisanje', component:PromovisanjeComponent},
  {path:'strNekretnine/:sif', component: StrNekretnineComponent},
  {path:'inbox', component: InboxComponent},
  {path:'konverzacija/:sif', component: KonverzacijaComponent},
  {path:'ugovoreneProdaje', component:UgovoreneProdajeComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
