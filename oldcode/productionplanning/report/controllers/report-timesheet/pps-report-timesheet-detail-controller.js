/**
 * Created by anl on 4/22/2020.
 */

(function () {
	/*global angular*/
	'use strict';
	var moduleName = 'productionplanning.report';

	angular.module(moduleName).controller('productionplanningReportTimeSheetDetailController', ReportTimeSheetDetailController);

	ReportTimeSheetDetailController.$inject = ['$scope', 'platformContainerControllerService',
		'productionplanningReportContainerInformationService',
		'productionplanningReportTimeSheetContainerService',
		'productionplanningReportReportDataService'];

	function ReportTimeSheetDetailController($scope, platformContainerControllerService,
											reportContainerInformationService,
											reportTimeSheetContainerService,
											reportDataService) {
		var containerUid = $scope.getContentValue('uuid');
		var originLayout = 'dc2aa594192c407e966c368a3c7791cc';
		var initConfig = {
			id: containerUid,
			layout: containerUid,
			usedLayout: originLayout,
			moduleName: moduleName
		};

		if (!reportContainerInformationService.hasDynamic(containerUid)) {
			reportTimeSheetContainerService.prepareDetailConfig(containerUid,
				reportContainerInformationService, initConfig, reportDataService);
		}

		platformContainerControllerService.initController($scope, moduleName, containerUid);

	}
})();