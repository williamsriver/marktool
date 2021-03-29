import {Message} from 'element-ui';
import axios from 'axios';
import lantext from "./lantext";
const message = Message;
let methods = {
  upLoadFile(file, name){
    console.log(file, name)
    let formData1 = new FormData();
    formData1.append("files",file);
    formData1.append("name",name);
    formData1.append("username",this.$store.state.currentuser);

    axios.post('http://tonycoder.ziqiang.net.cn:8080/fileoperations/',formData1)
      .then((response) =>{
        console.log(response);
        if (response.data.msg==="ok") message.success('ok')
      }).catch(error => console.log(error));
  },

  getDataSet(userName, datasetId){
    console.log(userName, datasetId)
    let url = 'http://tonycoder.ziqiang.net.cn:8080/commentsList/';
    axios.put(url ,{ params:{ username:userName, list_id:datasetId,} } )
      .then(response =>{
        console.log(response);
        if (response.data.msg!=="OK") message.warning(response.data.msg);


    }).catch(error => console.log(error));
  },


}
export default methods;
