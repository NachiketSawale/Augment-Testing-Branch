
(function (angular) {
	'use strict';
	var moduleName = 'project.main';
	angular.module(moduleName).service('projectMainSourceDataServiceFactory', ProjectMainSourceDataServiceFactory);
	ProjectMainSourceDataServiceFactory.$inject = ['platformSourceWindowDataServiceFactory'];
	function ProjectMainSourceDataServiceFactory(platformSourceWindowDataServiceFactory) {
		this.createDataService = function createDataService(templInfo, filterSrv) {

			return platformSourceWindowDataServiceFactory.createDataService(moduleName, templInfo, filterSrv);
		};
	}
})(angular);