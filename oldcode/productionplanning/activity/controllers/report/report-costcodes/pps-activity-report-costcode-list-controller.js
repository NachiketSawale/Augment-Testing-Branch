/**
 * Created by anl on 2/5/2018.
 */

(function () {

	'use strict';
	var moduleName = 'productionplanning.activity';

	angular.module(moduleName).controller('productionplanningActivityReport2CostCodeListController', Report2CostCodeListController);

	Report2CostCodeListController.$inject = ['$scope', 'platformContainerControllerService',
		'platformGridAPI',
		'productionplanningActivityContainerInformationService',
		'productionplanningReportCostCodeContainerService'];

	function Report2CostCodeListController($scope, platformContainerControllerService,
										   platformGridAPI,
										   activityContainerInformationService,
										   report2CostCodeContainerService) {

		var reportGUID = '1435d4d81ed6429bb7cdcfb80ff39f2b';
		var dynamicReportService = activityContainerInformationService.getContainerInfoByGuid(reportGUID).dataServiceName;


		var containerUid = $scope.getContentValue('uuid');
		var originLayout = '187a17f9e2ca468a9d2cab369d28e4bf';
		var initConfig = {
			id: containerUid,
			layout: containerUid,
			usedLayout: originLayout,
			moduleName: moduleName
		};

		if (!activityContainerInformationService.hasDynamic(containerUid)) {
			report2CostCodeContainerService.prepareGridConfig(containerUid,
				activityContainerInformationService, initConfig, dynamicReportService);
		}

		platformContainerControllerService.initController($scope, moduleName, containerUid);

		var report2CostCodeContainerInfo = activityContainerInformationService.getContainerInfoByGuid(containerUid);
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