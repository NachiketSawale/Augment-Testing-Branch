/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';
	const moduleName = 'awp.main';

	angular.module(moduleName).controller('awpMainServicePackagesController',
		['_', '$scope', 'platformGridAPI', 'platformGridControllerService', 'awpMainServicePackagesDataService', 'awpMainServicePackagesUiService',
			function (_, $scope, platformGridAPI, platformGridControllerService, awpMainServicePackagesDataService, awpMainServicePackagesUiService) {

				platformGridControllerService.initListController($scope, awpMainServicePackagesUiService, awpMainServicePackagesDataService, null, {
					initCalled: false,
					columns: [],
					isRoot: false,
					parentProp: 'ParentFk',
					childProp: 'Children',
					skipPermissionCheck: true,
					multiSelect: false
				});

				function updateTools() {
					_.forEach($scope.tools.items, tool=>{
						switch (tool.id){
							case 'createChild':
								tool.disabled = function (){
									let selected = awpMainServicePackagesDataService.getSelected();

									return !selected || selected.TypeFk >=0;
								}
								break;
							case 'create':
								tool.disabled = function (){
									let selected = awpMainServicePackagesDataService.getSelected();

									return selected && selected.TypeFk >=0 && selected.TypeFk !== 103;
								}
								break;
							case 'delete':
								break;
						}
					})
					$scope.tools.update();
				}

				updateTools();

				function onChangeGridContent() {
					updateTools();
				}

				platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', onChangeGridContent);

				$scope.$on('$destroy', function () {
					if (platformGridAPI.grids.exist($scope.gridId)) {
						platformGridAPI.grids.unregister($scope.gridId);

					}
					platformGridAPI.events.unregister($scope.gridId, 'onSelectedRowsChanged', onChangeGridContent);
				});
			}
		]);
})();