var client_id;
var type;
var callback;

window.onload = init({client_id: "e3bb863dc169557", type: "token", callback_function: ""});

function init(json) {
   client_id = json["client_id"];
   type = json["type"];
   callback = json["callback_function"];
}

function login() {
   window.open('http://api.imgur.com/oauth2/authorize?client_id=' + client_id +'&response_type=' + type);
}