function init() {
   var params = {};
   var queryString = location.hash.substring(1);
   var regex = /([^&=]+)=([^&]*)/g;
   var m;
   
   while (m = regex.exec(queryString)) {
     params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
   }
   window.opener.callBackFunction(params['access_token'])
   window.close();
}