/*
 * $Id: project-info-request-list-controller.js 542869 2019-04-26 02:08:47Z lst $
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	var moduleName = 'project.inforequest';

	angular.module(moduleName).controller('projectInfoRequestListController', ProjectInfoRequestListController);

	ProjectInfoRequestListController.$inject = ['$rootScope', '$scope', 'platformContainerControllerService', 'projectInfoRequestDataService', 'platformGridControllerService',
		'bascisCommonClerkDataServiceFactory',
		'modelViewerStandardFilterService', 'platformMenuListUtilitiesService'];

	function ProjectInfoRequestListController($rootScope, $scope, platformContainerControllerService, projectInfoRequestDataService, platformGridControllerService,
	                                          bascisCommonClerkDataServiceFactory,
	                                          modelViewerStandardFilterService, platformMenuListUtilitiesService) {
		platformContainerControllerService.initController($scope, 'Project.InfoRequest', '281de48b068c443c9b7c62a7f51ac45f');

		$scope.$on('$destroy', projectInfoRequestDataService.unregisterAll);

		modelViewerStandardFilterService.attachMainEntityFilter($scope, projectInfoRequestDataService.getServiceName());

		const toolbarItems = [
			platformMenuListUtilitiesService.createToggleItemForObservable({
				value: projectInfoRequestDataService.updateModelSelection,
				toolsScope: $scope
			})
		];

		platformGridControllerService.addTools(toolbarItems);
	}
})(angular);
