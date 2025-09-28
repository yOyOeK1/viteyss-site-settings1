<template>
    <div v-show="setOpts.isOpen"
        class="cSetShe"
        >

        <div class="cSSTop">
            <button @click="closePanel()">x</button>
            <small>Settings:</small> {{ name }}
        </div>

        conf items: ({{ configs.length }})
        
        <div>

            <div v-for="conf in configs">

                <div class="cSetSheh3">{{ strFirtLeterLarge(conf.name) }}</div>
                <div v-show="conf.desc" 
                    class="cSetSheh3desc">{{ conf.desc }}</div>
                <div v-show="conf.html" v-html="conf.html"
                    class="cSetSheh3html"></div>

                <div v-if="conf['fields']">
                    <div v-for="field in conf['fields']">
                        <div class="cSetSheh4">
                            {{ strFirtLeterLarge(field.name) }}: 
                            <span v-show="field.range">( {{ field.value }} )</span>
                        </div>

                        <div v-show="field.text">{{ field.text }}</div>
                        <div v-show="field.desc" class="cSetSheh3desc">{{ field.desc }}</div>
                        <div v-show="field.html" v-html="field.html" class="cSetSheh3html"></div>
                        
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
            setOpts,
            configs: [],
            pageOpenAn: '',
            myPageCheck: -1
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
            this.pageOpenAn = parseInt( pager.currentPage );
            if( this.myPageCheck == -1 ){
                this.myPageCheck = setInterval(()=>{
                    console.log('cSettings ... page current correct ');
                    if( pager.currentPage != this.pageOpenAn ){
                        console.log('cSettings clone different page then start.');
                        this.closePanel();
                    }
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
            this.configs = configs;
            this.openPanel();
        }
    }

}
</script>

<style>
.cSetShe{
    border-left: 3px solid rgb(38, 36, 36);
    background-color: rgb(220, 255, 151);
    min-width: 45vw;
    min-height: 100vh;
    
    position: absolute;
    right:0px;
    top:0px;

    z-index: 999;
}
.cSSTop{
    border-bottom: 3px solid red;
    background-color: rgb(38, 36, 36);
    color: white;
    padding-left: 5px;
    width:100%;
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
    position: absolute;
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