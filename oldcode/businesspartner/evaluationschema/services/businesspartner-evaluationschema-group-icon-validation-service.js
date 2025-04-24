(function (angular) {
	'use strict';
	angular.module('businesspartner.evaluationschema').factory('businessPartnerEvaluationschemaGroupIconValidationService',
		['platformDataValidationService',
			function (platformDataValidationService) {
				return function (dataService) {
					return {
						validateModel: function () {
							return true;
						},
						validatePointsFrom: function (entity, value, model) {
							entity.from = value;
							entity.to = entity.PointsTo;
							return platformDataValidationService.isOverlap(dataService.getList(), model, value, entity);
						},
						validatePointsTo: function (entity, value, model) {
							entity.from = entity.PointsFrom;
							entity.to = value;
							return platformDataValidationService.isOverlap(dataService.getList(), model, value, entity);
						}
					};
				};
			}
		]);
})(angular);