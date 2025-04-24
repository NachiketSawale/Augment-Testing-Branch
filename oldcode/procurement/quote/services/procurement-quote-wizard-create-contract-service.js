(function (angular) {
	'use strict';
	var moduleName = 'procurement.quote';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	angular.module(moduleName).factory('procurementQuoteCreateContractWizardService', [
		'$http', '$q', 'platformDataServiceFactory', 'platformGridDomainService',
		'basicsLookupdataLookupDescriptorService', 'procurementQuoteHeaderDataService',
		function ($http, $q, platformDataServiceFactory, platformGridDomainService,
			basicsLookupdataLookupDescriptorService, procurementQuoteHeaderDataService) {
			var service = {};

			service._data = null;
			service.getQuotesWithChangeOrder = function getQuotesWithChangeOrder(quoteHeaderId) {
				var biddersUrl = globals.webApiBaseUrl + 'procurement/quote/header/getchangeorderquotes';
				var postData = {Value: quoteHeaderId};
				return $http.post(biddersUrl, postData);
			};

			service.getData = function () {
				var deferred = $q.defer();
				if (service._data !== null) {
					deferred.resolve(service._data);
				} else {
					var headerItem = procurementQuoteHeaderDataService.getSelected();
					if (headerItem && headerItem.Id > 0) {
						service.getQuotesWithChangeOrder(headerItem.Id).then(function (response) {
							service._data = response.data;
							deferred.resolve(service._data);
						});
					} else {
						deferred.resolve({});
					}
				}

				return deferred.promise;
			};

			service.setData = function (data) {
				service._data = data;
			};

			service.clearData = function () {
				service._data = null;
			};

			service.getList = function () {
				var deferred = $q.defer();
				service.getData().then(function (data) {
					deferred.resolve(data);
				});
				return deferred.promise;
			};

			service.getItemByKey = function (value) {
				var deferred = $q.defer();
				service.getList().then(function (data) {
					var currentItem = {};
					for (var i = data.length; i > 0; i--) {
						if (data[i - 1].Id === value) {
							currentItem = data[i - 1];
							break;
						}
					}
					deferred.resolve(currentItem);
				});
				return deferred.promise;
			};

			service.getItemByIdAsync = function (value) {
				var deferred = $q.defer();
				service.getList().then(function (data) {
					var currentItem = {};
					for (var i = data.length; i > 0; i--) {
						if (data[i - 1].Id === value) {
							currentItem = data[i - 1];
							break;
						}
					}
					deferred.resolve(currentItem);
				});
				return deferred.promise;
			};

			service.getSearchList = function () {
				var deferred = $q.defer();
				service.getList().then(function (data) {
					deferred.resolve(data);
				});
				return deferred.promise;
			};

			service.createContract = function (options) {
				var createContractUrl = globals.webApiBaseUrl + 'procurement/contract/wizard/createmergecontractfromquotewithchangeorder';
				return $http.post(createContractUrl, options);
			};

			return service;
		}
	]);
})(angular);