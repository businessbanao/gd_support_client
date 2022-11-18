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
const host = "localhost"; //"54.210.61.230"; //
const port = "3500";
const baseUrl = `${protocal}://${host}:${port}/`;
/***** conf constants end *****/

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