/**
 * Created by anl on 12/4/2017.
 */

(function (angular) {
	'use strict';
	var moduleName = 'productionplanning.mounting';

	angular.module(moduleName).controller('productionplanningMountingReport2CostCodeDetailController', Report2CostCodeDetailController);

	Report2CostCodeDetailController.$inject = ['$scope', 'platformContainerControllerService',
		'productionplanningMountingContainerInformationService',
		'productionplanningReportCostCodeContainerService'];

	function Report2CostCodeDetailController($scope, platformContainerControllerService,
											 mountingContainerInformationService,
											 report2CostCodeContainerService) {

		var reportGUID = '518268e717e2413a8107c970919eea85';
		var dynamicReportService = mountingContainerInformationService.getContainerInfoByGuid(reportGUID).dataServiceName;

		var containerUid = $scope.getContentValue('uuid');
		var originLayout = '504a75f8108c459eb85c9e3217cd5159';
		var initConfig = {
			id: containerUid,
			layout: containerUid,
			usedLayout: originLayout,
			moduleName: moduleName
		};

		if (!mountingContainerInformationService.hasDynamic(containerUid)) {
			report2CostCodeContainerService.prepareGridConfig(containerUid,
				mountingContainerInformationService, initConfig, dynamicReportService);
		}
		var report2CostCodeContainerInfo = mountingContainerInformationService.getContainerInfoByGuid(containerUid);
		var report2CostCodeDataService = report2CostCodeContainerInfo.dataServiceName;

		platformContainerControllerService.initController($scope, moduleName, containerUid);

		report2CostCodeDataService.registerFilter();
		// un-register on destroy
		$scope.$on('$destroy', function () {
			report2CostCodeDataService.unregisterFilter();
		});
	}

})(angular);
