(function (angular) {
	'use strict';

	let moduleName = 'controlling.configuration';
	angular.module(moduleName).controller('controllingConfigurationColumnDefinitionListController',
		['$scope','$injector','$timeout', '_', 'platformGridControllerService', 'controllingConfigurationColumnDefinitionDataService', 'controllingConfigurationColumnDefinitionConfigurationService',
			function ($scope,$injector,$timeout, _, platformGridControllerService, dataService, configurationService) {

				let myGridConfig = {
					initCalled: false, columns: [],
					sortOptions: {
						initialSortColumn: {field: 'code', id: 'code'},
						isAsc: true
					},
					type: 'controlling.configuration',
					dragDropService : $injector.get('basicsCommonClipboardService')
				};

				platformGridControllerService.initListController($scope, configurationService, dataService, null, myGridConfig);

				function updateTools() {
					$scope.tools.items = _.filter($scope.tools.items,function (d) {
						return   d.id === 't12' ||  d.id==='t108' || d.id ==='gridSearchAll' || d.id ==='gridSearchColumn' || d.id ==='t200';
					});
					$timeout(function () {
						$scope.tools.update();
					});
				}
				updateTools();
				function init(){
					if(!dataService.getList().length){
						dataService.load();
					}
				}
				init();
				$scope.$on ('$destroy', function () {
				});
			}
		]);
})(angular);
