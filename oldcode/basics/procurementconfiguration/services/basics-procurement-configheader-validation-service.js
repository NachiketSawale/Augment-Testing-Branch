/**
 * Created by wuj on 8/27/2015.
 */
(function (angular) {
	'use strict';

	var moduleName = 'basics.procurementconfiguration';

	angular.module(moduleName).factory('basicsProcurementConfigHeaderValidationService', ['basicsProcurementConfigHeaderDataService',
		function (dataService) {
			var service = {};

			var self = this;

			self.handleDefaultItem = function (entity) {
				var defaultItem = _.find(dataService.getList(), function (item) {
					return item.Id !== entity.Id && item.IsDefault;
				});

				if (defaultItem && defaultItem.IsDefault) {
					defaultItem.IsDefault = false;
					dataService.fireItemModified(defaultItem);
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

			service.validateBasConfigurationTypeFk = function (entity, value) {
				if (value && entity.BasConfigurationTypeFk !== value) {
					dataService.updatedBasConfigurationType.fire(null, value);
				}
			};
			return service;

		}]);
})(angular);