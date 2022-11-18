
	/******************************************************************/
	/***************************** LOGIN ******************************/
	/******************************************************************/

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
					localStorage.setItem(`${custId_prop}`, data.object.AdminDetails._id);
					localStorage.setItem(`${authToken_prop}`, data.object.authToken);
					window.location.href = `${homePage_prop}`;
				} else if (data.error) {
					($("#errorMsg")[0]).innerHTML = data.object.msg;
					$("#errorMsg").show();
				}
			},
			error: function (jqXHR, textStatus, errorThrown) {
				($("#errorMsg")[0]).innerHTML = login_fail_msg_label;
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