	/******************************************************************/
	/************************** TICKET DETAIL *************************/
	/******************************************************************/

	function getParameterByName(name, url = window.location.href) {
		name = name.replace(/[\[\]]/g, '\\$&');
		var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
			results = regex.exec(url);
		if (!results) return null;
		if (!results[2]) return '';
		return decodeURIComponent(results[2].replace(/\+/g, ' '));
	}

	function getTicketbyId() {
		var ticketId = getParameterByName(ticket_Id_prop);
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
						$("#queryAttachment").html('<img src="' + docUrls[i] + '" alt="'+ticket_attachment_alt_label+'" style="height: 200px; margin-left:10px;"></img>');
					}
				},
				error: function (error) { console.log("Error : ", `Error ${error}`); }
			});
		}
	}

	function updateStatus(status){
		switch (status) {
			case open_status_prop:
				$("#open-status").removeClass("open-status");
				$("#open-status").addClass("open-status-active");				
				break;
			case inprogress_status_prop:
				$("#inprogress-status").removeClass("inprogress-status");
				$("#inprogress-status").addClass("inprogress-status-active");
				break;
			case closed_status_prop:
				$("#closed-status").removeClass("closed-status");
				$("#closed-status").addClass("closed-status-active");
				break;		
			default:
				$("#open-status").removeClass("open-status");
				$("#open-status").addClass("open-status-active");
				break;
		}
	}

	$(document).ready(function () {
		getTicketbyId();
	});