/**
 * Created by anl on 2/5/2018.
 */

(function () {
	/*global angular*/
	'use strict';
	var moduleName = 'productionplanning.activity';

	angular.module(moduleName).controller('productionplanningActivityReportListController', ReportListController);

	ReportListController.$inject = ['$scope', 'platformContainerControllerService',
		'productionplanningActivityContainerInformationService',
		'productionplanningReportReportContainerService',
		'productionplanningActivityActivityDataService'];

	function ReportListController($scope, platformContainerControllerService,
								  activityContainerInformationService,
								  reportContainerService,
								  activityDataService) {
		var containerUid = $scope.getContentValue('uuid');
		var originLayout = 'a17a58e59a944f95ae9e0c7f627c9e1a';
		var initConfig = {
			id: containerUid,
			layout: containerUid,
			usedLayout: originLayout,
			moduleName: moduleName
		};

		if (!activityContainerInformationService.hasDynamic(containerUid)) {
			reportContainerService.prepareGridConfig(containerUid,
				activityContainerInformationService, initConfig, activityDataService);
		}

		platformContainerControllerService.initController($scope, moduleName, containerUid);

	}
})();
