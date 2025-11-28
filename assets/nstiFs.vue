<template>
    
    <div class="nstDebugBar"
        style="width: 90%;">
        <div>
            File name: 
            <input type="input" v-model="fileName" 
                style="
                    width:200px;
                "/>
        </div>
        <div>
            <small><textarea v-model="dataTo" 
                rows="6"
                style="
                    width:100%;

                "/></small>

        </div>
    </div>


    

    

    <div class="nstDebugBar"
        style="width: 90%;">
    
        Path: <input type="input" v-model="dirName" />
    
        <button @click="onMkNewDir()"
            title="Create new directory">+<i class="fa-solid fa-folder"></i></button>
    </div>
    

    <div class="nstDebugBar"
        style="width: 90%;">
        
        <div>
            <div v-for="f in dirContentDirs"
                @click="onDirectoryChange(f.name)"
                class="nstPropItem"
                :title="'Directory reated at: '+f.createdAt"
                >
                
                <i v-if="f.name == '..'" class="fa-solid fa-arrow-turn-up"></i>
                <i v-else class="fa-solid fa-folder"></i> 

                {{ f.name }}  </div>

            <div v-for="f in dirContentFiles"
                :title="'File created at: '+f.createdAt"
                @click="fileName=f.name"
                class="nstPropItem">
                <i class="fa-regular fa-file"></i>
                {{ f.name }}
            </div>


        </div>

    </div>



    <div class="nstDebugBar"
        style="width: 90%;"
        >
        <div v-if="operation=='save'" >
            <button @click="saveTo_clipboard()">To clipboard</button>
            <button @click="saveTo_SaveAs()">Download</button>
            <button @click="saveTo_iFs()">Save in iFs</button>
    
        </div>
        <div v-else-if="operation=='load'">
            <button @click="loadFrom_clipboard()">From clipboard</button>
  
            <label for="fileUpload">From file:</label>
            <input type="file" id="fileUpload" name="uploadedFile" 
                @change="loadFrom_file"
               >
    
        </div>
    </div>


</template>

<script>
//import { a as testa} from '@/test.js'

//import { a as testa2} from '@viteyss-site-settings1/libs/test.js'

export default{
    props:['operation', 'data'],
    data(){
        return {
            dirName: 'nst',
            fileName: timestampToNiceTime_DomSafe()+'.js',
            filesInDir: -1,
            dirContentFiles:['loading ...'],
            dirContentDirs:['loading ...'],

            dataTo: this.data!=null? this.data:`erties [html@local]#[dDivSvg] of node
nstTimeLine.vue:745
 make selected node by name : #dDivSvg 
props: (1) ['left'] 
event:  undefined
nstTimeLine.vue:690
div find name ....dDivSvg  have (1)
nstTimeLine.vue:654
 get properties [html@local]#[dDivSvg] of node
nstTimeLine.vue:745
observer START for [html@local]`,
        };
    },
    computed:{
        
    },
    watch:{
        dirName(nV,oV){
            this.readDirectory();
        },
        fileName( nV, oV ){
            if( this.operation == 'load' ){
                iFs.readFile( this.dirName+'/'+nV )
                .then( ok => this.dataTo = ok ) 
                .catch( e => console.error( 'error on read file from ifs ',e ) );
            }
        }
    },
    mounted(){
        this.readDirectory();
    },
    methods:{

        onMkNewDir(){
            let sign = prompt("Name of new directory");

            if (sign === null) {
                $.toast('New directory Cancel');

            } else if (sign.length >= 1 ) {
                let path = `${this.dirName}/${sign}`;
                iFs.createDirectory( path ).then(
                    ok => {
                        $.toast('New directory created<br>'+path);
                         this.readDirectory();
                    }
                ).catch(e=>{
                    console.log('new dir error ',e);
                });
            } else {
                $.toast('Name is empty !');

            }
        },

        onDirectoryChange( dName ){
            if( dName == '..' ){
                if( this.dirName.indexOf('/') != -1 ){
                    let dt = this.dirName.split('/');
                    dt.splice( dt.length-1,1 );
                    this.dirName = dt.join('/');
                }
            }else
                this.dirName+= '/'+dName;
        },
        
        timestampToNiceTime_DomSafe( ms ){ return timestampToNiceTime_DomSafe( ms ); },
        
        readDirectory(){
            iFs.readDirectory(this.dirName).then(res =>{
                this.filesInDir = res.filesCount;
                //this.updateDirectoryList();
                if( this.dirName.indexOf( '/') != -1 )
                    res.directories.unshift({name:'..',createdAt: -1});
                this.dirContentDirs = res.directories;
                this.dirContentFiles = res.files;

            })
            .catch(e=>{
                console.error('EE on read file ?\n',e);
                this.dirContent = ['Wrong directory name'];
            });
            
        },

        loadFrom_clipboard(){
            navigator.clipboard.readText()
                .then(ok=> this.dataTo = ok )
                .catch(e=> console.error('On read from clipboarod ',e) );
        },
        loadFrom_file( o='' ){
            let file = document.getElementById('fileUpload').files[0];
            let tloadedDadaTo = this.loadedDadaTo;
            if( file ){
                let reader = new FileReader();
                reader.onload = function(e) {
                    tloadedDadaTo( e.target.result );
                    
                };
                reader.readAsText(file);
            }else{

            }
        },
        loadedDadaTo( dNew){
            this.dataTo = `${dNew}`;
        },

        saveTo_clipboard(){
            navigator.clipboard.writeText( this.dataTo );
            $.toast('In clipboard: '+`${this.dataTo.length} characters`);
        },
        
        saveTo_SaveAs(){
            downloadStringAsFile( this.dataTo, this.fileName, 'application/javascript' );
        },
        
        async saveTo_iFs(){
            await iFs.createDirectory(this.dirName);
            let path = `${this.dirName}/${this.fileName}`;

            const fileExists = await iFs.exists( path );

            if( fileExists == true ){
                let  userConfirmation = confirm(`File: [${path}] exists. Do you want to overrite?`);
                if (userConfirmation) {
                    // yes 
                } else {
                    // no - abord
                   return 1;
                }
            }

            await iFs.writeFile(path, this.dataTo );

            $.toast(
                'Layers save in local storage<br>'+
                (fileExists ? 'Overrited<br>':'New<br>')+
                '<small>Adress:</small> '+path
            );


            this.readDirectory();

        },


    }




}

</script>