import mongoose from 'mongoose'

const Schema = mongoose.Schema;

let Korisnik = new Schema(
    {
        korisnicko_ime:{
            type:String,
            unique: true
        },
        lozinka:{
            type:String
        },
        ime:{
            type:String
        },
        prezime:{
            type:String
        },
        email:{
            type:String,
            unique: true
        },
        grad:{
            type:String
        },
        drzava:{
            type:String
        },
        tip:{
            type:String
        },
        slika:{
            type:String
        },
        status:{
            type:String
        },
        blokirani:{
            type:Array
        }
    }
)

export default mongoose.model('Korisnik', Korisnik, 'korisnici');