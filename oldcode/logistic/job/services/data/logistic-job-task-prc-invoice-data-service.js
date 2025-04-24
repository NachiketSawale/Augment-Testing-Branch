/**
 * Created by leo on 06.05.2019
 */
/*globals math*/

(function (angular) {
	'use strict';
	var moduleName = 'logistic.job';
	var myModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name logisticJobTaskPrcInvoiceDataService
	 * @description provides methods to access prc item entities
	 */
	myModule.service('logisticJobTaskPrcInvoiceDataService', LogisticJobTaskPrcInvoiceDataService);
	LogisticJobTaskPrcInvoiceDataService.$inject = ['$http', '$q', 'basicsLookupdataLookupDescriptorService'];

	function LogisticJobTaskPrcInvoiceDataService($http, $q, basicsLookupdataLookupDescriptorService) {
		function getItemFromCache(id) {
			var item = null;
			if (data.length > 0) {
				var result = _.find(data, {id: id});
				if (result && result.item) {
					item = result.item;
				}
			}
			return item;
		}

		function round(number) {
			if (_.isNaN(number)) {
				return 0;
			}
			return math.round(number, 2);
		}

		var taxCodes = basicsLookupdataLookupDescriptorService.getData('TaxCode');

		function getTaxCode(item) {
			var deferred = $q.defer();
			var taxCode;
			if (taxCodes) {
				taxCode = _.find(taxCodes, {Id: item.MdcTaxCodeFk});
				deferred.resolve(taxCode);
			} else {
				$http.post(globals.webApiBaseUrl + 'basics/taxcode/instance', {Id: item.TaxCodeFk})
						.then(function (response) {
							if (response && response.data) {
								taxCode = response.data;
								if (!taxCodes) {
									taxCodes = [];
								}
								taxCodes.push(taxCode);
							}
							deferred.resolve(taxCode);
						});
			}
			return deferred.promise;
		}

		function getExchangeRate(item) {
			var deferred = $q.defer();
			var exchangeRate = 0;
			$http.get(globals.webApiBaseUrl + 'procurement/invoice/header/getHeaderById?id=' + item.InvHeaderFk)
					.then(function (response) {
						if (response && response.data) {
							exchangeRate = response.data.ExchangeRate;
						}
						deferred.resolve(exchangeRate);
					});
			return deferred.promise;
		}

		function calculation(item) {
			var deferred = $q.defer();
			var promise1 = getTaxCode(item);
			var promise2 = getExchangeRate(item);
			$q.all([promise1, promise2]).then(function (responseArray) {
				if (responseArray) {
					var vatPercent = responseArray[0] ? responseArray[0].Vatpercent : 0;
					var exchangeRate = responseArray[1] ? responseArray[1] : 0;

					item.AmountTotal = item.AmountNet * item.Quantity;
					item.AmountTotalOc = round(item.AmountTotal * exchangeRate);
					item.AmountUnitGross = item.AmountNet * (100 + vatPercent) / 100;
					item.AmountUnitOcGross = round(item.AmountUnitGross * exchangeRate);
					item.AmountTotalGross = item.Quantity * item.AmountUnitGross;
					item.AmountTotalOcGross = round(item.AmountTotalGross * exchangeRate);
				}
				deferred.resolve(item);
			});
			return deferred.promise;
		}

		var data = [];
		this.getItemByIdAsync = function getItemByIdAsync(id) {
			var deferred = $q.defer();
			var item = null;
			if (id) {
				item = getItemFromCache(id);
				if (item) {
					deferred.resolve(item);
				}
				$http.get(globals.webApiBaseUrl + 'procurement/invoice/other/getbyid?id=' + id).then(function (response) {
					var result = null;
					if (response && response.data) {
						result = response.data;
						calculation(result).then(function (result) {
							data.push({id: id, item: result});
							deferred.resolve(result);
						});
					}
				});
			} else {
				deferred.resolve(item);
			}
			return deferred.promise;
		};

		this.getItemById = function getItemById(id) {
			var item = null;
			if (id) {
				item = getItemFromCache(id);
			}
			return item;
		};
	}
})(angular);