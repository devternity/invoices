angular.module('app', ['ngRoute'])
  .service('Invoice', function($http) {
      this.fetch = function (invoiceUUID) {
        return $http
          .get("https://devternity-22e74.firebaseio.com/invoices/" + invoiceUUID + ".json")
          .then(function(it) {
            const data = it.data;
            if (data.paymentMethod === 'VISA') {
              data.paymentLink = 'https://api.devternity.com/invoice/' + invoiceUUID + '/linkpay'
            }
            if (data.billTo === 'devcapital') {
              data.billTo = {};
              data.billTo.name = 'DevCapital OÜ';
              data.billTo.regNo = '12194848';
              data.billTo.vatNo = '-';
              data.billTo.address = 'J. Koorti tn 16-20 Tallinn, Estonia';
              data.billTo.iban = 'EE497700771004301717';
            } else {
              data.billTo = {};
              data.billTo.name = 'DevTernity OÜ';
              data.billTo.regNo = '14226860'
              data.billTo.vatNo = 'EE101974721'
              data.billTo.address = 'Mõisavahe 38-129 Tartu, Estonia';
              data.billTo.iban = 'EE757700771002512472';
            }
            return data;
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