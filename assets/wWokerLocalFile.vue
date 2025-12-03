<template>


    <div>
        <label for="file-upload" class="button-style-label">
            Select file
        </label>
        <input 
            id="file-upload" 
            type="file" 
            @change="handleFileSelect" 
            :multiple="allowMultiple" 
            hidden 
            />
        <div v-if="selectedFiles.length">
            <h3>Selected Files:</h3>
            <ul>
                <li v-for="file in selectedFiles" :key="file.name">{{ file.name }}</li>
            </ul>
        </div>
    </div>

    <div v-if="workers.length!=0">
        Workers: ({{ workers.length }})

    </div>


</template>
<style scoped>
.button-style-label {
  display: inline-block;
  padding: 2px 10px;
  background-color: #ffdd00;
  color: rgb(0, 0, 0);
  border-radius: 8%;
  border-color: black;
  border: 1px solid transparent;
  cursor: pointer;
  margin:2px;
}
</style>
<script>
import { ref, toRaw } from 'vue';

export default{
    props: ['homeUrl', 'multi', 'onDone' ],
    data(){
        return {
            wObj:null,
            wStatus:false,
            wMsg: [''],


            workers: [],
            fileDone: [],

            selectedFiles: ref([]),
            allowMultiple: ref( this.multi == true ? true : false )

        };

    },
    mounted(){
        
    },
    methods:{

        sponWorkerToRead( id, fileH ){
            let w = new Worker( this.homeUrl+'nstWorker_loadFile.js');  
            let tStart = Date.now();
            this.workers[ id ] = w;       
            w.onmessage = (event)=>{
                console.log( 'worker '+id+': DONE ',event.data );
                if( event.data.status == 'ok' ){
                    this.fileDone[ id ] = event.data;
                    this.fileDone[ id ]['tTotal'] = Date.now() - tStart;
                    this.workers[ id ].terminate();
                    this.workers[ id ] = undefined;    
                    
                    
                    let chk = true;
                    this.workers.forEach( w=> {
                        if( w != undefined ) chk = false;
                    } );

                    if( chk == true ){
                        this.workers = [];
                        this.onDone( toRaw( this.fileDone ) );
                    }


                }
            };
            w.onerror = (er) =>{
                console.log( 'worker '+id+': ERROR \n',er);
            }
            w.postMessage( {
                'wId': id,
                'resAs': 'b64',
                action: 'openFile',
                fh: fileH
            });
        },

        handleFileSelect(event){
            if (event.target.files) {
                this.fileDone = [];
                this.fileDone = new Array( event.target.files.length );
                this.selectedFiles = Array.from(event.target.files);

                for( let fi=0,fic=event.target.files.length; fi<fic; fi++ ){
                    let f = event.target.files[ fi ];
                    this.sponWorkerToRead( fi, f );
                }


                           
            }
        },



        async onFilePicker(){
            let pickerOpts = {
            types: [
                {
                description: "Images / media / html",
                accept: {
                    "*/*": [".svg", ".png", ".gif", ".jpeg", ".jpg"],
                },
                },
            ],
            excludeAcceptAllOption: true,
            multiple: false,
            };
            let [fileHandle] = await window.showOpenFilePicker( pickerOpts );
            //let file = fileHandle.getFile();
            return fileHandle;
        },


        onSend(msg){
            this.wMsg.unshift( '> :'+msg );

            if( msg == 'openFile' ){
                this.onFilePicker().then(fileH=>{
                    this.wObj.postMessage( {
                        action: 'openFile',
                        fh: fileH
                    });
                });

            }else {
                this.wObj.postMessage( msg );
            }

        },
        onKill(){
            if( this.wObj != null ){
                this.wObj.terminate();
                this.wObj = null;
                this.wStatus = false;
            }
        },
        onStart(){
            if( this.wObj == null ){
                this.wObj = new Worker('./siteNo/1/./assets/wWorker2.js');               

                this.wObj.onmessage = (event)=>{
                    this.wMsg.unshift( "< :"+event.data );
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