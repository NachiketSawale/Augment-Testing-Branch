/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';

	/**
	 * @ngdoc service
	 * @name projectMaterialValidationService
	 * @description provides validation methods for project Material properties
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('project.material').factory('projectMaterialValidationService', ['validationService', 'projectMaterialMainService',
		function (validationService, dataService) {

			let service = validationService.create('projectMaterialItem', 'project/material/scheme');

			service.costPriceValidator = function (entity, value, model) {
				entity[model] = value;
				dataService.recalculateCost(entity,null,model);
				return true;
			};

			service.validateListPrice = service.costPriceValidator;
			service.validateDiscount = service.costPriceValidator;
			service.validateCharges = service.costPriceValidator;
			service.validatePriceExtra = service.costPriceValidator;


			service.validatePrcPriceconditionFk = function (entity, value) {
				dataService.priceConditionSelectionChanged.fire({Id:value});
				entity.PrcPriceConditionFk = value;
				// dataService.reloadPriceCondition(entity, value);
				return true;
			};

			return service;
		}
	]);

})(angular);
