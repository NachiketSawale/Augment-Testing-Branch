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
	 * @name logisticJobTaskPrcItemDataService
	 * @description provides methods to access prc item entities
	 */
	myModule.service('logisticJobTaskPrcItemDataService', LogisticJobTaskPrcItemDataService);
	LogisticJobTaskPrcItemDataService.$inject = ['$http', '$q', 'basicsLookupdataLookupDescriptorService'];

	function LogisticJobTaskPrcItemDataService($http, $q, basicsLookupdataLookupDescriptorService) {
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

		var taxCodes = basicsLookupdataLookupDescriptorService.getData('TaxCode');

		function round(number) {
			if (_.isNaN(number)) {
				return 0;
			}
			return math.round(number, 2);
		}

		function calculate(item, taxCode) {
			var vatPercent = taxCode ? taxCode.Vatpercent : 0;
			item.PriceGross = round(item.Price * (100 + vatPercent) / 100);
			item.PriceOcGross = round(item.PriceOc * (100 + vatPercent) / 100);
			if (!(item.BasItemTypeFk === 2 || item.BasItemType2Fk === 3 || item.BasItemType2Fk === 5)) {
				item.TotalGross = round((item.Price + item.PriceExtra) * item.Quantity / item.PriceUnit * item.FactorPriceUnit * (100 - item.Discount) / 100 * (100 + vatPercent) / 100);
				item.TotalOcGross = round((item.PriceOc + item.PriceExtraOc) * item.Quantity / item.PriceUnit * item.FactorPriceUnit * (100 - item.Discount) / 100 * (100 + vatPercent) / 100);
			} else {
				item.TotalGross = 0;
				item.TotalOcGross = 0;
			}
			item.TotalPriceGross = round((item.Price + item.PriceExtra) * (100 - item.Discount) / 100 * (100 + vatPercent) / 100);
			item.TotalPriceGrossOc = round((item.PriceOc + item.PriceExtraOc) * (100 - item.Discount) / 100 * (100 + vatPercent) / 100);
		}

		function setGross(item) {
			var deferred = $q.defer();
			var taxCode;
			if (taxCodes) {
				taxCode = _.find(taxCodes, {Id: item.MdcTaxCodeFk});
				calculate(item, taxCode);
				deferred.resolve(item);
			} else {
				$http.post(globals.webApiBaseUrl + 'basics/taxcode/instance', {Id: item.MdcTaxCodeFk})
						.then(function (response) {
							if (response && response.data) {
								taxCode = response.data;
								calculate(item, taxCode);
								if (!taxCodes) {
									taxCodes = [];
								}
								taxCodes.push(taxCode);
							}
							deferred.resolve(item);
						});
			}
			if (item.ReplacementItems && item.ReplacementItems.length) {
				setGross(item.ReplacementItems);
			}
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
				$http.get(globals.webApiBaseUrl + 'procurement/common/prcitem/getbyid?id=' + id).then(function (response) {
					var result = null;
					if (response && response.data) {
						result = response.data;
						setGross(result).then(function (response) {
							data.push({id: id, item: response});
							deferred.resolve(response);
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