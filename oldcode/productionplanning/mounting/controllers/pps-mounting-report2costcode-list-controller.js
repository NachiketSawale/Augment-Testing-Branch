/**
 * Created by anl on 12/4/2017.
 */

(function () {
	/*global angular*/
	'use strict';
	var moduleName = 'productionplanning.mounting';

	angular.module(moduleName).controller('productionplanningMountingReport2CostCodeListController', Report2CostCodeListController);

	Report2CostCodeListController.$inject = ['$scope', 'platformContainerControllerService',
		'platformGridAPI',
		'productionplanningMountingContainerInformationService',
		'productionplanningReportCostCodeContainerService'];

	function Report2CostCodeListController($scope, platformContainerControllerService,
										   platformGridAPI,
										   mountingContainerInformationService,
										   report2CostCodeContainerService) {

		var reportGUID = '518268e717e2413a8107c970919eea85';
		var dynamicReportService = mountingContainerInformationService.getContainerInfoByGuid(reportGUID).dataServiceName;

		var containerUid = $scope.getContentValue('uuid');
		var originLayout = '187a17f9e2ca468a9d2cab369d28e4bf';
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

		platformContainerControllerService.initController($scope, moduleName, containerUid);

		var report2CostCodeContainerInfo = mountingContainerInformationService.getContainerInfoByGuid(containerUid);
		var report2CostCodeDataService = report2CostCodeContainerInfo.dataServiceName;
		var report2CostCodeValidationService = report2CostCodeContainerInfo.validationServiceName;

		var onCellChange = function (e, args) {
			var col = args.grid.getColumns()[args.cell].field;
			if (col === 'CostCodeFk') {
				report2CostCodeDataService.updateUom(args.item, report2CostCodeValidationService);
			}
		};

		platformGridAPI.events.register($scope.gridId, 'onCellChange', onCellChange);
		report2CostCodeDataService.registerFilter();
		// un-register on destroy
		$scope.$on('$destroy', function () {
			platformGridAPI.events.unregister($scope.gridId, 'onCellChange', onCellChange);
			report2CostCodeDataService.unregisterFilter();
		});
	}
})();