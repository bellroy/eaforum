(function ($) {

$(document).ready(function() {
  /* reposition elements for CFEA reskin */

  // login button
  $("#side-login form button").attr("id", "loginbutton");
  $("#side-login form button").text("Log in / Sign Up");
  $form = $("<form id=\"loginForm\" action=\"/post/login\"></form>");
  $form.appendTo("#header");
  $("#side-login form button").appendTo("#loginForm");

  // username
  $("#side-status h2").appendTo("#header");
  // karma
  $("#side-status div.userinfo span.score").appendTo("#header");
  $("#side-status div.userinfo span.monthly-score").appendTo("#header");
  // logout
  $("#side-status ul.userlinks a[href$='/logout/']").attr("id", "signout");
  $("#side-status ul.userlinks a[href$='/logout/']").text("sign out");
  $("#side-status ul.userlinks a[href$='/logout/']").appendTo("#header");
  // search
  $("#side-search").appendTo("#header");

  // filter nav
  var navDivId = "#nav";
  if ($("#filternav").length > 0) {
    $("#filternav li:first-child a").text("New");
    $("#nav").hide();

    navDivId = "#filternav";
  }
  $navBar = $("<div id=\"navbar\"></div>");
  $navBar.prependTo("#main");
  $(navDivId).prependTo("#navbar");

  // new article
  $("#side-status ul.userlinks a[href$='/submit/']").text("New Article");
  $("#side-status ul.userlinks a[href$='/submit/']").attr("id", "newarticle");
  $("#side-status ul.userlinks a[href$='/submit/']").appendTo("#navbar");
  // messages
  $("#side-status div.userinfo span.mail a").text("Messages");
  $("#side-status div.userinfo span.mail").attr("id", "messages");
  $("#side-status div.userinfo span.mail").appendTo("#navbar");
  // preferences
  $("#side-status ul.userlinks a[href$='/prefs/']").attr("id", "preferences");
  $("#side-status ul.userlinks a[href$='/prefs/']").appendTo("#navbar");

  /* Dropdowns in main menu */
  dropdownSel = 'ul#nav li img.dropdown';
  $(dropdownSel).click(function(e) {
    var ul = $(this).next('ul');
    var isVisible = $(ul).is(':visible');

    /* Hide all dropdowns */
    $(dropdownSel).next('ul').hide();

    /* If it wasn't visible initially, show it */
    if (!isVisible)
      ul.show();

    /* Register for any clicks to close the dropdown */
    $(document).one("click", function() {
      $(ul).hide();
    });

    return false;
  });

  // Post filter control
  $('#post-filter div.filter-active').click(function() {
    $(this).toggleClass('open');
    $(this).next('div.filter-options').toggle();
    return false;
  });

  // Comment filter control
  $('#comment-controls div.filter-active').click(function() {
    $(this).toggleClass('open');
    $(this).next('div.filter-options').toggle();
    return false;
  });

  function isiPhone() {
    return ((navigator.platform.indexOf("iPhone") != -1) ||
            (navigator.platform.indexOf("iPod") != -1) ||
            (navigator.platform.indexOf("iPad") != -1));
  };

  /* Don't do qtip tooltips with iphones (and related), it seems to interfer with the
     normal onclick behaviour */
  if (!isiPhone()) {
    // Button tooltips
    $('div.tools div.vote a, div.tools div.boxright a.edit, div.tools div.boxright a, \
       div.comment-links ul li a, \
       .userinfo .score, .userinfo .monthly-score, .votes').qtip({
      position: {
        my: 'bottom center',
        at: 'top center'
      },
      style: {
        classes: 'ui-tooltip-lesswrong',
        tip: {
	  border: 0,
	  corner: 'bottom center',
	  height: 7, /* If you adjust this, you must change qtip-tip-ie.gif to the same size */
	  width: 10 /* If you adjust this, you must change qtip-tip-ie.gif to the same size */
        }
      }
    });
  }
});

})(jQuery);
