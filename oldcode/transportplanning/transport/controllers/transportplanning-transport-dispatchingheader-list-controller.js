/**
 * Created by zov on 15/11/2018.
 */

(function () {
	'use strict';

	var moduleName = 'transportplanning.transport';

	angular.module(moduleName).controller('trsTransportDispatchingHeaderListController', dispatchingHeaderController);
	dispatchingHeaderController.$inject = [
		'$scope', 'platformGridControllerService', 'trsTransportDispatchingHeaderUIConfigService',
		'trsTransportDispatchingHeaderService'
	];

	function dispatchingHeaderController($scope, platformGridControllerService, uiStandardService,
										 dataService) {
		var gridConfig = {initCalled: false, columns: []};
		platformGridControllerService.initListController($scope, uiStandardService, dataService, {}, gridConfig);
		var captions = [
			'cloud.common.taskBarGrouping',
			'cloud.common.print',
			'cloud.common.taskBarSearch',
			'cloud.common.gridSettings'
		];
		//noinspection UnnecessaryLocalVariableJS
		var customTools = $scope.tools.items.filter(function (item) {
			return captions.indexOf(item.caption) > -1;
		});
		$scope.tools.items = customTools;
	}
})(angular);