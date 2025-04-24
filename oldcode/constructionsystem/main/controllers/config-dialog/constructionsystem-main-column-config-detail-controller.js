(function(angular){
	// eslint-disable-next-line no-redeclare
	/* globals angular */
	'use strict';

	var moduleName = 'constructionsystem.main';

	angular.module(moduleName).controller('constructionsystemMainColumnConfigDetalController',[
		'$scope','platformCreateUuid','$timeout','platformGridAPI','$injector','platformGridControllerService',
		'constructionsystemMainColumnConfigUIStandardService','constructionsystemMainColumnConfigDetailDataService',
		'estimateMainEstColumnConfigDetailValidationService','constructionsystemMainColumnConfigDataService',
		'estimateMainDialogProcessService',
		function($scope,platformCreateUuid,$timeout,platformGridAPI,$injector,platformGridControllerService,
			configDetailUIConfigService,constructionsystemMainColumnConfigDetailDataService,
			configDetailValidationService,constructionsystemMainColumnConfigDataService,
			estimateMainDialogProcessService){
			var gridConfig = {
				initCalled: false,
				columns:[],
				enableDraggableGroupBy: false,
				skipPermissionCheck: true,
				cellChangeCallBack: function (arg) {
					constructionsystemMainColumnConfigDetailDataService.setItemToSave(arg.item);
					configDetailValidationService.validGridItems(arg.item);
				}
			};

			$scope.gridId = platformCreateUuid();

			constructionsystemMainColumnConfigDetailDataService.gridId = $scope.gridId;

			$scope.onContentResized = function () {
				resize();
			};

			$scope.setTools = function (tools) {
				tools.update = function () {
					tools.version += 1;
				};
			};

			// Define standard toolbar Icons and their function on the scope
			$scope.tools = {
				showImages: true,
				showTitles: true,
				cssClass: 'tools',
				items: [
					{
						id: 'create',
						sort: 0,
						caption: 'cloud.common.taskBarNewRecord',
						type: 'item',
						iconClass: 'tlb-icons ico-rec-new',
						fn: function () {
							// var colConfig = estimateMainEstColumnConfigDataService.getColumnConfigData();
							// estimateMainEstColumnConfigDetailDataService.createItem(colConfig && colConfig.estColumnConfig ? colConfig.estColumnConfig.Id : 0);
						},
						disabled: false
					},
					{
						id: 'delete',
						sort: 10,
						caption: 'cloud.common.taskBarDeleteRecord',
						type: 'item',
						iconClass: 'tlb-icons ico-rec-delete',
						fn: function () {
							// var SelectedEntities = estimateMainEstColumnConfigDetailDataService.getSelectedEntities();
							/* angular.forEach(SelectedEntities,function(cItem){
								estimateMainEstColumnConfigDetailDataService.deleteItem(cItem);
							}); */
						},
						disabled: true
					},
					{
						id: 'moveUp',
						sort: 10,
						caption: 'estimate.main.columnConfigDetails.toolsUp',
						type: 'item',
						iconClass: 'tlb-icons ico-grid-row-up',
						fn: function () {
							// estimateMainEstColumnConfigDetailDataService.moveUp(1,$scope.gridId);
						},
						disabled: true
					},
					{
						id: 'moveDown',
						sort: 10,
						caption: 'estimate.main.columnConfigDetails.toolsDown',
						type: 'item',
						iconClass: 'tlb-icons ico-grid-row-down',
						fn: function () {
							// estimateMainEstColumnConfigDetailDataService.moveDown(3,$scope.gridId);
						},
						disabled: true
					}
				],
				update: function () {
					return;
				}
			};// TODO:Add functionality

			function resize() {
				$timeout(function () {
					updateTools();
					platformGridAPI.grids.resize($scope.gridId);
				});
			}

			function init() {
				if (platformGridAPI.grids.exist($scope.gridId)) {
					platformGridAPI.grids.unregister($scope.gridId);
				}
				var estimateConfigDetailService = $injector.get('estimateMainEstColumnConfigDetailUIStandardService');
				// TODO: Replce estimateConfigDetailService with configDetailUIConfigService if necessary
				platformGridControllerService.initListController($scope, estimateConfigDetailService, constructionsystemMainColumnConfigDetailDataService, configDetailValidationService, gridConfig);

				// eslint-disable-next-line no-unused-vars
				var config = $injector.get('estimateMainDialogProcessService').getDialogConfig();// TODO:Change

				$injector.get('constructionsystemMainConfigDialogService').currentItemChangeFire();

			}

			function setDataSource(data) {
				$scope.data = data;
				constructionsystemMainColumnConfigDetailDataService.setDataList(data);
				constructionsystemMainColumnConfigDetailDataService.refreshGrid();
			}

			function updateData(currentItem) {
				setDataSource(currentItem.estColumnConfigDetails);
			}
			// set/reset toolbar items readonly
			function updateTools(args) {
				var readOnly = false;// estimateMainDialogProcessService.isColDetailReadOnly();//TODO:Change

				var disableMoveUp = false;
				var disableMoveDown = false;

				var dataService=constructionsystemMainColumnConfigDetailDataService.getList();

				if(args){
					for(var index in args.rows){
						if(args.rows[index] === 0) {
							disableMoveUp = true;
							break;
						}
					}

					for(var index1 in args.rows){
						if(args.rows[index1] === dataService.length-1) {
							disableMoveDown = true;
							break;
						}
					}

				}else{
					disableMoveUp = true;
					disableMoveDown = true;
				}


				angular.forEach($scope.tools.items, function (item) {
					item.disabled = readOnly;
					var disable = !(args && args.rows.length>0);
					if (!readOnly && item.id === 'delete') {
						item.disabled = disable;
					}

					if (!readOnly && item.id === 'moveUp') {
						item.disabled = disableMoveUp;
					}

					if (!readOnly && item.id === 'moveDown') {
						item.disabled = disableMoveDown;
					}
				});
			}

			constructionsystemMainColumnConfigDataService.onItemChange.register(updateData);

			estimateMainDialogProcessService.onRefreshColDetail.register(updateTools);// TODO:Change

			function onSelectedRowsChanged(e, args){
				updateTools(args);
			}

			platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);

			$scope.$on('$destroy', function () {
				if (platformGridAPI.grids.exist($scope.gridId)) {
					platformGridAPI.grids.unregister($scope.gridId);
				}
				constructionsystemMainColumnConfigDataService.onItemChange.unregister(updateData);// TODO:Change
				estimateMainDialogProcessService.onRefreshColDetail.unregister(updateTools);// TODO:Change
				platformGridAPI.events.unregister($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
			});

			init();
		}
	]);
})(angular);
