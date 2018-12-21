$('#myTabs a').click(function (e) {
  e.preventDefault()
  $('#myTabs a[href="#solutions"]').tab('show');
  $('#myTabs a[href="#publisher"]').tab('show');
});
