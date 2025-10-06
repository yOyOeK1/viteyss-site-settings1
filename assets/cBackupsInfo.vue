<template>
    made {{ dcount }} last: {{ niceData }}
    <i v-show="!showIt" 
        @click="showIt=!showIt" class="fa-solid fa-circle-info" title="show details"></i>
    <i v-show="showIt" 
        @click="showIt=!showIt" class="fa-solid fa-circle-xmark"></i>
    
    <br>
    <div  v-show="showIt">
        <b>vNames in base:</b><hr>
        <table>
            <tr>
                <th title="count of use">cof</th>
                <th>vName</th>
            </tr>
            <tr v-for="(v,k,i) in vNames">
                <td>{{v['cou']}}</td>
                <td>{{v['vName']}}</td>
            </tr>
        </table>

    </div>
</template>
<script>
export default{
    props: ['datap'],
    data(){
        return {
            showIt: false,
            dd: this.datap,
            vNames: this.datap['vNames'],
            dcount: this.datap['count']
        };
    },
    computed:{
        niceData(){
            return new Date( parseInt(this.datap['lastEntryDate']) );
        }
    }


}
</script>
