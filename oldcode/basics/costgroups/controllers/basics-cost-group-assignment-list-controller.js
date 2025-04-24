/**
 * Created by lav on 4/28/2019.
 */
(function (angular) {
	'use strict';

	var moduleName = 'basics.costgroups';

	angular.module(moduleName).controller('basicsCostGroupAssignmentListController', ResultListController);

	ResultListController.$inject = ['$scope',
		'platformGridControllerService',
		'basicsCostGroupAssignmentUIStandardService',
		'basicsCostGroupCommonDataService',
		'$injector'];

	function ResultListController($scope,
								  platformGridControllerService,
								  basicsCostGroupAssignmentUIStandardService,
								  basicsCostGroupCommonDataService,
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
		var dataService = basicsCostGroupCommonDataService.getService(options);
		costGroupService.costGroupAssignmentService = dataService;

		platformGridControllerService.initListController($scope, basicsCostGroupAssignmentUIStandardService, dataService, {}, myGridConfig);

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