(function (angular) {
	'use strict';
	var moduleName = 'resource.equipment';

	/**
	 * @ngdoc service
	 * @name resourceEquipmentSourceDataServiceFactory
	 * @description provides data services for the source window in scheduling main
	 */
	angular.module(moduleName).service('resourceEquipmentSourceDataServiceFactory', ResourceEquipmentSourceDataServiceFactory);

	ResourceEquipmentSourceDataServiceFactory.$inject = ['platformSourceWindowDataServiceFactory'];

	function ResourceEquipmentSourceDataServiceFactory(platformSourceWindowDataServiceFactory) {
		this.createDataService = function createDataService(templInfo, filterSrv) {
			return platformSourceWindowDataServiceFactory.createDataService(moduleName, templInfo, filterSrv);
		};
	}
})(angular);