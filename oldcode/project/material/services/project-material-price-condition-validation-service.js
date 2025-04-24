/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name projectMaterialPriceConditionValidationService
	 * @description provides validation methods for project materialPriceCondition
	 */
	angular.module('project.material').factory('projectMaterialPriceConditionValidationService',
		['validationService', 'projectMaterialPriceConditionService',
			function (validationService, dataService) {
				let service = validationService.create('projectMaterialPriceCondition', 'project/material/pricecondition/schema');

				service.validateValue = dataService.validateValue;
				service.asyncValidatePrcPriceConditionTypeFk = dataService.validateType;

				return service;
			}
		]);
})(angular);
