/**
 * Created by anl on 8/9/2017.
 */

(function (angular) {

	'use strict';
	var moduleName = 'productionplanning.mounting';

	angular.module(moduleName).controller('productionplanningMountingReportDetailController', ReportDetailController);

	ReportDetailController.$inject = ['$scope', 'platformContainerControllerService',
		'productionplanningMountingContainerInformationService',
		'productionplanningReportReportContainerService'];

	function ReportDetailController($scope, platformContainerControllerService,
									mountingContainerInformationService,
									reportContainerService) {
		var containerUid = $scope.getContentValue('uuid');
		var originLayout = 'f32ffb6f21d34c7ab7aca13882ec61fe';
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
			reportContainerService.prepareDetailConfig(containerUid,
				mountingContainerInformationService, initConfig, dynamicActivityDataService);
		}

		platformContainerControllerService.initController($scope, moduleName, containerUid);

	}
})(angular);