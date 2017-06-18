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
var chatsRef    = db.ref("chats");
var usersRef    = db.ref("users");
var store       = firebase.storage();
var storeRef    = store.ref();
var currentUser;
var clickedUser;
var historyUID;
var historyUsers = [];
var usersLastMessage = []; 

firebase.auth().onAuthStateChanged(function (user) {
  if(user){
    currentUser = user;
    console.log(currentUser.uid);

getUsersID();
    

  }else{
    alert("您尚未登入")
  }
});

function getUsersID() {

	   $.get( "https://sna-final.firebaseio.com/chats/"+currentUser.uid+".json?shallow=true", function( data ) {
 historyUID = Object.keys(data)
 getUsersInfo(historyUID)	
})
}

function getUsersInfo(historyUID) {
	for(i = 0 ;i < historyUID.length; i++){
		//console.log(historyUID[i]);
		usersRef.child(historyUID[i]).child("userData").once('value').then(function(snapshot) {
			if(null != snapshot.val()){
			historyUsers.push(snapshot.val());


			var rone = $("<div></div>").addClass('recent-one');
			var ronel = $("<div></div>").addClass('recent-one__logo');
			var ronei = $("<div></div>").addClass('recent-one__img');
			var img = $("<img/>").attr("src", snapshot.val().photoURL);
			ronei.append(img);
			ronel.append(ronei);
			rone.append(ronel);
			var roneb = $("<div></div>").addClass('recent-one');
			var roneh = $("<div></div>").addClass('recent-one');
			var ronen = $("<div></div>").addClass('recent-one__name').text(snapshot.val().displayName);
			roneh.append(ronen);
			roneb.append(roneh);
			rone.append(roneb);

			$('.recent-friends').prepend(rone);
			leftClickFun();
			}
  		// var username = snapshot.val().displayName;
  		})
	}
	console.log(historyUsers);
	refreshLeftUsers(historyUsers);	
}

function refreshLeftUsers(historyUsers){
	console.log(historyUsers.length);
	for(i = 0 ;i < historyUsers.length; i++){
		console.log(i);
		var recentPostsRef = myChatsRef.child(historyUsers[i].uid).limitToLast(1);
		recentPostsRef.once('value').then(function(snapshot) {
			console.log(snapshot.value);
		})
	}	
}

function leftClickFun(){
$('.recent-one').click(function(o){
	console.log("recent");
	$('.recent-one__active').removeClass('recent-one__active');
		$(this).addClass('recent-one__active')

		//TODO setUserName
		var name = $(this).find('.recent-one__name').text();
		$('.messenger__user-name').text(name);

		$('.messenger__list').empty();
		//TODO add messenger


// 		var commentsRef = myChatsRef.child("");
// commentsRef.on('child_added', function(data) {
//   addCommentElement(postElement, data.key, data.val().text, data.val().author);
// });
	})
}

console.log("js loaded")
$('#send_bt').click(function(){
 
var myChatsRef    = chatsRef.child(currentUser.uid);

       var dataArr = $("#articleForm").serializeArray();
     
      var postData = {
        meSend :true,
        message : "hi there",
        time :new Date().getFullYear()+'-'+(new Date().getMonth()+1)+'-'+new Date().getDate()+' '+new Date().getHours()+':'+new Date().getMinutes(),
      }

      var newPostKey = myChatsRef.child('101').push().key;
console.log(newPostKey);
      var updates = {};
      updates['/101/' + newPostKey] = postData;
      myChatsRef.update(updates)
		

	  newPostKey = chatsRef.child(currentUser.uid).push().key;

      postData.meSend = false;
      var updates2 = {};
      updates2['/'+'101'+'/' + currentUser.uid + '/' + newPostKey] = postData;
      chatsRef.update(updates2)
      console.log("sended");
 return;

})

leftClickFun();