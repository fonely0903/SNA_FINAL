//firebase
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
var store       = firebase.storage();
var storeRef    = store.ref();
var currentUser
var pageUid = {};

$(window).ready(function(){
  var query = location.search.substr(1);
  query.split("&").forEach(function(part) {
    var item = part.split("=");
    pageUid= decodeURIComponent(item[1]);
  });
  console.log(pageUid);
})

firebase.auth().onAuthStateChanged(function(user) {
  currentUser = firebase.auth().currentUser;
	if(user){
    // window.location = '/profile.html'
		// $('.userName').text(user.displayName)
    var currentUid = currentUser.uid
    usersRef.once('value',function(snapShot){
      var userInfo = snapShot.val()[pageUid].userInfo

      //初次登入填表單
      if(userInfo == undefined){
        console.log("nice");
        $('#firstLogin').modal({
          backdrop: 'static',
          keyboard: false
        })
        $('#infoForm').submit(function(){
          var name = $('#yourName').val()
          var change = $('#youCanChange').val().split(" ")
          var learn = $('#youWantLearn').val().split(" ")
          var aboutYou = $('#aboutYou').val()
          usersRef.child(currentUid).update({
            "userInfo":{
              "name": name,
              "youCanChange": change,
              "youWantLearn": learn,
              "aboutYou": aboutYou
            }
          })
        })
      }
      //顯示資料
      $('.userName').text(userInfo.name)
      $('.mid-left-content').html(userInfo.aboutYou.replace(/\n/g,"<br />"))
      $('.change-content').text(userInfo.youCanChange)
      $('.learn-content').text(userInfo.youWantLearn)
    })
}else{
  alert("您尚未登入")
}
})
//上傳作品
$('.test-btn').click(function(){
  window.location.search="uid="+currentUser.uid
})
var localFileVideoPlayer =function(){
	'use strict'
  var URL = window.URL || window.webkitURL
  var displayMessage = function (message, isError) {
    var element = document.querySelector('#message')
    element.innerHTML = message
    element.className = isError ? 'error' : 'info'
  }
  var playSelectedFile = function (event) {
    var file = this.files[0]
    var type = file.type
    var videoNode = document.querySelector('video')
    // var canPlay = videoNode.canPlayType(type)
    // if (canPlay === '') canPlay = 'no'
    // var message = 'Can play type "' + type + '": ' + canPlay
    // var isError = canPlay === 'no'
    // displayMessage(message, isError)

    // if (isError) {
    //   return
    // }

    var fileURL = URL.createObjectURL(file)
    videoNode.src = fileURL
  }
  var inputNode = document.querySelector('input')
  inputNode.addEventListener('change', playSelectedFile, false)
}

//中間捲軸動畫
$('.message').hover(function(){
	$('.message-text').css('opacity',1);
},function(){
	$('.message-text').css('opacity',0)
})

$('.mid-left-btn').click(function(){
	$('.mid-left').animate({marginLeft:"0"},{duration:500,queue:false})
	$('.mid-right').animate({marginRight:"-100%"},{duration:100,queue:false})
	$('.mid-left-btn').animate({left:"100%"},{duration:500,queue:false})
	$('.mid-right-btn').animate({right:"0"},{duration:100,queue:false})
	// setTimeout(function(){$('.mid-right-btn').css('display','block')},1000)
	$('.mid-right-btn').delay(850).fadeIn("slow")
	setTimeout(function(){$('.mid-left-btn').css('display','none')},1000)

})

$('.mid-right-btn').click(function(){
	$('.mid-right-btn').animate({right:"100%"},{duration:100,queue:false})
	$('.mid-left-btn').animate({left:"0"},{duration:100,queue:false})
	$('.mid-right').animate({marginRight:"0"},{duration:500,queue:false})
	$('.mid-left').animate({marginLeft:"-100%"},{duration:100,queue:false})
	$('.mid-left-btn').delay(500).fadeIn("slow")
	setTimeout(function(){$('.mid-right-btn').css('display','none')},1000)
})
