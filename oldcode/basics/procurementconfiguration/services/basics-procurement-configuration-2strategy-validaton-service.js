/**
 * Created by wuj on 9/2/2015.
 */
(function (angular) {
	'use strict';

	var moduleName = 'basics.procurementconfiguration';
	angular.module(moduleName).factory('basicsProcurementConfiguration2StrategyValidationService',
		['platformDataValidationService', 'basicsProcurementConfiguration2StrategyDataService', 'platformRuntimeDataService',
			function (platformDataValidationService, dataService, platformRuntimeDataService) {
				var service = {};
				var self = this;

				self.removeError = function (entity) {
					if (entity.__rt$data && entity.__rt$data.errors) {
						entity.__rt$data.errors = null;
					}
				};

				self.handleError = function (result, entity) {
					if (!result.valid) {
						platformRuntimeDataService.applyValidationResult(result, entity, 'PrcStrategyFk');
						platformRuntimeDataService.applyValidationResult(result, entity, 'PrcCommunicationChannelFk');
					} else {
						self.removeError(entity);
					}
				};

				self.validateUnique = function (id, prcStrategyFk, prcCommunicationChannelFk) {
					return platformDataValidationService.isGroupUnique(
						dataService.getList(),
						{
							PrcStrategyFk: prcStrategyFk,
							PrcCommunicationChannelFk: prcCommunicationChannelFk
						},
						id,
						'cloud.common.towFiledUniqueValueErrorMessage',
						{field1: 'strategy', field2: 'communication channel'}
					);
				};

				service.validatePrcStrategyFk = function (entity, value, model) {
					var result = platformDataValidationService.isMandatory(value, model);
					if (result.valid) {
						result = self.validateUnique(entity.Id, value, entity.PrcCommunicationChannelFk);
					}
					self.handleError(result, entity);
					return result;
				};


				service.validatePrcCommunicationChannelFk = function (entity, value, model) {
					var result = platformDataValidationService.isMandatory(value, model);
					if (result.valid) {
						result = self.validateUnique(entity.Id, entity.PrcStrategyFk, value);
					}
					self.handleError(result, entity);
					return result;
				};
				return service;

			}]);
})(angular);