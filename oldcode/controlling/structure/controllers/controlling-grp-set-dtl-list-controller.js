/**
 * Created by lcn on 5/22/2019.
 */

(function () {

	'use strict';
	var moduleName = 'controlling.structure';

	angular.module(moduleName).controller('controllingStructureGrpSetDTLListController',['$scope','platformGridControllerService','controllingStructureGrpSetDTLUIStandardService','controllingStructureGrpSetDTLValidationService','$injector',
		function ($scope,platformGridControllerService,gridColumns,validationService,$injector) {
			var gridConfig = {initCalled: false,columns: []};
			var dataService = $scope.getContentValue('dataService');
			if (angular.isString(dataService)) {
				dataService = $injector.get(dataService);
			}
			if (angular.isFunction(dataService)) {
				dataService = dataService.call(this);
			}
			function updateTools(itemTypeFk){
				var tools = $scope.tools;
				if(tools) {
					_.forEach($scope.tools.items, (item) => {
						if (item.id === 'create' || item.id === 'delete' || item.id==='t14') {
							if (itemTypeFk === 7) {
								item.disabled = true;
							} else {
								item.disabled = false;
							}
						}
					});
					$scope.tools.update();
				}
			}
			function ItemTypeChange() {
				$scope.parentItem =dataService.parentService().getSelected();

				if(!_.isNil($scope.parentItem)) {
					let itemTypeFk = $scope.parentItem.BasItemTypeFk;
					updateTools(itemTypeFk);
					let itemList = dataService.getList();
					_.forEach(itemList,(item)=>{
						dataService.readonlyFieldsByItemType(item,itemTypeFk);
					});
				}
			}
			dataService.updateToolsEvent.register(ItemTypeChange);

			validationService = validationService(dataService);
			platformGridControllerService.initListController($scope,gridColumns,dataService,validationService,gridConfig);

		}
	]);
	angular.module(moduleName).controller('controllingStructureGrpSetDTLDetailController',['$scope','platformDetailControllerService','controllingStructureGrpSetDTLUIStandardService','controllingStructureGrpSetDTLValidationService','platformTranslateService','$injector',
		function ($scope,platformDetailControllerService,gridColumns,validationService,platformTranslateService,$injector) {
			var dataService = $scope.getContentValue('dataService');
			if (angular.isString(dataService)) {
				dataService = $injector.get(dataService);
			}
			if (angular.isFunction(dataService)) {
				dataService = dataService.call(this);
			}
			validationService = validationService(dataService);
			platformDetailControllerService.initDetailController($scope,dataService,validationService,gridColumns,platformTranslateService);

		}
	]);
})();