/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	let moduleName = 'project.costcodes';
	angular.module(moduleName).factory('projectCostCodesPriceListRecordValidationService',
		['$injector', 'projectCostCodesPriceListForJobMessengerService',
			function ($injector, messengerService) {
				let service = {};
				service.validateSelected = function validateSelected(entity, value) {
					entity.Selected = value;
					if(value === true){
						if(entity.Weighting === 0){
							entity.Weighting = 1;// if weighting is 0. set it to 1.
						}
					}
					let parentService = $injector.get('projectCostCodesPriceListForJobDataService');
					messengerService.PriceListRecordSelectedChanged.fire(null, {prjCostCodes: parentService.getSelected()});
				};

				service.validateWeighting = function validateSelected(entity, value) {
					entity.Weighting = value;
					let parentService = $injector.get('projectCostCodesPriceListForJobDataService');
					messengerService.PriceListRecordWeightingChanged.fire(null, {prjCostCodes: parentService.getSelected()});
				};
				return service;
			}]);
})(angular);