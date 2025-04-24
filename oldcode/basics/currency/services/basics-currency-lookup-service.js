/**
 * Created by joshi on 20.11.2014.
 */
(function (angular) {
	/* global globals */
	'use strict';
	var moduleName = 'basics.currency';

	/**
	 * @ngdoc service
	 * @name basicsCurrencyLookupService
	 * @function
	 *
	 * @description
	 * basicsCurrencyLookupService provides all lookup data for currency module
	 */
	angular.module(moduleName).factory('basicsCurrencyLookupService', ['$http', '$q', 'basicsLookupdataLookupDescriptorService',
		function ($http, $q, basicsLookupdataLookupDescriptorService) {

			// private code
			var lookupData = {
				currency: [],
				currencyConversion: [],
				rate: [],
				rateType: []
			};
			var currencyLookup = {
				'currency': $http.get(globals.webApiBaseUrl + 'basics/currency/list'),
				'currencyConversion': $http.get(globals.webApiBaseUrl + 'basics/currency/conversion/getList'),
				'rate': $http.get(globals.webApiBaseUrl + 'basics/currency/rate/getList'),
				'rateType': $http.get(globals.webApiBaseUrl + 'basics/currency/rate/type/list')
			};

			// Object presenting the service
			var service = {};

			// Messengers
			// service.lookupDataLoaded = new Platform.Messenger();

			// currency look up data service calls
			service.getCurrency = function () {
				return lookupData.currency;
			};

			service.getCurrencyConversion = function () {
				return lookupData.currencyConversion;
			};

			service.getCurrencyRate = function () {
				return lookupData.rate;
			};

			service.getCurrencyRateType = function () {
				return lookupData.rateType;
			};

			service.getCurrencyConversionByKey = function (value) {
				var items = [];
				var list = lookupData.currencyConversion;
				for (var i = 0; i < list.length; i++) {
					if (list[i].CurrencyHomeFk === value) {
						items.push(list[i]);
					}
				}
				return items;
			};

			service.getForeignCurrencyByKey = function (value) {
				var item;
				var list = lookupData.currency;
				for (var i = 0; i < list.length; i++) {
					if (list[i].Id === value) {
						item = list[i];
						break;
					}
				}
				return item;
			};

			service.getCurrencyRateListByKey = function (value) {
				var items = [];
				var list = lookupData.rate;
				for (var i = 0; i < list.length; i++) {
					if (list[i].CurrencyConversionFk === value) {
						items.push(list[i]);
					}
				}
				return items;
			};

			service.getCurrencyRateTypeByKey = function (value) {
				var item = {};
				var list = lookupData.rateType;
				for (var i = 0; i < list.length; i++) {
					if (list[i].Id === value) {
						item = list[i];
						break;
					}
				}
				return item;
			};

			service.getCurrencyRateByKey = function getCurrencyRateByKey(value) {
				var item = {};
				var list = lookupData.rate;
				for (var i = 0; i < list.length; i++) {
					if (list[i].CurrencyHomeFk === value) {
						item = list[i];
						break;
					}
				}
				return item;
			};
			// currency service call
			service.loadLookupData = function () {
				$q.all(currencyLookup).then(function (result) {
					lookupData.currency = result.currency.data;
					lookupData.currencyConversion = result.currencyConversion.data;
					lookupData.rate = result.rate.data;
					lookupData.rateType = result.rateType.data;
					basicsLookupdataLookupDescriptorService.updateData('currency', lookupData.currency);
					basicsLookupdataLookupDescriptorService.updateData('currencyconversionlookup', lookupData.currency);
					basicsLookupdataLookupDescriptorService.updateData('ratetypefk', lookupData.rateType);
				});

			};

			// General stuff
			service.reload = function () {
				service.loadLookupData();
			};

			// Load the currency lookup data
			service.loadLookupData();

			return service;
		}]);
})(angular);
