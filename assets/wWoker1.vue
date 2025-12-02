<template>
    web worker 1
    <br></br>
    <button @click="onStart()">start</button>
    <button @click="onKill()">kill</button>
    status: {{ wStatus }}
    <div
        v-for="value in wMsg"
        >
        {{ value }}
    </div>

</template>
<script>
export default{
    data(){
        return {
            wObj:null,
            wStatus:false,
            wMsg: ['']
        };

    },
    mounted(){
        
    },
    methods:{
        onKill(){
            if( this.wObj != null ){
                this.wObj.terminate();
                this.wObj = null;
                this.wStatus = false;
            }
        },
        onStart(){
            if( this.wObj == null ){
                this.wObj = new Worker('./siteNo/1/./assets/wWorker1.js');               

                this.wObj.onmessage = (event)=>{
                    this.wMsg.unshift( event.data );
                    this.wStatus = true;
                };

                this.wObj.onerror = (er) =>{
                    this.wMsg.push('ee '+er);
                    this.wStatus = false;
                }

            }
        }
    }

}

</script>