import store from "../store";
import axios from "axios";
class TagCategory{
  dataset_id = 1680064092965

  category_obj;

  constructor(obj, obj_str) {
    if (!!obj) this.category_obj = obj;
    else this.category_obj = JSON.parse(obj_str);
  }

  print(){
    return this.category_obj.toString();
  }

  save(tag_id, dataset_id, comment_id) {
    //这里的tag_id就代表了对应的tag_category

    //如果这是新category
    if (!tag_id) {
      let formData1 = new FormData()
      formData1.append('remarks', JSON.stringify(this.category_obj))
      formData1.append('token', store.state.token);
      formData1.append('tag_user_info', store.state.currentuser)//用户信息
      formData1.append('confidence', '5') //confidence

      axios.post('/tag/', formData1).then(response => {
        if (response.data.Details) {
          let tag_object = response.data.Details
          tag_id = tag_object.tag_id
          let formData2 = new FormData()
          let date = new Date();
          formData2.append("datetime_info", date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate())
          formData2.append('comment_id', comment_id)
          formData2.append('tag_id', String(tag_id))

          axios.put('/comments/', formData2).then(response => {
            console.log(comment_id, tag_id)
          })
        }
      })
    }
  }

}
export default TagCategory
