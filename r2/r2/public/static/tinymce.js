function init_tinymce(base_url) {
  tinyMCE.init({
    selector: "#article",
    plugins: "advlist,code,image,link,media",
    content_css: "/static/eaforum.css",
    toolbar: "styleselect | \
              bold italic blockquote strikethrough removeformat | \
              bullist numlist | \
              outdent indent | \
              link image media code",
    body_class: "md",
    menubar: false,
    relative_urls:false,
    document_base_url: base_url,
    browser_spellcheck: true,
  });
};

function showImageBrowser(field_name, url, type, win) {
  var location = window.location;

  // Get the last path component
  var path = location.pathname;
  var article_id = '';
  if(matches = path.match(/\/([^\/]+)$/)) {
    article_id = matches[1];
  }

  tinyMCE.activeEditor.windowManager.open({
      file : location.protocol + '//' + location.host + '/imagebrowser/' + article_id,
      title : 'Image Browser',
      width : 640,
      height : 400,
      resizable : "yes",
      scrollable : "yes",
      inline : "yes",  // Requires inlinepopups plugin to have affect
      close_previous : "no"
  }, {
      window : win,
      input : field_name
  });
  return false;
};
