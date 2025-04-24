/**
 * Created by anl on 8/9/2017.
 */

(function () {
	/*global angular*/
	'use strict';
	var moduleName = 'productionplanning.mounting';

	angular.module(moduleName).controller('productionplanningMountingReportListController', ReportListController);

	ReportListController.$inject = ['$scope', 'platformContainerControllerService',
		'productionplanningMountingContainerInformationService',
		'productionplanningReportReportContainerService'];

	function ReportListController($scope, platformContainerControllerService,
								  mountingContainerInformationService,
								  reportContainerService) {
		var containerUid = $scope.getContentValue('uuid');
		var originLayout = 'a17a58e59a944f95ae9e0c7f627c9e1a';
		var initConfig =
		{
			id: containerUid,
			layout: containerUid,
			usedLayout: originLayout,
			moduleName: moduleName
		};
		var activityUid = '3a37c9d82f4e45c28ccd650f1fd2bc1f';
		var dynamicActivityDataService = mountingContainerInformationService.getContainerInfoByGuid(activityUid).dataServiceName;

		if (!mountingContainerInformationService.hasDynamic(containerUid)) {
			reportContainerService.prepareGridConfig(containerUid,
				mountingContainerInformationService, initConfig, dynamicActivityDataService);
		}

		platformContainerControllerService.initController($scope, moduleName, containerUid);

	}
})();
