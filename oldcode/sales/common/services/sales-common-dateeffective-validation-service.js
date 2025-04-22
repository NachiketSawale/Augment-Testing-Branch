(function (angular) {
	'use strict';

	var moduleName = 'sales.common';

	angular.module(moduleName).service('salesCommonDateEffectiveValidateService', ['$injector',
		'procurementCommonDateEffectiveValidateService',
		function ($injector,procurementCommonDateEffectiveValidateService) {
			var self = this;
			/**
			 *
			 * @param entity
			 * @param value
			 * @param model
			 * @param boqMainSrvc
			 * @param dataService
			 * @param validateService
			 * @param Module
			 * @returns {*}
			 */
			self.asyncModifyDateEffectiveAndUpdateBoq = function asyncModifyDateEffectiveAndUpdateBoq(entity, value, model, boqMainSrvc, dataService, validateService,Module) {
				if(angular.isString(boqMainSrvc)){
					boqMainSrvc = $injector.get(boqMainSrvc);
				}
				let headerData = {
					ProjectId: entity.ProjectFk,
					Module: Module,
					HeaderId: entity.Id,
					ExchangeRate: entity.ExchangeRate
				};
				return procurementCommonDateEffectiveValidateService.asyncModifyDateEffectiveAndUpdateBoq(entity, value, model, boqMainSrvc, dataService, validateService, headerData);
			};
		}
	]);
})(angular);