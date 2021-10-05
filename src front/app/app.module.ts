import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ChartsModule } from 'ng2-charts';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NotifierModule,NotifierOptions } from 'angular-notifier';
import { RegAzurInfoComponent } from './reg-azur-info/reg-azur-info.component';
import { PromenaLozinkeComponent } from './promena-lozinke/promena-lozinke.component';
import { DodajNekretninuComponent } from './dodaj-nekretninu/dodaj-nekretninu.component';
import { AzurNekretnineComponent } from './azur-nekretnine/azur-nekretnine.component';
import { MojeNekrComponent } from './moje-nekr/moje-nekr.component';
import { PregledKorisnikaComponent } from './pregled-korisnika/pregled-korisnika.component';
import { ZahteviKorisnikComponent } from './zahtevi-korisnik/zahtevi-korisnik.component';
import { ZahteviNekretninaComponent } from './zahtevi-nekretnina/zahtevi-nekretnina.component';
import { PromovisanjeComponent } from './promovisanje/promovisanje.component';
import { PretragaComponent } from './pretraga/pretraga.component';
import { GrafikoniComponent } from './grafikoni/grafikoni.component';
import { StrNekretnineComponent } from './str-nekretnine/str-nekretnine.component';
import { InboxComponent } from './inbox/inbox.component';
import { KonverzacijaComponent } from './konverzacija/konverzacija.component';
import { UgovoreneProdajeComponent } from './ugovorene-prodaje/ugovorene-prodaje.component';

const customNotifierOptions: NotifierOptions = {
  position: {
		horizontal: {
			position: 'middle',
			distance: 12
		},
		vertical: {
			position: 'bottom',
			distance: 90,
			gap: 10
		}
	},
  theme: 'material',
  behaviour: {
    autoHide: 3000,
    onClick: 'hide',
    onMouseover: 'pauseAutoHide',
    showDismissButton: true,
    stacking: 4
  },
  animations: {
    enabled: true,
    show: {
      preset: 'slide',
      speed: 300,
      easing: 'ease'
    },
    hide: {
      preset: 'fade',
      speed: 300,
      easing: 'ease',
      offset: 50
    },
    shift: {
      speed: 300,
      easing: 'ease'
    },
    overlap: 150
  }
};


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    RegAzurInfoComponent,
    PromenaLozinkeComponent,
    DodajNekretninuComponent,
    AzurNekretnineComponent,
    MojeNekrComponent,
    PregledKorisnikaComponent,
    ZahteviKorisnikComponent,
    ZahteviNekretninaComponent,
    PromovisanjeComponent,
    PretragaComponent,
    GrafikoniComponent,
    StrNekretnineComponent,
    InboxComponent,
    KonverzacijaComponent,
    UgovoreneProdajeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NotifierModule.withConfig(customNotifierOptions),
    ChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }


