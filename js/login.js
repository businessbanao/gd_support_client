
	/******************************************************************/
	/************************* common code ****************************/
	/******************************************************************/

	var authToken_val = localStorage.getItem("authToken");
	var isAuthorised = (authToken_val != null && authToken_val != "" && authToken_val != undefined) ? true : false;
	if ((window.location.href).includes('login.html')) {
		if (isAuthorised) { window.location.href = "home.html"; }
	} else {
		if (!isAuthorised) { window.location.href = "login.html"; }
	}

	/******************************************************************/
	/***************************** LOGIN ******************************/
	/******************************************************************/

	/***** constants start *****/
	const protocal = "http";
	const host = "54.210.61.230";
	const port = "3500";
	const baseUrl = `${protocal}://${host}:${port}/`;


	const custId = "custId";
	const authToken = "authToken";
	const homePage = "home.html";
	/***** constants end *****/

	$("#loginbtn").click(function (event) {
		event.preventDefault();
		login($("#email").val(), $("#password").val());
	});

	$("#errorMsg").click(function () {
		$("#errorMsg").hide(2000);
	});

	function login(emailId, pass) {
		var formData = { email: emailId, password: pass };
		$.ajax({
			url: `${baseUrl}api/v1/admin/loginAdmin`,
			type: "POST",
			data: formData,
			success: function (data, textStatus, jqXHR) {
				if (!data.error) {
					localStorage.setItem(`${custId}`, data.object.AdminDetails._id);
					localStorage.setItem(`${authToken}`, data.object.authToken);
					window.location.href = `${homePage}`;
				} else if (data.error) {
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

	function myFunction() {
		var x = document.getElementById("password");
		if (x.type === "password") {
		  x.type = "text";
		} else {
		  x.type = "password";
		}
	  }