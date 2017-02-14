$(function() {
  $(".datepick").each(function() {
    $(this).datepicker();
  });
  $("button, .link-button").button();
  
  $(".delete-domain").on("click", function(e) {
    deleteDomain($(this).data("url"));
    e.preventDefault();
  });
  
  function addDomain() {
    var domain = $("#domain"),
        clientId = $("#clientId");
    $.post("/domain/add", { domain: domain.val(), clientId: clientId.val() }, function(data) {
      window.location.reload();
    }).fail(function() {
    });
  }
  function deleteDomain(d) {
    $.post("/domain/delete", { url: d }, function(data) {
      window.location.reload();
    }).fail(function() {
    });
  }
  var dialog = $( "#dialog-form" ).dialog({
      autoOpen: false,
      height: 300,
      width: 350,
      modal: true,
      buttons: {
        "Save": addDomain,
        Cancel: function() {
          dialog.dialog( "close" );
        }
      },
      close: function() {
      }
    });
  $(".new-domain").on("click", function(event) {
    event.preventDefault();
    dialog.dialog("open");
  });
});