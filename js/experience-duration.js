document.addEventListener('DOMContentLoaded', function () {
  var now = new Date();

  document.querySelectorAll('.cv-duration').forEach(function (el) {
    var start = new Date(el.dataset.start);
    var cap = el.dataset.endCap ? new Date(el.dataset.endCap) : null;
    var end = cap && now > cap ? cap : now;

    var months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    if (end.getDate() < start.getDate()) months--;
    months = Math.max(0, months);

    el.textContent = months + ' mois';
  });
});
