/**
 * Created by baf on 13.03.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.maintenance';

	/**
	 * @ngdoc controller
	 * @name resourceMaintenanceSchemaRecordLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  resource maintenance schemaRecord entity.
	 **/
	angular.module(moduleName).service('resourceMaintenanceSchemaRecordLayoutService', ResourceMaintenanceSchemaRecordLayoutService);

	ResourceMaintenanceSchemaRecordLayoutService.$inject = ['platformUIConfigInitService', 'resourceMaintenanceContainerInformationService', 'resourceMaintenanceConstantValues', 'resourceMaintenanceTranslationService'];

	function ResourceMaintenanceSchemaRecordLayoutService(platformUIConfigInitService, resourceMaintenanceContainerInformationService, resourceMaintenanceConstantValues, resourceMaintenanceTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: resourceMaintenanceContainerInformationService.getSchemaRecordLayout(),
			dtoSchemeId: resourceMaintenanceConstantValues.schemes.schemaRecord,
			translator: resourceMaintenanceTranslationService
		});
	}
})(angular);