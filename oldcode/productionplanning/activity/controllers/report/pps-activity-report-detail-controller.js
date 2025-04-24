/**
 * Created by anl on 2/5/2018.
 */


(function () {
	/*global angular*/
	'use strict';
	var moduleName = 'productionplanning.activity';

	angular.module(moduleName).controller('productionplanningActivityReportDetailController', ReportDetailController);

	ReportDetailController.$inject = ['$scope', 'platformContainerControllerService',
		'productionplanningActivityContainerInformationService',
		'productionplanningReportReportContainerService',
		'productionplanningActivityActivityDataService'];

	function ReportDetailController($scope, platformContainerControllerService,
									activityContainerInformationService,
									reportContainerService,
									activityDataService) {
		var containerUid = $scope.getContentValue('uuid');
		var originLayout = 'f32ffb6f21d34c7ab7aca13882ec61fe';
		var initConfig = {
			id: containerUid,
			layout: containerUid,
			usedLayout: originLayout,
			moduleName: moduleName
		};

		if (!activityContainerInformationService.hasDynamic(containerUid)) {
			reportContainerService.prepareDetailConfig(containerUid,
				activityContainerInformationService, initConfig, activityDataService);
		}

		platformContainerControllerService.initController($scope, moduleName, containerUid);

	}
})(angular);