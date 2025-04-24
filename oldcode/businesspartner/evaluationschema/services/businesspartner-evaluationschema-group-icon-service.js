(function (angular) {
	'use strict';
	let businesspartnerEvaluationschemaModule = angular.module('businesspartner.evaluationschema');

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('businesspartner.evaluationschema').factory('businessPartnerEvaluationschemaGroupIconService',
		['globals', 'businessPartnerEvaluationSchemaGroupService', 'platformDataServiceFactory', 'basicsLookupdataLookupDescriptorService',
			'platformRuntimeDataService', 'businessPartnerEvaluationschemaGroupIconValidationService',
			function (globals, businessPartnerEvaluationSchemaGroupService, platformDataServiceFactory, basicsLookupdataLookupDescriptorService,
				platformRuntimeDataService, validationService) {

				let serviceOption = {
					flatLeafItem: {
						module: businesspartnerEvaluationschemaModule,
						httpCreate: {route: globals.webApiBaseUrl + 'businesspartner/evaluationschema/evaluationgroupicon/', endCreate: 'createnew'},
						httpRead: {route: globals.webApiBaseUrl + 'businesspartner/evaluationschema/evaluationgroupicon/'},
						actions: {
							delete: true,
							create: 'flat'
						},
						entityRole: {
							leaf: {
								itemName: 'GroupIcon',
								parentService: businessPartnerEvaluationSchemaGroupService
							}
						},
						dataProcessor: [{processItem: processItem}]
					}
				};
				let serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);
				return serviceContainer.service;

				function processItem(item) {
					let validator = validationService(serviceContainer.service);
					platformRuntimeDataService.applyValidationResult(validator.validatePointsFrom(item, item.PointsFrom, 'PointsFrom'), item, 'PointsFrom');
					platformRuntimeDataService.applyValidationResult(validator.validatePointsTo(item, item.PointsTo, 'PointsTo'), item, 'PointsTo');
				}
			}]);
})(angular);
