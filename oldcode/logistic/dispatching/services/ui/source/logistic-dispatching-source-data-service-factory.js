(function (angular) {
	'use strict';
	var moduleName = 'logistic.dispatching';

	/**
	 * @ngdoc service
	 * @name logisticDispatchingSourceDataServiceFactory
	 * @description provides data services for the source window in scheduling main
	 */
	angular.module(moduleName).service('logisticDispatchingSourceDataServiceFactory', LogisticDispatchingSourceDataServiceFactory);

	LogisticDispatchingSourceDataServiceFactory.$inject = ['platformSourceWindowDataServiceFactory'];

	function LogisticDispatchingSourceDataServiceFactory(platformSourceWindowDataServiceFactory) {
		this.createDataService = function createDataService(templInfo, filterSrv) {
			return platformSourceWindowDataServiceFactory.createDataService(moduleName, templInfo, filterSrv);
		};
	}
})(angular);
