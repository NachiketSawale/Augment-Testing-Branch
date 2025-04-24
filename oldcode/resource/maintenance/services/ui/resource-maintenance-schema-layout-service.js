/**
 * Created by baf on 13.03.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.maintenance';

	/**
	 * @ngdoc controller
	 * @name resourceMaintenanceSchemaLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  resource maintenance schema entity.
	 **/
	angular.module(moduleName).service('resourceMaintenanceSchemaLayoutService', ResourceMaintenanceSchemaLayoutService);

	ResourceMaintenanceSchemaLayoutService.$inject = ['platformUIConfigInitService', 'resourceMaintenanceContainerInformationService', 'resourceMaintenanceConstantValues', 'resourceMaintenanceTranslationService'];

	function ResourceMaintenanceSchemaLayoutService(platformUIConfigInitService, resourceMaintenanceContainerInformationService, resourceMaintenanceConstantValues, resourceMaintenanceTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: resourceMaintenanceContainerInformationService.getSchemaLayout(),
			dtoSchemeId: resourceMaintenanceConstantValues.schemes.schema,
			translator: resourceMaintenanceTranslationService
		});
	}
})(angular);