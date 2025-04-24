/**
 * Created by baf on 13.03.2019
 */

(function (angular) {
	'use strict';
	let moduleName = 'resource.maintenance';

	/**
	 * @ngdoc service
	 * @name resourceMaintenanceSchemaRecordValidationService
	 * @description provides validation methods for resource maintenance schemaRecord entities
	 */
	angular.module(moduleName).service('resourceMaintenanceSchemaRecordValidationService', ResourceMaintenanceSchemaRecordValidationService);

	ResourceMaintenanceSchemaRecordValidationService.$inject = ['platformValidationServiceFactory', 'resourceMaintenanceConstantValues', 'resourceMaintenanceSchemaRecordDataService'];

	function ResourceMaintenanceSchemaRecordValidationService(platformValidationServiceFactory, resourceMaintenanceConstantValues, resourceMaintenanceSchemaRecordDataService) {
		let self = this;

		platformValidationServiceFactory.addValidationServiceInterface(resourceMaintenanceConstantValues.schemes.schemaRecord, {
			mandatory: platformValidationServiceFactory.determineMandatoryProperties(resourceMaintenanceConstantValues.schemes.schemaRecord)
		},
		self,
		resourceMaintenanceSchemaRecordDataService);
	}
})(angular);
