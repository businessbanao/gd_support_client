!(function($) {

/******************************************************************/
/************************* common code ****************************/
/******************************************************************/	

var authToken = localStorage.getItem("authToken");
var isAuthorised = (authToken != null && authToken != "" && authToken != undefined) ? true : false; 
if((window.location.href).includes('login.html')){
	if(isAuthorised){ window.location.href = "home.html"; }
} else {
	if(!isAuthorised){ window.location.href = "login.html"; }
}

/******************************************************************/
/***************************** LOGIN ******************************/
/******************************************************************/

	$("#loginbtn").click(function(event){
		event.preventDefault();
		login($("#email").val(), $("#password").val());
	});	
	
	$("#errorMsg").click(function(){
		$("#errorMsg").hide(2000);
	});
	
	function login(emailId, pass) {
		var formData = { email:emailId, password: pass };						
		$.ajax({
			url : "http://localhost:3500/api/v1/admin/loginAdmin",
			type: "POST",
			data : formData,
			success: function(data, textStatus, jqXHR) {
				if(!data.error){
					localStorage.setItem("custId", data.object.AdminDetails._id);
					localStorage.setItem("authToken", data.object.authToken);
					window.location.href = "home.html";
				} else if(data.error){
					($("#errorMsg")[0]).innerHTML = data.object.msg;					
					$("#errorMsg").show();
				}
			},
			error: function (jqXHR, textStatus, errorThrown) {
				($("#errorMsg")[0]).innerHTML = "Something went wrong";
				$("#errorMsg").show();
			}
		});
	}

})(jQuery);