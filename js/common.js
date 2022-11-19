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


/***** conf constants start *****/
const protocal = "http";
const host = "54.210.61.230";
// const host = "localhost";
const port = "3500";
const baseUrl = `${protocal}://${host}:${port}/`;


/************* APP constants ************/
const custId_prop = "custId";
const authToken_prop = "authToken";
const homePage_prop = "home.html";
const ticket_page_prop = "ticket.html";

const ticket_Id_prop = "ticketId";
const customer_id_prop = "customerId";

const open_status_prop = "OPEN";
const inprogress_status_prop = "INPROGRESS";
const closed_status_prop = "CLOSED";

const query_contact_prop = "query";
const call_contact_prop = "call";
const email_contact_prop = "email";

const ticket_created_toast_action_prop = "ticketCreated";
const ticket_creation_failed_toast_action_prop = "ticketCreationFailed";
const upload_img_warning_toast_action_prop = "uploadImgWarning";
const upload_img_failed_toast_action_prop = "uploadImgFailed";

const login_fail_msg_label = "Something went wrong";
const ticket_attachment_alt_label = "Ticket attachment";
const no_ticket_found_label = "No ticket found";
const admin_not_exist_err_label = "Admin does not exist.";
const attachment_warning_label = "More than 3 attachments not allowed.";





/******************************************************************/
/***************************** COMMON *****************************/
/******************************************************************/

$(document).on('click', '#logout', function(e) {
	e.preventDefault();
	localStorage.clear();
	window.location.href = "login.html";
});

if ($('.nav-menu').length) {
    var $mobile_nav = $('.nav-menu').clone().prop({
      class: 'mobile-nav d-lg-none'
    });
    $('body').append($mobile_nav);
    $('body').prepend('<button type="button" class="mobile-nav-toggle d-lg-none"><i class="icofont-navigation-menu"></i></button>');
    $('body').append('<div class="mobile-nav-overly"></div>');

    $(document).on('click', '.mobile-nav-toggle', function(e) {
      e.preventDefault();
      $('body').toggleClass('mobile-nav-active');
      $('.mobile-nav-toggle i').toggleClass('icofont-navigation-menu icofont-close');
      $('.mobile-nav-overly').toggle();
    });

    $(document).on('click', '.mobile-nav .drop-down > a', function(e) {
      e.preventDefault();
      $(this).next().slideToggle(300);
      $(this).parent().toggleClass('active');
    });

    $(document).click(function(e) {
      var container = $(".mobile-nav, .mobile-nav-toggle");
      if (!container.is(e.target) && container.has(e.target).length === 0) {
        if ($('body').hasClass('mobile-nav-active')) {
          $('body').removeClass('mobile-nav-active');
          $('.mobile-nav-toggle i').toggleClass('icofont-navigation-menu icofont-close');
          $('.mobile-nav-overly').fadeOut();
        }
      }
    });
  } else if ($(".mobile-nav, .mobile-nav-toggle").length) {
    $(".mobile-nav, .mobile-nav-toggle").hide();
  }