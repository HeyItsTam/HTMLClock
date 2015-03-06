var client_id;
var type;
var callback;

window.onload = init({client_id:"e3bb863dc169557", type:"token", callback_function:"callBackFunction" });

function init(json) {
   client_id = json["client_id"];
   type = json["type"];
   callback = json["callback_function"];
}

function login() {
   $.ajax({
      url: "https://api.imgur.com/oauth2/authorize?client_id=" + client_id + "&response_type=" + type + "&state=1234&callback=" + callback,
      type: "GET",
      dataType: "text",
      success: function(string) {
         window.open("https://api.imgur.com/oauth2/authorize?client_id=" + client_id + "&response_type=" + type + "&state=1234");
         console.log("Authorization Success!");
      },
      error: function(xhr, status, errorThrown) {
         console.log("Error: login");
         alert(errorThrown);
      }
   });
}

function callBackFunction(token) {
   $.ajax({
      url: "https://api.imgur.com/3/account/me/",
      type: "GET",
      beforeSend: function (xhr) {
          xhr.setRequestHeader ("Authorization", "Bearer " + token);
      },
      dataType: "json",
      success: function(string) {
         console.log(string["data"]["url"]);
         alert('Welcome ' +  string["data"]["url"]);
      },
      error: function(xhr, status, errorThrown) {
         console.log("Error: callback");
         console.log(errorThrown);
         alert(errorThrown);
      }
   });
}