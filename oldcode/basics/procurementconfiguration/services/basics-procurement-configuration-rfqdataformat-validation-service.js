/**
 * Created by lcn on 3/25/2019.
 */
(function (angular) {
	'use strict';

	var moduleName = 'basics.procurementconfiguration';
	angular.module(moduleName).factory('basicsProcurementConfigurationRfqDataFormatValidationService',
		['$translate', 'basicsProcurementConfigurationDataFormatService', 'platformDataValidationService', 'platformRuntimeDataService',
			function ($translate, dataService, platformDataValidationService, platformRuntimeDataService) {
				var service = {};
				var self = this;

				self.handleDefaultItem = function (entity) {
					var defaultItem = _.find(dataService.getList(), function (item) {
						return item.Id !== entity.Id && item.IsDefault;
					});


					if (defaultItem && defaultItem.IsDefault) {
						defaultItem.IsDefault = false;
						dataService.markItemAsModified(defaultItem);
					}
				};

				service.validateIsDefault = function (entity, value) {
					if (value) {
						self.handleDefaultItem(entity);
						dataService.markItemAsModified(entity);
						var currentItem = dataService.getSelected();
						if (currentItem && currentItem.Id !== entity.Id) {
							dataService.setSelected(entity);
						}
					}
					return true;
				};

				service.validateBasDataformatFk = function (entity, value, model) {
					var result = {apply: true, valid: true};

					if ((value === null || _.isUndefined(value) || value === '' || value === 0)) {
						result.valid = false;
						result.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage');

					} else {
						var items = _.filter(dataService.getList(), function (item) {
							/** @namespace item.BasDataformatFk */
							return value === item.BasDataformatFk && item.Id !== entity.Id;
						});

						if (items.length && items.length > 0) {
							result.valid = false;
							result.error = $translate.instant('cloud.common.uniqueValueErrorMessage', {object: 'BasData format'});
						}
					}
					entity.BasDataformatFk = value;
					platformRuntimeDataService.applyValidationResult(result, entity, model);
					return platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
				};
				return service;

			}]);
})(angular);