(function(angular) {
	'use strict';
	/* global  angular */
	const moduleName = 'productionplanning.common';

	angular.module(moduleName).controller('ppsCommonProductTransportHistoryListController', ppsCommonProductTransportHistoryListController);

	ppsCommonProductTransportHistoryListController.$inject = ['$scope', 'platformGridControllerService', 'ppsCommonProductTransportHistoryDataService', 'ppsCommonProductTransportHistoryUIStandardService'];

	function ppsCommonProductTransportHistoryListController($scope, gridControllerService,
		dataService,
		uiStandardService) {

		var gridConfig = { initCalled: false, columns: [] };
		var uuid = $scope.getContentValue('uuid');
		var parentService = $scope.getContentValue('parentService');
		var parentFilter = $scope.getContentValue('parentFilter');
		var endRead = $scope.getContentValue('endRead');
		var ds = dataService.getService(uuid, {parentService : parentService, parentFilter: parentFilter , endRead: endRead} );
		gridControllerService.initListController($scope, uiStandardService, ds, null, gridConfig);

		$scope.$on('$destroy', function() {

		});
	}

})(angular);