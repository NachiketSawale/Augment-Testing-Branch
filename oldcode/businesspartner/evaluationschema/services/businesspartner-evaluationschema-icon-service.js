(function (angular) {
	'use strict';
	let moduleName = 'businesspartner.evaluationschema';
	let businesspartnerEvaluationschemaModule = angular.module(moduleName);
	angular.module(moduleName).factory('businesspartnerEvaluationschemaIconService',
		['globals','platformDataServiceFactory', 'basicsLookupdataLookupDescriptorService', 'businesspartnerEvaluationschemaHeaderService',
			'platformRuntimeDataService','businesspartnerEvaluationschemaIconValidationService',
			/* jshint -W072 */ // many parameters because of dependency injection
			function (globals,platformDataServiceFactory, basicsLookupdataLookupDescriptorService, parentService,
				platformRuntimeDataService,validationService) {

				let serviceOptions = {
					flatLeafItem: {
						module: businesspartnerEvaluationschemaModule,
						serviceName: 'businesspartnerEvaluationschemaIconService',
						entityRole: {leaf: {itemName: 'EvaluationSchemaIcon', parentService: parentService}},
						httpCRUD: {route: globals.webApiBaseUrl + 'businesspartner/evaluationschema/evaluationschemaicon/', endCreate: 'createnew'},
						presenter: {list: {}},
						actions: {create: 'flat', delete: true},
						dataProcessor: [{processItem: processItem}]
					}
				};
				let container = platformDataServiceFactory.createNewComplete(serviceOptions);
				return container.service;

				function processItem(item) {
					let validator = validationService(container.service);
					platformRuntimeDataService.applyValidationResult(validator.validatePointsFrom(item, item.PointsFrom, 'PointsFrom'), item, 'PointsFrom');
					platformRuntimeDataService.applyValidationResult(validator.validatePointsTo(item, item.PointsTo, 'PointsTo'), item, 'PointsTo');
				}
			}
		]);
})(angular);

