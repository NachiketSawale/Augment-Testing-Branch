
/**
 * Created by leo on 15.02.2017.
 */

(function (angular) {
	'use strict';
	var moduleName = 'project.main';
	angular.module(moduleName).service('projectMainSourceWindowControllerService', ProjectMainSourceWindowControllerService);
	ProjectMainSourceWindowControllerService.$inject = ['platformSourceWindowControllerService']; //check this
	function ProjectMainSourceWindowControllerService(platformSourceWindowControllerService) {
		this.initSourceFilterController = function ($scope, uuid) {
			platformSourceWindowControllerService.initSourceFilterController($scope, uuid, 'projectMainContainerInformationService', 'projectMainSourceFilterService');
		};
	}
})(angular);