(function () {
	'use strict';

	var moduleName = 'transportplanning.requisition';
	angular.module(moduleName).controller('trsRequisitionTrsGoodsFilterController', [
		'$scope',
		'platformSourceWindowControllerService',
		'transportplanningTransportMainService',
		'trsRequisitionTrsGoodsFilterService',
		'trsRequisitionTrsGoodsFilterDataService',
		'basicsCommonToolbarExtensionService',
		'platformGridAPI',
		function ($scope,
				  platformSourceWindowControllerService,
				  transportMainService,
				  trsGoodsFilterService,
				  trsGoodsFilterDataService,
				  basicsCommonToolbarExtensionService,
				  platformGridAPI) {

			var sourceFSName = 'trsRequisitionTrsGoodsFilterService';
			var uuid = $scope.getContainerUUID();
			var options = {
				afterInitSubController: function () {
					basicsCommonToolbarExtensionService.insertBefore($scope,
						[{
							id: 'createRouteBtn',
							caption: 'transportplanning.transport.wizard.createTrasnsportRoute',
							type: 'item',
							iconClass: 'tlb-icons ico-rec-new',
							fn: function () {
								trsGoodsFilterDataService.createRoute(transportMainService);
							},
							disabled: function () {
								return !trsGoodsFilterDataService.canCreateRoute();
							}
						}, {
							id: 'updateRouteBtn',
							caption: 'transportplanning.transport.wizard.updateTrasnsportRoute',
							type: 'item',
							iconClass: 'tlb-icons ico-append',
							fn: function () {
								trsGoodsFilterDataService.updateRoute(transportMainService);
							},
							disabled: function () {
								return !trsGoodsFilterDataService.canUpdateRoute(transportMainService);
							}
						}
						]);
					$scope.updateTools();
				}
			};
			platformSourceWindowControllerService.initSourceFilterController($scope, uuid,
				'transportplanningTransportContainerInformationService', sourceFSName, options);
			transportMainService.registerSelectionChanged(onSelectionChanged);

			function onSelectionChanged(e, entity) {
				if (entity) {
					trsGoodsFilterService.setDate(entity.PlannedStart);
				}
			}

			onSelectionChanged(null, transportMainService.getSelected());
			trsGoodsFilterDataService.setSelectedFilter();

			platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);

			function onSelectedRowsChanged() {
				$scope.tools.update();
			}

			$scope.$on('$destroy', function () {
				platformGridAPI.events.unregister($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
				transportMainService.unregisterSelectionChanged(onSelectionChanged);
			});
		}
	]);
})();