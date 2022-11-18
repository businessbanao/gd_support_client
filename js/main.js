	/******************************************************************/
	/***************************** HOME ******************************/
	/******************************************************************/

	/***** constants start *****/
	const ticketLimit = 10;
	const pageBatchSize = 5;
	/***** constants end *****/

	/***** variables end *****/
	let imgArr = [];
	let queryType = "";
	/***** variables end *****/

	function getTickets(skipCount) {
		var custId = localStorage.getItem("custId");
		var custExist = false;
		if (custId != null && custId != undefined && custId != "") { custExist = true; }

		if (custExist) {
			$.ajax({
				url: `${baseUrl}api/v1/admin/support/getTickets/${skipCount}/${ticketLimit}?customerId=${custId}`,
				type: "GET",
				success: function (data) {
					// Empty the container
					$('#queryListContainer').html('');
					$("#norecordfound img").remove();
					$(".noOfRecords").show();

					var ticketArray = data.object.TicketsList.filter(e => e.contactMedium == 'query');

					if (undefined != ticketArray && ticketArray.length > 0) {
						var elm = '';
						var status;

						for (var i = 0; i < ticketArray.length; i++) {
							elm = '';
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
							document.getElementById('queryListContainer').insertAdjacentHTML('beforeend', elm);
						}
						$("#outOfTickets").text((skipCount+10));
						$("#totalTicket").text(data.object.totalTickets);
						if(skipCount == 0){
							updatePageNo(skipCount);
						}

					} else {
						$(".noOfRecords").hide();
						$("#norecordfound").html('<img src="images/norecordfound.jpg" alt="Go Drazy" class="img-fluid">');
					}
				},
				error: function (error) { console.log("Error : ", `Error ${error}`); }
			});
		} else { document.getElementById('queryListContainer').insertAdjacentHTML('beforeend', "Admin does not exist."); }
	}

	function getTicketsForPage(event, pageNumber){
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
			var custId = localStorage.getItem("custId");
			var formData;
			if (contactMedium == "call") {
				formData = { query: "", contactMedium: "call", status: "OPEN" };
			} else if (contactMedium == "email") {
				formData = { query: "", contactMedium: "email", status: "OPEN" };
			} else if (contactMedium == "query") {
				formData = { query:$("#query").val(), contactMedium:"query", status: "OPEN", docUrl:imgArr };
			}
			$.ajax({
				url: `${baseUrl}api/v1/admin/support/createTicket/${custId}`,
				type: "POST",
				data: formData,
				success: function (data, textStatus, jqXHR) {
					showToast("ticketCreated", data.object.Message, data.object.ticket._id);
				},
				error: function (jqXHR, textStatus, errorThrown) {
					showToast("ticketCreationFailed", "", "");
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
			showToast("uploadImgWarning","","");
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
					showToast("uploadImgFailed", "", "");					
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

	function showToast(actionResp, toastMessage, ticketId){
		if(actionResp == "ticketCreated"){
			document.getElementById("createQuerySuccessToast").style.zIndex = "10000";
			$("#createQuerySuccessToastmessage").text(toastMessage);
			$("#createQuerySuccessToastClick").attr("href", "ticket.html?ticketId="+ticketId);
			$("#createQuerySuccessToast").toast("show");
		} else if(actionResp == "ticketCreationFailed"){
			document.getElementById("createQueryFailToast").style.zIndex = "10000";
			$("#createQueryFailToast").toast("show");
		} else if(actionResp == "uploadImgWarning"){
			document.getElementById("uploadImgWarningToast").style.zIndex = "10000";
			$("#uploadImgWarningToast").toast("show");
		} else if(actionResp == "uploadImgFailed"){
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

		var elm = isFirstPage ? "" : `<a href="#" onclick="getNextBatch(event, ${skipLeft})">&laquo;</a>`;
		for(var i=firstPage; i<=lastPage; i++){
			console.log("page : " + i);
			activeClass = i == currentPage ? "active" : ""; 
			elm += `<a href="#" onclick="getTicketsForPage(event, ${i})" class="${activeClass}">${i}</a>`;
		}
		elm += isLastPage ? "" : `<a href="#" onclick="getNextBatch(event, ${skipRight})">&raquo;</a>`;

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