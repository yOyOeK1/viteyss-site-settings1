<template>
    <div v-show="setOpts.isOpen"
        :class="'cSetShe '+(theme==1?'':'cSetSheTheme'+theme)"
        >
        <div class="cSSTop">
            <button @click="closePanel()">x</button>
            <small>{{ title }} </small>
        </div>
        <br><br><br>

        conf items: ({{ configs.length }})
        
        <div>

            <div v-for="conf in configs">

                
                <div class="cSetSheh3">{{ strFirtLeterLarge(conf.name) }}</div>

                <div v-show="conf.icon"><img :src="conf.icon" /></div>
                
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
                            {{ strFirtLeterLarge(field.name) }}: 
                            <span v-show="field.range">( {{ field.value }} )</span>
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

export default{
    props:[ 'name' ],
    data(){

        let setOpts = {
            'isOpen': false, // default state of setting 
            'methods': this

        };
        window['setOpts'] = setOpts;

        return {
            //isOpen: true
            title: 'Settings: '+this.name,
            theme: 1,
            setOpts,
            configs: [],
            pageOpenAn: '',
            myPageCheck: -1,
            callBackOnClose: undefined
        };
    },
    computed:{
        
    },
    methods:{
        strFirtLeterLarge(st){
            return st.charAt(0).toUpperCase() + st.slice(1);
        },
        openPanel(){
            this.setOpts.isOpen = true;

            //$('#mainPage').css('box-shadow', 'inset 5px 5px 50px rgba(0, 0, 0, 0.8)');
            aajs.animate('#mainPage',{
                'box-shadow': [
                    'inset 0px 0px 0px rgba(0, 0, 0, 0.0)',
                    'inset 15px 15px 40px rgba(0, 0, 0, 1.0)'
                ],
                duration: 100,        // Animation duration in milliseconds
                easing: 'easeInOutQuad' // Easing function for the animation
                });


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
        },
        closePanel(){
            this.setOpts.isOpen = false;
            //$('#mainPage').css('box-shadow','');
            aajs.animate('#mainPage',{
                'box-shadow': [
                    'inset 15px 15px 40px rgba(0, 0, 0, 1.0)',
                    'inset 0px 0px 0px rgba(0, 0, 0, 0.0)'
                ],
                duration: 100,        // Animation duration in milliseconds
                easing: 'easeInOutQuad' // Easing function for the animation
                });
            clearInterval( this.myPageCheck );
            this.myPageCheck = -1;
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

            this.callBackOnClose = callBackOnClose;

            this.openPanel();
        }
    }

}
</script>

<style>
.cSetShe{
    box-shadow: 10px 10px 30px rgba(0, 0, 0, 1.0);
    background-color: rgb(220, 255, 151);
    min-width: 45vw;
    max-width: 45vw;
    height: 100vh;
    overflow-y: auto;
    
    position: fixed;
    right:0px;
    top:0px;

    
    z-index: 999;
}
.cSetSheTheme2{
    background-color: rgb(197, 181, 218);
}

.cSSTop{
    border-bottom: 3px solid red;
    background-color: rgb(38, 36, 36);
    color: white;
    padding-left: 5px;
    width:100%;
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
    background-color: white;
    padding-left: 5px;
}
.cSetSheh3desc{
    font-size: 70%;
    background-color: white;
    padding-left: 5px;
    
}

</style>