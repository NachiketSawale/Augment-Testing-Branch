/**
 * Created by baf on 13.03.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.maintenance';

	/**
	 * @ngdoc service
	 * @name resourceMaintenanceConditionConstantValues
	 * @function
	 *
	 * @description
	 * resourceMaintenanceConditionConstantValues provides definitions and constants frequently used in resource maintenance module
	 */
	angular.module(moduleName).value('resourceMaintenanceConstantValues', {
		schemes: {
			schema: {typeName: 'MaintenanceSchemaDto', moduleSubModule: 'Resource.Maintenance'},
			schemaRecord: {typeName: 'MaintenanceSchemaRecordDto', moduleSubModule: 'Resource.Maintenance'}
		},
		uuid: {
			container: {
				schemaList: '3218a6cca2b4415ea455785bbe633285',
				schemaDetail: '7f8efe8f35b34937aaf023d76ae30172',
				schemaRecordList: '1dad2033d1b24f4bac55849d549b9c52',
				schemaRecordDetail: '03987f82b6b141f8b4481c4f52697c83'
			}
		}
	});
})(angular);
