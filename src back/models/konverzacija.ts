import mongoose from 'mongoose'

const Schema = mongoose.Schema;

let Konverzacija = new Schema(
    {
        id:{
            type:Number,
            unique: true
        },
        vlasnik:{
            type:String
        },
        idNekr:{
            type:Number
        },
        kupac:{
            type:String
        },
        idPonude:{
            type:Number
        },
        poruke:{
            type:Array
        },
        neprocitano_vlasnik:{
            type:Number
        },
        neprocitano_kupac:{
            type:Number
        },
        odobreno_vlasnik:{
            type:Number
        },
        odobreno_agent:{
            type:Number
        },
        ponuda:{
            type:Object
        },
        arhivirano_vlasnik:{
            type:Number
        },
        arhivirano_kupac:{
            type:Number
        },
        blokiran_vlasnik:{
            type:Number
        },
        blokiran_kupac:{
            type:Number
        },
        proc_agencije:{
            type:Number
        }
    }
)

export default mongoose.model('Konverzacija', Konverzacija, 'konverzacije');