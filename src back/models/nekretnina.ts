import mongoose from 'mongoose'

const Schema = mongoose.Schema;

let Nekretnina = new Schema(
    {
        id:{
            type:Number,
            unique: true
        },
        naziv:{
            type:String
        },
        grad:{
            type:String
        },
        opstina:{
            type:String
        },
        adresa:{
            type:String
        },
        kuca:{
            type:Number
        },
        sprat:{
            type:Number
        },
        broj_spratova:{
            type:Number
        },
        kvadratura:{
            type:Number
        },
        broj_soba:{
            type:String
        },
        namesten:{
            type:Number
        },
        galerija:{
            type:Array
        },
        videogalerija:{
            type:Array
        },
        izdavanje:{
            type:Number
        },
        cena:{
            type:Number
        },
        vlasnik:{
            type:String
        },
        promovisano:{
            type:Number
        },
        odobreno:{
            type:Number
        },
        izdato:{
            type:Array
        },
        prodato:{
            type:Number
        },
        broj_pregleda:{
            type:Number
        },
        posl_pregledi:{
            type:Array
        }
    }
)

export default mongoose.model('Nekretnina', Nekretnina, 'nekretnine');