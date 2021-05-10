<template>
  <section class="form-group" ref="form_group">
    <router-link to="/" class="form-nav"><img src="@/assets/img/icon/logo.png" height="30"></router-link>
    <form ref="form">
      <h4>{{$t('SubmitProject')}}</h4>
      <div class="list-name" ref='title'> {{$t('Title')}} <span>*</span></div>
      <input type="text" name="title" :placeholder="$t('ProjectTitle')" v-model="title" autocomplete="off">
      <div class="list-name" ref="category"> {{$t('Category')}} <span>*</span></div>
      <select :class="{selected:cateID}" name="cateID" v-model="cateID">
        <option value='' disabled selected> {{$t('SelectCategory')}}</option>
        <option v-for="item in category.slice(1)" :value="item.ID" :key="item.ID">{{item.title}}</option>
      </select>
      <div class="list-name" ref="introduction">{{$t('ShortIntroduction')}} <span>*</span></div>
      <div class="basic-group">
        <textarea name="introduction" :placeholder="$t('ShortIntroductionLimit')" rows="4" v-model="introduction" @input="limitByteSize" autocomplete="off"></textarea>
        <span><i :class="{warn:shortByte>256}">{{shortByte}}</i>/256</span>
      </div>
      <div class="list-name">{{$t('DetailDescription')}}</div>
      <textarea name="description" :placeholder="$t('DetailDescription')" v-model="description" ref="des" @input="textareaHeight" autocomplete="off"></textarea>
      <!-- logo -->
      <div class="list-name">Logo (Image Size: 288*288 px)</div>
      <div class="upload-pic" id="fileContainer" :style="'backgroundImage:url('+ (img?'https://medishares-cn.oss-cn-hangzhou.aliyuncs.com/'+img:require('@/assets/img/icon/photo.png'))+')'">
        <div id="file"></div>
        <input type="hidden" name="img" v-model="img">
      </div>
      <div class="list-name">{{$t('Website')}}</div>
      <input type="text" name="website" :placeholder="$t('Website')" v-model="website" autocomplete="off">
      <div class="list-name">{{$t('Email')}}</div>
      <input type="email" name="email" :placeholder="$t('Email')" v-model="email" autocomplete="off">
      <div class="list-name">Twitter</div>
      <input type="text" name="twitter" placeholder="Twitter" v-model="twitter" autocomplete="off">
      <div class="list-name">Telegram</div>
      <input type="text" name="telegram" placeholder="Telegram" v-model="telegram" autocomplete="off">
      <div class="list-name">Element</div>
      <input type="text" name="element" placeholder="Element" v-model="element" autocomplete="off">
      <div class="list-name">Github</div>
      <input type="text" name="github" placeholder="Github" v-model="github" autocomplete="off">
      <div class="list-name">Coinmarketcap</div>
      <input type="text" name="coinmarketcap" placeholder="Coinmarketcap" v-model="coinmarketcap" autocomplete="off">
      <div class="list-name">Coingecko</div>
      <input type="text" name="coingecko" placeholder="Coingecko" v-model="coingecko" autocomplete="off">
      <div class="list-name">Subsocial</div>
      <input type="text" name="subsocial" placeholder="Subsocial" v-model="subsocial" autocomplete="off">
      <div class="list-name">{{$t('PLOTokenAllocationPlan')}}</div>
      <input type="text" name="PLOTokenAllocationPlan" :placeholder="$t('PLOTokenAllocationPlan')" v-model="PLOTokenAllocationPlan" autocomplete="off">
      <div class="list-name" v-if="parentChainList&&parentChainList.length>0">{{$t('ParentChain')}}</div>
      <select :class="{selected:parentChain}" name="pID" v-model="parentChain" v-if="parentChainList&&parentChainList.length>0">
        <option value='0' selected>None</option>
        <option v-for="item in parentChainList" :value="item.ID" :key="item.ID">{{item.title}}</option>
      </select>
      <!-- 提交申请 -->
      <a href="javascript:;" class="submit-btn" @click="submitProject">{{$t('Submit')}}</a>
    </form>
  </section>
</template>
<script>
export default {
  data(){
    return {
      title: '',
      cateID: '',
      introduction: '',
      description: '',
      img: '',
      website: '',
      email: '',
      twitter: '',
      telegram: '',
      github: '',
      coingecko:'',
      element:'',
      parentChain: '0',
      coinmarketcap: '',
      lock: false,
      shortByte: 0, //简介字符数
      g_object_name_type: 'random_name',
      g_object_name : '',
      accessid: '',
      host: '',
      policyBase64: '',
      signature: '',
      callbackbody: '',
      key: '',
      expire: 0,
      parentChainList:null,
      subsocial:'',
      PLOTokenAllocationPlan:''
    }
  },
  created(){
    this.getParentChainList();
    this.$loading(0);
  },
  mounted(){
    // 上传图片
    this.initUploader();
  },
  methods:{
    getParentChainList(){
      this.axios.get(this.domain + 'getParentChainList').then(res=>{
        if (res.data.success) {
          this.parentChainList = res.data.data;
        } else {
          console.log(res.data.message)
        }
      })
    },
    // textarea字符限制
    limitByteSize() {
      this.shortByte = this.webUtil.computeByteSize(this.introduction);
      if (this.shortByte > 256) {
        return false;
      }
      return true
    },
    // textarea高度自适应
    textareaHeight(e) {
      var textarea = e.target
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    },
    validate() {
      if (!this.title.trim()) {
        this.$toast(this.$t('EnterTitle'));
        this.$refs.form_group.scrollTo(0, this.$refs.title.offsetTop - 74);
        return false;
      }
      if (!this.cateID) {
        this.$toast(this.$t('EnterCategory'));
        this.$refs.form_group.scrollTo(0, this.$refs.category.offsetTop - 74);
        return false;
      }
      if (!this.introduction.trim()) {
        this.$toast(this.$t('EnterShortIntroduction'));
        this.$refs.form_group.scrollTo(0, this.$refs.introduction.offsetTop - 74);
        return false;
      }
      if (!this.limitByteSize()) {
        this.$toast(this.$t('EnterIntroductionLimited'));
        this.$refs.form_group.scrollTo(0, this.$refs.introduction.offsetTop - 74);
        return false;
      }
      return true;
    },
    // 提交表单
    submitProject() {
      // 防止多次提交
      if (this.lock == true) {
        return false;
      }

      this.lock = true;
      var formData = new FormData(this.$refs.form);

      if (!this.validate()) {
        this.lock = false;
        return false;
      }

      // 去除空文件元素
      try {
        for (var pair of formData.entries()) {
          if (pair[1] instanceof File && pair[1].name == '' && pair[1].size == 0)
            formData.delete(pair[0]);
        }
      } catch (e) {}

      this.$loading(1);

      this.axios.post(this.domain+"submitPolkaProject",formData).then(res=>{
        if (res.data.success) {
          this.$toast(this.$t('SubmitSuccess'));
          this.$router.push('/');
        } else {
          this.$toast(res.data.message,3000);
          this.lock = false;
        }
        this.$loading(0);
      }).catch(err=>{
        console.log(err);
        this.$toast(this.$t('ERROR'));
        this.lock = false;
        this.$loading(0);
      })
    },
    send_request() {
      var xmlhttp = null;
      if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
      } else if (window.ActiveXObject) {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
      }

      if (xmlhttp != null) {
        let serverUrl = 'https://api.maiziqianbao.net/apiTools/getOssUploadPolicy?flag=p'

        xmlhttp.open("GET", serverUrl, false);
        xmlhttp.send(null);
        return xmlhttp.responseText
      } else {
        this.$toast("Your browser does not support XMLHTTP.");
      }
    },
    get_signature() {
      // 可以判断当前expire是否超过了当前时间， 如果超过了当前时间， 就重新取一下，3s 作为缓冲。
      let now = Date.parse(new Date()) / 1000;
      if (this.expire < now + 3) {
        let body = this.send_request()
        let obj = eval("(" + body + ")");
        this.host = obj['host']
        this.policyBase64 = obj['policy']
        this.accessid = obj['accessid']
        this.signature = obj['signature']
        this.expire = parseInt(obj['expire'])
        this.callbackbody = obj['callback']
        this.key = obj['dir']
        return true;
      }
      return false;
    },
    set_upload_param(up, filename, ret) {
      if (ret == false) {
        ret = this.get_signature()
      }
      this.g_object_name = this.key;
      if (filename != '') {
        this.calculate_object_name(filename)
      }
      let new_multipart_params = {
        'key': this.g_object_name,
        'policy': this.policyBase64,
        'OSSAccessKeyId': this.accessid,
        'success_action_status': '200', //让服务端返回200,不然，默认会返回204
        'callback': this.callbackbody,
        'signature': this.signature,
      };

      up.setOption({
        'url': this.host,
        'multipart_params': new_multipart_params
      });
      up.start();
    },
    get_uploaded_object_name(filename) {
      if (this.g_object_name_type == 'local_name') {
        let tmp_name = this.g_object_name
        tmp_name = tmp_name.replace("${filename}", filename);
        return tmp_name
      } else if (this.g_object_name_type == 'random_name') {
        return this.g_object_name
      }
    },
    random_string(len) {
      len = len || 32;
      let chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
      let maxPos = chars.length;
      let pwd = '';
      for (let i = 0; i < len; i++) {
        pwd += chars.charAt(Math.floor(Math.random() * maxPos));
      }
      return pwd;
    },
    get_suffix(filename) {
      let pos = filename.lastIndexOf('.'),
      suffix = ''
      if (pos != -1) {
        suffix = filename.substring(pos)
      }
      return suffix;
    },
    calculate_object_name(filename) {
      if (this.g_object_name_type == 'local_name') {
        this.g_object_name += "${filename}"
      } else if (this.g_object_name_type == 'random_name') {
        let suffix = this.get_suffix(filename)
        this.g_object_name = this.key + this.random_string(20) + suffix
      }
      return ''
    },
    // oss安全上传
    initUploader() {
      if (this.$refs.form) {
        var uploader = new plupload.Uploader({
          runtimes: 'html5,flash,silverlight,html4',
          browse_button: 'file',
          //multi_selection: false,
          container: document.getElementById('fileContainer'),
          flash_swf_url: './plugin/Moxie.swf',
          silverlight_xap_url: './plugin/Moxie.xap',
          url: 'http://oss.aliyuncs.com',
          filters: {
            mime_types: [ //只允许上传图片和zip文件
              { title: "Image files", extensions: "jpg,jpeg,gif,png,bmp" },
            ],
            max_file_size: '2mb', //最大只能上传2mb的文件
            prevent_duplicates: true //不允许选取重复文件
          },
          init: {
            FilesAdded: (up, files)=> {
              this.set_upload_param(uploader, '', false);
            },
            BeforeUpload:(up, file)=> {
              this.set_upload_param(up, file.name, true);
            },
            FileUploaded:(up, file, info)=>{
              if (info.status == 200) {
                this.img = this.get_uploaded_object_name(file.name);
              } else if (info.status == 203) {
                console.log('上传到OSS成功，但是oss访问用户设置的上传回调服务器失败，失败原因是:' + info.response);
              } else {
                console.log(info.response);
              }
            },
            Error: (up, err)=>{
              if (err.code == -600) {
                this.$toast('图片太大，请小于 2M');
              } else if (err.code == -601) {
                this.$toast('图片类型有误，仅支持 jpg,jpeg,gif,png,bmp');
              } else if (err.code == -602) {
                this.$toast('图片已上传');
              } else {
                this.$toast(err);
                console.log(err.response);
              }
            }
          }
        });
        uploader.init();
      }
    },
  }
}
</script>
<style scoped>
input,
textarea,
select {
  border: var(--border);
  padding: 12px;
}
/*表单*/
.form-group {
  background: var(--paleGrey);
  padding-top: 64px;
  height: 100%;
  overflow-y: auto;
}

.form-nav {
  padding: 17px 24px;
  background: var(--mainColor);
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 1000;
}

.form-group form {
  width: 100%;
  max-width: 824px;
  margin: 32px auto;
  background: #fff;
  padding: 16px 24px;
}

.form-group h4 {
  font-size: 16px;
  line-height: 1.5;
  font-weight: bold;
  font-family: var(--familyMedium);
  padding-bottom: 15px;
  border-bottom: var(--border);
}

.list-name {
  font-size: 12px;
  line-height: 16px;
  margin: 32px 0 8px;
}

.list-name span {
  color: var(--mainColor);
  font-size: 24px;
  vertical-align: -webkit-baseline-middle;
}

select {
  color: #c8c7cc;
  background: url(../assets/img/icon/downward.png)no-repeat 98% center/12px;
}

.selected {
  color: #000;
}

select [disabled] {
  display: none;
}

.basic-group textarea {
  padding-bottom: 36px;
}

.basic-group .warn {
  color: red;
  font-weight: bold;
  font-family: var(--familyMedium);
}

.basic-group span {
  position: absolute;
  right: 12px;
  bottom: 12px;
  font-size: 12px;
  line-height: 16px;
}

.submit-btn {
  text-align: center;
  display: block;
  background: var(--mainColor);
  color: #fff;
  padding: 12px;
  font-size: 16px;
  line-height: 1.5;
  margin: 32px 0 16px;
}

.upload-pic {
  border-radius: 8px;
  height: 88px;
  width: 88px;
  position: relative;
  overflow: hidden;
  background-repeat: no-repeat;
  background-color: #f7f7fa;
  background-position: center;
  -webkit-background-size: contain;
  background-size: cover;
  cursor: pointer;
}

.upload-pic #file {
  width: 100%;
  height: 100%;
}

.upload-pic input,
.upload-pic input::-webkit-file-upload-button {
  height: 100%!important;
  width: 100%!important;
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
  z-index: 10;
}
@media(max-width:768px){
  .form-group {
    background: #fff;
    padding-top: 16px;
  }
  .form-group form {
    margin: 0;
  }
}



</style>
