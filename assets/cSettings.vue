<template >



    <div v-if="configs!=[] && setOpts.isOpen"
        v-ref="divFirstName"
        :id="'divTopsC'+name"
        :style="divStyle"
        :class="'cSet '+(theme==1?'':'cSetSheTheme'+theme)"
        >

        <div class="cSSTop" v-ref="cSTitleBar"
            v-if="isTitleVisible">
            <small>{{ title }} </small>
        </div>
        
        <div class="cSlayerButtons">
            <button 
                title="Make as floating"
                v-if="isFloating == false && divControlls.minMax"
                @click="makeAsFloating()">
                <i class="fa-solid fa-down-left-and-up-right-to-center"></i></button>
            <button 
                title="As right drawer"
                v-if="isFloating == true && divControlls.minMax"
                @click="makeAsDrawer()">
                <i class="fa-solid fa-forward-step"></i></button>

            
            <button 
                title="Hide title"
                v-if="isTitleVisible == true && divControlls.titleBarHide"
                @click="isTitleVisible = false">
                <i class="fa-solid fa-arrows-up-to-line"></i></button>

            <button 
                title="Show title"
                v-if="isTitleVisible == false && divControlls.titleBarHide"
                @click="isTitleVisible = true">
                <i class="fa-solid fa-arrows-up-down"></i></button>
            
            <button 
                title="Move it"
                v-if="isFloating == true && divControlls.move"
                v-on:mousedown="oMoveIt_nMousedown"
                v-on:touchdown="oMoveIt_nMousedown" 
                v-on:touchstart="oMoveIt_nMousedown"            
                >
                <i class="fa-solid fa-up-down-left-right"></i></button>

            <button 
                title="Close it"
                v-if="divControlls.close"
                @click="closePanel()"><i class="fa-solid fa-xmark"></i></button>
        </div>


        
        <div v-if="isTitleVisible">
            <br>
            conf items: ({{ configs.length }})
        </div>


        
        <div>

            <div v-for="conf in configs">

                
                <div class="cSetSheh3">{{ strFirtLeterLarge(conf.name) }}</div>

                <div v-if="conf.icon"><img :src="conf.icon" /></div>
                
                <div v-show="conf.desc" 
                    class="cSetSheh3desc">{{ conf.desc }}</div>
                <div v-show="conf.html" v-html="conf.html"
                    class="cSetSheh3html"></div>

                    
                <div v-if="conf['fields']">
                    <div v-for="field in conf['fields']">

                        
                        <div v-show="field.selectoneoption">
                            select one 
                            <select
                                v-model="field.value"
                                @change="field.callBackF($event, field.value)"
                                >
                                <option v-for="v in field.values"
                                    :value="v"
                                    >{{ v }}</option>
                            </select>

                        </div>


                        <div class="cSetSheh4">
                            {{ 'name' in field ? strFirtLeterLarge( field.name ) : '' }}: 
                            <span v-if="field.range">( {{ field.value }} )</span>
                        </div>

                        <div v-show="field.text">{{ field.text }}</div>
                        <div v-show="field.desc" class="cSetSheh3desc">{{ field.desc }}</div>
                        <div v-show="field.html" v-html="field.html" class="cSetSheh3html"></div>
                        
                        <div v-show="field.whantDiv"
                            :id="field.whantDiv">{{ field.whantDiv }}</div>

                        <div v-show="field.filesList">
                            <textarea v-show="field.filesList"
                                v-model="field.value"
                                style="width: 100%;"
                                >{{ field.value }}</textarea>
                                
                                
                            <br>current values: [<small>{{ field.value }}</small>]
                        </div>

                         <div v-show="field.inputText">
                            <input type="text" 
                                v-model="field.value" 
                                @change="field.callBackF($event, field.value)"
                                />                           

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

                    </div>

                </div>
                <div v-else><!--<small>no paramiters</small>--></div>


            </div>

        </div>
        

    </div>

</template>
<script>
import { ref } from 'vue';

export default{
    props:[ 'name', 'opts' ],
    data(){

        let setOpts = {
            'isOpen': false, // default state of setting 
            'methods': this,
            'openPanelWithDiv': this.openPanelWithDiv

        };
        if( !( 'setOpts' in window) ){
            window['setOpts'] = setOpts;
        }

        return {
            //isOpen: true
            isTitleVisible: true,
            isFloating: false,
            draggingNow: false,
            byCorner: 'tr',
            divFirstName: ref('cSetFirstDiv'+this.name),
            cSTitleBar: null,
            divStyle: {
                'box-shadow': '10px 10px 30px rgba(0, 0, 0, 1.0)',
                'background-color': 'rgb(220, 255, 151)',
                //'min-width': '45%',
                'width': '45%',
                'height': '100%',
                'overflow-y': 'auto',
                'border':'solid 2px gray',            
                position: 'fixed',

                right: '0px',
                top: '0px',
                
                'z-index': 999
            },
            divSize: null,
            divControlls:{
                minMax: true, 
                titleBarHide: true,
                move: true,
                close: true
            },
            title: 'Settings: '+this.name,
            theme: 1,
            setOpts,
            configs: [],
            pageOpenAn: '',
            myPageCheck: -1,
            callBackOnClose: undefined,

            mousePos:[0,0],

            
        };
    },
    mounted(){
        console.log('cSettings ['+this.name+'] mounted....');
    },
    computed:{
        
    },
    methods:{
        strFirtLeterLarge(st){
            console.log('st ',st);
            return st.charAt(0).toUpperCase() + st.slice(1);
        },
       
        oMoveIt_nMousedown(e){
            console.log('cS - mouse down',e);
            this.draggingNow = true;
            setOpts.Dragging_start(e,this.oMoveIt_nMousemove, this.oMoveIt_nMouseup);

        },
        oMoveIt_nMousemove(e){
            if( this.draggingNow == false ){
               return 1;
            } 

            this.setLayerPos(e.cXY);

            //console.log('cS - mouse move',e,);
            //this.divStyle['right'] = (-e.delta[0]+ parseInt(this.divStyle['right'].substring(0,this.divStyle['right'].length-2)) )+'px';
            //this.divStyle['top'] = (e.delta[1]+ parseInt(this.divStyle['top'].substring(0,this.divStyle['top'].length-2)) )+'px';
        },
        oMoveIt_nMouseup(e){
            console.log('cS - mouse up');
            this.draggingNow = false;
        },


        makeAsFloating(){
            console.log('cS go floating .... \n',this.divFirstName); 
            //this.divStyle['height'] = '30%';
            this.isFloating = true;
            //this.divStyle['border'] = 'solid gray 3px';
            this.updateDivSize();  
        },

        makeAsDrawer(){
            this.divStyle['height'] = '100%';
            this.divStyle['right'] = '0px';
            this.divStyle['top'] = '0px';
            //this.divStyle['border'] = '';

            this.isFloating = false;
        },

        openPanelWithDiv( title, callBack, callBackOnClose = undefined ){
            let divName = `divSettingsPanel${parseInt(Date.now())}`;
            this.openPanelWithConfig([
                {
                name: title,
                html: `<div id="${divName}"></div>`
                }], title, callBackOnClose );
            setTimeout(()=>{
                callBack( divName );
            },10);
        },
        

        updateDivSize(){
            let dFram = $('#divTopsC'+this.name );
            this.divSize = [ dFram.width(), dFram.height() ];
            console.log('cS - update div size ', this.divSize);
        },
        setDivSize( size ){
            console.log('cS - set div size ', size);
            let dFram = $('#divTopsC'+this.name );
            this.divStyle['width'] = size[0]+'px';
            this.divStyle['height'] = size[1]+'px';
            //dFram.width( size[0]+'px' );
            //dFram.height( size[1]+'px' );
            
        },

        setLayerPos( pos ){
            let wSize = [ window.innerWidth, window.innerHeight ];
            let lPos = [ parseInt( this.divStyle['right'].replace('px','') ), parseInt( this.divStyle['top'].replace('px','') ) ];
            
            this.updateDivSize();

            if( this.byCorner == 'tr' ){
                this.divStyle['right'] = wSize[0]-pos[0]+'px';
                this.divStyle['top'] = pos[1]+'px';
                
            }else if( this.byCorner == 'tl' ){
                this.divStyle['right'] = wSize[0]-pos[0]-this.divSize[0]+'px';
                this.divStyle['top'] = pos[1]+'px';
                
            }else if( this.byCorner == 'bl' ){
                this.divStyle['right'] = wSize[0]-pos[0]-this.divSize[0]+'px';
                this.divStyle['top'] = -this.divSize[1]+pos[1]+'px';
            
            }else if( this.byCorner == 'br' ){
                this.divStyle['right'] = wSize[0]-pos[0]+'px';
                this.divStyle['top'] = -this.divSize[1]+pos[1]+'px';
            
            }else{
                console.error('EE cS set layer pos by corren NaN ',this.byCorner);
                console.log('cS set layer pos by corner: ['+this.byCorner+']',
                    '\n POS:        ', pos, 
                    '\n   lPos:     ', lPos,
                    '\n   divSize:    ', this.divSize,
                    '\n   wSize:    ', wSize,
                );
            }
            
            //console.log('cS set layer pos Final',
            //'\nright , top : '+this.divStyle['right']+ ' , '+this.divStyle['top'] );


        },


        openPanel(){
            

            if( 'style' in this.opts ){
                Object.keys( this.opts.style )
                    .forEach( k => this.divStyle[ k ] = this.opts.style[ k ] );
            }
           

            if( 'byCorner' in this.opts )
                this.byCorner = this.opts.byCorner;
            if( 'isTitleVisible' in this.opts )
                this.isTitleVisible = this.opts.isTitleVisible;
            if( 'size' in this.opts )
                this.setDivSize( this.opts.size );
            if( 'controls' in this.opts ){
                Object.keys( this.opts.controls )
                    .forEach( k => this.divControlls[ k ] = this.opts.controls[ k ] );
            }
            
            if( 'makeFloating' in this.opts && this.opts.makeFloating == true ){
                this.makeAsFloating();
                 if( 'pos' in this.opts ){
                    console.log('   - cS panel / layer [makeFloating]\n',
                        '   - pos [',this.opts,']' );

                    setTimeout(()=>{
                        this.setLayerPos( this.opts.pos );
                    },10);
                }
            }

            //$('#mainPage').css('box-shadow', 'inset 5px 5px 50px rgba(0, 0, 0, 0.8)');
            /*
            aajs.animate('#mainPage',{
                'box-shadow': [
                    'inset 0px 0px 0px rgba(0, 0, 0, 0.0)',
                    'inset 15px 15px 40px rgba(0, 0, 0, 1.0)'
                ],
                duration: 100,        // Animation duration in milliseconds
                easing: 'easeInOutQuad' // Easing function for the animation
                });
            */

            if( 'forThisSite' in this.opts && this.opts.forThisSite == false ){
                this.myPageCheck = 'dontWant';
            }
            this.pageOpenAn = parseInt( pager.currentPage );
            if( this.myPageCheck == -1 ){
                this.myPageCheck = setInterval(()=>{
                    //console.log('cSettings ... page current correct ');
                    if( pager.currentPage != this.pageOpenAn ){
                        console.log('cSettings clone different page then start.');
                        this.closePanel();
                    }
                },1000);
            }

            this.setOpts.isOpen = true;

        },
        closePanel(){
            this.setOpts.isOpen = false;
            //$('#mainPage').css('box-shadow','');
            /*
            aajs.animate('#mainPage',{
                'box-shadow': [
                    'inset 15px 15px 40px rgba(0, 0, 0, 1.0)',
                    'inset 0px 0px 0px rgba(0, 0, 0, 0.0)'
                ],
                duration: 200,        // Animation duration in milliseconds
                easing: 'easeInOutQuad' // Easing function for the animation
                });
                */
            if( this.myPageCheck != 'dontWant' ){
                clearInterval( this.myPageCheck );
                this.myPageCheck = -1;
            }
            //console.log('cSettings - close panel - callbackon clone ', this.callBackOnClose);
            if( this.callBackOnClose != undefined )
                this.callBackOnClose();
        },
        restoreSettings( clientName ){
            return [];
        },
        openPanelWithConfig(configs, title = '', callBackOnClose = undefined){
            this.configs = configs;
            if( title != '' ){
                this.title = title;
                this.theme = 2;
            }else{
                this.title = 'Settings: '+this.name;
                this.theme = 1;
            }

            if( this.isOpen )
                this.closePanel();

            this.callBackOnClose = callBackOnClose;
            this.openPanel();
        }
    }

}
</script>

<style>

.cSet button{
    padding:3px;
}

.cSlayerButtons{
    position: sticky;
    right: 0px;
    top: 0px;
    text-align: right;
}
.cSlayerButtons button{

    background-color: greenyellow;
    color: black;
    border-radius: 3px;
    margin: 1px;
    border: 1px solid rgb(193, 123, 180);
}

.cSetSheTheme2{
    background-color: rgb(197, 181, 218);
}

.cSSTop{
    border-bottom: 1px solid rgb(193, 123, 180);
    background-color: rgb(38, 36, 36);
    color: white;    
    min-width: 45%;
    max-width:45%;
    position: fixed;
}

.cSetSheh3{
    border-top: 2px solid green;
    font-size: 110%;
    line-height: 150%;
    background-color: rgb(216, 216, 216);
}
.cSetSheh4{
    font-size: 75%;
    border-top: 2px solid orange;
    padding-left: 5px;
    background-color: rgb(222, 222, 222);
}

.cSetSheh4 input{
    max-width: 50%;
}

.cSetSheh3html{
    font-size: 75%;
    overflow-y: hidden;
    overflow-x: hidden;
    min-height: 30px;
    max-width: 90%;
    background-color: white;
    padding-left: 5px;
}
.cSetSheh3desc{
    font-size: 70%;
    background-color: white;
    padding-left: 5px;
    
}

</style>