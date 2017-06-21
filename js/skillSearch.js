var config = {
  apiKey: "AIzaSyCjkfmg2MFFocIDBdQuplLOOflyD2roLQM",
  authDomain: "sna-final.firebaseapp.com",
  databaseURL: "https://sna-final.firebaseio.com",
  projectId: "sna-final",
  storageBucket: "sna-final.appspot.com",
  messagingSenderId: "296131393218"
};
firebase.initializeApp(config);

var provider    = new firebase.auth.FacebookAuthProvider();
var db          = firebase.database() ;
var rootRef     = db.ref() ;
var usersRef    = db.ref("users");
var articlesRef = db.ref("articles");
var currentUser

var app = new Vue({
  el :'#app',
  data :{
    currentUser,
    skill_list :[],
    suggest_list :{},
    favorite_list : {},
    control:{
      tab : "all",
      filter : "",
      sort : ""
    }
  },
  methods :{
    articleModal :function(){
      $('#publishArticle').modal('show')
    },
    articleSubmit :function(){
      var vm=this;
      var dataArr = $("#articleForm").serializeArray();
      var newPostKey = firebase.database().ref().child('articles').push().key;
      // Write the new post's data simultaneously in the posts list and the user's post list.
      var postData = {
        uid :vm.currentUser.uid,
        aid :newPostKey,
        author :vm.currentUser.displayName,
        title :dataArr[0].value,
        change :dataArr[1].value,
        learn :dataArr[2].value,
        content :dataArr[3].value.replace(/\n/g,"<br />"),
        time :new Date().getFullYear()+'-'+(new Date().getMonth()+1)+'-'+new Date().getDate()+' '+new Date().toLocaleTimeString(),
        changed :false
      }
      var updates = {};
      updates['/articles/' + newPostKey] = postData;
      //updates['/user-articles/' + currentUser.uid + '/' + newPostKey] = postData;

      return firebase.database().ref().update(updates);
    },
    toggle_like :function(aid){
      var vm=this
      var favorite = {}
      favorite[aid] =true
      usersRef.child(vm.currentUser.uid).child("favorite").child(aid).once('value',function(data){
        if(data.val()){
          usersRef.child(vm.currentUser.uid).child("favorite").child(aid).remove()
        }else{
          usersRef.child(vm.currentUser.uid).child("favorite").update(favorite)
        }
      })
      this.$set(this.favorite_list ,aid , this.favorite_list[aid] ?  false : true)
      console.log(this.favorite_list);
    },
    logList :function(){
      console.log(this.skill_list);
    },
    edit_article :function(a){
      $('#editArticle').modal('show')
      $('#edittitle').val(a.title)
      $('#editchange').val(a.change)
      $('#editlearn').val(a.learn)
      $('#editarticleContent').val(a.content.replace(/<br\s*\/?>/gi,'\n'))
      $('#aid').val(a.aid)
      console.log(a);
    },
    editSubmit :function(){
      var vm =this;
      var aid = $('#aid').val()
      var dataArr = $("#editForm").serializeArray();
      console.log(aid);
      var postData = {
        uid :vm.currentUser.uid,
        aid :aid,
        author :vm.currentUser.displayName,
        title :dataArr[0].value,
        change :dataArr[1].value,
        learn :dataArr[2].value,
        content :dataArr[3].value.replace(/\n/g,"<br />"),
        time :new Date().getFullYear()+'-'+(new Date().getMonth()+1)+'-'+new Date().getDate()+' '+new Date().toLocaleTimeString(),
        changed :false
      }
      console.log(aid)
      var updates = {};
      updates['/articles/' + aid] = postData;
      //updates['/user-articles/' + currentUser.uid + '/' + newPostKey] = postData;
      return firebase.database().ref().update(updates);
    },
    queryUrl :function(uid){
      window.location="profile.html?uid="+uid
    }

    // favorite :function(aid){
    //   var result =[];
    //   usersRef.child(currentUser.uid).child("favorite").child(aid).on('value',function(data){
    //     console.log(data.val())
    //     if(data.val()){
    //       result=['favorite']
    //     }else{
    //       result = [""]
    //     }
    //   })
    //   return result
    // }
  },
  computed :{
    current_skill_list :function(){
      var vm=this
      var current = []
      switch (vm.control.tab) {
        case "all" :
          current = vm.skill_list
          break
        case "star" :
          current = vm.skill_list.filter(function(a){
            return vm.favorite_list[a.aid]
          })
      }
      if(vm.control.filter && vm.control.filter.length>0){
        var filter = []
        current = current.filter(function(s){
          var search = vm.control.filter.toLowerCase()
          var title = s.title.toLowerCase()
          var change = s.change.toLowerCase()
          var learn = s.learn.toLowerCase()
          var content = s.content.toLowerCase()
          return (title.indexOf(search) > -1||change.indexOf(search) > -1||learn.indexOf(search) > -1||content.indexOf(search) > -1)
        })
      }

      return current;
    }
  },
  created :function(){
    var vm=this;
    firebase.auth().onAuthStateChanged(function (user) {
      if(user){
        vm.currentUser = user;
      }else{
        alert("您尚未登入")
      }
      usersRef.child(vm.currentUser.uid).child("favorite").once('value',function(data){
        if(data.val()){
          var fArticles = Object.keys(data.val())
          console.log(fArticles);
          for(var i=0;i<fArticles.length;i++){
             app.$set(app.favorite_list ,fArticles[i] , app.favorite_list[fArticles[i]] ?  false : true)
          }
        }
      })
    });
    var vm=this;
    articlesRef.once('value',function(data){
      var allArticles = data.val()
      var obj = $.map(allArticles, function(value, index) {
        var re = [value]
        re.reverse()
        return re;
      });
      obj = obj.reverse();
      vm.skill_list = obj
    })
  }
})
