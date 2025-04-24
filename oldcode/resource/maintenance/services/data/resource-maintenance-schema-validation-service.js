/**
 * Created by baf on 13.03.2019
 */

(function (angular) {
	'use strict';
	let moduleName = 'resource.maintenance';

	/**
	 * @ngdoc service
	 * @name resourceMaintenanceSchemaValidationService
	 * @description provides validation methods for resource maintenance schema entities
	 */
	angular.module(moduleName).service('resourceMaintenanceSchemaValidationService', ResourceMaintenanceSchemaValidationService);

	ResourceMaintenanceSchemaValidationService.$inject = ['platformValidationServiceFactory', 'resourceMaintenanceConstantValues', 'resourceMaintenanceSchemaDataService'];

	function ResourceMaintenanceSchemaValidationService(platformValidationServiceFactory, resourceMaintenanceConstantValues, resourceMaintenanceSchemaDataService) {
		let self = this;

		platformValidationServiceFactory.addValidationServiceInterface(resourceMaintenanceConstantValues.schemes.schema, {
			mandatory: platformValidationServiceFactory.determineMandatoryProperties(resourceMaintenanceConstantValues.schemes.schema)
		},
		self,
		resourceMaintenanceSchemaDataService);
	}
})(angular);
