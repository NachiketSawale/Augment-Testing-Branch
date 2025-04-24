/**
 * Created by wui on 4/6/2016.
 */

(function (angular) {
	'use strict';

	var moduleName = 'constructionsystem.main';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('constructionSystemMainJobListController', [
		'$scope',
		'$timeout',
		'platformGridControllerService',
		'constructionSystemMainJobUIConfigService',
		'constructionSystemMainJobDataService',
		'_',
		function ($scope, $timeout, platformGridControllerService, uiConfigService, dataService,_) {

			platformGridControllerService.initListController($scope, uiConfigService, dataService, {}, {});

			_.remove($scope.tools.items, function (item) {
				return item.id === 'create';
			});

			$scope.addTools([
				{
					id: 't-delete-all',
					sort: 10,
					caption: 'constructionsystem.main.taskBarDeleteAll',
					type: 'item',
					iconClass: 'tlb-icons ico-discard',
					fn: dataService.deleteAll,
					disabled: dataService.disableDeleteAll
				}, {
					id: 't-refresh',
					sort: 10,
					caption: 'cloud.common.toolbarRefresh',
					type: 'item',
					iconClass: 'tlb-icons ico-refresh',
					fn: dataService.refresh,
					disabled: false
				}/* , {
					id: 't-cancel',
					sort: 10,
					caption: 'cloud.common.taskBarCancel',
					type: 'item',
					iconClass: 'tlb-icons ico-stop',
					fn: dataService.cancelItem,
					disabled: dataService.disableCancelItem
				} */
			]);

			dataService.loadJobs();

			var stopFunc = dataService.queryStatus();

			$scope.$on('$destroy', function () {
				stopFunc();
			});
		}
	]);
})(angular);
