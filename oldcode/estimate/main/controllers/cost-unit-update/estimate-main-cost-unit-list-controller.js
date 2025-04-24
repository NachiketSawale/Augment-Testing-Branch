/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {
	'use strict';

	let modModule = 'estimate.main';

	angular.module(modModule).controller('estimateMainCostUnitListController', ['$scope','platformGridAPI','$injector', 'platformGridControllerService',
		'estimateMainCostUnitDataService','estimateMainCostUnitListOfCostCodeUI','estimateMainCostUnitListOfMaterialUI',
		function ($scope, platformGridAPI, $injector, platformGridControllerService,
			estimateMainCostUnitDataService,estimateMainCostUnitListOfCostCodeUI,estimateMainCostUnitListOfMaterialUI) {
			let gridConfig = {
				columns: [],
				type:'costUnitList',
				property: 'LgmJobFk',
				skipPermissionCheck: true
			};

			$scope.gridId = '5225da5ad627405a8996aa2298cc006d';
			let estimateMainResourceType = $injector.get('estimateMainResourceType');

			$scope.getContainerUUID = function () {
				return $scope.gridId;
			};

			$scope.close = function () {
				$scope.$close(false);
			};

			$scope.setTools = function () {};
			$scope.tools = {update :function(){}};

			if(platformGridAPI.grids.exist($scope.gridId)){
				platformGridAPI.grids.unregister($scope.gridId);
			}

			let resourceDataService = $injector.get('estimateMainResourceService');

			let entity = resourceDataService.getSelected();
			let uiService = entity.EstResourceTypeFk === estimateMainResourceType.CostCode ? estimateMainCostUnitListOfCostCodeUI : estimateMainCostUnitListOfMaterialUI;
			uiService.setReadOnly(true);

			let dataOpt = {
				entity:entity,
				onlyShowSelected:false,
				uuid:$scope.gridId
			};

			let dataService = estimateMainCostUnitDataService.getDataService(dataOpt);

			let udpService = dataService.registerUserDefinedColumnService(uiService,true);

			platformGridControllerService.initListController($scope, uiService, dataService, null, gridConfig);

			estimateMainCostUnitDataService.loadData(dataService, entity, true);
			$scope.refresh = function() {
				estimateMainCostUnitDataService.loadData(dataService, entity, true);
			};

			function onGridClick(e, args) {
				let selected = args.grid.getDataItem(args.row);
				if(entity.LgmJobFk === selected.LgmJobFk){
					$scope.close();
					return;
				}

				entity.LgmJobFk = selected.LgmJobFk;
				entity.IsRate = selected.IsRate;
				entity.BasCurrencyFk = selected.CurrencyFk;
				$injector.get('estimateMainResourceDetailService').fieldChange(entity, 'LgmJobFk');

				$scope.close();
			}
			function onInitialized() {
				if(udpService) {
					udpService.loadDynamicColumns();
				}
			}

			platformGridAPI.events.register($scope.gridId, 'onClick', onGridClick);
			platformGridAPI.events.register($scope.gridId, 'onInitialized', onInitialized);
			// un-register on destroy
			$scope.$on('$destroy', function () {
				dataService.unRegisterUserDefinedColumnService();
				if (platformGridAPI.grids.exist($scope.gridId)) {
					platformGridAPI.grids.unregister($scope.gridId);
				}
				platformGridAPI.events.unregister($scope.gridId, 'onClick', onGridClick);
				platformGridAPI.events.unregister($scope.gridId, 'onInitialized', onInitialized);
			});
		}
	]);
})(angular);
