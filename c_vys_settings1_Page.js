
import { createApp } from 'vue';
import CSettings from './assets/cSettings.vue';


class s_vyssettings1Page{

  constructor(){
    this.set1App = createApp( CSettings, { 
      'name':'setOpts'
    } );

    $("body").append('<div id="cSet1Div"></div>');
    console.log('Settings1 .... injection do body');
    this.set1App.mount('#cSet1Div');

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

  getHtmlAfterLoad = () =>{
    cl(`${this.getName} - getHtmlAfterLoad()`);
    setTimeout(()=>{
      setOpts.methods.openPanel();
    },500);
    
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
