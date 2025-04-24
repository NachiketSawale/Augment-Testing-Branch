(function (angular) {
	'use strict';
	var moduleName = 'resource.equipmentgroup';

	/**
	 * @ngdoc service
	 * @name resourceEquipmentGroupSourceDataServiceFactory
	 * @description provides data services for the source window in scheduling main
	 */
	angular.module(moduleName).service('resourceEquipmentGroupSourceDataServiceFactory', ResourceEquipmentGroupSourceDataServiceFactory);

	ResourceEquipmentGroupSourceDataServiceFactory.$inject = ['platformSourceWindowDataServiceFactory'];

	function ResourceEquipmentGroupSourceDataServiceFactory(platformSourceWindowDataServiceFactory) {
		this.createDataService = function createDataService(templInfo, filterSrv) {
			return platformSourceWindowDataServiceFactory.createDataService(moduleName, templInfo, filterSrv);
		};
	}
})(angular);