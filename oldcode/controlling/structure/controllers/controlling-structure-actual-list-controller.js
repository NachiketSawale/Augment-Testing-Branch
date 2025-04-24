(function () {
	'use strict';

	var moduleName = 'controlling.structure';

	angular.module(moduleName).controller('controllingStructureActualListController',[
		'$scope','platformGridControllerService','controllingStructureActualUIStandardService','controllingStructureActualDataService',
		function ($scope,platformGridControllerService,gridColumns,dataService) {
			var gridConfig = {initCalled: false,columns: []};
			platformGridControllerService.initListController($scope,gridColumns,dataService, {},gridConfig);

			$scope.addTools([
				{
					id: 'refresh',
					caption: 'cloud.desktop.navBarRefreshDesc',
					type: 'item',
					iconClass: 'tlb-icons ico-refresh',
					fn: function (){
						dataService.load();
					},
					disabled: function () {
						return !dataService.canLoad();
					},
					permission: '#r'
				}
			]);
		}
	]);
})();
