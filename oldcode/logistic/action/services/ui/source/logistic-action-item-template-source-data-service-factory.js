/**
 * Created by chlai on 2025/01/30
 */
(function (angular) {
	'use strict';
	var moduleName = 'logistic.action';

	/**
	 * @ngdoc service
	 * @name logisticActionItemTemplateSourceDataServiceFactory
	 * @description provides data services for the source window in logistic action
	 */
	angular.module(moduleName).service('logisticActionItemTemplateSourceDataServiceFactory', LogisticActionItemTemplateSourceDataServiceFactory);

	LogisticActionItemTemplateSourceDataServiceFactory.$inject = ['platformSourceWindowDataServiceFactory'];

	function LogisticActionItemTemplateSourceDataServiceFactory(platformSourceWindowDataServiceFactory) {
		this.createDataService = function createDataService(templInfo, filterSrv) {
			return platformSourceWindowDataServiceFactory.createDataService(moduleName, templInfo, filterSrv);
		};
	}
})(angular);