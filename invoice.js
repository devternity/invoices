angular.module('app', ['ngRoute'])
  .service('Invoice', function($q, $http) {
      var self = this;
      this.fetch = function (invoiceUUID) {
        return $http
          .get("https://devternity-22e74.firebaseio.com/invoices/" + invoiceUUID + ".json")
          .then(function(it) { 
            return it.data;
          });
      };
})

.config(function($routeProvider) {
  var fetchInvoice = {
    invoice: function (Invoice, $route, $location) {
      return Invoice
        .fetch($route.current.params.invoiceUUID)
        .then(function(it) {
          if (!it) {
            $location.path("/")
          }
          return it;
        })
    }
  };

  $routeProvider
    .when('/', {
      templateUrl: 'missing.html'
    })
    .when('/:invoiceUUID', {
      controller:'ViewInvoice as invoice',
      templateUrl: 'render.html',
      resolve: fetchInvoice
    })
    .otherwise({
      redirectTo:'/'
    });
})

.controller('ViewInvoice', function($location, $routeParams, invoice) {    
    if (!invoice) {
      return;
    }
    this.issued = moment(invoice.issued).format("MMMM DD, YYYY");
    this.due = moment(invoice.issued).add(invoice.dueDays, 'days').format("MMMM DD, YYYY");
    this.details = invoice;
});