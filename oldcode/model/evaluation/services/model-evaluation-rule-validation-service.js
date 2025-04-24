/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	var moduleName = 'model.evaluation';

	/**
	 * @ngdoc service
	 * @name modelEvaluationRuleValidationService
	 * @function
	 * @requires modelEvaluationRule2HlItemDataService, modelEvaluationRuleDataService, $q
	 *
	 * @description
	 * A service for validating model rules.
	 */
	angular.module(moduleName).factory('modelEvaluationRuleValidationService', ['modelEvaluationRule2HlItemDataService',
		'modelEvaluationRuleDataService', '_', '$q',
		function (modelEvaluationRule2HlItemDataService, modelEvaluationRuleDataService, _, $q) {
			var service = {};

			service.asyncValidateHlItemFk = function validateHlItemFk (entity, value) {
				var actionPromise;
				if (modelEvaluationRuleDataService.areMappingsReady()) {
					if (_.isNumber(value)) {
						actionPromise = modelEvaluationRule2HlItemDataService.findOrCreateMappingEntity(entity.Id).then(function (mappingEntity) {
							mappingEntity.HighlightingItemFk = value;
							modelEvaluationRule2HlItemDataService.markItemAsModified(mappingEntity);
						});
					} else {
						(function () {
							var mappingEntity = modelEvaluationRule2HlItemDataService.findMappingEntity(entity.Id);
							if (mappingEntity) {
								modelEvaluationRule2HlItemDataService.deleteItem(mappingEntity);
							}
						})();
						actionPromise = $q.resolve();
					}
				} else {
					actionPromise = $q.resolve();
				}

				return actionPromise.then(function () {
					return {
						valid: true
					};
				});
			};

			return service;
		}]);
})(angular);
