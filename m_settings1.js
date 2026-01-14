
//import { hotHelperServer } from "/home/yoyo/Apps/viteyss/libs/hotHelper.js"; // TODO FIX
import { hotHelperServer } from './libs/hotHelper.js'; // test 1

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { sqlHelp } from "./libs/sqlHelp.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let debug = 'viteyssDebug' in process.env ? (process.env.viteyssDebug=='true'?true:false) : false;


if( debug )console.log('settings1 pDir investigation ... ',process.cwd(),{__dirname, __filename});

class m_settings1 extends hotHelperServer{
    constructor( ws ){
        super(ws);
        //this.pDir = '/home/yoyo/Apps/viteyss-site-settings1/userSettings';
        this.pDir = `${__dirname}/userSettings`;
        //this.dbFile = '/home/yoyo/Apps/viteyss-site-settings1/db_userSettings_test1.sqlite';
        this.dbFile = `${__dirname}/db_userSettings_test1.sqlite`;
        this.cl("m_settings init ... pDir: ",this.pDir, '\n dbFile:',this.dbFile);
        this.server = -1;
        this.wskey = 'settings1';
        this.sqH = new sqlHelp( this.dbFile );
        
    }

    cl( str ){
        if( debug ) console.log('m_settings1',str);
    }    

    setServer(server){
        this.server = server;
    }

    chkDirTargetAndSave=(location, device, settings)=>{
        let dTarget = this.chkDirTarget( location,device);
        let tFile = path.join( dTarget, 'settings1_backup.json' );
        fs.writeFileSync(tFile, JSON.stringify(settings,null,4));


        this.sqH.newSetting( location, device, (setting_id)=>{
            for(let kn of Object.keys( settings ) )
                this.sqH.newItem( setting_id, kn, settings[ kn ] );
        });

        return tFile;
    }

    chkDirTarget=( location, device )=>{
        let tNow = `${Date.now()}`;
        let dLoc = path.join( this.pDir, location );
        let dDev = path.join( dLoc, device );
        let dDate = path.join( dDev, tNow);

        if( !fs.existsSync( dLoc ) ){
            this.cl( '[i] no location directori: '+dLoc );
            fs.mkdirSync( dLoc );
        }
        if( !fs.existsSync( dDev ) ){
            this.cl( '[i] no device directori: '+dDev );
            fs.mkdirSync( dDev );
        }
        if( !fs.existsSync( dDate ) ){
            this.cl( '[i] no date directori: '+dDate );
            fs.mkdirSync( dDate );
        }

        return dDate;



    }


    onMsg( msg ){
        this.cl( " got msg: ");this.cl(msg);
        if( msg.topic == 'settings1/save' && 'payload' in msg ){
            msg['workDone'] = 'ok';

            let dirTest = this.chkDirTargetAndSave( 
                msg['payload']['settings1Dump']['device/location'],
                msg['payload']['settings1Dump']['device/name'],
                msg['payload']['settings1Dump']
            );
            console.log('dirTest res :'+dirTest);
            msg['pathF'] = dirTest;

            this.sendIt(msg);
        }else if( msg.topic == 'settings1/getMyStats' && 'payload' in msg){
            this.sqH.myBackupStatus(
                msg['payload']['location'],
                msg['payload']['name'],
                (res)=>{
                    msg['myBackupStatus'] = res
                    this.sendIt( msg );
                }
            );


        }

        
    }

}

export { m_settings1 }