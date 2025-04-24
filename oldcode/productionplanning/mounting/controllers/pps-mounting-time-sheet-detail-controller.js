/**
 * Created by anl on 10/25/2017.
 */

(function () {
	'use strict';

	var moduleName = 'productionplanning.mounting';

	angular.module(moduleName).controller('productionplanningTimeSheetDetailController', TimeSheetDetailController);

	TimeSheetDetailController.$inject = ['$scope', 'platformContainerControllerService',
		'productionplanningMountingContainerInformationService',
		'productionplanningReportTimeSheetContainerService'];

	function TimeSheetDetailController($scope, platformContainerControllerService,
									   mountingContainerInformationService,
									   timeSheetContainerService) {

		var reportGUID = '518268e717e2413a8107c970919eea85';
		var dynamicReportService = mountingContainerInformationService.getContainerInfoByGuid(reportGUID).dataServiceName;

		var containerUid = $scope.getContentValue('uuid');
		var originLayout = 'dc2aa594192c407e966c368a3c7791cc';
		var initConfig =
		{
			id: containerUid,
			layout: containerUid,
			usedLayout: originLayout,
			moduleName: moduleName
		};

		if (!mountingContainerInformationService.hasDynamic(containerUid)) {
			timeSheetContainerService.prepareGridConfig(containerUid,
				mountingContainerInformationService, initConfig, dynamicReportService);
		}

		platformContainerControllerService.initController($scope, moduleName, containerUid);
	}

})();

