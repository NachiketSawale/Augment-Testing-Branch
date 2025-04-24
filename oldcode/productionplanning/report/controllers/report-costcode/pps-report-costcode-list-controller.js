/**
 * Created by anl on 4/20/2020.
 */


(function () {
	/*global angular*/
	'use strict';
	var moduleName = 'productionplanning.report';

	angular.module(moduleName).controller('productionplanningReportCostCodeListController', ReportCostCodeListController);

	ReportCostCodeListController.$inject = ['$scope', 'platformContainerControllerService',
		'platformGridAPI',
		'productionplanningReportContainerInformationService',
		'productionplanningReportCostCodeContainerService',
		'productionplanningReportReportDataService'];

	function ReportCostCodeListController($scope, platformContainerControllerService,
										  platformGridAPI,
										  reportContainerInformationService,
										  reportCostCodeContainerService,
										  reportDataService) {

		var containerUid = $scope.getContentValue('uuid');
		var originLayout = '187a17f9e2ca468a9d2cab369d28e4bf';
		var initConfig = {
			id: containerUid,
			layout: containerUid,
			usedLayout: originLayout,
			moduleName: moduleName
		};

		if (!reportContainerInformationService.hasDynamic(containerUid)) {
			reportCostCodeContainerService.prepareGridConfig(containerUid,
				reportContainerInformationService, initConfig, reportDataService);
		}

		platformContainerControllerService.initController($scope, moduleName, containerUid);

		var reportCostCodeContainerInfo = reportContainerInformationService.getContainerInfoByGuid(containerUid);
		var reportCostCodeDataService = reportCostCodeContainerInfo.dataServiceName;
		var reportCostCodeValidationService = reportCostCodeContainerInfo.validationServiceName;

		var onCellChange = function (e, args) {
			var col = args.grid.getColumns()[args.cell].field;
			if (col === 'CostCodeFk') {
				reportCostCodeDataService.updateUom(args.item, reportCostCodeValidationService);
			}
		};

		platformGridAPI.events.register($scope.gridId, 'onCellChange', onCellChange);
		reportCostCodeDataService.registerFilter();
		// un-register on destroy
		$scope.$on('$destroy', function () {
			platformGridAPI.events.unregister($scope.gridId, 'onCellChange', onCellChange);
			reportCostCodeDataService.unregisterFilter();
		});
	}
})();