(function ($) {

$(document).ready(function() {
  /* reposition elements for CFEA reskin */

  var userInfo = $('<div id="user-info">');
  var pathname = window.location.pathname;
  if (logged) {
    // username - using last child so when viewing another user their details
    // stay in right box
    $("#side-status h2").last().appendTo(userInfo);
    // karma
    $("#side-status div.userinfo span.score").last().appendTo(userInfo);
    $("#side-status div.userinfo span.monthly-score").last().appendTo(userInfo);
    // logout
    $("#side-status ul.userlinks a[href$='/logout/']").attr("id", "signout");
    $("#side-status ul.userlinks a[href$='/logout/']").text("sign out");
    $("#side-status ul.userlinks a[href$='/logout/']").appendTo(userInfo);

  }
  // search
  $("#sidebar #side-search").appendTo("#header");
  // Add user info to header
  $("#header").append(userInfo);

  // filter nav
  var navDivId = "#nav";
  if ($("#filternav").length > 0) {
    $("#filternav li:first-child a").text("New");
    $("#nav").hide();

    navDivId = "#filternav";
  }
  $navBar = $("<div id=\"navbar\" class=\"clear\"></div>");
  $navBar.prependTo("#main");
  $(navDivId).prependTo("#navbar");

  // if user is checking their messages, add the return to forum button
  if (/^\/message\/.*/.test(pathname) || /^\/user\//.test(pathname)) {
    $("#navbar").append("<a href=\"/\" id=\"back_to_forum\">Back To Forum</a>");
    var right = "410px";
    if (/^\/user\//.test(pathname)) {
      right = "280px";
    }
    $("#back_to_forum").attr("style", "right: " + right +";");
  }

  // if user is adding a new article and does not have enough karma
  var mainForumOption = $("select#sr option[value=main]")[0];
  if (/^.*\/submit\//.test(pathname) && mainForumOption != undefined && mainForumOption.disabled) {
    var karma = / at least ([0-9]+) /.exec(mainForumOption.text)[1];
    $("<div class='infobar' style='width: inherit;'>You do not yet have enough karma to post an article. Every 'like' that your comments gain will increase your karma by one point. Once you have earned " + karma + " karma, you will be able to post articles here. In the meantime, here are some <a href=\"/ea/7b/welcome_to_the_effective_altruism_forum/\">other ways</a> to participate.</div><p>&nbsp;</p>").insertAfter("form h1");
  }

  // new article
  $("#side-status ul.userlinks a[href$='/submit/']").text("New Article");
  $("#side-status ul.userlinks a[href$='/submit/']").attr("id", "newarticle");
  $("#side-status ul.userlinks a[href$='/submit/']").appendTo("#navbar");
  // messages
  $("#side-status div.userinfo span.mail a").text("Messages");
  $("#side-status div.userinfo span.mail").attr("id", "messages");
  // $("#side-status div.userinfo span.mail").addClass("empty");
  $("#side-status div.userinfo span.mail").appendTo("#navbar");
  // preferences
  $("#side-status ul.userlinks a[href$='/prefs/']").attr("id", "preferences");
  $("#side-status ul.userlinks a[href$='/prefs/']").appendTo("#navbar");

  // Add posts header on Overview page
  if (/^\/user\//.test(pathname)) {
    // Remove Hidden
    $('a').filter(function(index) { return $(this).text() === "Hidden"; }).hide();
    var bits = /^\/user\/([^\/]*)\/(.*)/.exec(pathname);
    var userName = bits[1];
    var rest = bits[2];
    var thingName = "Contributions";
    if (rest.indexOf("comments") == 0) {
      thingName = "Comments";
    } else if (rest.indexOf("submitted") == 0) {
      thingName = "Articles";
    } else if (rest.indexOf("liked") == 0) {
      thingName = "Likes";
    } else if (rest.indexOf("disliked") == 0) {
      thingName = "Dislikes";
    } else if (rest.indexOf("hidden") == 0) {
      thingName = "Hidden Articles";
    } else if (rest.indexOf("drafts") == 0) {
      thingName = "Drafts";
    }
    $posts = $("<h2>" + userName + "'s " + thingName + "</h2>");
    $posts.prependTo("#content");

    // Bigger space between comments and posts
    if (thingName == "Contributions") {
      $("div#content > div.sitetable > div.comment, div#content > div.sitetable > div.post.list").each(function() {
        $(this).attr("style", "margin-top: 24px");
      });
    }
  }

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

  /* Add README link to the last paragraph */
  $('span.read_more_link').each(function() {
     var paragraph = $(this).parents("[itemprop='description']").find("p").filter(function() {
        return jQuery(this).text().length > 0;
     }).last();
     paragraph.append($(this).html());
     $(this).remove();
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

  $("#banner").click(function() {
    window.location.href = "/";
  });

  function isiPhone() {
    return ((navigator.platform.indexOf("iPhone") != -1) ||
            (navigator.platform.indexOf("iPod") != -1) ||
            (navigator.platform.indexOf("iPad") != -1));
  }

  var commentId = window.location.hash;
  jQuery(commentId).addClass("comment-fading-highlight");
  window.addEventListener("hashchange", function () {
    var commentId = window.location.hash;
    jQuery(commentId)
      .removeClass("comment-fading-highlight")
      .addClass("comment-fading-highlight");
  }, false);

  /* Don't do qtip tooltips with iphones (and related), it seems to interfer with the
     normal onclick behaviour */
  if (!isiPhone()) {
    // Button tooltips
    $('div.tools div.vote a, div.tools div.boxright a.edit, div.tools div.boxright a, \
       div.comment-links ul li a, \
       .userinfo .score, .userinfo .monthly-score, \
       #user-info .score, #user-info .monthly-score, .votes').qtip({
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
