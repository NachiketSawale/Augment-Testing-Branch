
(function () {
	'use strict';
	/* global _, Slick */

	let moduleName = 'estimate.main';

	angular.module(moduleName).value('estimateMainBoqHeaderControllerListColumns', {
		getStandardConfigForListView: function () {
			return {
				columns: [
					{
						id: 1,
						field: 'Reference',
						name: 'Reference No',
						name$tr$: 'boq.main.Reference',
						readonly: true,
						editor: null,
						width: 150
					},
					{ id: 'brief', field: 'BriefInfo', name: 'Brief', width: 150, toolTip: 'Brief', formatter: 'translation', name$tr$: 'boq.main.BriefInfo'}
				]
			};
		}
	});

	angular.module(moduleName).controller('estimateMainBoqHeaderController', [
		'$scope','$injector','$http','estimateMainBoqHeaderControllerListColumns', 'platformGridAPI', 'estimateMainBoqItemService', 'platformTranslateService','estimateMainBoqHeaderService','projectMainService',
		function ($scope,$injector,$http,estimateMainBoqHeaderControllerListColumns, platformGridAPI, estimateMainBoqItemService, platformTranslateService,estimateMainBoqHeaderService,projectMainService) {
			let parentScope = $scope.$parent;
			$scope.gridBoqHeaderId = '43F1D3B81BAB49FFB8E00BF131B52419';
			$scope.gridData = {
				state: $scope.gridBoqHeaderId
			};

			let gridConfig = {
				data: [],
				columns: angular.copy(estimateMainBoqHeaderControllerListColumns.getStandardConfigForListView().columns),
				id: $scope.gridBoqHeaderId,
				lazyInit: false,
				isStaticGrid: true,
				options: {
					tree: false, indicator: false,
					editorLock: new Slick.EditorLock (),
					multiSelect: false
				},
				enableConfigSave: true
			};

			platformGridAPI.grids.config(gridConfig);
			platformTranslateService.translateGridConfig(gridConfig.columns);

			let filterFunc = $scope.$eval('options.filter');

			if (parentScope.ngModel && _.isNumber(parentScope.ngModel)){
				platformGridAPI.items.data([]);
			}else{
				let prjId = $injector.get('estimateMainService').getProjectId();
				if(prjId && prjId === -1){
					let project = projectMainService.getSelected();
					if(project){
						prjId = project.Id;
					}
				}

				estimateMainBoqHeaderService.loadBoqHeader(prjId).then(function (response) {
					let boqHeaderItems = filterFunc ? filterFunc(response) : response;
					platformGridAPI.items.data($scope.gridBoqHeaderId, boqHeaderItems);
					$scope.$root.safeApply();
				});
			}

			parentScope.$watch('isCatLoading', function(isLoading){
				$scope.isLoading = isLoading;
			});

			function onListLoaded(){
				platformGridAPI.events.unregister($scope.gridBoqHeaderId, 'onSelectedRowsChanged', loadBoqItemsByBoqHeader);

				let treeData = estimateMainBoqHeaderService.getList();

				treeData = filterFunc ? filterFunc(treeData) : treeData;

				platformGridAPI.items.data($scope.gridBoqHeaderId, treeData);

				let isItemFiltered = estimateMainBoqHeaderService.isItemFilterEnabled();
				let boqItem = estimateMainBoqItemService.getHighlightBoqItem();
				let boqHeaderFk = _.isEmpty(boqItem) ? 0 : boqItem.BoqHeaderFk;

				if(getGrid()) {
					let matBoqHeader = _.find(getGrid().dataView.getItems(),function(item){
						return item.BoqHeaderFk === boqHeaderFk;
					});

					let rows = getGrid().dataView.mapIdsToRows(matBoqHeader ?[matBoqHeader.Id]:[0]);

					if (isItemFiltered) {
						getGrid().instance.setSelectedRows(rows);
						estimateMainBoqHeaderService.setItemFilter(null); // clear the filter for next search
					}
				}
				platformGridAPI.events.register($scope.gridBoqHeaderId, 'onSelectedRowsChanged', loadBoqItemsByBoqHeader);
			}


			function loadBoqItemsByBoqHeader(e, args) {
				parentScope.isLoading = true;
				let selectedBoqHeader = args.grid.getDataItem (args.rows);

				estimateMainBoqHeaderService.setSelected(selectedBoqHeader);
				if (parentScope.enableMultiSelection === false) {
					parentScope.modalOptions.disableOkButton = true;
				}

				estimateMainBoqItemService.setOptions (parentScope.options);

				estimateMainBoqItemService.load().then (function (boqItems) {
					if (boqItems) {
						estimateMainBoqItemService.updateBoqItemsCache(boqItems);
					}
					parentScope.isLoading = false;
					let boqItemGrid = estimateMainBoqItemService.getGridId ();
					if (platformGridAPI.grids.exist (boqItemGrid)) {
						platformGridAPI.rows.collapseAllNodes (boqItemGrid);
					}
				});
			}

			function reset(boqHeaderSelected){
				let prjId = $injector.get('estimateMainService').getProjectId();
				if(prjId && prjId === -1){
					let project = projectMainService.getSelected();
					if(project){
						prjId = project.Id;
					}
				}
				estimateMainBoqHeaderService.loadBoqHeader(prjId).then(function(treeList){

					platformGridAPI.events.unregister($scope.gridBoqHeaderId, 'onSelectedRowsChanged', loadBoqItemsByBoqHeader);

					if (_.isEmpty(boqHeaderSelected)){
						if(getGrid()) {
							getGrid().instance.setSelectedRows([]);
						}
					}else{

						let itemList = estimateMainBoqHeaderService.getList();
						let boqHeader = _.find(itemList, {'Id': boqHeaderSelected.Id});

						treeList = filterFunc ? filterFunc(treeList) : treeList;
						platformGridAPI.items.data($scope.gridBoqHeaderId, treeList);

						if (!_.isEmpty(boqHeader)){
							if(getGrid()){
								let rows = getGrid().dataView.mapIdsToRows([boqHeaderSelected.Id]);
								getGrid().instance.setSelectedRows(rows);
							}

							estimateMainBoqHeaderService.setSelected(boqHeader);
							platformGridAPI.rows.scrollIntoViewByItem($scope.gridBoqHeaderId, boqHeader);
						}
					}

					let  boqItemGrid = estimateMainBoqItemService.getGridId();
					let isCollapse = estimateMainBoqItemService.getBoqItemIsCollapse();

					if(platformGridAPI.grids.exist(boqItemGrid)) {
						if (!isCollapse) {
							platformGridAPI.rows.expandAllNodes(boqItemGrid);
						} else {
							platformGridAPI.rows.collapseAllNodes(boqItemGrid);
						}
					}
					platformGridAPI.events.register($scope.gridBoqHeaderId, 'onSelectedRowsChanged', loadBoqItemsByBoqHeader);
					$scope.isLoading = false;
					$scope.isReady = true;
				});

			}


			platformGridAPI.events.register($scope.gridBoqHeaderId, 'onSelectedRowsChanged', loadBoqItemsByBoqHeader);

			function getGrid(){
				return platformGridAPI.grids.element('id', $scope.gridBoqHeaderId);
			}

			estimateMainBoqHeaderService.registerListLoaded(onListLoaded);
			estimateMainBoqHeaderService.reset.register(reset);
			$scope.$on('$destroy', function () {
				platformGridAPI.grids.unregister($scope.gridBoqHeaderId);
				platformGridAPI.events.unregister($scope.gridBoqHeaderId, 'onSelectedRowsChanged', loadBoqItemsByBoqHeader);
				estimateMainBoqHeaderService.unregisterListLoaded(onListLoaded);
				estimateMainBoqHeaderService.reset.unregister(reset);
			});
		}]);
})();
