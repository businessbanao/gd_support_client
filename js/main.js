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

	/***** constants start *****/
	const protocal = "http";
	const host = "localhost"; //"54.210.61.230";
	const port = "3500";
	const baseUrl = `${protocal}://${host}:${port}/`;
	const tickerLimit = 10;
	/***** constants end *****/

	/***** variables end *****/
	let imgArr = [];
	let skipCount = 0;
	let queryType = "";
	/***** variables end *****/

	function getTickets() {
		var custId = localStorage.getItem("custId");
		var custExist = false;
		if (custId != null && custId != undefined && custId != "") { custExist = true; }

		if (custExist) {
			$.ajax({
				url: `${baseUrl}api/v1/admin/support/getTickets/${skipCount}/${tickerLimit}?customerId=${custId}`,
				type: "GET",
				success: function (data) {
					// Empty the container
					$('#queryListContainer').html('')
					var ticketArray = data.object.TicketsList.filter(e => e.contactMedium == 'query');

					if (undefined != ticketArray && ticketArray.length > 0) {
						var elm = '';
						var status;

						for (var i = 0; i < ticketArray.length; i++) {
							if ((ticketArray[i]).status == 'OPEN') { status = 'active'; }
							else if ((ticketArray[i]).status == 'INPROGRESS') { status = 'waiting'; }
							elm += '<tr>' +
								'<td class="d-flex align-items-center">' +
								'<div>';
							if ((ticketArray[i]).contactMedium == 'query') {
								elm += '<span class="listcontent">' + (ticketArray[i]).query + '</span><br>';
							}
							elm += '<span class="listcontent">' + (ticketArray[i]).updatedAt.substring(0, 10) + '</span>' +
								'</div>' +
								'</td>' +
								'<td>' +
								'<span class="' + status + '">' + (ticketArray[i]).status + '</span>' +
								'</td>' +
								'<td>' +
								'<a class="far fa-eye" style="box-shadow: 1px 1px 25px #8586b994;" href="ticket.html?ticketId=' + (ticketArray[i])._id + '"></a>' +
								'</td>';
							'</tr>';
						}
						document.getElementById('queryListContainer').insertAdjacentHTML('beforeend', elm);
					} else {
						$("#norecordfound").html('<img src="images/norecordfound.jpg" alt="Go Drazy" class="img-fluid">');
					}
				},
				error: function (error) { console.log("Error : ", `Error ${error}`); }
			});
		} else { document.getElementById('queryListContainer').insertAdjacentHTML('beforeend', "Admin does not exist."); }
	}

	function getTicketsForPage(event, pageNumber){
		skipCount = parseInt(pageNumber-1)*10;
		getTickets();
		$(".pagination a").removeClass("active")
		$(event.target).addClass("active");
	}

	function createTicket(contactMedium) {
		queryType = contactMedium;
		if(validateForm()){
			var custId = localStorage.getItem("custId");
			var formData;
			if (contactMedium == "call") {
				formData = { query: "", contactMedium: "call", status: "OPEN" };
			} else if (contactMedium == "email") {
				formData = { query: "", contactMedium: "email", status: "OPEN" };
			} else if (contactMedium == "query") {
				formData = { query:$("#query").val(), contactMedium:"query", status: "OPEN", docUrl:["333", "222", "111"] };
			}
			$.ajax({
				url: `${baseUrl}api/v1/admin/support/createTicket/${custId}`,
				type: "POST",
				data: formData,
				success: function (data, textStatus, jqXHR) {
					console.log("success");
				},
				error: function (jqXHR, textStatus, errorThrown) {
					console.log("fail");
				}
			});
		} else {
			return;
		}
	}

	function validateForm(){
		var isValid = false;
		if(queryType == "query"){
			if($("#query").val() == '') {
				$("#query").addClass("requiredField");
				$(".requiredFieldLabel").show();
				isValid = false;
			} else {
				$("#query").removeClass("requiredField");
				$(".requiredFieldLabel").hide();
				isValid = true;
			}
	
			if(($("#file")[0]).files.length > 3) {
				($("#form-message-warning")[0]).innerHTML = "More than 3 attachments not allowed.";
				$("#form-message-warning").show();
				isValid = false;
			}
		} else {
			isValid = true;
		}

		return isValid; 
	}

	function uploadImage(event) {
		if (imgArr.length > 3) {
			($("#form-message-warning")[0]).innerHTML = "More than 3 attachments not allowed.";
			$("#form-message-warning").show();
			setTimeout(() => {
				$("#form-message-warning").hide();
			}, 5000);
			//TODO :  show toaster
			return;
		} else {
			$(".loader").show();
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
					showToast();
					$(".loader").hide();
					let url = data.object.s3Url;
					imgArr.push(url);
					for (let i = 0; i < imgArr.length; i++) {
						$('<div class="attachmentBlock">'+
                        '<button type="submit" class="close" onclick="removeattachment(event)"><span>&times;</span></button>'+
                        '<img src="' + imgArr[i] + '" width="50px" style="margin-left:12px" height="50px"/>'+
                      	'</div>').appendTo("#attachmentHolder");
					}
				},
				error: function (jqXHR, textStatus, errorThrown) {
					$(".loader").hide();
				}
			});
		}
	}

	$(document).on('change', '#file', function (e) {
		uploadImage(e);
		$("#attachmentHolder").html('');
		if (($("#file")[0]).files.length > 3) {
			($("#form-message-warning")[0]).innerHTML = "More than 3 attachments not allowed.";
			$("#form-message-warning").show();
		} else {
			$("#form-message-warning").hide();
			// readURL(this);
		}
	});

	$("#upfile").click(function () {
		$("#file").trigger('click');
	});

	function removeattachment(event){
		event.target.parentElement.parentElement.remove();
	}

	$("#myToastBtn").click(function(){
		$("#myToast").toast("show");
	});

	// $(".myToastBtn").click(function(){
	// 	$("#myToast").toast("show");
	// });

	// $("#myToast").toast("hide");
	// $("#hideBtn").click(function(){
	//     $("#myToast").toast("hide");
	// });

	// $("#disposeBtn").click(function(){
	//     $("#myToast").toast("dispose");
	// });

	function showToast(){
		$("#myToast").toast("show");
	};

	$(document).ready(function () {
		getTickets();
	});

	// if (isAuthorised) {
	// 	getTickets();
	// }