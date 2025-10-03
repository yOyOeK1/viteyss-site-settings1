import { downloadStringAsFile } from "./strToFile";


function getStats(){
    let keys = [];
    for(let kn=0; kn<localStorage.length; kn++){
        keys.push( localStorage.key(kn) );
    }

    return {
        length: localStorage.length,
        keys: keys
    };
}

function setK( keyn, value ){
    localStorage.setItem( keyn, value );
    localStorage.setItem( 'lastEntryDate', `${Date.now()}` );
}
function getK( keyn, defaultR = undefined ){
    let tr = localStorage.getItem( keyn );
    if( tr == null ){
        setK( keyn, defaultR );
        return defaultR;
    }else{
        return tr;
    }
}

function dump(){
    let sta = getStats();
    let tr = {};
    for( let kn of sta['keys'] ){
        tr[ kn ]= localStorage.getItem( kn );
    }
    return tr;
}

function exportToDownloadableFile(){
    let d = dump();
    downloadStringAsFile( 
        JSON.stringify(d,null,4),
        'viteyss_settings_'+Date.now()+'.json'
     );
}


let localStorageH = {
    getStats: getStats,
    dump: dump,
    exportToDownloadableFile: exportToDownloadableFile,
    setK: setK,
    getK: getK
};

export { getStats,localStorageH  }