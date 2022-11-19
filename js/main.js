	/******************************************************************/
	/***************************** HOME ******************************/
	/******************************************************************/

	/***** constants start *****/
	const ticketLimit = 10;
	const pageBatchSize = 5;

	/***** variables *****/
	let imgArr = [];
	let queryType = "";

	function getTickets(skipCount) {
		var custId = localStorage.getItem(custId_prop);
		var custExist = false;
		if (custId != null && custId != undefined && custId != "") { custExist = true; }

		if (custExist) {
			$.ajax({
				url: `${baseUrl}api/v1/admin/support/getTickets/${skipCount}/${ticketLimit}?${customer_id_prop}=${custId}`,
				type: "GET",
				success: function (data) {
					// Empty the container
					$('#queryListContainer').html('');
					$("#norecordfound img").remove();
					$(".noOfRecords").show();

					var ticketArray = data.object.TicketsList.filter(e => e.contactMedium == query_contact_prop);

					if (undefined != ticketArray && ticketArray.length > 0) {
						var elm = '';
						var status_class;

						for (var i = 0; i < ticketArray.length; i++) {
							elm = '';
							if ((ticketArray[i]).status == open_status_prop) { status_class = 'active'; }
							else if ((ticketArray[i]).status == inprogress_status_prop) { status_class = 'waiting'; }
							elm += '<tr>' +
								'<td class="d-flex align-items-center">' +
								'<div>';
							if ((ticketArray[i]).contactMedium == query_contact_prop) {
								elm += '<span class="listcontent">' + (ticketArray[i]).query + '</span><br>';
							}
							elm += '<span class="listcontent">' + (ticketArray[i]).updatedAt.substring(0, 10) + '</span>' +
								'</div>' +
								'</td>' +
								'<td>' +
								'<span class="' + status_class + '">' + (ticketArray[i]).status + '</span>' +
								'</td>' +
								'<td>' +
								'<a class="far fa-eye" style="box-shadow: 1px 1px 25px #8586b994;" href="ticket.html?'+ticket_Id_prop+'=' + (ticketArray[i])._id + '"></a>' +
								'</td>';
							'</tr>';
							document.getElementById('queryListContainer').insertAdjacentHTML('beforeend', elm);
						}
						$("#outOfTickets").text((skipCount+10) > parseInt(data.object.totalTickets) ? data.object.totalTickets : (skipCount+10));
						$("#totalTicket").text(data.object.totalTickets);
						if(skipCount == 0){
							updatePageNo(skipCount);
						}

					} else {
						$(".noOfRecords").hide();
						$("#norecordfound").html('<img src="images/norecordfound.jpg" alt="'+no_ticket_found_label+'" class="img-fluid">');
					}
				},
				error: function (error) { console.log("Error : ", `Error ${error}`); }
			});
		} else { document.getElementById('queryListContainer').insertAdjacentHTML('beforeend', admin_not_exist_err_label); }
	}

	function getTicketsForPage(event, pageNumber){
		event.preventDefault();
		skipCount = parseInt(pageNumber-1)*10;
		getTickets(skipCount);
		$(".pagination a").removeClass("active");
		if(event != undefined){
			$(event.target).addClass("active");
		}

	}

	function createTicket(contactMedium) {
		queryType = contactMedium;
		if(validateForm()){
			var custId = localStorage.getItem(custId_prop);
			var formData = {};
			if (contactMedium == call_contact_prop) {
				formData = { query: "", contactMedium: call_contact_prop, status: open_status_prop };
			} else if (contactMedium == email_contact_prop) {
				formData = { query: "", contactMedium: email_contact_prop, status: open_status_prop };
			} else if (contactMedium == query_contact_prop) {
				formData = { query:$("#query").val(), contactMedium: query_contact_prop , status: open_status_prop, docUrl:imgArr };
			}
			$.ajax({
				url: `${baseUrl}api/v1/admin/support/createTicket/${custId}`,
				type: "POST",
				data: JSON.stringify(formData),
				contentType: "application/json; charset=utf-8",
				success: function (data, textStatus, jqXHR) {
					if (contactMedium == query_contact_prop){
						showToast(ticket_created_toast_action_prop);
						getTickets(0);
					}
				},
				error: function (jqXHR, textStatus, errorThrown) {
					showToast(ticket_creation_failed_toast_action_prop);
				}
			});
		} else {
			return;
		}
	}

	function validateForm(){
		var isValid = false;
		if(queryType == query_contact_prop){
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
				($("#form-message-warning")[0]).innerHTML = attachment_warning_label;
				$("#form-message-warning").show();
				isValid = false;
			}
		} else {
			isValid = true;
		}

		return isValid; 
	}

	function uploadImage(event) {
		if (imgArr.length >= 3) {
			showToast(upload_img_warning_toast_action_prop);
			return;
		} else {
			$(".loader").show();
			let authorizationToken = localStorage.getItem(authToken_prop) || ''
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
					$(".loader").hide();
					let url = data.object.s3Url;
					imgArr.push(url);
					$('<div class="attachmentBlock float-child-element">'+
					'<button type="submit" class="close" onclick="removeattachment(event)"><span>&times;</span></button>'+
					'<img src="' + url + '" width="50px" style="margin-left:12px" height="50px"/>'+
					'</div>').appendTo("#attachmentHolder");
				},
				error: function (jqXHR, textStatus, errorThrown) {
					$(".loader").hide();
					showToast(upload_img_failed_toast_action_prop);					
				}
			});
		}
	}

	$(document).on('change', '#file', function (e) {
		uploadImage(e);
	});

	$("#upfile").click(function () {
		$("#file").trigger('click');
	});

	function removeattachment(event){
		var imgUrl = event.target.parentElement.parentElement.childNodes[1].src;
		for(var i=0; i<imgArr.length; i++){
			if(imgArr[i] == imgUrl){
				imgArr.pop(imgUrl);
			}
		}
		event.target.parentElement.parentElement.remove();
	}

	function showToast(actionResp){
		if(actionResp == ticket_created_toast_action_prop){
			document.getElementById("createQuerySuccessToast").style.zIndex = "10000";
			$("#createQuerySuccessToast").toast("show");
		} else if(actionResp == ticket_creation_failed_toast_action_prop){
			document.getElementById("createQueryFailToast").style.zIndex = "10000";
			$("#createQueryFailToast").toast("show");
		} else if(actionResp == upload_img_warning_toast_action_prop){
			document.getElementById("uploadImgWarningToast").style.zIndex = "10000";
			$("#uploadImgWarningToast").toast("show");
		} else if(actionResp == upload_img_failed_toast_action_prop){
			document.getElementById("uploadImgFailToast").style.zIndex = "10000";
			$("#uploadImgFailToast").toast("show");
		}
	};

	function closeToast(event){
		(event.target.parentElement.parentElement).style.zIndex = -1;
	}

	function updatePageNo(skipCount){
		var isLastPage = false;
		var isFirstPage = false;

		var totalTickets = parseInt($("#totalTicket").text());
		var totalPages = Math.trunc(totalTickets/10) + (totalTickets%10 > 0 ? 1 : 0);
		var activeClass = "";
		
		var currentPage = (skipCount/10)+1;
		var firstPage = currentPage < pageBatchSize ? 1 : (Math.trunc(currentPage/pageBatchSize)*pageBatchSize)+1;
		var lastPage = currentPage < pageBatchSize ? pageBatchSize : (firstPage + pageBatchSize) - 1;

		var skipLeft = ((firstPage*10)-10)-(pageBatchSize*10);
		skipLeft = skipLeft < 0 ? 0 : skipLeft;
		var skipRight = lastPage*10;		

	
		if(lastPage >= totalPages){
			isLastPage = true;
			lastPage = totalPages; 
		}
		if(firstPage == 1){
			isFirstPage = true;
		}

		var elm = isFirstPage ? `<a href="#" style="pointer-events: none;">&laquo;</a>` : `<a href="#" onclick="getNextBatch(event, ${skipLeft})">&laquo;</a>`;
		for(var i=firstPage; i<=lastPage; i++){
			activeClass = i == currentPage ? "active" : ""; 
			elm += `<a href="#" onclick="getTicketsForPage(event, ${i})" class="${activeClass}">${i}</a>`;
		}
		elm += isLastPage ? `<a href="#" style="pointer-events: none;">&raquo;</a>` : `<a href="#" onclick="getNextBatch(event, ${skipRight})">&raquo;</a>`;

		$("#paginationContainer").html(elm);

	}

	function getNextBatch(event, batchSkipCount){
		event.preventDefault();
		getTickets(batchSkipCount);
		updatePageNo(batchSkipCount);
	}

	$(document).ready(function () {
		getTickets(0);
	});