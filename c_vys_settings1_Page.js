
import { createApp,ref,watch } from 'vue';
import CSettings from './assets/cSettings.vue';
import CEggTry from './assets/cEggTry.vue';
import { getStats, localStorageH } from './libs/localDb';
import { hotHelperClient } from '/libs/hotHelper.js'; // TODO FIX
import CBackupsInfo from './assets/cBackupsInfo.vue';




class cSLayers{

  constructor(){
    this._layers = [];

    this.install_setOpts();
  }

  getStatusOfLayers=()=>{
    let tr = [];
    this._layers.forEach( l =>{ 
      tr.push({
        name: l.name,
        isOpen: l.app.$data.setOpts.isOpen
      });
    });
    return tr;
  }

  closeLayers=()=>{
    this._layers.forEach( l => l.app.closePanel() );
  }

  install_setOpts = () => {
    let setIIns = setInterval(()=>{
      if( !('setOpts' in window ) ){
        console.log('cSettings layer install waint .....');
      }else{
        setOpts['cSl'] = this;
        setOpts['closeLayers'] = this.closeLayers;
        setOpts['getStatusOfLayers'] = this.getStatusOfLayers;
        console.log('cSettings layer installed  ..... DONE');
        clearInterval( setIIns );
      }
    },50);
  }

  addLayer= ( lOpts ) =>{
    console.log('cS - addLayer ....', lOpts);

    if( !('entryDate' in lOpts ) ) lOpts['entryDate'] = parseInt( Date.now() );


    lOpts['dName'] = this.install_div( lOpts.name );
    //$('#'+lOpts.dName).html(' nice<hr><pre>'+JSON.stringify(lOpts,null,4)+'</pre>');
    lOpts['app'] = createApp( CSettings, { 
      'name': lOpts.name,
      'opts': lOpts
      } ).mount('#'+lOpts['dName']);
    
    this._layers.push( lOpts );

    return lOpts;
  }

  getLayer = ( lName, makeNewIfNotExists = false, lOpts = {} ) =>{
    
    let lIs = this.getLayers().filter( l => l.name == lName );
    let lIsLen = lIs.length;
    // is not existing 
    // making new 
    if( lIsLen == 0 ){
      if( makeNewIfNotExists ){
        if( lOpts == {} ) lOpts = {name:lName};
        return this.addLayer( lOpts );
      }else{
        return 0;
      }
      

    // 1 result ok
    }else if( lIsLen == 1 ){
      return lIs[0];

    }else{
      console.error('EE cS -getLayer have more then one result ! wrong!',lIs);
      return -2;
    }
  }

  getLayers=()=>{
    return this._layers;
  }


  install_div=( dName )=>{
    dName = 'cSL'+dName.replaceAll(' ',"_");
    $("body").append('<div id="'+dName+'"></div>');
    console.log('cSettings1  .... injection do div: ['+dName+']');
    return dName;
  }


}



class s_vyssettings1Page extends hotHelperClient{

  constructor(){
    super();
    this.hotKey = 'settings1';    
    this.hotRegisterOn();

    this.cSL = new cSLayers();

    localStorageH['reopenPanelWithConfig'] = this.reopenPanelWithConfig;
    localStorageH['getBackupsStatsFromServer'] = this.getBackupsStatsFromServer;
    window['localStorageH'] = localStorageH;
    this.updateThisClientIdent();


    this.set1App = -1;
    
    this.egg1App = createApp( CEggTry, {
      name:'eggtry1'
    });

    this.install_divs();


    setTimeout(()=>{
      this.runDefault_eTry();
    },500);

    this.chk_if_android_show_fullScreenButtonOption();
    this.install_setOpts_layer();

    this.install_dragging_layer();

  }

  install_dragging_layer = () =>{
    this.isDragging = false;
    $("body").append(`<div id="cDraggingDiv"
      style="${this.Dragging_getStyle(false)}"></div>`);
    this.dragDiv = $('#cDraggingDiv');
    console.log('cSettings1 - cDraggingDiv.... injection do body');


    let setIIns = setInterval(()=>{
      if( !('setOpts' in window ) ){
        console.log('cSettings layer install Dragging .....');
      }else{
        setOpts['Dragging_start'] = this.Dragging_start;
        setOpts['Dragging_stop'] = this.Dragging_stop;
        console.log('cSettings layer installed Dragging ..... DONE');
        clearInterval( setIIns );
      }
    },50);
  


  }

  Dragging_getStyle( asActive ){
    if( asActive ){
      return {
        'background-color': 'rgba(0,0,0,0.75)',
        color: 'white',
        'min-width': '100vw',
        'max-width': '100vw',
        height: '100vh',        
        position: 'fixed',
        right: '0px',
        top: '0px',
        'z-index': 1999
      };
    }else{
      return {
          position: 'fixed',
          right: '0px',
          top: '0px',
          'min-width': '0px',
          'max-width': '0px',
          'z-index': 999
      };
    }
  }

  drag_onmove = (e )=>{
    let cXY = [0,0];
    if( this.dragEventType == 'mousemove' )
      cXY = [ e.clientX, e.clientY ];
    else{
      //console.log(e);
      cXY = [ parseInt(e.originalEvent.touches[0].clientX), parseInt( e.originalEvent.touches[0].clientY ) ];
    }

    let wSize = [ window.innerWidth, window.innerHeight ];
    console.log('on -> '+this.dragEventType,'   ',Date.now(),
    '\n cXY:',cXY, ' window size: ',wSize,
    '\ne:\n',e);
    let trStr = `<br><br>client XY: [${cXY}]`;

    /*
    if( cXY[0] < 40 ) cXY[0] = 40;
    if( cXY[1] < 10 ) cXY[1] = 11;

     if( cXY[0] > (wSize[0]-40) ) cXY[0] = (wSize[0]-40);
    if( cXY[1] > (wSize[1]-60) ) cXY[1] = (wSize[1]-60);
    */

    if( this.dragPointLast[0] == null ) this.dragPointLast = cXY;
      
      let delta = [
      cXY[0] - this.dragPointLast[0], 
      cXY[1] - this.dragPointLast[1]
    ] ;
    this.dragPointLast = cXY;
    
    trStr+=`<br>delta: [${delta}]`
    //this.dragDiv.html(trStr);

   
    return { delta: delta, cXY: cXY };
  }

  Dragging_start=( e = {clientX:0, clientY:0}, callBackOnMove = undefined, callBackOnEnd = undefined )=>{
    console.log('Dragging ...... START\n',e);
    this.isDragging = true;
    this.dragPoint = [0,0];
    this.dragPointLast = [ null,null ];
    this.dragDiv.css( this.Dragging_getStyle( true ) );
    this.dragEventType = 'mousemove';

    if( 'touches' in e ){
      //console.log('   ... Need to bee touch screen');
      this.dragEventType = 'touchmove';
      e.stopPropagation();
      e.preventDefault();      
    }


    $('body').on( this.dragEventType ,e=>{        
      if( callBackOnMove != undefined )
        callBackOnMove( this.drag_onmove( e ) );   
      else{
        this.drag_onmove( e );
      }

      e.stopPropagation();
      e.preventDefault();
      
    });
    
    $('body').on('touchend',e=>{
      if( callBackOnEnd != undefined )
        callBackOnEnd(e);
      this.Dragging_stop(e);
    });
    $('body').on('mouseup',e=>{
      if( callBackOnEnd != undefined )
        callBackOnEnd(e);
      this.Dragging_stop(e);
    });

  }
  Dragging_stop=(e ='')=>{
    //console.log(' dragging stop ........ event\n',e);
    console.log('Dragging ...... STOP\n',e);
    this.isDragging = false;
    this.dragDiv.css( this.Dragging_getStyle( false ) );

    $('body').off( this.dragEventType );
    $('body').off('mouseup');
    $('body').off('touchend');   

  }

  install_setOpts_layer = () =>{
    let l = this.cSL.addLayer({name:'setOpts'});
    this.set1App = createApp( CSettings, { 'name':'setOpts'} );
//      .mount('#cSet1Div');
  }


  chk_if_android_show_fullScreenButtonOption=()=>{
    const isAndroid = navigator.userAgent.toLowerCase().includes('android');
    if ( 0 || isAndroid==true) { 
      setTimeout(()=>{
        let l = this.cSL.getLayer('fullScreenForAndoid',true, {
          name:'fullScreenForAndoid',
          isTitleVisible: false,
          makeFloating: true,
          //pos: [100,100],
          //byCorner: 'tl',
          //pos: [100,window.innerHeight -100],
          //byCorner: 'bl',
          pos: [100, 100],
          size: [150,120], 
          byCorner: 'tl',
          controls: { 
              minMax: false, 
              titleBarHide: false,
              move: true,
              close: true
             }       
          });
        l.app.openPanelWithConfig([
          {
            name: 'Fullscreen?',
            html: `<button id="cSAndFullScreenLayer">yes</button>`
          }], 'For mobile');


        setTimeout(()=>{
          $('#cSAndFullScreenLayer').on('click', e=>{
            mkfullscreen();
            l.app.closePanel();
          });
        },200);

      },500);
    }
  }

  install_divs=()=>{
    //$("body").append('<div id="cSet1Div"></div>');
    //console.log('Settings1 .... injection do body');
    
    $("body").append(`<div id="cEggTry1Div"></div>`);
    console.log('Settings1 - eggtry1div.... injection do body');
    this.egg1App.mount('#cEggTry1Div');

  }
  
  
  
  updateThisClientIdent = () => {
    window['thisClientIdent'] = localStorageH.getK('device/name', thisClientIdent);
  }


  get getName(){
    return `vys settings1`;
  }
    
  
  get getDefaultBackgroundColor(){
    return "#ffffff";
  }
  
  getHtml = () => {

    return `<b>${this.getName}</b><br>
    <img src="${this.homeUrl}assets/ico_viteyss_32.png"><br>
    This is a npm package<br>
    viteyss-site-settings1<br>
    <pre>
    In Menu: ${this.getName}
    Home url: ${this.homeUrl}
    Ver: ${this.instanceOf.ver}

    More ditails in \`./site.json\`
    </pre>
    <button onclick="setOpts.methods.openPanel()">settings</button>
    <button onclick="setOpts.Dragging_start()">Dragging start</button>
    
    `;

  }

  timeStampToHHMM = ( nVal )=>{
    nVal = new Date( nVal );
    return String(nVal.getHours()).padStart(2, '0')+':'+
      String(nVal.getMinutes()).padStart(2, '0');
  }

  


  runDefault_eTry=()=>{

    let confT1 = [
      { 
        name: 'Context menu - test1',
        desc: "This is a menu contex / popup / layer for egg try item.",
        
      },
      { 
      name: 'Map at',
      fields: [
          { name: "lat",      text: 0.3424 },
          { name: "lng",      text: 1.42324 },
          { name: "Zoom",     range: true, min:1, max:22, step:1, value:5, callBackF:(ev='', value='')=>{ console.log('zoom change '+value);} }
        ]
      },
      { 
        name: 'Mapio - settings',
        desc: "Setting of map ("+this.mapname+")",
        
      }];



    this.eTry = [
      
        { name: "Time1", html: '00:00'},

        { name: "ContextMenu", value: '<i class="fa-solid fa-square-caret-down"></i>',
            onclick: 'settings', settingsOpts: confT1
        },


        { name: "Time2", value: '-', watchOpts:{
          valPath:'siteByKey.s_vyssettings1Page.o.egg1App._instance.ctx.$data.tNow',
          'onchange': (field, nVal,oVal,watcher)=>{ 
            //console.log( `callback from wath`,nVal );
            field.value = this.timeStampToHHMM(nVal);
            field.title = new Date(nVal).toLocaleString();
          }
        } },

        //<i class="fa-solid fa-display"></i>
        { name: "WeakLock", title: "WeakLock - unknown status.",
            value: '<i class="fa-solid fa-display"></i>' },

        { name: 'WebSocket', title: 'WebSocket connection status', value: '-', watchOpts:{
          valPath:'wsInIsOk',
          'onchange': (field, nVal,oVal, watcher)=>{ 
            //console.log( `callback from wath`,nVal );
            if( nVal == true ){
              field.value = '<i style="color:green;" class="fa-solid fa-link"></i>';
              field.title = "WebSocket is Good \nregisterd at: "+this.timeStampToHHMM(watcher.entryDate);
            }else if( nVal == false){
              field.value = '<i style="color:red;" class="fa-solid fa-link"></i>';
              field.title = 'WebSocket is Down!';
            }else{  
              field.value = '<i style="color:orange;" class="fa-solid fa-link"></i>';
              field.title = "WebSocket\nState unknown: ["+nVal+"]";
            }
          }
        } }
      ];
      
      eggTryOpts.methods.openPanelWithConfig( this.eTry );
  }

  reopenPanelWithConfig = () => {
    let stoH = localStorageH.getStats();
    setOpts.methods.openPanelWithConfig([
      {
        name: 'This device',
        desc: 'Enter identification helpers for this device',
        fields: [
          { name: "device name",    inputText: true, value:thisClientIdent,  
            callBackF:(ev='',val='')=>{ 
              localStorageH.setK('device/name',val); 
              this.updateThisClientIdent(); 
            } },
          { name: "location",       inputText: true, value:localStorageH.getK('device/location',''),  
            callBackF:(ev='',val='')=>{ 
              localStorageH.setK('device/location',val);
              this.updateThisClientIdent();
            } },
          { name: "Description",    inputText: true, value:localStorageH.getK('device/desc',''),  
            callBackF:(ev='',val='')=>{ 
              localStorageH.setK('device/desc',val);
              //this.updateThisClientIdent();
            } },
        ]
      },
      {
        name: 'stoH - localStorage',
        //desc: JSON.stringify(stoH,null,4),
        fields: [          
          { name: "Settings", html: `
              <button onclick='localStorageH.reopenPanelWithConfig(); localStorageH.getBackupsStatsFromServer();'>
                reload</button>
              <button onclick='localStorage.clear();localStorageH.reopenPanelWithConfig()'>
                clear</button>
              <button onclick="localStorageH.exportToDownloadableFile();">
                save as</button>
              <br>
              <textarea
                style="min-height:100px;width:90%;"
                >${JSON.stringify(localStorageH.dump(),null,2)}</textarea>` 
          },
          { name: "Backups info", html: `
              <button id="setSaveOnSer">
                save on server</button>
              <div id="set1BackInfo">looking ....</div>`},
        ]
      },
      {
        name: '-------------------',
        text: '--'
      }
    ]);


    setTimeout(()=>{
      $('#setSaveOnSer').click(()=>{
        console.log('save on server !');
        let toSave = {
          name: thisClientIdent,
          settings1Dump: localStorageH.dump()
        };
        this.hotTaskStart({topic:'settings1/save',payload:toSave}).then((msg)=>{
          console.log("Got result of m_settings1 ");
          if( msg['workDone'] == 'ok' ){
            $.toast({
              heading: 'Success',
              text: 'Settings saved on server in: '+msg['pathF'],
              //showHideTransition: 'slide',
              //hideAfter: 800,
              icon: 'success'
            });
          }
          //cl(msg.list.reverse());
        }).catch( (err)=>{
          console.error(' Not able to get task m_settings1 done :(');
        } );

    })},200);


    setTimeout(()=>{
      console.log('get some stats from settings ......');
      this.getBackupsStatsFromServer();
    },700);

  }

  getBackupsStatsFromServer=()=>{
    this.hotTaskStart({topic:'settings1/getMyStats',payload:{
        location: localStorageH.getK('device/location'),
        name: localStorageH.getK('device/name')
      }}).then((msg)=>{
          console.log("Got result of m_settings1 / getMyStats ....");
          if( 'myBackupStatus' in msg ){
            console.log('myBackupStatus----------------------',
              msg['myBackupStatus'],
            '----------------------------------------');
            createApp( CBackupsInfo, { datap: msg['myBackupStatus']} )
              .mount( '#set1BackInfo' );
          }
          //cl(msg.list.reverse());
        }).catch( (err)=>{
          console.error(' Not able to get task m_settings1 done :(');
        } );
  }


  getHtmlAfterLoad = () =>{
    cl(`${this.getName} - getHtmlAfterLoad()`);
    setTimeout(()=>{ this.reopenPanelWithConfig(); },1500);
    
  }

  get svgDyno(){
    return '';
  }

  svgDynoAfterLoad(){

  }

  onHotMessageCallBack = ( msg ) =>{
    cl(`onHot Got!`);cl(msg);

  }


  onMessageCallBack = ( r ) => {
    cl( `${this.getName} [cb] - got msg `);

  }

}

export { s_vyssettings1Page };
