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
	/************************** TICKET DETAIL *************************/
	/******************************************************************/
	/***** constants start *****/
	const protocal = "http";
	const host = "localhost"; //"54.210.61.230";
	const port = "3500";
	const baseUrl = `${protocal}://${host}:${port}/`;

	/***** constants end *****/

	function getParameterByName(name, url = window.location.href) {
		name = name.replace(/[\[\]]/g, '\\$&');
		var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
			results = regex.exec(url);
		if (!results) return null;
		if (!results[2]) return '';
		return decodeURIComponent(results[2].replace(/\+/g, ' '));
	}

	function getTicketbyId() {
		var ticketId = getParameterByName("ticketId");
		if (ticketId) {
			$.ajax({
				url: `${baseUrl}api/v1/admin/support/getTicket/${ticketId}`,
				type: "GET",
				success: function (data) {
					// Update status baar
					updateStatus(data.object.TicketsList[0].status);

					var ticket = data.object.TicketsList[0];
					$("#QueryDate").text(ticket.createdAt.substring(0, 10));
					$("#QueryContent").text(ticket.query);

					var docUrls = ticket.docUrl;
					for (var i = 0; i < docUrls.length; i++) {
						$("#queryAttachment").html('<img src="' + docUrls[i] + '" alt="Interior Design Work" style="height: 200px; margin-left:10px;"></img>');
						//$("#queryAttachment").html('<img src="images/query1.jpg" alt="'+Ticket Attachment+'" style="height: 200px; margin-left:10px;"></img>');
					}
				},
				error: function (error) { console.log("Error : ", `Error ${error}`); }
			});
		}
	}

	function updateStatus(status){
		switch (status) {
			case "OPEN":
				$("#open-status").removeClass("open-status");
				$("#open-status").addClass("open-status-active");				
				break;
			case "INPROGRESS":
				inprogress-status -active
				$("#inprogress-status").removeClass("inprogress-status");
				$("#inprogress-status").addClass("inprogress-status-active");
				break;
			case "CLOSED":
				closed-status -active
				$("#closed-status").removeClass("closed-status");
				$("#closed-status").addClass("closed-status-active");
				break;		
			default:
				$("#open-status").removeClass("open-status");
				$("#open-status").addClass("open-status-active");
				break;
		}
	}

	if (isAuthorised) {
		getTicketbyId();
	}

})(jQuery);