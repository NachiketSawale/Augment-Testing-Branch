(function (angular) {
	'use strict';
	let moduleName = 'procurement.requisition';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	angular.module(moduleName).factory('procurementReqCreateRfqWizardDataService', [
		'platformModalService', 'procurementRequisitionHeaderDataService',
		'procurementReqCreateRfqHttpWizard', '$q',
		function (platformModalService, mainDataService,
			procurementReqCreateRfqHttpWizard, $q) {

			let service = {};

			service.findBidder = function (findBidderComplete) {
				let defer = $q.defer();
				procurementReqCreateRfqHttpWizard.findBidder(findBidderComplete).then(function (response) {
					defer.resolve(response.data);
				}, function (error) {
					defer.resolve(error);
				});

				return defer.promise;
			};

			service.getDefaultAddress = function (reqHeaderId) {
				let defer = $q.defer();
				procurementReqCreateRfqHttpWizard.getDefaultAddress(reqHeaderId).then(function (response) {
					defer.resolve(response.data);
				}, function (error) {
					defer.resolve(error);
				});

				return defer.promise;
			};

			service.createRfq = function (options) {
				let defer = $q.defer();
				procurementReqCreateRfqHttpWizard.createRfq(options).then(function (response) {
					defer.resolve(response.data);
				}, function (error) {
					defer.resolve(error);
				});

				return defer.promise;
			};

			service.getStructureCode = function (reqHeaderId) {
				let defer = $q.defer();
				procurementReqCreateRfqHttpWizard.getStructureCode(reqHeaderId).then(function (response) {
					defer.resolve(response.data);
				}, function (error) {
					defer.resolve(error);
				});

				return defer.promise;
			};

			service.getEvaluationSchema = function (structureIds) {
				let defer = $q.defer();
				procurementReqCreateRfqHttpWizard.getEvaluationSchema(structureIds).then(function (response) {
					defer.resolve(response.data);
				}, function (error) {
					defer.resolve(error);
				});

				return defer.promise;
			};

			service.getBidder = function (prcHeaderId) {
				let defer = $q.defer();
				procurementReqCreateRfqHttpWizard.GetBidder(prcHeaderId).then(function (response) {
					defer.resolve(response.data);
				}, function (error) {
					defer.resolve(error);
				});

				return defer.promise;
			};

			service.execute = function () {
				let header = mainDataService.getSelected();
				if (!header) {
					return;
				}

				header.bpPrcHeaderEntity = header.PrcHeaderEntity;
				service.getBidder(header.PrcHeaderFk).then(function (suggestedBidder) {
					platformModalService.showDialog({
						templateUrl: globals.appBaseUrl + 'businesspartner.main/templates/filter-business-partner-dialog.html',
						backdrop: false,
						resizeable: true,
						width: 'max',
						height: 'max',
						minHeight: '585px',
						IsWizardForCreateReq: true,
						mainData: header,
						bidderData: suggestedBidder,
						onReturnButtonPress: function () {
						}
					});
				});
			};

			service.checkReqCanCreateRFQ = function checkReqCanCreateRFQ(reqHeaderId) {
				return procurementReqCreateRfqHttpWizard.checkReqCanCreateRFQ(reqHeaderId);
			};

			return service;
		}]);

	angular.module(moduleName).factory('procurementReqCreateRfqHttpWizard', ['$http',
		function ($http) {

			let service = {};

			service.findBidder = function (findBidderComplete) {
				return $http.post(globals.webApiBaseUrl + 'requisition/requisition/wizard/findbidder', findBidderComplete);
			};

			service.getDefaultAddress = function (reqHeaderId) {
				return $http.get(globals.webApiBaseUrl + 'procurement/requisition/requisition/getaddressbyreqheader?reqHeaderId=' + reqHeaderId);
			};

			service.createRfq = function (options) {
				return $http.post(globals.webApiBaseUrl + 'procurement/rfq/wizard/createrfqfromreqwizard', options);
			};

			service.getStructureCode = function (reqHeaderId) {
				return $http.get(globals.webApiBaseUrl + 'requisition/requisition/wizard/getstructurecodebyreqheader?reqHeaderId=' + reqHeaderId);
			};

			service.getEvaluationSchema = function (structureIds) {
				return $http.post(globals.webApiBaseUrl + 'businesspartner/evaluationschema/listByStructureIds', structureIds);
			};

			service.checkReqCanCreateRFQ = function (reqHeaderId) {
				return $http.get(globals.webApiBaseUrl + 'procurement/rfq/requisition/checkreqcancreaterfq?reqHeaderId=' + reqHeaderId);
			};

			service.GetBidder = function (prcHeaderId) {
				return $http.get(globals.webApiBaseUrl + 'procurement/common/wizard/getbidder?prcHeaderFk=' + prcHeaderId);
			};

			return service;
		}]);

	angular.module(moduleName).factory('procurementReqCreateRfqBPListService', [
		'platformDataServiceFactory',
		function (platformDataServiceFactory) {

			let serviceOption = {
				module: angular.module(moduleName),
				serviceName: 'procurementReqCreateRfqBPListService',
				httpRead: {
					useLocalResource: true,
					resourceFunction: function () {
						return [];
					}
				},
				presenter: {list: {}},
				entitySelection: {},
				modification: {}
			};

			let container = platformDataServiceFactory.createNewComplete(serviceOption);
			let service = container.service;

			container.data.markItemAsModified = function () {
			};
			service.markItemAsModified = function () {
			};

			return service;
		}
	]);

	angular.module(moduleName).factory('procurementReqCreateRfqBPDContractService', [
		'platformDataServiceFactory',
		function (platformDataServiceFactory) {

			let serviceOption = {
				module: angular.module(moduleName),
				serviceName: 'procurementReqCreateRfqBPDContractService',
				httpRead: {
					useLocalResource: true,
					resourceFunction: function () {
						return [];
					}
				},
				presenter: {list: {}},
				entitySelection: {},
				modification: {}
			};

			let container = platformDataServiceFactory.createNewComplete(serviceOption);
			let service = container.service;

			container.data.markItemAsModified = function () {
			};
			service.markItemAsModified = function () {
			};

			return service;
		}
	]);

})(angular);
