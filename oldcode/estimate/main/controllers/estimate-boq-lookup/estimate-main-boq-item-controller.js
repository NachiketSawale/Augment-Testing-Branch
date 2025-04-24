
(function () {

	/* global _, Slick */
	'use strict';

	let moduleName = 'estimate.main';

	angular.module(moduleName).value('estimateMainWicBoqItemControllerListColumns', {
		getStandardConfigForListView: function () {
			return {
				columns: [
					{
						id: 'BriefInfo',
						field: 'BriefInfo',
						name: 'Description',
						name$tr$: 'boq.main.Brief',
						formatter: 'translation',
						readonly: true
					},
					{
						id: 'Reference',
						field: 'Reference',
						name: 'Reference',
						name$tr$: 'boq.main.Reference',
						readonly: true,
						width: 100
					},
					{
						id: 'Reference2',
						field: 'Reference2',
						name: 'Reference2',
						name$tr$: 'boq.main.Reference2',
						readonly: true,
						width: 100
					},
					{
						id: 'BasUomFk',
						field: 'BasUomFk',
						name: 'BasUomFk',
						toolTip: 'QuantityUoM',
						name$tr$: 'cloud.common.entityUoM',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'uom',
							displayMember: 'Unit'
						},
						directive: 'basics-lookupdata-uom-lookup'
					}
				]
			};
		}
	});

	angular.module(moduleName).controller('estimateMainBoqItemController', [
		'$scope', '$injector', 'keyCodes', 'estimateMainBoqItemService', 'estimateMainWicBoqItemControllerListColumns', 'platformGridAPI', 'estimateMainBoqHeaderService', 'platformTranslateService','cloudCommonGridService', 'basicsLookupdataLookupControllerFactory', 'basicsLookupdataLookupViewService', 'basicsLookupdataLookupDataService','basicsLookupdataLookupDescriptorService',
		function ($scope, $injector, keyCodes, estimateMainBoqItemService, estimateMainWicBoqItemControllerListColumns, platformGridAPI, estimateMainBoqHeaderService, platformTranslateService,cloudCommonGridService, basicsLookupdataLookupControllerFactory, basicsLookupdataLookupViewService, lookupDataService,basicsLookupdataLookupDescriptorService) {
			estimateMainBoqItemService.init();
			let parentScope = $scope.$parent;

			$scope.gridId = parentScope.gridBoqItemId;
			estimateMainBoqItemService.setGridId($scope.gridId);

			parentScope.isLoading = true;

			if ($scope.options.dataView === undefined) {
				$scope.options.dataView = new basicsLookupdataLookupViewService.LookupDataView();
				$scope.options.dataView.dataPage.size = 100;
				$scope.options.dataView.dataProvider = lookupDataService.registerDataProviderByType('estboqitems');
			}

			let gridConfig = {
				data: [],
				columns: angular.copy(estimateMainWicBoqItemControllerListColumns.getStandardConfigForListView().columns),
				id: $scope.gridId,
				lazyInit: false,
				options: {
					tree: true,
					indicator: false,
					editorLock: new Slick.EditorLock(),
					multiSelect: false,
					parentProp: 'BoqItemFk',
					childProp: 'BoqItems'
				}
			};

			platformGridAPI.grids.config(gridConfig);
			platformTranslateService.translateGridConfig(gridConfig.columns);

			if (!$scope.tools) {
				basicsLookupdataLookupControllerFactory.create({grid: true,dialog: true,search: false},$scope, gridConfig);
			}

			// Define standard toolbar Icons and their function on the scope
			let toolBarItems =  [
				{
					id: 't10',
					sort: 90,
					caption: 'cloud.common.toolbarExpandAll',
					type: 'item',
					iconClass: 'tlb-icons ico-tree-expand-all',
					fn: function expandAll() {
						platformGridAPI.rows.expandAllSubNodes($scope.gridId);
					}
				},
				{
					id: 't9',
					sort: 80,
					caption: 'cloud.common.toolbarCollapseAll',
					type: 'item',
					iconClass: 'tlb-icons ico-tree-collapse-all',
					fn: function collapseAll() {
						platformGridAPI.rows.collapseAllSubNodes($scope.gridId);
					}
				},
				{
					id: 't8',
					sort: 70,
					caption: 'cloud.common.toolbarExpand',
					type: 'item',
					iconClass: 'tlb-icons ico-tree-expand',
					fn: function expandSelected() {
						platformGridAPI.rows.expandNode($scope.gridId);
					}
				},
				{
					id: 't7',
					sort: 60,
					caption: 'cloud.common.toolbarCollapse',
					type: 'item',
					iconClass: 'tlb-icons ico-tree-collapse',
					fn: function collapseSelected() {
						platformGridAPI.rows.collapseNode($scope.gridId);
					}
				}
			];

			_.forEach(toolBarItems, function(toolbar){
				$scope.tools.items.unshift(toolbar);
			});

			if (parentScope.ngModel && _.isNumber(parentScope.ngModel)) {
				let prjId = $injector.get('estimateMainService').getProjectId();
				estimateMainBoqHeaderService.loadBoqHeader(prjId).then(function(){

					estimateMainBoqItemService.getBoqItemTreeByIdAsync(parentScope.ngModel,parentScope.entity.BoqHeaderFk).then(function(boqItemTree) {

						if (boqItemTree){

							let desBoqItems =[];
							cloudCommonGridService.flatten(boqItemTree,desBoqItems,'BoqItems');

							_.forEach(desBoqItems, function (item) {
								if (item.Id === parentScope.ngModel) {
									parentScope.searchValue = item[parentScope.options.displayMember];
									let cat = item;
									let catId = _.isEmpty(cat) ? [] : _.map([cat], 'Id');
									let rows = getGrid().dataView.mapIdsToRows(catId);
									getGrid().instance.setSelectedRows(rows);

									estimateMainBoqItemService.setSelected(item);
									estimateMainBoqItemService.setHighlightBoqItem(item);
								}
							});
							estimateMainBoqItemService.setBoqItemsImage(desBoqItems);

							platformGridAPI.items.data($scope.gridId, boqItemTree);
							getGrid().dataView.expandAllNodes();

							let boqHeaderList = estimateMainBoqHeaderService.getList();
							let boqHeader =  _.find(boqHeaderList, {BoqHeaderFk: boqItemTree[0].BoqHeaderFk});

							estimateMainBoqHeaderService.setItemFilter(function (item) {
								return (boqHeader && boqHeader.Id === item.Id);
							});

							estimateMainBoqHeaderService.setSelected(boqHeader);


							estimateMainBoqHeaderService.enableItemFilter(true);

							parentScope.isReady = true;
							parentScope.isLoading = false;
						}
					});
				});
			}else{
				$scope.isLoading = false;
				parentScope.isReady = true;
				parentScope.isLoading = false;
				$scope.$root.safeApply();
			}

			parentScope.$watch('isLoading', function(isLoading){
				$scope.isLoading = isLoading;
			});

			angular.extend(parentScope, {
				onOk: onOk,
				onRefresh: onRefresh,
				onSearch: onSearch,
				onSearchInputKeyDown: onSearchInputKeyDown
			});

			function onSelectedRowsChanged(e, args){
				let rows = args.rows;
				let selectedItem = getGrid().instance.getDataItem(_.first(rows));
				estimateMainBoqItemService.setSelected(selectedItem);

				let boqLineTypes = [0,11,200, 201, 202, 203];

				let okBtn = true;
				if (selectedItem && boqLineTypes.indexOf(selectedItem.BoqLineTypeFk) === -1){
					okBtn = false;
				}
				
				if (selectedItem && selectedItem.Id && selectedItem.BoqLineTypeFk === 0) {
					// if position boq contains sub quantity, can not assign lineItem to BoqItem which contains sub quantity items.
					if (_.isArray(selectedItem.BoqItems) && selectedItem.BoqItems.length > 0) {
						if (_.find(selectedItem.BoqItems, function (item) {
							return item.BoqLineTypeFk === 11;
						}) !== null) {
							okBtn = false;
						}
						
						let subDescriptionChildrens = _.find(selectedItem.BoqItems,{'BoqLineTypeFk':110});
						if(subDescriptionChildrens){
							okBtn = true;
						}
					}
				}

				let canClickOkBtn = okBtn;
				parentScope.modalOptions.disableOkButton =  !canClickOkBtn;
				if(!estimateMainBoqItemService.isAllowanceBoqItemLookup()){
					$scope.$root.safeApply();
				}
			}

			function onDblClick(){
				onOk();
			}

			function onOk() {
				let selectedItem = estimateMainBoqItemService.getSelected();

				let boqLineTypes = [0,11, 200, 201, 202, 203];
				if (selectedItem && boqLineTypes.indexOf(selectedItem.BoqLineTypeFk) === -1) {
					return;
				}
				
				if (selectedItem && selectedItem.Id && selectedItem.BoqLineTypeFk === 0) {
					// if position boq contains sub quantity, can not assign lineItem to BoqItem which contains sub quantity items.
					if (_.isArray(selectedItem.BoqItems) && selectedItem.BoqItems.length > 0) {
						let crbChildrens = _.filter(selectedItem.BoqItems, {'BoqLineTypeFk': 11});
						if (crbChildrens && crbChildrens.length) {
							return;
						}
					}
				}
				
				let result = {isOk: true};
				angular.extend(result, {
					selectedItem: selectedItem
				});

				parentScope.onClose(result);
			}

			function onRefresh(){
				parentScope.isReady = false;
				basicsLookupdataLookupDescriptorService.updateData('estBoqItemTree', []);

				$scope.isLoading = $scope.isCatLoading = true;
				let boqHeaderSelected = estimateMainBoqHeaderService.getSelected() ? estimateMainBoqHeaderService.getSelected():  estimateMainBoqHeaderService.getList()[0];
				estimateMainBoqHeaderService.reset.fire(boqHeaderSelected);

				estimateMainBoqItemService.setBoqItemIsCollapse(true);
				estimateMainBoqItemService.search('', parentScope,true);
				$scope.isLoading = false;
				$scope.IsCollapse  = true;
				parentScope.isReady = true;
				parentScope.isLoading = false;
			}

			function onSearch(searchValue){
				$scope.isLoading = true;

				let IsCollapse = !searchValue || searchValue=== '' ? true:false;

				estimateMainBoqItemService.setBoqItemIsCollapse(IsCollapse);

				let boqHeaderSelected = estimateMainBoqHeaderService.getSelected() ? estimateMainBoqHeaderService.getSelected():  estimateMainBoqHeaderService.getList()[0];
				estimateMainBoqHeaderService.reset.fire(boqHeaderSelected);


				estimateMainBoqItemService.search(searchValue,parentScope,true).then(function() {
					let wicItemGrid = estimateMainBoqItemService.getGridId();
					if (!IsCollapse) {
						platformGridAPI.rows.expandAllNodes(wicItemGrid);
					}
					else {
						platformGridAPI.rows.collapseAllNodes(wicItemGrid);
					}
				});

				$scope.isLoading = false;
				parentScope.isReady = true;
				parentScope.isLoading = false;
			}

			function onSearchInputKeyDown(event, searchValue){
				if (event.keyCode === keyCodes.ENTER) {
					onSearch(searchValue);
				}
			}

			function onListLoaded(){
				platformGridAPI.events.unregister($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
				let data = estimateMainBoqItemService.getTree();
				platformGridAPI.items.data($scope.gridId, data.filter(e => e.BoqItemFk === null));

				let cat = estimateMainBoqItemService.getSelected();
				let catId = _.isEmpty(cat) ? [] : _.map([cat], 'Id');
				let rows = getGrid().dataView.mapIdsToRows(catId);

				getGrid().instance.setSelectedRows(rows);
				estimateMainBoqItemService.setItemFilter(null);
				platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
				if($scope.IsCollapse) {
					let wicItemGrid = estimateMainBoqItemService.getGridId();
					platformGridAPI.rows.collapseAllNodes(wicItemGrid);
				}
			}

			function getGrid(){
				return platformGridAPI.grids.element('id', $scope.gridId);
			}

			function reset() {
				let prjId = $injector.get('estimateMainService').getProjectId();
				estimateMainBoqHeaderService.loadBoqHeader(prjId);
				estimateMainBoqItemService.load().then(function(){
					setTimeout(function(){
						$scope.isLoading = false;
						parentScope.isReady = true;
					}, 300);
				});
			}

			platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
			platformGridAPI.events.register($scope.gridId, 'onDblClick', onDblClick);

			estimateMainBoqItemService.registerListLoaded(onListLoaded);
			estimateMainBoqItemService.reset.register(reset);

			$scope.$on('$destroy', function () {
				platformGridAPI.events.unregister($scope.gridId, 'onDblClick', onDblClick);
				platformGridAPI.grids.unregister($scope.gridId);
				estimateMainBoqItemService.reset.unregister(reset);
				estimateMainBoqItemService.unregisterListLoaded(onListLoaded);
			});
		}]);
})();
