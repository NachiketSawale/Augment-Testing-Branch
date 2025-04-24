/**
 * Created by lav on 4/28/2019.
 */
(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.common';

	angular.module(moduleName).controller('ppsCommonCostGroupListController', ResultListController);

	ResultListController.$inject = ['$scope',
		'platformGridControllerService',
		'ppsCommonCostGroupUIStandardService',
		'ppsCommonCostGroupDataService',
		'$injector'];

	function ResultListController($scope,
								  platformGridControllerService,
								  ppsCommonCostGroupUIStandardService,
								  ppsCommonCostGroupDataService,
								  $injector) {
		var myGridConfig = {initCalled: false, columns: []};
		var costGroupService = $injector.get($scope.getContentValue('costGroupService'));
		var options = {
			serviceKey: $scope.getContentValue('uuid'),
			parentService: costGroupService.parentService(),
			dataLookupType: costGroupService.getDataLookupType(),
			route: costGroupService.getRoute(),
			initReadData: costGroupService.initReadData
		};
		var dataService = ppsCommonCostGroupDataService.getService(options);
		platformGridControllerService.initListController($scope, ppsCommonCostGroupUIStandardService, dataService, {}, myGridConfig);

		/* add costGroupService to mainService */
		if (!dataService.costGroupService) {
			dataService.costGroupService = $injector.get($scope.getContentValue('costGroupService'));
		}

		/* register the cellChange event */
		dataService.costGroupService.registerCellChangedEvent($scope.gridId);

		$scope.$on('$destroy', function () {
			dataService.costGroupService.unregisterCellChangedEvent($scope.gridId);
		});
	}

})(angular);