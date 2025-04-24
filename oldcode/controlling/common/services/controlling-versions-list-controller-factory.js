(function () {
	'use strict';
	var moduleName = 'controlling.common';
	var controllingCommonModule = angular.module(moduleName);

	controllingCommonModule.factory('controllingVersionsListControllerFactory',
		['_','platformGridControllerService','controllingVersionsListUIStandardService',
			function (_,platformGridControllerService,controllingVersionsListUIStandardService) {

				var factory = {};

				factory.initControllingVersionListController = function initControllingVersionListController(scope, dataService){
					var gridConfig = {
						columns: []
					};

					controllingVersionsListUIStandardService.setDataService(dataService);
					platformGridControllerService.initListController(scope, controllingVersionsListUIStandardService, dataService, null, gridConfig);

					dataService.setGridId(scope.gridId);
					function  initTools(){

						var btns2Hidden = ['create','t14'];
						scope.tools.items = _.filter(scope.tools.items, function (toolItem) {
							return btns2Hidden.indexOf(toolItem.id)<=-1;
						});

						scope.addTools([
							{
								id: 'delete',
								sort: 10,
								caption: 'cloud.common.taskBarDeleteRecord',
								type: 'item',
								iconClass: 'tlb-icons ico-rec-delete',
								fn: function () {
									var selectedItem = dataService.getSelected();
									dataService.deleteItem(selectedItem);
								},
								disabled: function () {
									var selected = dataService.getSelected();
									return !selected;
								}
							}
						]);

						scope.tools.update();
					}

					initTools();
				};

				return factory;
			}]);
})();
