/**
 * Created by anl on 4/20/2020.
 */

(function () {
	/*global angular*/
	'use strict';
	var moduleName = 'productionplanning.report';

	angular.module(moduleName).controller('productionplanningReportCostCodeDetailController', ReportCostCodeDetailController);

	ReportCostCodeDetailController.$inject = ['$scope', 'platformContainerControllerService',
		'productionplanningReportContainerInformationService',
		'productionplanningReportCostCodeContainerService',
		'productionplanningReportReportDataService'];

	function ReportCostCodeDetailController($scope, platformContainerControllerService,
											reportContainerInformationService,
											reportCostCodeContainerService,
											reportDataService) {
		var containerUid = $scope.getContentValue('uuid');
		var originLayout = '504a75f8108c459eb85c9e3217cd5159';
		var initConfig = {
			id: containerUid,
			layout: containerUid,
			usedLayout: originLayout,
			moduleName: moduleName
		};

		if (!reportContainerInformationService.hasDynamic(containerUid)) {
			reportCostCodeContainerService.prepareDetailConfig(containerUid,
				reportContainerInformationService, initConfig, reportDataService);
		}

		platformContainerControllerService.initController($scope, moduleName, containerUid);

	}
})();