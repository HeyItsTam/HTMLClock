window.onload = redirect_init();

function redirect_init() {
	var str = location['hash'];
	var re = /=.[^&]*/g;
	var found = str.match(re);

	var token = found[0].replace("=", "");
	var username = found[4].replace("=", "");

	localStorage.setItem("access_token", token);
	localStorage.setItem("username", username);

	$.ajax({
		url: "https://api.imgur.com/3/account/" + username,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("Authorization", "Bearer " + token);
		},
		success: function(result) {
			console.log(result['data']['url']);
			alert("Imgur authorization for '" + result['data']['url'] + "' was successful!");
			window.close();
		},
		error: function(error) {
			console.log("Redirect error: " + error);
			window.close();
		}
	});
}