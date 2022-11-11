!(function ($) {

	/******************************************************************/
	/************************* common code ****************************/
	/******************************************************************/
	var authToken = localStorage.getItem("authToken");
	var isAuthorised = (authToken != null && authToken != "" && authToken != undefined) ? true : false;
	if ((window.location.href).includes('login.html')) {
		if (isAuthorised) { window.location.href = "home.html"; }
	} else {
		if (!isAuthorised) { window.location.href = "login.html"; }
	}

	/******************************************************************/
	/***************************** HOME ******************************/
	/******************************************************************/

	const baseUrl = "http://54.210.61.230:3500/";
	function getTickets() {
		var custId = localStorage.getItem("custId");
		var custExist = false;
		if (custId != null && custId != undefined && custId != "") { custExist = true; }

		if (custExist) {
			$.ajax({
				url: `${baseUrl}api/v1/admin/support/getTickets?customerId1=${custId}`,
				type: "GET",
				success: function (data) {
					var myStringArray = data.object.TicketsList.filter(e => e.contactMedium == 'query');

					if (myStringArray) {
						var elm = '';
						var status;

						for (var i = 0; i < myStringArray.length; i++) {
							if ((myStringArray[i]).status == 'OPEN') { status = 'active'; }
							else if ((myStringArray[i]).status == 'INPROGRESS') { status = 'waiting'; }
							elm += '<tr>' +
								'<td class="d-flex align-items-center">' +
								'<div>';
							if ((myStringArray[i]).contactMedium == 'query') {
								elm += '<span class="listcontent">' + (myStringArray[i]).query + '</span><br>';
							}
							elm += '<span class="listcontent">' + (myStringArray[i]).updatedAt.substring(0, 10) + '</span>' +
								'</div>' +
								'</td>' +
								'<td>' +
								'<span class="' + status + '">' + (myStringArray[i]).status + '</span>' +
								'</td>' +
								'<td>' +
								'<a class="far fa-eye" href="ticket.html?ticketId=' + (myStringArray[i])._id + '"></a>' +
								'</td>';
							'</tr>';
						}
						document.getElementById('queryListContainer').insertAdjacentHTML('beforeend', elm);
					}
				},
				error: function (error) { console.log("Error : ", `Error ${error}`); }
			});
		} else { document.getElementById('queryListContainer').insertAdjacentHTML('beforeend', "Admin does not exist."); }
	}

	function createTicket(contactMedium) {
		if (($("#file")[0]).files.length > 3) {
			($("#form-message-warning")[0]).innerHTML = "More than 3 attachments not allowed.";
			$("#form-message-warning").show();
		} else {
			var custId = localStorage.getItem("custId");
			var formData;
			var isCreated = false;
			if (contactMedium == "call") {
				formData = { query: "", contactMedium: "call", status: "OPEN", docUrl: "" };
			} else if (contactMedium == "email") {
				formData = { query: "", contactMedium: "email", status: "OPEN", docUrl: "" };
			} else if (contactMedium == "query") {
				var custQuery = $("#query").val();
				formData = { query: custQuery, contactMedium: "query", status: "OPEN", docUrl: imgArr };
			}
			$.ajax({
				url: `${baseUrl}api/v1/admin/support/createTicket/${custId}`,
				type: "POST",
				data: formData,
				success: function (data, textStatus, jqXHR) {
					// if (contactMedium == "query") {
					// 	$("#form-message-success").show();
					// 	$("#form-message-success").hide(5000);
					// }
					// isCreated = true;

					alert("Ticket created successfully");
					// show toaster
				},
				error: function (jqXHR, textStatus, errorThrown) {
					// if (contactMedium == "query") {
					// 	$("#form-message-warning").show();
					// 	$("#form-message-warning").hide(5000);
					// }
					// isCreated = false;

					// show toaster
				}
			});
		}
	}


	let imgArr = [];
	function uploadImage(event) {

		if (imgArr.length > 2) {
			// ($("#form-message-warning")[0]).innerHTML = "More than 3 attachments not allowed.";
			// $("#form-message-warning").show();
			// setTimeout(() => {
			// 	$("#form-message-warning").hide();
			// }, 5000);


			// show toaster
			alert("More than 3 attachments not allowed.");
			return
		}

		let authorizationToken = localStorage.getItem("authToken") || ''
		let fileObj = event.target.files ? event.target.files[0] : {};

		let formData = new FormData();
		formData.append("photo", fileObj);

		$.ajax({
			url: `${baseUrl}api/v1/Admin/saveAllImages`,
			type: "POST",
			beforeSend: function (request) {
				request.setRequestHeader("__authorization_x_token", authorizationToken);
			},
			data: formData,
			cache: false,
			contentType: false,
			processData: false,
			success: function (data, textStatus, jqXHR) {

				let url = data.object.s3Url;

				imgArr.push(url)



				for (let i = 0; i < imgArr.length; i++) {
					$('<img src="' + imgArr[i] + '" id="profile-img-tag" width="50px" style="margin-left:12px" height="50px"/>').appendTo("#attachmentHolder");
				}

				// ($("#attachmentHolder")[0]).innerHTML = "More than 3 attachments not allowed.";

				alert('sucess');
			},
			error: function (jqXHR, textStatus, errorThrown) {
				alert('error');
			}
		});
	}


	$(document).on('click', '.createQuery', function (e) {
		var contactMedium = $(this).data("type");
		createTicket(contactMedium);
	});

	$(document).on('change', '#file', function (e) {
		uploadImage(e)
		$("#attachmentHolder").html('');
		if (($("#file")[0]).files.length > 3) {
			($("#form-message-warning")[0]).innerHTML = "More than 3 attachments not allowed.";
			$("#form-message-warning").show();
		} else {
			$("#form-message-warning").hide();
			// readURL(this);
		}
	});



	if (isAuthorised) {
		getTickets();
	}

})(jQuery);