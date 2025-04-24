(function (angular) {
	'use strict';

	let moduleName = 'businesspartner.evaluationschema';

	angular.module(moduleName).factory('businesspartnerEvaluationschemaIconValidationService', ['$translate', 'platformDataValidationService',
		/* jshint -W072 */ // many parameters because of dependency injection
		function ($translate, platformDataValidationService) {

			return function (dataService) {
				let service = {$translate: $translate, dataService: dataService};

				service.validateModel = function () {

				};

				service.validatePointsFrom = function (entity, value, model) {
					entity.from = value;
					entity.to = entity.PointsTo;
					return platformDataValidationService.isOverlap(dataService.getList(), model, value, entity);
				};

				service.validatePointsTo = function (entity, value, model) {
					entity.from = entity.PointsFrom;
					entity.to = value;
					return platformDataValidationService.isOverlap(dataService.getList(), model, value, entity);
				};

				return service;
			};
		}
	]);

})(angular);

