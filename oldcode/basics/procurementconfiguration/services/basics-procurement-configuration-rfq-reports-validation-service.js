/**
 * Created by lvy on 3/21/2019.
 */
(function (angular) {
	'use strict';

	var moduleName = 'basics.procurementconfiguration';
	angular.module(moduleName).factory('basicsProcurementConfigurationRfqReportsValidationService',
		['platformRuntimeDataService', 'platformDataValidationService', '$translate', function (platformRuntimeDataService, platformDataValidationService, $translate) {
			return function (dataService) {
				var service = {};
				service.validateBasReportFk = function validateBasReportFk(entity, value, model) {
					var result = {apply: true, valid: true};
					if (!value || value === 0) {
						result.valid = false;
						result.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: $translate.instant('basics.reporting.reportfk')});
					}
					platformRuntimeDataService.applyValidationResult(result, entity, model);
					platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
					return result;
				};

				service.validateIsDefault = function (entity, value) {
					if (value) {
						handleDefaultItem(entity);
						var currentItem = dataService.getSelected();
						if (currentItem && currentItem.Id !== entity.Id) {
							dataService.setSelected(entity);
						}
					}
					return true;
				};

				function handleDefaultItem(entity) {
					var defaultItem = _.find(dataService.getList(), function (item) {
						return item.Id !== entity.Id && item.IsDefault;
					});

					if (defaultItem && defaultItem.IsDefault) {
						defaultItem.IsDefault = false;
						dataService.fireItemModified(defaultItem);
						dataService.markItemAsModified(defaultItem);
					}
				}

				return service;
			};

		}]);
})(angular);