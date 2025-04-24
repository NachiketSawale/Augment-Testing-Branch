/**
 * Created by wui on 12/24/2015.
 */
/* global _ */
(function (angular) {
	'use strict';

	var moduleName = 'constructionsystem.master';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('constructionsystemMasterLineItemController', ['$scope', '$injector',
		'platformGridControllerService',
		'constructionSystemMasterLineItemUIStandardService',
		'platformGridAPI',
		function (
			$scope,
			$injector,
			platformGridControllerService,
			constructionSystemMasterLineItemUIStandardService,
			platformGridAPI) {

			var dataServiceName = $scope.getContentValue('dataService');
			var dataService = $injector.get(dataServiceName);

			platformGridControllerService.initListController($scope,
				constructionSystemMasterLineItemUIStandardService,
				dataService, {}, {});

			platformGridAPI.events.register($scope.gridId, 'onBeforeEditCell', onBeforeEditCell);

			if(angular.isFunction(dataService.refresh)) {
				// add refresh button
				$scope.addTools([
					{
						id: 'refresh',
						sort: 10,
						caption: 'constructionsystem.master.taskBarUpdate',
						type: 'item',
						iconClass: 'tlb-icons ico-refresh',
						fn: dataService.refresh,
						disabled: false
					}
				]);
			}

			// remove create and delete buttons.
			_.remove($scope.tools.items, function(item) {
				return item.id === 'create' || item.id === 'delete';
			});

			$scope.$on('$destroy', function(){
				platformGridAPI.events.unregister($scope.gridId, 'onBeforeEditCell', onBeforeEditCell);
			});

			function onBeforeEditCell() {
				return false;
			}

		}
	]);

})(angular);