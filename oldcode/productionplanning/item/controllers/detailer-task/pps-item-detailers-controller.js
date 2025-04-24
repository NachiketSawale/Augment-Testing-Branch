(function () {
	'use strict';

	var moduleName = 'productionplanning.item';
	angular.module(moduleName).controller('ppsItemDetailersController', [
		'$scope',
		'platformSourceWindowControllerService',
		'basicsCommonToolbarExtensionService',
		'ppsItemDetailersDataService',
		'$timeout',
		'platformGridAPI',
		'ppsItemDetailersFilterService',
		function ($scope,
				  platformSourceWindowControllerService,
				  basicsCommonToolbarExtensionService,
				  ppsItemDetailersDataService,
				  $timeout,
				  platformGridAPI,
				  ppsItemDetailersFilterService) {

			var sourceFSName = 'ppsItemDetailersFilterService';
			var uuid = $scope.getContainerUUID();
			platformSourceWindowControllerService.initSourceFilterController($scope, uuid,
				'productionplanningItemContainerInformationService', sourceFSName);

			$timeout(function () {
				basicsCommonToolbarExtensionService.insertBefore($scope, {
					id: 'assignDetailerBtn',
					caption: 'productionplanning.item.TrsAssignedQuantity',
					type: 'item',
					iconClass: 'control-icons ico-search-user',
					fn: function () {
						ppsItemDetailersDataService.assign();
					},
					disabled: function () {
						return !ppsItemDetailersDataService.canAssign();
					}
				});
				$scope.updateTools();
			}, 200);

			var ppsItemTreeGridId = '5907fffe0f9b44588254c79a70ba3af1';
			var ppsItemFlatGridId='3598514b62bc409ab6d05626f7ce304b';
			platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
			platformGridAPI.events.register(ppsItemTreeGridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
			platformGridAPI.events.register(ppsItemFlatGridId, 'onSelectedRowsChanged', onSelectedRowsChanged);

			ppsItemDetailersFilterService.onRoleIdChanged.register(onRoleIdChanged);

			function onRoleIdChanged(entity) {
				onSelectedRowsChanged();
				ppsItemDetailersFilterService.applyFilterSetting(entity.roleId);
			}

			function onSelectedRowsChanged() {
				$scope.tools.update();
			}

			$scope.$on('$destroy', function () {
				platformGridAPI.events.unregister(ppsItemTreeGridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
				platformGridAPI.events.unregister(ppsItemFlatGridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
				platformGridAPI.events.unregister($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
				ppsItemDetailersFilterService.onRoleIdChanged.unregister(onSelectedRowsChanged);
			});
		}
	]);
})();