/*
 * $Id$
 * Copyright (c) RIB Software GmbH
 */

(function (angular) {
	'use strict';

	angular.module('platform').value('platformFormConfigDialogColumns', {
		columns: [
			{
				field: 'label',
				id: 'label',
				name$tr$: 'cloud.desktop.formConfigLabelName',
				formatter: 'description',
				width: 210
			}, {
				id: 'userLabelCode',
				formatter: 'lookup',
				formatterOptions:{
					lookupType: 'platformGridConfigUserLabelLookup',
					dataServiceName: 'platformGridConfigUserLabelLookupService',
					valueMember: 'Id',
					displayMember: 'Code',
					columns:[
						{id: 'Code', field: 'Code', name: 'Code', width: 150}
					]
				},
				name: 'Label Code',
				name$tr$: 'cloud.desktop.formConfigLabelCode',
				groupName: 'Labels',
				field: 'labelCode',
				editor: 'lookup',
				editorOptions: {
					lookupDirective: 'basics-lookup-data-by-custom-data-service',
					lookupOptions: {
						additionalColumns: true,
						columns: [
							{id: 'Code', field: 'Code', name: 'Code', width: 150},
							{id: 'KeyWords', field: 'KeyWords', name: 'Key Words', width: 150},
						],
						dataServiceName: 'platformGridConfigUserLabelLookupService',
						disableDataCaching: false,
						displayMember: 'Code',
						events: undefined,
						filter: undefined,
						filterKey: null,
						isClientSearch: true,
						isTextEditable: false,
						lookupModuleQualifier: 'platformGridConfigUserLabelLookupService',
						lookupType: 'platformGridConfigUserLabelLookupService',
						showClearButton: true,
						uuid: '70b9f81e1a534dbd9d3e440f0c08f1e3',
						valueMember: 'Id'
					},
					lookupType: 'platformGridConfigUserLabelLookupService'
				},
				width: 180
			}, {
				field: 'customerLabel',
				id: 'customerLabel',
				name$tr$: 'cloud.desktop.formConfigCustomerLabelName',
				formatter: 'description',
				editor: 'description',
				width: 180
			},
			{
				field: 'visible',
				id: 'visible',
				name$tr$: 'cloud.desktop.formConfigVisibility',
				formatter: 'boolean',
				editor: 'boolean',
				width: 70
			},
			{
				field: 'enterStop',
				id: 'enterStop',
				name$tr$: 'cloud.desktop.formConfigAllowEnterNavigation',
				formatter: 'boolean',
				editor: 'boolean',
				width: 70
			}
		]
	});

	angular.module('platform').controller('platformConfigDialogController', platformConfigDialogController);

	platformConfigDialogController.$inject = ['$scope', '_', 'platformModuleNavigationService', 'platformPermissionService', 'platformGridControllerService', 'platformFormConfigService', 'platformFormConfigDialogColumns', 'platformGridAPI', '$translate', '$timeout'];

	/* jshint -W072 */ // many parameters because of dependency injection
	function platformConfigDialogController($scope, _, naviService, platformPermissionService, gridControllerService, dataService, gridColumns, platformGridAPI, $translate, $timeout) {

		let customizePermissions = ['f5e884c670df4f938e51787e7cc40bf7', '3a51bf834b8649069172d23ec1ba35e2', 'f79018066c4847a6b38ee99a6085dc9e'];
		platformPermissionService.loadPermissions(customizePermissions);
		let navigator = {
			moduleName: 'userLabel.Translation',
			navFunc: function (info, item){
				$timeout(()=>{
					scope.$close({isOK: false});
					naviService.navigate({moduleName: 'basics.customize-userLabel'}, item, info);
				});
			},
			hide: function (item) {
				return !item.labelCode || !platformPermissionService.hasWrite(customizePermissions);
			}
		};
		let userLabelColumn = _.find(gridColumns.columns, {id: 'userLabelCode'});
		userLabelColumn.navigator = navigator;


		var scope = $scope;
		var gridConfig = {
			columns: [],
			parentProp: 'parentId',
			childProp: 'ChildItems',
			skipPermissionCheck: true,
			showMainTopPanel: true,
			saveSearch: false,
			passThrough: {
				editorLock: new Slick.EditorLock()
			}
		};

		scope.data = [];
		scope.selectedItem = dataService.getSelected();

		dataService.getTree = function () {
			scope.data = loadTreeData();
			platformGridAPI.grids.refresh(scope.gridId);
			return scope.data;
		};

		scope.getContainerUUID = function () {
			return '60df73838d9a4ea1b91872a2800a60ca';
		};

		scope.onContentResized = function () {
		};

		scope.setTools = function () {
		};

		if (platformGridAPI.grids.exist(scope.getContainerUUID())) {
			platformGridAPI.grids.unregister(scope.getContainerUUID());
		}

		if (_.filter(scope.formOptions.configure.rows, {'type': 'convert'}).length > 0) {
			var uomColumns = [{
				id: 'uom',
				formatter: 'lookup',
				formatterOptions: {
					lookupType: 'uom',
					displayMember: 'Unit'
				},
				name: 'UoM',
				field: 'uom',
				width: 70,
				cssClass: 'cell-right',
				editor: 'lookup',
				editorOptions: {
					lookupDirective: 'basics-lookupdata-uom-lookup',
					lookupOptions: {}
				},
				focusable: true
			}, {
				id: 'fraction',
				formatter: 'boolean',
				name: 'Fraction',
				field: 'fraction',
				width: 30,
				editor: 'boolean'
			}];

			gridColumns.columns = _.unionBy(gridColumns.columns, uomColumns, 'id');

			_.each(scope.formOptions.configure.groups, function (group) {
				var filter = {
					readonly: [{
						field: 'uom',
						readonly: true
					}, {
						field: 'fraction',
						readonly: true
					}]
				};
				var rows = dataService.getRowsByGroupId(group.gid, scope.formOptions);

				group.readFilter = filter;
				_.each(rows, function (row) {
					if (row.type !== 'convert') {
						row.readFilter = filter;
					}
				});
			});
		} else {
			_.remove(gridColumns.columns, function (col) {
				return col.id === 'uom' || col.id === 'fraction';
			});
		}

		var uiStandardService = {
			getStandardConfigForListView: function () {
				return gridColumns;
			}
		};

		gridControllerService.initListController(scope, uiStandardService, dataService, null, /* validationService, */ gridConfig);

		var setPropertyValue = function setPropertyValue(prop, item) {
			var isRoot = item.parentId === null;
			var isGroup = item.parentId === -1;

			if (prop === 'visible' || prop === 'enterStop') {
				if (isRoot) {
					angular.forEach(item.ChildItems, function (group) {
						group[prop] = item[prop];
						angular.forEach(group.ChildItems, function (row) {
							row[prop] = item[prop];
						});
					});
					platformGridAPI.grids.refresh(scope.gridId);
				} else if (isGroup) {
					angular.forEach(item.ChildItems, function (row) {
						row[prop] = item[prop];
					});

					setParentProperty(scope.data[0], prop);
				} else {
					var group = getGroupByRow(item);
					setParentProperty(group, prop);
					setParentProperty(scope.data[0], prop);
				}
			}
		};

		var setParentProperty = function setParentProperty(parent, prop) {
			parent[prop] = null;

			var childlist = _.filter(parent.ChildItems, function (item) {
				return item[prop] === true;
			});

			var childPropnull = _.filter(parent.ChildItems, function (item) {
				return item[prop] === null;
			});

			if (childlist && childlist.length === parent.ChildItems.length) {
				parent[prop] = true;
			} else if (childlist.length === 0 && childPropnull.length === 0) {
				parent[prop] = false;
			}

			platformGridAPI.grids.refresh(scope.gridId);
		};

		/**
		 * @loadTreeData when open this dialog ,initgrid,need to load data.
		 */
		var loadTreeData = function loadTreeData() {
			var treeDataList = [];
			var formOptions = scope.formOptions;
			var groups = _.sortBy(formOptions.configure.groups, 'sortOrder');

			angular.forEach(groups, function (group) {
				var rows = _.sortBy(dataService.getRowsByGroupId(group.gid,
					formOptions), 'sortOrder');

				var groupData = {
					Id: group.gid,
					parentId: -1,
					image: 'control-icons ico-accordion-grp',
					nodeInfo: {collapsed: false, level: 1},
					gid: group.gid,
					label: $translate.instant(group.header),
					labelCode: group.labelCode || '',
					customerLabel: group.userheader,
					ChildItems: [],
					HasChildren: true,
					isOpen: group.isOpen,
					visible: angular.isUndefined(group.visible) ? true : group.visible,
					sortOrder: group.sortOrder,
					__rt$data: angular.isUndefined(group.readFilter) ? {} : group.readFilter
				};

				angular.forEach(rows, function (row) {
					var rowData = {
						Id: row.rid,
						parentId: group.gid,
						image: 'control-icons ico-accordion-pos',
						nodeInfo: {collapsed: false, level: 2},
						gid: row.gid,
						rid: row.rid,
						label: $translate.instant(row.label),
						labelCode: row.labelCode || '',
						customerLabel: row.userlabel,
						ChildItems: [],
						HasChildren: false,
						enterStop: angular.isUndefined(row.enterStop) ? true : row.enterStop,
						tabStop: angular.isUndefined(row.tabStop) ? true : row.tabStop,
						visible: angular.isUndefined(row.visible) ? true : row.visible,
						readonly: row.readonly,
						sortOrder: row.sortOrder,
						uom: row.uom,
						fraction: row.fraction,
						__rt$data: angular.isUndefined(row.readFilter) ? {} : row.readFilter
					};

					if(row.labelCode){
						platformGridAPI.cells.readonly({gridId: scope.gridId, item: rowData, field: 'customerLabel'});
					}


					groupData.ChildItems.push(rowData);
				});

				setParentProperty(groupData, 'enterStop');
				setParentProperty(groupData, 'visible');

				treeDataList.push(groupData);
			});

			var root = {
				Id: -1,
				parentId: null,
				image: 'control-icons ico-accordion-root',
				labelCode: '',
				nodeInfo: {collapsed: false, level: 0},
				label: formOptions.configure.name,
				ChildItems: treeDataList,
				HasChildren: true,
				__rt$data: angular.isUndefined(formOptions.configure.rootReadFilter) ? {} : formOptions.configure.rootReadFilter
			};

			setParentProperty(root, 'visible');
			setParentProperty(root, 'enterStop');

			return [root];
		};

		/**
		 * @getSetting when save setting of this dialog,call it
		 */
		var getSetting = function getSetting() {
			var treeDataList = scope.data[0].ChildItems;
			var formOptions = scope.formOptions;
			var userSetting = {
				fid: formOptions.configure.fid,
				version: formOptions.configure.version
			};
			var settingGroups = userSetting.groups = [];
			var settingRows = userSetting.rows = [];
			var groupOrder = 1;
			var rowOrder;

			angular.forEach(treeDataList, function (group) {
				var groupSetting = {
					gid: group.gid.toString(),
					userheader: group.customerLabel,
					labelCode: group.labelCode || '',
					isOpen: group.isOpen,
					visible: group.visible,
					sortOrder: groupOrder++
				};
				rowOrder = 0;

				angular.forEach(group.ChildItems, function (row) {
					var rowSetting = {
						gid: row.gid.toString(),
						rid: row.rid.toString(),
						userlabel: row.customerLabel,
						labelCode: row.labelCode || '',
						readonly: row.readonly,
						enterStop: row.enterStop,
						tabStop: row.tabStop,
						visible: row.visible,
						sortOrder: rowOrder++,
						uom: row.uom,
						fraction: row.fraction
					};
					if (row.visible) {
						groupSetting.visible = true;
					}
					settingRows.push(rowSetting);
				});

				settingGroups.push(groupSetting);

			});

			return userSetting;
		};

		/**
		 * @getGroupByRow when excute moveup and movedown,need to know group of current row
		 */
		var getGroupByRow = function (row) {
			return _.find(scope.data[0].ChildItems, {gid: row.gid});
		};

		/**
		 * @getPreviousGroup when excute moveup and currentrow is first row ,moveup to previous
		 group
		 */
		var getPreviousGroup = function (group) {
			var groupIndex = scope.data[0].ChildItems.indexOf(group);
			return scope.data[0].ChildItems[groupIndex - 1];
		};

		/**
		 * @getNextGroup when excute movedown and currentrow is last row ,movedown to next group
		 */
		var getNextGroup = function (group) {
			var groupIndex = scope.data[0].ChildItems.indexOf(group);
			return scope.data[0].ChildItems[groupIndex + 1];
		};

		/**
		 * @removeRowFromGroup when excute moveup/movedown and currentrow is first/last row ,
		 * moveup/movedown to previous/next group,need to delete current row in current group
		 */
		var removeRowFromGroup = function (group, row) {
			var rowIndex = group.ChildItems.indexOf(row);
			group.ChildItems.splice(rowIndex, 1);
		};

		/**
		 * @moveRowToPreviousGroup when excute moveup and currentrow is first row ,moveup to
		 previous group
		 */
		var moveRowToPreviousGroup = function (group, row) {
			var prevGroup = getPreviousGroup(group);
			row.gid = prevGroup.gid;
			row.parentId = prevGroup.gid;
			removeRowFromGroup(group, row);
			prevGroup.ChildItems.push(row);
			prevGroup.nodeInfo.collapsed = false;
		};

		/**
		 * @moveRowToNextGroup when excute movedown and currentrow is last row ,movedown to next
		 group
		 */
		var moveRowToNextGroup = function (group, row) {
			var nextGroup = getNextGroup(group);
			row.gid = nextGroup.gid;
			row.parentId = nextGroup.gid;
			removeRowFromGroup(group, row);
			nextGroup.ChildItems.splice(0, 0, row);
			nextGroup.nodeInfo.collapsed = false;
		};

		/**
		 * @moveRowUpInGroup when excute moveup and currentrow is not first row ,moveup to
		 previous row in current group
		 */
		var moveRowUpInGroup = function (group, row) {
			var array = group.ChildItems;
			var rowIndex = array.indexOf(row);
			var prevRow = group.ChildItems[rowIndex - 1];
			group.ChildItems[rowIndex - 1] = row;
			group.ChildItems[rowIndex] = prevRow;
		};

		/**
		 * @moveRowToTopPositionInGroup when excute moveup and currentrow is not first row ,moveup to
		 top position in  row in current group
		 */
		var moveRowToTopPositionInGroup = function (group, row) {
			group.ChildItems = _.sortBy(group.ChildItems, function (item) {
				return item.Id === row.Id ? 0 : 1;
			});
		};

		/**
		 * @moveRowDownInGroup when excute movedonw and currentrow is not last row ,movedown to
		 next row in current group
		 */
		var moveRowDownInGroup = function (group, row) {
			var array = group.ChildItems;
			var rowIndex = array.indexOf(row);
			var nextRow = group.ChildItems[rowIndex + 1];
			group.ChildItems[rowIndex + 1] = row;
			group.ChildItems[rowIndex] = nextRow;

			// platformGridAPI.grids.refresh($scope.gridId);
		};

		/**
		 * @moveUpRow when current item is row and  excute moveup,call it
		 */
		var moveUpRow = function (row, type) {
			var group = getGroupByRow(row);

			if (isFirstRowInGroup(row, group) && isFirstGroup(group)) {
				return;
			}
			if (isFirstRowInGroup(row, group) && !isFirstGroup(group)) {
				moveRowToPreviousGroup(group, row);
			} else if (type === 'top') {
				moveRowToTopPositionInGroup(group, row);
			} else {
				moveRowUpInGroup(group, row);
			}
		};

		/**
		 * @moveDownRow when current item is row and excute movedown,call it
		 */
		var moveDownRow = function (row, type) {
			var group = getGroupByRow(row);

			if (isLastRowInGroup(row, group) && isLastGroup(group)) {
				return;
			}

			if (isLastRowInGroup(row, group) && !isLastGroup(group)) {
				moveRowToNextGroup(group, row);
			} else if (type === 'bottom') {
				moveRowToBottomInGroup(group, row);
			} else {
				moveRowDownInGroup(group, row);
			}
		};

		/**
		 * @moveRowToBottomInGroup when excute moveup and currentrow is not first row ,moveup into
		  bottom in row in current group
		 */
		var moveRowToBottomInGroup = function (group, row) {
			group.ChildItems = _.sortBy(group.ChildItems, function (item) {
				return item.Id === row.Id ? 1 : 0;
			});
		};

		/**
		 * @moveUpGroup when current item is group and  excute moveup,call it
		 */
		var moveUpGroup = function (group, type) {
			if (isFirstGroup(group)) {
				return;
			}

			if (type === 'top') {
				// set selected item in first position in array
				scope.data[0].ChildItems = _.sortBy(scope.data[0].ChildItems, function (item) {
					return item.Id === group.Id ? 0 : 1;
				});
			} else {
				var groupIndex = scope.data[0].ChildItems.indexOf(group);
				var prevGroupIndex = groupIndex - 1;

				var prevGroup = scope.data[0].ChildItems[prevGroupIndex];
				scope.data[0].ChildItems[prevGroupIndex] = group;
				scope.data[0].ChildItems[groupIndex] = prevGroup;
			}
		};

		/**
		 * @moveDownGroup when current item is group and  excute movedown,call it
		 */
		var moveDownGroup = function (group, type) {
			if (isLastGroup(group)) {
				return;
			}

			if (type === 'bottom') {
				// set selected item in last position in array
				scope.data[0].ChildItems = _.sortBy(scope.data[0].ChildItems, function (item) {
					return item.Id === group.Id ? 1 : 0;
				});
			} else {
				var groupIndex = scope.data[0].ChildItems.indexOf(group);
				var nextGroup = scope.data[0].ChildItems[groupIndex + 1];
				scope.data[0].ChildItems[groupIndex + 1] = group;
				scope.data[0].ChildItems[groupIndex] = nextGroup;
			}
			// platformGridAPI.grids.refresh($scope.gridId);
		};

		/**
		 * @isFirstRowInGroup when moveup,need to know current row is first row or not
		 */
		var isFirstRowInGroup = function (row, group) {
			return group.ChildItems.indexOf(row) === 0;
		};

		/**
		 * @isLastRowInGroup when moveup,need to know current row is last row or not
		 */
		var isLastRowInGroup = function (row, group) {
			return group.ChildItems.indexOf(row) === group.ChildItems.length - 1;
		};

		/**
		 * @isLastRowInGroup when moveup,need to know current group is first row or not
		 */
		var isFirstGroup = function (group) {
			return scope.data[0].ChildItems.indexOf(group) === 0;
		};

		/**
		 * @isLastGroup when movedwon,need to know current group is last group or not
		 */
		var isLastGroup = function (group) {
			return scope.data[0].ChildItems.indexOf(group) === scope.data[0].ChildItems.length - 1;
		};

		scope.moveUp = function (type) {
			scope.selectedItem = getSelectedItem();
			if (scope.selectedItem.parentId === null) {
				return;
			}
			if (scope.selectedItem.parentId === -1) {
				moveUpGroup(scope.selectedItem, type);
			} else {
				moveUpRow(scope.selectedItem, type);
			}

			refreshGrid();
		};

		scope.moveDown = function (type) {
			scope.selectedItem = getSelectedItem();
			if (scope.selectedItem.parentId === null) {
				return;
			}

			if (scope.selectedItem.parentId === -1) {
				moveDownGroup(scope.selectedItem, type);
			} else {
				moveDownRow(scope.selectedItem, type);
			}

			refreshGrid();
		};

		function refreshGrid() {
			platformGridAPI.grids.refresh(scope.gridId);
			platformGridAPI.rows.scrollIntoViewByItem(scope.gridId, scope.selectedItem);
		}

		// footer-button functionality
		scope.dialog.getButtonById('ok').fn = function (info) {
			var grid = platformGridAPI.grids.element('id', scope.gridId);

			if (grid.instance.getEditorLock().isActive()) {
				grid.instance.getEditorLock().commitCurrentEdit();
			}

			var setting = getSetting();

			scope.$close({isOK: true, setting: setting});
		};

		scope.dialog.getButtonById('restore').fn = function (/* info */) {
			dataService.fireListLoaded();
		};

		scope.dialog.getButtonById('cancel').fn = function (/* info */) {
			scope.$close({isOK: false});
		};

		let decideUserLabelNameReadonlyState = function (){
			let activeRow = platformGridAPI.rows.selection({gridId: scope.gridId});
			if(activeRow.labelCode){
				if(!activeRow.__rt$data){
					activeRow.__rt$data = {};
					platformGridAPI.cells.readonly({gridId: scope.gridId, item: activeRow, field: 'customerLabel'});
				}else{
					let readonly = _.find(activeRow.__rt$data.readonly, (item) => { return item.field === 'customerLabel';});
					if(readonly){
						readonly.readonly = true;
					}else{
						platformGridAPI.cells.readonly({gridId: scope.gridId, item: activeRow, field: 'customerLabel'});
					}
				}
			}else{
				if(activeRow.__rt$data && activeRow.__rt$data.readonly){
					let readonly = _.find(activeRow.__rt$data.readonly, (item) => { return item.field === 'customerLabel';});
					if(readonly){
						readonly.readonly = false;
					}
				}
			}
		};

		var onCellChange = function (e, arg) {
			var column = arg.grid.getColumns()[arg.cell];
			var item = arg.item;

			setPropertyValue(column.field, item);
			if(column.field === 'labelCode'){
				decideUserLabelNameReadonlyState();
			}
		};



		/*
		 *   init toolbar
		 */
		scope.tools = {
			showImages: true,
			showTitles: true,
			cssClass: 'tools',
			items: [{
				id: 'moveUp',
				sort: 10,
				caption: 'cloud.common.toolbarMoveUp',
				type: 'item',
				iconClass: 'tlb-icons ico-grid-row-up',
				fn: function () {
					scope.moveUp('up');
				},
				disabled: function () {
					return !getSelectedItem();
				}
			}, {
				id: 'moveDown',
				sort: 10,
				caption: 'cloud.common.toolbarMoveDown',
				type: 'item',
				iconClass: 'tlb-icons ico-grid-row-down',
				fn: function () {
					scope.moveDown('down');
				},
				disabled: function () {
					return !getSelectedItem();
				}
			}, {
				id: 'moveTop',
				sort: 0,
				caption: 'cloud.common.toolbarMoveTop',
				type: 'item',
				iconClass: 'tlb-icons ico-grid-row-start',
				fn: function () {
					scope.moveUp('top');
				},
				disabled: function () {
					return !getSelectedItem();
				}
			}, {
				id: 'moveBottom',
				sort: 10,
				caption: 'cloud.common.toolbarMoveBottom',
				type: 'item',
				iconClass: 'tlb-icons ico-grid-row-end',
				fn: function () {
					scope.moveDown('bottom');
				},
				disabled: function () {
					return !getSelectedItem();
				}
			}],
			update: function () {
				return;
			}
		};

		function getSelectedItem() {
			return dataService.getSelected();
		}

		platformGridAPI.events.register(scope.gridId, 'onCellChange', onCellChange);

		var unregister = [scope.$on('$destroy', function () {
			platformGridAPI.events.unregister(scope.gridId, 'onCellChange', onCellChange);

			_.over(unregister)();
			unregister = scope = null;
		})];

		// This timeout is used for resize the grid layout after the dialog is shown.
		// Otherwise the grid in dialog can't be shown correctly.
		$timeout(function () {
			platformGridAPI.grids.invalidate(scope.gridId);
			platformGridAPI.grids.resize(scope.gridId);
			platformGridAPI.grids.refresh(scope.gridId);
		});
	}
})(angular);
