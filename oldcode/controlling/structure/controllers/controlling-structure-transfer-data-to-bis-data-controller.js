/**
 * Created by myh on 09/27/2019.
 */


(function () {

	'use strict';

	var moduleName = 'controlling.structure';

	/**
     * @ngdoc controller
     * @name controllingStructureTransferDataToBisDataController
     * @function
     *
     * @description
     * controller for a controllingStructureTransferDataToBisDataController data grid
     */
	angular.module(moduleName).controller('controllingStructureTransferDataToBisDataController', [
		'_', '$injector', '$scope','$timeout', 'platformGridAPI', 'platformTranslateService', '$translate', 'controllingStructureTransferDataToBisDataService', 'controllingStructureTransferCostGroupUiStandardService',
		'controllingStructureTransferDataToBisDataValidationService',
		function (_, $injector, $scope, $timeout,platformGridAPI, platformTranslateService, $translate, controllingStructureTransferDataToBisDataService, controllingStructureTransferCostGroupUiStandardService,
			controllingStructureTransferDataToBisDataValidationService) {

			$scope.gridId = '543ab29ce8134eee88ec11258852dc79';
			$scope.gridHistroyId = 'EF5F74B504614158B106528B89048A56';
			$scope.versionType =2;

			var project = controllingStructureTransferDataToBisDataService.getProject();


			var updateLineitemConf = controllingStructureTransferDataToBisDataService.getUpdateLineItemConfig();

			$scope.entity = {
				// AQ
				updateAQLabel : $translate.instant('controlling.structure.updatePlannedQty'),// + '(' + $translate.instant('controlling.structure.lastUpdateAt') + ' : ' + lastModifiedAQDate + ')',
				updatePlannedQty : !!updateLineitemConf.updateAQ,

				// IQ
				updateIQLabel : $translate.instant('controlling.structure.updateInstalledQty'),// + '(' + $translate.instant('controlling.structure.lastUpdateAt') + ' : ' + lastModifiedIQDate + ')',
				updateInstalledQty : !!updateLineitemConf.updateIQ,
				insQtyUpdateFrom : updateLineitemConf.updateIQFrom,

				// Revenue
				revenueUpdateFrom : updateLineitemConf.updateRevenueFrom,
				updateRevenue : !!updateLineitemConf.updateRevenue,

				// BQ
				updateBQLabel : $translate.instant('controlling.structure.updateBillingQty'),
				updateBillingQty : !!updateLineitemConf.updateBQ,

				// FQ
				updateFQLabel : $translate.instant('controlling.structure.updateForecastingPlannedQty'),
				updateForecastingPlannedQty : !!updateLineitemConf.updateFQ,

				projectId : project.Id,
				projectIsCompletePerformance : project.IsCompletePerformance,
				debugMode : false
			};

			$scope.setInsQtyUpdateFrom = function(value)
			{
				$scope.entity.insQtyUpdateFrom = value;
			};

			$scope.setRevenueUpdateFrom = function(value)
			{
				$scope.entity.revenueUpdateFrom = value;
			};

			$scope.resetUpdateIQOption = function(updateIQ)
			{
				$scope.entity.insQtyUpdateFrom = updateIQ ? updateLineitemConf.updateIQFrom : 0;
			};

			$scope.resetUpdateRevenueOption = function(updateRevenue)
			{
				$scope.entity.revenueUpdateFrom = updateRevenue ? updateLineitemConf.updateRevenueFrom : 0;
			};

			var histroyEntities = [];
			var ribPrjHistoryList = [];

			$scope.error = {
				show: false,
				message: 'Error message',
				messageCol: 1,
				type: 3
			};

			$scope.histroyEntities ={
				valueMember: 'value',
				displayMember: 'value',
				items :histroyEntities
			};

			function initRadioBtnNData(){
				$scope.entity.versionType = $scope.versionType;

				// init the histroy Grid list data
				ribPrjHistoryList = controllingStructureTransferDataToBisDataService.getHistoryList();
				bindData();
			}

			function bindData(){
				if(ribPrjHistoryList && ribPrjHistoryList.length){
					// var  histroyIds = _.map(ribPrjHistoryList,'RibHistoryId');
					// histroyIds = _.uniq(histroyIds);
					ribPrjHistoryList = _.orderBy(ribPrjHistoryList, ['RibHistoryId']);
					_.forEach(ribPrjHistoryList, function (d) {
						var item ={};
						item.value = d.RibHistoryId;
						item.description = d.HistoryDescription;
						item.ribPrjHistroyKey = d.Id;
						histroyEntities.push(item);
					});
				}

				$scope.histroyEntities ={
					valueMember: 'value',
					displayMember: 'value',
					items :histroyEntities
				};

				var grid = platformGridAPI.grids.element('id', $scope.gridHistroyId);
				if(grid){
					grid.data  = ribPrjHistoryList;
				}
				$scope.entity.ribHistoryId = -1;
			}

			initRadioBtnNData();

			$scope.gridData = {
				state: $scope.gridId
			};

			$scope.gridHistroyData ={
				state:$scope.gridHistroyId
			};

			$scope.isOpen = false;
			$scope.isHistroyOpen = false;

			$scope.isDisabledHistroyId = true;

			// Just need to resize once grid
			var resized = false;
			var resizedHistroyGrid = false;
			$scope.onOpen = function onOpen(value) {
				if (value && !resized) {
					resized = true;
					platformGridAPI.grids.resize($scope.gridId);
				}
			};

			$scope.UpdateLastVersionSelected = true;
			$scope.onVersionSelected = function (value) {

				$scope.entity.versionType = value;

				if(value === 2 ){
					$scope.UpdateLastVersionSelected = true;
					$scope.isDisabledHistroyId = true;
					$scope.isDisableOkBtn = $scope.error.show && !$scope.error.canContinue;
					$scope.entity.ribHistoryId = -1;
					$scope.entity.histroyRemark = null;
					$scope.entity.historyDescription = null;

				}else{
					$scope.UpdateLastVersionSelected = false;
					$scope.isDisabledHistroyId = false;
					if(!$scope.entity.histroyRemark){
						$scope.isDisableOkBtn = true;
					}else{
						$scope.isDisableOkBtn = $scope.error.show && !$scope.error.canContinue;
					}

					$scope.entity.ribHistoryId = histroyEntities && histroyEntities.length ? histroyEntities[0].value: -1;
					$scope.entity.historyDescription = histroyEntities && histroyEntities.length ? histroyEntities[0].description: null;
				}
			};

			$scope.onHistroyOpen = function onHistroyOpen(value) {
				if (value && !resizedHistroyGrid) {
					resizedHistroyGrid = true;
					platformGridAPI.grids.resize($scope.gridHistroyId);
				}
			};

			$scope.onRibHistoryIdChanged = function(arg,arg2){
				if(arg && arg.items && arg.items.length){
					var item =_.find(arg.items,{'value':arg2});
					if(item){
						$scope.entity.historyDescription = item.description;
					}
				}
			};

			$scope.remarkChanged = function remarkChanged(){
				if(!$scope.entity.histroyRemark || !ribPrjHistoryList.length){
					$scope.isDisableOkBtn = true;
				}else{
					$scope.isDisableOkBtn = $scope.error.show && !$scope.error.canContinue;
				}
			};

			function navigateToProject(){
				var naviService = $injector.get('platformModuleNavigationService');
				var navigator = naviService.getNavigator('project.main');

				$scope.close();
				naviService.navigate(navigator, {PrjProjectFk: project.Id}, 'PrjProjectFk');
			}

			$scope.config = {
				project: {
					lookupDirective: 'procurement-project-lookup-dialog',
					descriptionMember: 'ProjectName',
					lookupOptions: {
						readOnly: true,
						extButtons: [
							{
								class: 'tlb-icons ico-goto '+_.uniqueId('_navigator'),
								style: {'background-size': '22px 22px'},
								execute: navigateToProject,
								canExecute: function () { return true; }
							}
						]
					}
				}
			};

			var validateResult = controllingStructureTransferDataToBisDataService.getValidateResult();
			controllingStructureTransferDataToBisDataValidationService.handleValidateResult($scope, validateResult);

			if (!platformGridAPI.grids.exist($scope.gridId)) {
				var grid = {
					id: $scope.gridId,
					data: controllingStructureTransferDataToBisDataService.getList(),
					columns: angular.copy(controllingStructureTransferCostGroupUiStandardService.getStandardConfigForListView().columns),
					options: {
						tree: false,
						indicator: true,
						iconClass: '',
						multiSelect: false,
						enableDraggableGroupBy: false
					},
					lazyInit: true,
					enableConfigSave: false
				};

				platformGridAPI.grids.config(grid);
				platformTranslateService.translateGridConfig(grid.columns);
			}

			if (!platformGridAPI.grids.exist($scope.gridHistroyId)) {
				var myGrid = {
					id: $scope.gridHistroyId,
					data: controllingStructureTransferDataToBisDataService.getHistoryList(),
					columns: angular.copy(controllingStructureTransferCostGroupUiStandardService.getHistoryStandardConfigListView().columns),
					options: {
						tree: false,
						indicator: true,
						iconClass: '',
						multiSelect: false,
						enableDraggableGroupBy: false
					},
					lazyInit: true,
					enableConfigSave: false
				};

				platformGridAPI.grids.config(myGrid);
				platformTranslateService.translateGridConfig(myGrid.columns);
			}



			$scope.onOK = function onOK(event){
				$scope.isLoading = true;
				$scope.isDisableOkBtn = true;
				$scope.entity.debugMode = event.ctrlKey;

				controllingStructureTransferDataToBisDataService.transferData2BisData($scope.$parent, $scope, $scope.entity);
			};

			$scope.onKeyPress = function onKeyPress(event){
				$scope.ctrlKeyIsPressed = event.ctrlKey;
			};

			$scope.close = function close() {
				$scope.$parent.$close();
			};

			$scope.canOk = function close() {
				return $scope.error.show && !$scope.error.canContinue;
			};

			$timeout(function () {
				$scope.isDisableOkBtn = $scope.error.show && !$scope.error.canContinue;
			});

			// $scope.entity.ribHistoryId = histroyEntities && histroyEntities.length ? histroyEntities[0].value: null;
			controllingStructureTransferDataToBisDataService.registerFilters();

			$scope.$on('$destroy', function () {
				platformGridAPI.grids.unregister($scope.gridId);
				platformGridAPI.grids.unregister($scope.gridHistroyId);
				controllingStructureTransferDataToBisDataService.unregisterFilters();
			});

		}
	]);
})(angular);
