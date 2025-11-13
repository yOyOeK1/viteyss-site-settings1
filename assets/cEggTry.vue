<template>

    <div v-if="setOpts.isOpen"
        class="cEggTryHist"
        >
        <table>
            <tr>
                <td>history</td>
            </tr>
        </table>

    </div>


    <div v-show="setOpts.isOpen"
        class="cEggTryShe"
        >


        <table>
            <tr>


            

                <td v-for="field in configs"
                    :class="(eggClickAt == field.name ? 'eggClickAt':'')">

                    <div v-show="field.text"
                        :title="field.title ? field.title : field.name"
                        >{{ field.text }}</div>
                    <div v-show="field.desc" class="cEggTrySheh3desc">{{ field.desc }}</div>
                    <div v-show="field.html"
                        :title="field.title ? field.title : field.name" v-html="field.html" class="cEggTrySheh3html"></div>

                    
                    <div v-show="field.value"
                        @click="eTryClick($event, field)"
                        :title="field.title ? field.title : field.name" v-html="field.value"class="cEggTrySheh3html"></div>

                    <div v-show="field.filesList">
                        <textarea v-show="field.filesList"
                            v-model="field.value"
                            style="width: 90%;"
                            >{{ field.value }}</textarea>


                        <br>current values: [<small>{{ field.value }}</small>]
                    </div>

                    <div v-show="field.range">
                        <input type="range"
                            v-model="field.value"
                            @change="field.callBackF($event, field.value)"
                            :min="field.min" :max="field.max" :step="field.step"
                            />

                    </div>

                    <div v-show="field.number">
                        <input
                            v-model="field.value"
                            @change="field.callBackF($event, field.value)"
                            />
                    </div>

                </td>


            </tr>
        </table>

        
        
        
        <div v-show="(false)">watchers: len({{  watchList.length }})
            <p v-for="w of watchList">
                {{ w.key.substring(0,15) }} {{ w.lastV }} {{Date.now()-w.entryDate}}
            </p>
        
        </div>
    </div>


</template>
<script>


export default{
    components:{
        
    },
    props:[ 'name' ],
    data(){

        let setOpts = {
            'isOpen': false, // default state of setting
            'methods': this

        };
        window['eggTryOpts'] = setOpts;

        return {
            //isOpen: true
            divObj: null,
            pos:[0,0],
            setOpts,
            configs: [],
            eggClickAt: -1,
            pageOpenAn: '',
            myPageCheck: -1,
            watchList: [],
            tNow: Date.now(), tNowNice: '--:--:--'
        };
    },
    watch:{
        wsInIsOk:{
            handler(nVal, oVal){
                console.log('wsInIsOk new state ', nVal);

            },
            deep:true,
            immediate:true
        }
            

    },
    computed:{

    },
    methods:{
        eTryConfigClose(){
            this.eggClickAt = -1;
        },

        eTryClick(e, field){
            //console.log('cE click on field name:'+field.name,
            //    '\n event e: ',e
            //);


            this.pos = [ e.clientX, e.clientY-20 ];
            
            let l = setOpts.cSl.getLayer('eggTryContextMenuTest',true, {
                name:'eggTryContextMenuTest',
                isTitleVisible: false,
                makeFloating: true,
                //pos: [100,100],
                //byCorner: 'tl',
                //pos: [100,window.innerHeight -100],
                //byCorner: 'bl',
                pos: this.pos,
                forThisSite:false,
                size: [200,100], 
                byCorner: 'br',
                controls: { 
                    minMax: true, 
                    titleBarHide: false,
                    move: true,
                    close: true
                    },
                style:{
                    'box-shadow': '10px 10px 30px rgba(0,100,200,200), inset 2px 2px 10px rgba(255,255,255,0.5)',
                    'background-color': 'rgba(184, 160, 204, 0.6)',
                    'backdrop-filter': 'sepia(80%) blur(5px)',
                    '-webkit-backdrop-filter': 'sepia(80%) blur(5px)',
                    'border': '5px solid #ff89e1',
                    'border-radius': '10px'
                }
                });
                

            if( 'onclick' in field && field.onclick == 'settings' && 'settingsOpts' in field ){
                setTimeout(()=>{
                    console.log('cE - onclick on eggtry ['+field.name+']',
                        '\nlayer:',l
                    );
                    l.app.setLayerPos( this.pos );
                    l.app.openPanelWithConfig(field.settingsOpts, field.name, this.eTryConfigClose)
                },100);
                
                this.eggClickAt = field.name;
                
            }
        },


        strFirtLeterLarge(st){
            return st.charAt(0).toUpperCase() + st.slice(1);
        },
        setVal( inde, key, val ){
            this.configs[ inde ][ key ] = val;
        },
        getVal(){
            return JSON.stringify(this.configs,null,2);
        },

        getValFromStrPathVal( valPath  ){
            let bObj = undefined; 
            let level = 0;
            let tr = -1;
            let sp = valPath.split('.');
            //console.log('level '+level+' split count:'+sp.length);

            if( bObj == undefined ){
                bObj = window[ sp[ level ] ];
                tr = bObj;

            }
            for(let i=1; i<sp.length-1; i++ ){
                bObj = bObj[ sp[i] ];
            }

            if( sp.length > 1 )
                tr = bObj[ sp[ sp.length-1 ] ];

            return tr;
        },

        openPanel(){
            this.setOpts.isOpen = true;
            this.pageOpenAn = parseInt( pager.currentPage );
            if( this.myPageCheck == -1 ){
                this.myPageCheck = setInterval(()=>{
                    //console.log('cEggTrytings ... page current correct ');

                    this.tNow = Date.now();
                    this.tNowNice = new Date().toLocaleTimeString();


                    //console.log('cEggTry ... watcher ');
                    for( let w of this.watchList ){
                        let vNow = this.getValFromStrPathVal( w.key );
                        if( `${vNow}` != `${w.lastV}` ){
                            let tNow = Date.now();
                            //console.log(`   ${w.key} ? = srcNow:[${vNow}] lastV: [${w.lastV}]`);
                            let tDel = tNow-w.entryDate;
                            //console.log(`different last update: ${tDel/1000} sec`);
                            w.value = vNow;
                            w.entryDate = tNow;  
                            
                            if( 'watchOpts' in w ){
                                if( 'onchange' in w.watchOpts ){
                                    w.watchOpts['onchange']( w.fieldSet, w.value, w.lastV, w );
                                }
                            }else{
                                w.fieldSet.value = w.value;

                            }
                            
                            w.lastV = vNow;

                        }
                    }


                    //if( pager.currentPage != this.pageOpenAn ){
                    //    console.log('cEggTrytings clone different page then start.');
                    //    this.closePanel();
                    //}
                },1000);
            }
        },
        closePanel(){
            this.setOpts.isOpen = false;
            clearInterval( this.myPageCheck );
            this.myPageCheck = -1;
        },
        restoreSettings( clientName ){
            return [];
        },
        openPanelWithConfig(configs){
            console.log('cEggTrytings ... openPanelWithConfig',configs);
            this.configs = configs;

            for( let field of this.configs ){
                if( 'watchOpts' in field ){
                    let opt = field['watchOpts'];
                    console.log('field with watch statment: '+ opt['valPath']);
                    let w = {
                        watchOpts: field['watchOpts'],
                        key: field['watchOpts']['valPath'],
                        lastV: field.value,
                        value: '-',
                        entryDate: Date.now(),
                        fieldSet: field
                    };
                    this.watchList.push(w);

                }
            }


            this.openPanel();
        }
    }

}
</script>

<style>
.cEggTryHist{
    border-radius: 6px;
    border-top: 1px solid rgb(38, 36, 36);
    border-right: 1px solid rgb(38, 36, 36);
    background-color: #ffffff66;
    min-width: 33vw;
    min-height: 15px;

    position: fixed;
    left:0px;
    bottom:-8px;

    z-index: 999;
}
.cEggTryShe{
    border-radius: 6px;
    border-top: 1px solid rgb(38, 36, 36);
    border-left: 1px solid rgb(38, 36, 36);
    min-width: 33vw;
    min-height: 15px;
    background-color: #ffaaaa66;
    
    position: fixed;
    
    right:0px;
    bottom:-8px;
    
    z-index: 1999;
}
.cSSTop{
    border-bottom: 3px solid red;
    background-color: rgb(38, 36, 36);
    color: white;
    padding-left: 5px;
    width:100%;
}

.eggClickAt{
    border-radius: 3px;
    border: solid 1px orange;
    background-color: white;
}

.cEggTrySheh3{
    border-top: 2px solid green;
    font-size: 110%;
    line-height: 150%;
    background-color: rgb(216, 216, 216);
}
.cEggTrySheh4{
    font-size: 75%;
    border-top: 2px solid orange;
    padding-left: 5px;
    background-color: rgb(222, 222, 222);
}

.cEggTrySheh4 input{
    max-width: 50%;
}

.cEggTrySheh3html{
    font-size: 75%;
    display: inline-block;
    vertical-align: top;
    overflow-y: hidden;
    overflow-x: hidden;
    min-height: 10px;
    padding-left: 5px;
}
.cEggTrySheh3desc{
    font-size: 70%;
    background-color: white;
    padding-left: 5px;

}

</style>