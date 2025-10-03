
import { createApp,ref,watch } from 'vue';
import CSettings from './assets/cSettings.vue';
import CEggTry from './assets/cEggTry.vue';
import { getStats, localStorageH } from './libs/localDb';

class s_vyssettings1Page{

  constructor(){
    localStorageH['reopenPanelWithConfig'] = this.reopenPanelWithConfig;
    window['localStorageH'] = localStorageH;
    this.updateThisClientIdent();


    this.set1App = createApp( CSettings, { 
      'name':'setOpts'
    } );
    this.egg1App = createApp( CEggTry, {
      name:'eggtry1'
    });

    $("body").append('<div id="cSet1Div"></div>');
    console.log('Settings1 .... injection do body');
    this.set1App.mount('#cSet1Div');

    $("body").append(`<div id="cEggTry1Div"></div>`);
    console.log('Settings1 - eggtry1div.... injection do body');
    this.egg1App.mount('#cEggTry1Div');


    setTimeout(()=>{
      this.runDefault_eTry();
    },500);




  const isAndroid = navigator.userAgent.toLowerCase().includes('android');
  if ( 0 || isAndroid==true) {
    // Code to execute if the device is Android
    setTimeout(()=>{
      setOpts.methods.openPanelWithConfig([
        {
          name: 'Fullscreen?',
          html: `<button onclick="mkfullscreen();">yes</button>`
        }], 'For mobile');
    },500);
    console.log("This is an Android device.");
    //$('#popupBasic').html(`<br><input type="button" style="border:10; padding:20px;"onclick="mkfullscreen();$('#popupBasic').popup('close');" value="fullscreen9"><br><br>`);
    //$('#popupBasic').popup();
    //$('#popupBasic').popup('open');
  } else {
    // Code to execute if the device is not Android
    console.log("This is not an Android device.");
  }





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
    
    `;

  }

  timeStampToHHMM = ( nVal )=>{
    nVal = new Date( nVal );
    return String(nVal.getHours()).padStart(2, '0')+':'+
      String(nVal.getMinutes()).padStart(2, '0');
  }

  


  runDefault_eTry=()=>{

    let confT1 = [{ 
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
              <button onclick='localStorageH.reopenPanelWithConfig()'>
                reload</button>
              <button onclick='localStorage.clear();localStorageH.reopenPanelWithConfig()'>
                clear</button>
              <button onclick="localStorageH.exportToDownloadableFile();">
                save as</button>
              <br>
              <textarea
                style="min-height:100px;"
                >${JSON.stringify(localStorageH.dump(),null,2)}</textarea>` 
          },
        ]
      },
      {
        name: '-------------------',
        text: '--'
      }
    ]);
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

  onMessageCallBack = ( r ) => {
    cl( `${this.getName} [cb] - got msg `);

  }

}

export { s_vyssettings1Page };
