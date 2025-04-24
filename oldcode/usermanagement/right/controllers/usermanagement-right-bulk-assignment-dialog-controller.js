/**
 * Created by aljami on 29.04.2022
 */
(function (angular) {

	'use strict';

	/**
	 * @ngdoc controller
	 * @name usermanagementRightBulkAssignDialogController
	 * @function
	 *
	 * @description
	 * Controller for the bulk assign right wizard
	 **/
	angular.module('usermanagement.right').controller('usermanagementRightBulkAssignDialogController', usermanagementRightBulkAssignDialogController);

	usermanagementRightBulkAssignDialogController.$inject = ['$scope', 'keyCodes', '$translate', '$http', '_', 'platformGridAPI', 'platformTranslateService', '$timeout', 'usermanagementRightService', 'platformRuntimeDataService', 'usermanagementRightMainService'];

	function usermanagementRightBulkAssignDialogController($scope, keyCodes, $translate, $http, _, platformGridAPI, platformTranslateService, $timeout, usermanagementRightService, platformRuntimeDataService, usermanagementRightMainService) { // jshint ignore:line

		const fieldsDefault = [
			{field: 'Descriptor.Read', readonly: true},
			{field: 'Descriptor.Write', readonly: true},
			{field: 'Descriptor.Create', readonly: true},
			{field: 'Descriptor.Delete', readonly: true},
			{field: 'Descriptor.Execute', readonly: true},
			{field: 'Descriptor.ReadDeny', readonly: true},
			{field: 'Descriptor.WriteDeny', readonly: true},
			{field: 'Descriptor.CreateDeny', readonly: true},
			{field: 'Descriptor.DeleteDeny', readonly: true},
			{field: 'Descriptor.ExecuteDeny', readonly: true}
		];

		$scope.dialog.dataService = createDataService();
		$scope.gridIdAvailable = 'available_rights';
		$scope.gridDataAvailable = {state: $scope.gridIdAvailable};
		$scope.gridIdSelected = 'selected_rights';
		$scope.gridDataSelected = {state: $scope.gridIdSelected};
		$scope.userCount = $scope.dialog.modalOptions.value.selectedRoles.length;
		$scope.selectedRoles = $scope.dialog.modalOptions.value.selectedRoles;
		$scope.isShowingSelection = true;
		$scope.loading = false;
		$scope.selectedRightsCount = 0;
		$scope.loadingMessage = ($scope.dialog.modalOptions.value.dialogRole === 'assignment') ? $translate.instant('usermanagement.right.dialogAssignRight.loadingMessage') : $translate.instant('usermanagement.right.dialogDeleteRight.loadingMessage');
		$scope.resultInfo = '';
		$scope.availableRights = [];
		$scope.countInfo = '';

		updateCountInResultInfo();

		$scope.showResultInfo = function (){
			return !$scope.isShowingConfig && !$scope.loading;
		};

		function updateCountInResultInfo(){
			$scope.resultInfo = ($scope.dialog.modalOptions.value.dialogRole === 'assignment') ? $translate.instant('usermanagement.right.dialogAssignRight.countMessage', {rolesCount: $scope.selectedRoles.length, rightsCount: $scope.selectedRightsCount}) : $translate.instant('usermanagement.right.dialogDeleteRight.countMessage', {rolesCount: $scope.selectedRoles.length, rightsCount: $scope.selectedRightsCount});
		}

		function createDataService() {
			const url = globals.webApiBaseUrl + 'usermanagement/main/right/treeComplete';
			const urlDelete = globals.webApiBaseUrl + 'usermanagement/main/right/commonRights';
			let $cacheData = [], $targetTree = [];
			const treeInfo = {
				parentProp: 'ParentGuid',
				childProp: 'Nodes'
			};
			let idTable = {};
			return {
				treeInfo: treeInfo,
				currentFilter: '',
				idTable: idTable,
				search: function (targetTree, filter) {
					filter = filter ? filter.toLowerCase() : '';
					let filteredTree = [];
					filterTree($cacheData, filter, filteredTree);
					this.currentFilter = filter;
					return filteredTree;
				},
				loadData:function (filter){
					return $http({
						method: 'POST',
						url: url + (filter ? ('?filter=' + filter) : ''),
						data: []
					}).then(function (response) {
						idTable = {};
						$cacheData = processItem(response.data, $targetTree);
						return response.data;
					}, function (error) {
						$log.error(error);
					});
				},
				loadCommonRightsToDelete: function (){
					return $http({
						method: 'POST',
						url: urlDelete,
						data: _.map($scope.selectedRoles, 'Id')
					}).then(function (response) {
						idTable = {};
						$cacheData = processItem(response.data, $targetTree);
						return response.data;
					}, function (error) {
						$log.error(error);
					});
				},
				getResult: function getResult() {
					const checkItems = [];
					const itemResult = function (entity) {
						let parentItem = getParent(entity);
						if (entity.IsMarked !== false && !entity.IsExistent) {
							while (parentItem && parentItem.IsExistent === false) {
								checkItems.push(parentItem);
								parentItem = getParent(parentItem);
							}
							checkItems.push(entity);
						}
						if (angular.isArray(entity.Nodes)) {
							entity.Nodes.forEach(itemResult);
						}
					};
					$cacheData.forEach(itemResult);
					usermanagementRightService.insertDescriptorNodes(checkItems);
					return checkItems;
				},
				getTree: function () {
					return $cacheData;
				},
				getSelectedRights: getSelectedRights,
				getList: function (filter) {
					return toList($cacheData, filter);
				},
				setChild: function (cEntity, isSelected) {
					const self = this;
					angular.forEach(cEntity[treeInfo.childProp], function (item) {
						item.IsMarked = isSelected;
						self.setChild(item, isSelected);
					});
				},
				setParent: function (cEntity, newValue) {
					if (!cEntity) {
						return;
					}

					const parent = getParent(cEntity);
					if (parent) {
						const childSelected = function (child) {
							if(child.Id !== cEntity.Id ){
								return child.IsMarked;
							}else{
								return newValue;
							}
						};
						parent.IsMarked = !!parent[treeInfo.childProp].every(childSelected);
						this.setParent(parent, parent.IsMarked);
					}
				}
			};

			function getSelectedRights(){
				let allItems = Object.keys(idTable).map(key => idTable[key]);
				return _.filter(allItems, item => item.Descriptor !== null && item.IsMarked);
			}

			function filterTree(items, filter, parentFilteredNodes){
				items.forEach(item => {
					if(item.Nodes.length > 0){
						let filteredChildren = [];
						filterTree(item.Nodes, filter, filteredChildren);
						if(filteredChildren.length > 0){
							if(idTable.hasOwnProperty(item.Id)){
								let clonedParent = _.cloneDeep(idTable[item.Id]);
								clonedParent.Nodes = filteredChildren;
								idTable[clonedParent.Id] = clonedParent;
								parentFilteredNodes.push(clonedParent);
							}
						}
					}else{
						if(isFiltered(item, filter)){
							parentFilteredNodes.push(item);
						}
					}
				});
			}

			function getParent(entity) {
				if(entity[treeInfo.parentProp] && idTable.hasOwnProperty(entity[treeInfo.parentProp])){
					return idTable[entity[treeInfo.parentProp]];
				}else{
					return null;
				}
			}

			function toList(items, filter) {
				const result = [];
				filter = filter || function () {
					return true;
				};
				items = items || [];
				for (let i = 0; i < items.length; i++) {
					if (filter(items[i])) {
						result.push(items[i]);
					}
					result.push.apply(result, toList(items[i][treeInfo.childProp], filter));
				}
				return result;
			}

			function processItem(responseData, targetTree) {
				const responseDataList = toList(process(responseData));
				const targetTreeList = toList(process(targetTree));

				angular.forEach(targetTreeList, function (source) {
					const response = _.find(responseDataList, {Id: source.Id});
					if (response) {
						if (check(response, source)) {
							const parentNode = getParent(response, responseData);
							removeNode(parentNode ? parentNode[treeInfo.childProp] : responseData, response);
						} else {
							response.IsExistent = true;
							response.IsMarked = false;
						}
					}
				});


				return responseData;

				function check(item1, item2) {
					return (!item1[treeInfo.childProp] && !item2[treeInfo.childProp]) ||
						(item1[treeInfo.childProp] && item2[treeInfo.childProp] && item1[treeInfo.childProp].length === item2[treeInfo.childProp].length);

				}

				function process(items) {
					angular.forEach(items, function (item) {
						item.IsMarked = false;
						item.IsShown = true;
						item[treeInfo.childProp] = item[treeInfo.childProp] || [];
						setAccessBits(item);
						idTable[item.Id] = item;
						process(item[treeInfo.childProp], item);
					});
					return items;
				}

				function setAccessBits(item){
					if(item.Descriptor !== null){
						item.Descriptor.Read = true;
						item.Descriptor.Write = true;
						item.Descriptor.Create = true;
						item.Descriptor.Delete = true;
						item.Descriptor.Execute = true;
					}
				}

				function removeNode(list, node) {
					const oldList = angular.copy(list);
					list.length = 0;
					for (let i = 0; i < oldList.length; i++) {
						if (oldList[i].Id !== node.Id) {
							list.push(oldList[i]);
						} else {
							oldList[i].IsMarked = true;
						}
					}
					return list;
				}
			}
		}

		$scope.onBeforeEditCell = function onBeforeEditCell(e, arg) {// can not select item whose 'IsLive' is false.
			return !arg.item.IsLive;
		};

		$scope.onCellChange = function onCellChange(e, arg) {
			$scope.dialog.dataService.setChild(arg.item, arg.item.IsMarked);
			$scope.dialog.dataService.setParent(arg.item, arg.item.IsMarked);
			platformGridAPI.grids.refresh($scope.gridIdAvailable);
			platformGridAPI.grids.resize($scope.gridIdAvailable);
			filterSelectedRightsForModifyGrid();
		};

		$scope.showResultInfo = function (){
			return !$scope.isShowingSelection && !$scope.loading;
		};

		function isFiltered(item, filter){
			if(!filter){
				return true;
			}
			return item.Name.toLowerCase().includes(filter) || (item.Description && item.Description.toLowerCase().includes(filter)) || (item.Descriptor && item.Descriptor.SortOrderPath.toLowerCase().includes(filter));
		}

		function filterSelectedRightsForModifyGrid(filter){
			let selectedItems = $scope.dialog.dataService.getSelectedRights();
			if(filter){
				selectedItems = selectedItems.filter(item => isFiltered(item, filter));
			}
			selectedItems.forEach(item => {
				processItemForSelectedGrid(item);
			});
			$scope.selectedRightsCount = selectedItems.length;
			updateCountInResultInfo();
			platformGridAPI.items.data($scope.gridIdSelected, selectedItems);

			platformGridAPI.grids.refresh($scope.gridIdSelected);
			platformGridAPI.grids.resize($scope.gridIdSelected);
		}

		function processItemForSelectedGrid(item) {
			if (!item.Type) {
				platformRuntimeDataService.readonly(item, fieldsDefault);
				platformRuntimeDataService.hideReadonly(item, _.map(fieldsDefault, function(item) {
					return item.field;
				}), true);
			}
			else {
				const myFields = _.cloneDeep(fieldsDefault);
				if (item.Descriptor.Mask & 0x01) {
					myFields[0].readonly =false;
				}
				if (item.Descriptor.Mask & 0x02) {
					myFields[1].readonly =false;
				}
				if (item.Descriptor.Mask & 0x04) {
					myFields[2].readonly =false;
				}
				if (item.Descriptor.Mask & 0x08) {
					myFields[3].readonly =false;
				}
				if (item.Descriptor.Mask & 0x10) {
					myFields[4].readonly =false;
				}
				if (item.Descriptor.Mask & 0x01<<8) {
					myFields[5].readonly =false;
				}
				if (item.Descriptor.Mask & 0x02<<8) {
					myFields[6].readonly =false;
				}
				if (item.Descriptor.Mask & 0x04<<8) {
					myFields[7].readonly =false;
				}
				if (item.Descriptor.Mask & 0x08<<8) {
					myFields[8].readonly =false;
				}
				if (item.Descriptor.Mask & 0x10<<8) {
					myFields[9].readonly =false;
				}

				platformRuntimeDataService.readonly(item, myFields);
				platformRuntimeDataService.hideReadonly(item, _.reduce(myFields, function(result, item) {
					if(item.readonly) {
						result.push(item.field);
					}

					return result;
				}, []), true);
			}
		}

		const applyBtn = {
			id: 'apply',
			caption: $translate.instant('usermanagement.right.dialogAssignRight.btnApply'),
			fn: function (event, info){
				$scope.loading = true;
				$scope.isShowingSelection = false;
				let selectedRights = $scope.dialog.dataService.getSelectedRights();
				$http.post(globals.webApiBaseUrl + 'usermanagement/main/role/assignRightsBulk', {RoleIds: _.map($scope.selectedRoles, 'Id'), DescriptorStructurePresenters: selectedRights}).then(function (assignResult){
					$scope.resultInfo = $translate.instant('usermanagement.right.dialogAssignRight.successMessage');
					$scope.countInfo = $translate.instant('usermanagement.right.dialogAssignRight.countMessage', {rolesCount: $scope.selectedRoles.length, rightsCount: selectedRights.length});
					$scope.loading = false;
					usermanagementRightMainService.refresh();
					cancelBtn.caption = $translate.instant('usermanagement.right.dialogAssignRight.btnClose');
				});
			},
			disabled: function (){
				return $scope.selectedRightsCount === 0 || $scope.loading || !$scope.isShowingSelection;
			}
		};

		const deleteBtn = {
			id: 'delete',
			caption: $translate.instant('usermanagement.right.dialogDeleteRight.btnDelete'),
			fn: function (event, info){
				$scope.loading = true;
				$scope.isShowingSelection = false;
				let selectedRights = $scope.dialog.dataService.getSelectedRights();
				$http.post(globals.webApiBaseUrl + 'usermanagement/main/role/deleteRightsBulk', {RoleIds: _.map($scope.selectedRoles, 'Id'), DescriptorStructurePresenters: selectedRights}).then(function (assignResult){
					$scope.resultInfo = $translate.instant('usermanagement.right.dialogDeleteRight.successMessage');
					$scope.countInfo = $translate.instant('usermanagement.right.dialogDeleteRight.countMessage', {rolesCount: $scope.selectedRoles.length, rightsCount: selectedRights.length});
					$scope.loading = false;
					usermanagementRightMainService.refresh();
					cancelBtn.caption = $translate.instant('usermanagement.right.dialogAssignRight.btnClose');
				});
			},
			disabled: function (){
				return $scope.selectedRightsCount === 0 || $scope.loading || !$scope.isShowingSelection;
			}
		};

		const cancelBtn = {
			id: 'cancel',
			caption: $translate.instant('usermanagement.right.dialogAssignRight.btnCancel'),
			fn: function (event, info){
				info.$close(false);
			}
		};

		$scope.dialog.buttons = ($scope.dialog.modalOptions.value.dialogRole === 'assignment') ? [applyBtn, cancelBtn] : [deleteBtn, cancelBtn];
		$scope.setSelectedState = function (value){
			$scope.selectedState = value;
		};

		function getAvailableGridConfig(scope, treeInfo) {
			let gridColumns = [
				{id: 'Description', field: 'Description', name: 'Description', width: 200}
			];

			const loadTranslation = function loadTranslation() {
				// register a module - translation table will be reloaded if module isn't available yet
				if (!platformTranslateService.registerModule('usermanagement.right')) {
					platformTranslateService.instant({
						'usermanagement.right': _.map(gridColumns, function (column) {
							return 'dialogDescriptorStructure.' + column.name.toLocaleLowerCase();
						})
					});
				}
			};

			angular.forEach(gridColumns, function (column) {
				column.name$tr$ = 'usermanagement.user.dialogDescriptorStructure.' + column.name.toLocaleLowerCase();
			});
			platformTranslateService.translationChanged.register(loadTranslation);
			scope.$on('$destroy', function () {
				platformTranslateService.translationChanged.unregister(loadTranslation);
			});

			return {
				id: scope.gridIdAvailable,
				columns: platformTranslateService.translateGridConfig(angular.copy(gridColumns)),
				data: [],
				options: {
					indicator: true,
					marker:{
						multiSelect: true
					},
					iconClass: 'controls-icons',
					idProperty: 'Id',
					tree: true,
					collapsed: true,
					parentProp: treeInfo.parentProp,
					childProp: treeInfo.childProp,
					treeWidth: 300,
					treeColumnDescription: ['Name'],
					treeHeaderCaption: 'Name'
				},
				lazyInit: true
			};
		}

		function getSelectedGridConfig(scope, treeInfo, modalOption){
			let gridColumns = [
				{id: 'sortOrderPath', formatter: 'text', field: 'Descriptor.SortOrderPath', name: 'Sort Order Path', name$tr$: 'usermanagement.right.columnSortOrderPath', width: 250},
				{id: 'Name', field: 'Name', name: 'Name', width: 200},
				{id: 'Description', field: 'Description', name: 'Description', width: 200},

			];
			let descriptorValues = [
				{
					id: 'read',
					formatter: 'boolean',
					editor: 'boolean',
					field: 'Descriptor.Read',
					name: 'R',
					name$tr$: 'usermanagement.right.rightRead',
					width: 50
				},
				{
					id: 'write',
					formatter: 'boolean',
					editor: 'boolean',
					field: 'Descriptor.Write',
					name: 'W',
					name$tr$: 'usermanagement.right.rightWrite',
					width: 50
				},
				{
					id: 'create',
					formatter: 'boolean',
					editor: 'boolean',
					field: 'Descriptor.Create',
					name: 'C',
					name$tr$: 'usermanagement.right.rightCreate',
					width: 50
				},
				{
					id: 'delete',
					formatter: 'boolean',
					editor: 'boolean',
					field: 'Descriptor.Delete',
					name: 'D',
					name$tr$: 'usermanagement.right.rightDelete',
					width: 50
				},
				{
					id: 'execute',
					formatter: 'boolean',
					editor: 'boolean',
					field: 'Descriptor.Execute',
					name: 'E',
					name$tr$: 'usermanagement.right.rightExecute',
					width: 50
				},
				{
					id: 'readDeny',
					formatter: 'boolean',
					editor: 'boolean',
					field: 'Descriptor.ReadDeny',
					name: 'RD',
					name$tr$: 'usermanagement.right.rightReadDeny',
					width: 50
				},
				{
					id: 'writeDeny',
					formatter: 'boolean',
					editor: 'boolean',
					field: 'Descriptor.WriteDeny',
					name: 'WD',
					name$tr$: 'usermanagement.right.rightWriteDeny',
					width: 50
				},
				{
					id: 'createDeny',
					formatter: 'boolean',
					editor: 'boolean',
					field: 'Descriptor.CreateDeny',
					name: 'CD',
					name$tr$: 'usermanagement.right.rightCreateDeny',
					width: 50
				},
				{
					id: 'deleteDeny',
					formatter: 'boolean',
					editor: 'boolean',
					field: 'Descriptor.DeleteDeny',
					name: 'DD',
					name$tr$: 'usermanagement.right.rightDeleteDeny',
					width: 50
				},
				{
					id: 'executeDeny',
					formatter: 'boolean',
					editor: 'boolean',
					field: 'Descriptor.ExecuteDeny',
					name: 'ED',
					name$tr$: 'usermanagement.right.rightExecuteDeny',
					width: 50
				}
			];
			if(modalOption.value.dialogRole === 'assignment'){
				gridColumns.push(...descriptorValues);
			}
			return {
				id: scope.gridIdSelected,
				columns: platformTranslateService.translateGridConfig(angular.copy(gridColumns)),
				data: [],
				options: {
					indicator: true,
					iconClass: 'controls-icons',
					idProperty: 'Id'
				},
				lazyInit: true
			};

		}

		$scope.search = function (filter, event) {
			if (!event || event.keyCode === keyCodes.ENTER) {
				let filteredResult = $scope.dialog.dataService.search(angular.copy($scope.dialog.modalOptions.entities), filter);
				platformGridAPI.items.data($scope.gridIdAvailable, filteredResult);
				platformGridAPI.grids.resize($scope.gridIdAvailable);
				if(filter) {
					platformGridAPI.rows.expandAllNodes($scope.gridIdAvailable);
				}
			}
		};

		$scope.searchSelected = function (filter, event) {
			if (!event || event.keyCode === keyCodes.ENTER) {
				filterSelectedRightsForModifyGrid(filter);
			}
		};

		platformGridAPI.grids.config(getAvailableGridConfig($scope, $scope.dialog.dataService.treeInfo, $scope.dialog.modalOptions));
		platformGridAPI.grids.config(getSelectedGridConfig($scope, $scope.dialog.dataService.treeInfo, $scope.dialog.modalOptions));

		$timeout(function () {
			platformGridAPI.events.register($scope.gridIdAvailable, 'onBeforeEditCell', $scope.onBeforeEditCell);
			platformGridAPI.events.register($scope.gridIdAvailable, 'onCellChange', $scope.onCellChange);
		}, 500);

		$scope.$on('$destroy', function () {
			platformGridAPI.events.unregister($scope.gridIdAvailable, 'onBeforeEditCell', $scope.onBeforeEditCell);
			platformGridAPI.events.unregister($scope.gridIdAvailable, 'onCellChange', $scope.onCellChange);
			platformGridAPI.grids.unregister($scope.gridIdAvailable);
		});

		setTimeout(function(){
			if($scope.dialog.modalOptions.value.dialogRole === 'assignment'){
				$scope.dialog.dataService.loadData().then(function (){
					$scope.search();
				});
			}else{
				$scope.dialog.dataService.loadCommonRightsToDelete().then(function (){
					$scope.search();
				});
			}


		},0);
	}
})(angular);
