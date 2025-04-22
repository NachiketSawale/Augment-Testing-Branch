/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

/* global globals */

(function () {
	'use strict';
	var moduleName = 'sales.billing';
	var salesBillingModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name salesBillingValidationDataService
	 * @function
	 *
	 * @description
	 * salesBillingValidationDataService main service for handling billing validation entities
	 */
	salesBillingModule.factory('salesBillingValidationDataService',
		['_', 'salesBillingService', 'platformDataServiceFactory', '$timeout', '$http',
			function (_, salesBillingService, platformDataServiceFactory, $timeout, $http) {

				var salesBillingValidationServiceOption = {
					flatLeafItem: {
						module: salesBillingModule,
						serviceName: 'salesBillingValidationDataService',
						httpRead: {
							route: globals.webApiBaseUrl + 'sales/billing/validation/', endRead: 'list'
						},
						presenter: {list: {}},
						actions: {}, // TODO: remove toolbar buttons (create/delete)
						dataProcessor: [],
						entityRole: {
							leaf: {itemName: 'BilValidation', parentService: salesBillingService}
						}
					}
				};

				var serviceContainer = platformDataServiceFactory.createNewComplete(salesBillingValidationServiceOption);
				var service = serviceContainer.service;

				var jobList = [];
				service.isUpdateValidation = false;
				service.updateValidation = function updateValidation(jobId) {
					if (service.isUpdateValidation) {
						$timeout(function () {
							$http.get(globals.webApiBaseUrl + 'sales/billing/transaction/getjobstate?jobId=' + jobId).then(function (res) {
								if (res && res.data > -1 && _.includes([0, 1, 2], res.data)) {
									updateValidation(jobId);
								} else {
									var index = _.indexOf(jobList, jobId);
									jobList.splice(index, 1);
								}
							});
						}, 1000 * 15);
					}
				};

				service.updateAll = function updateAll() {
					service.isUpdateValidation = true;
					if (jobList.length > 0) {
						angular.forEach(jobList, function (item) {
							(function (item) {
								service.updateValidation(item);
							})(item);
						});
					} else {
						$http.get(globals.webApiBaseUrl + 'sales/billing/transaction/getjobs').then(function (res) {
							if (res && res.data && res.data.length > 0) {
								jobList = jobList.concat(res.data);
								updateAll();
							}
						});
					}
				};

				service.addJob = function addJob(jobId) {
					jobList.push(jobId);
				};

				return service;
			}]);
})();
