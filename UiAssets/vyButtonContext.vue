<template>

    <div :id="'vyButCont'+name"
        style="position:relative;display: inline;"
        >

        <button 
            v-if="btShowHide"
            @click="
            pointPos=[$event.pageX-15, $event.pageY-15 ]; 
            console.log( 'do '+!isShowing+' event,',$event,'\npointPos:',pointPos );
            $emit( 'update:isShowing',!isShowing )"
            :title="title"
                v-html="icon"></button>


        <div 
            v-show="isShowing"
            style="background-color: #aaccbb55;
                width:100%;height:100%;
                position:fixed;top:0px;left:0px;
                z-index: 19;"
            @mouseover="$emit( 'update:isShowing', false )"                    
            >

        
    
        
        </div>


        <Transition>

            <div 
                v-if="isShowing"
                id="nstToolsBlock"
                :style="`
                    border:solid darkolivegreen 4px;
                    border-radius: 15px;
                    background-color: rgb(111,66,103);
                    color:white;
                    position: fixed;
                    margin-top:10px;
                    z-index:20;
                    padding:10px;
                    min-width:200px;
                    max-height:66vh;
                    left:${pointPos[0]}px;
                    top:${pointPos[1]}px;
                    overflow-y: auto;
                    box-shadow: rgb(50, 50, 50) 5px 8px 15px;
                    `

                "
                >

                <slot />

            </div>

        </Transition>

    </div>



</template>

<script>
export default{

props:{
    'isShowing': { type: Boolean, default: false },
    'name': { type: String, default: 'NaN'+Date.now() },
    'title':  { type: String, default: 'NaN_title' },
    'icon':  { type: String, default: '<i class="fa-solid fa-ellipsis-vertical"/>' },
    'btShowHide': { type: Boolean, default: true },
    
},
emits: [ 'update:isShowing' ],
data(){
    return { 
        //isShowing:false,
        pointPos: [ 0,0]

     };
},
watch:{
    icon(nv,ov){
        console.log( `vyButton - icon `, this );
        if( this.icon != -1 )
            this.opts.icon = this.icon;
    }
}





}

</script>