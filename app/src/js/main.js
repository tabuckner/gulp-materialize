// DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded and parsed');
});

// Document Ready
$(document).ready(() => {
  console.log('Initializing Materialize Components');
  $('.sidenav').sidenav();
  $('ul.tabs').tabs();
  // Add additional component inits here.
});
