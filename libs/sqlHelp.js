import sqlite3 from 'sqlite3';

let debug = 'viteyssDebug' in process.env ? (process.env.viteyssDebug=='true'?true:false) : false;


class sqlHelp{

    constructor( fPath ){
        this.fPath = fPath;

        let SQLite3 = sqlite3.verbose();
        this.db = new SQLite3.Database( this.fPath , (err) => {
            if (err) {
                console.error('Error opening database:', err.message);
            } else {
                //console.log('Connected to the SQLite database.');
                // Create table and perform operations            
            }
        });
 
        this.createV1();

    }
    hErr=(err)=>{
        if( err ){
            console.error('hERR - Error opening database:', err.message);
        }else{
            return true;
        }
        return false;
    }

    myBackupStatus = ( location, device, callBack ) =>{
        let tr = {};
        this.db.all(`
            SELECT 
                count(id) as 'cou',
                entryDate
            FROM settings 
            WHERE 
                location=? AND 
                device=?
            ORDER BY entryDate desc
            LIMIT 1;
            `,[location,device],(e,d)=>{
                if( this.hErr(e) ){
                    if( debug )console.log('god d:[',d,']');
                    tr['count'] = parseInt(d[0]['cou']);
                    tr['lastEntryDate'] = parseInt(d[0]['entryDate']);
                    tr['vNames'] = [];

                    this.db.all(`select 
                        vName,
                        count(id) as cou 
                        from items where setting_id IN ( 
                        SELECT id from settings WHERE location=? AND device=?
                        ) group by vName;`,
                        [location, device ], (e2, d2)=>{
                            if( this.hErr( e2 ) ){
                                if( debug ) console.log('got some stats on vName ....',d2);
                                for(let r of d2 ){
                                    tr['vNames'].push(r);
                                }
                                callBack( tr );
                            }

                    });




                }
            });

    }

    newSetting=( location, device, callBack_lastId = undefined)=>{
        let entryDate = parseInt(Date.now());
        let res = this.db.run( `
            INSERT INTO settings ( location, device, entryDate ) VALUES ( ?,?,? );
            `, [location,device,entryDate],function( err ){
                if( err ){
                    console.error("Error selecting resHendle ",err.message);
                }else{
                    //console.log('new settings res :) ','lastID:',this.lastID );
                    if( callBack_lastId != undefined )
                        callBack_lastId( this.lastID );
                }
            });
    }
    newItem=( setting_id, vName, vOff, callBack_lastId = undefined)=>{
        let res = this.db.run( `
            INSERT INTO items ( setting_id, vName, vOff ) VALUES ( ?,?,? );
            `, [setting_id, vName, vOff],function( err ){
                if( err ){
                    console.error("Error selecting resHendle ",err.message);
                }else{
                    //console.log('new item res :) ','lastID:',this.lastID );
                    if( callBack_lastId != undefined )
                        callBack_lastId( this.lastID );
                }
            });
    }


    createV1=()=>{
        let q = `
        CREATE TABLE settings
            (
                id INTEGER PRIMARY KEY AUTOINCREMENT, 
                location text,
                device text,
                entryDate text
            );
        `;
        let qR = this.db.all( q,[], this.resHandle );

        q = `
        CREATE TABLE items
            (
                id INTEGER PRIMARY KEY AUTOINCREMENT, 
                setting_id INTEGER,
                vName text,
                vOff text
            );
        `;
        qR = this.db.all( q,[], this.resHandle );

    }

    resHandle = ( err, rows )=>{
        if( err && debug ){
            console.error("[i] on createV1 got soft ee ",err.message);
        }else{
            //console.log('rows',rows);

        }
    }



}

/*
let sqt = new sqlHelp('./db_test1.sqlite');
sqt.newSetting('sqlHelp.js','dell',( setting_id )=>{
    sqt.newItem(setting_id,'test1', 'hello world');
    sqt.newItem(setting_id,'tNow', Date.now());
});

sqt.myBackupStatus('sqlHelp.js','dell',(rap)=>{
    console.log('[i] my backup status back\n',rap);
});
*/

export { sqlHelp }