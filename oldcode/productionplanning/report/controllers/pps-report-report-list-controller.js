/**
 * Created by anl on 1/24/2017.
 */

(function () {
	/* global angular */
	'use strict';
	var moduleName = 'productionplanning.report';


	angular.module(moduleName).controller('productionplanningReportReportListController', ReportListController);

	ReportListController.$inject = ['$scope', 'platformContainerControllerService',
		'platformTranslateService', 'productionplanningReportReportUIStandardService',
		'ppsCommonModelFilterService', 'productionplanningReportReportDataService',
		'productionplanningReportGobacktoBtnsExtension','basicsCommonToolbarExtensionService'];

	function ReportListController($scope, platformContainerControllerService,
	                              platformTranslateService, uiStandardService,
	                              ppsCommonModelFilterService, dataServ,
		gobacktoBtnsExtension, basicsCommonToolbarExtensionService) {
		platformTranslateService.translateGridConfig(uiStandardService.getStandardConfigForListView().columns);
		var containerUid = $scope.getContentValue('uuid');
		platformContainerControllerService.initController($scope, moduleName, containerUid);

		dataServ.registerSelectedEntitiesChanged(ppsCommonModelFilterService.updateMainEntityFilter);
		basicsCommonToolbarExtensionService.insertBefore($scope, gobacktoBtnsExtension.createGobacktoBtns(dataServ));

		$scope.$on('$destroy', function () {
			dataServ.unregisterSelectedEntitiesChanged(ppsCommonModelFilterService.updateMainEntityFilter);
		});
	}
})();
