/**
 * Created by uestuenel on 13.06.2017.
 */

(function () {
	'use strict';

	angular.module('platform').factory('platformGridConfigService', platformGridConfigService);

	platformGridConfigService.$inject = ['platformGridAPI', 'platformModuleNavigationService', 'platformPermissionService'];

	function platformGridConfigService(platformGridAPI, naviService, platformPermissionService) {

		let onNavigateCallback = null;
		let customizePermissions = ['f5e884c670df4f938e51787e7cc40bf7', '3a51bf834b8649069172d23ec1ba35e2', 'f79018066c4847a6b38ee99a6085dc9e'];
		platformPermissionService.loadPermissions(customizePermissions);

		return {
			initToolBar: initToolBar,
			getVisibleColumns: getVisibleColumns,
			getAvailableColumns: getAvailableColumns,
			isGridSelected: isGridSelected,
			moveSelectedItemTo: moveSelectedItemTo,
			registerOnNavigate: registerOnNavigate
		};

		function initToolBar(gridId) {
			return {
				showImages: true,
				showTitles: true,
				cssClass: 'tools',
				items: [
					{
						id: 'moveUp',
						sort: 10,
						caption: 'cloud.common.toolbarMoveUp',
						type: 'item',
						iconClass: 'tlb-icons ico-grid-row-up',
						fn: function () {
							moveSelectedItemTo(1, gridId);
						},
						disabled: function () {
							return !isGridSelected(gridId);
						}
					},
					{
						id: 'moveDown',
						sort: 10,
						caption: 'cloud.common.toolbarMoveDown',
						type: 'item',
						iconClass: 'tlb-icons ico-grid-row-down',
						fn: function () {
							moveSelectedItemTo(3, gridId);
						},
						disabled: function () {
							return !isGridSelected(gridId);
						}
					},
					{
						id: 'moveTop',
						sort: 0,
						caption: 'cloud.common.toolbarMoveTop',
						type: 'item',
						iconClass: 'tlb-icons ico-grid-row-start',
						fn: function () {
							moveSelectedItemTo(2, gridId);
						},
						disabled: function () {
							return !isGridSelected(gridId);
						}
					},
					{
						id: 'moveBottom',
						sort: 10,
						caption: 'cloud.common.toolbarMoveBottom',
						type: 'item',
						iconClass: 'tlb-icons ico-grid-row-end',
						fn: function () {
							moveSelectedItemTo(4, gridId);
						},
						disabled: function () {
							return !isGridSelected(gridId);
						}
					}
				],
				update: function () {
					return;
				}
			};
		}

		function moveSelectedItemTo(type, gridId) {
			var items = platformGridAPI.items.data(gridId);
			var selectedData = getGridSelectedInfos(gridId);
			var i, j;

			selectedData.selectedRows = sortNumber(selectedData.selectedRows);

			switch (type) {
				case 1:
					// moveUp
					for (i = 0; (i < selectedData.selectedRows.length && selectedData.selectedRows[i] - 1 >= 0); i++) {
						items.splice(selectedData.selectedRows[i] - 1, 0, items.splice(selectedData.selectedRows[i], 1)[0]);
					}
					break;

				case 2:
					// push upwards
					for (i = 1, j = 0; i <= selectedData.selectedRows.length; i++, j++) {
						items.splice((0 + j), 0, items.splice(selectedData.selectedRows[i - 1], 1)[0]);
					}
					break;

				case 3:
					// moveDown
					selectedData.selectedRows = selectedData.selectedRows.reverse();
					for (i = 0; (i < selectedData.selectedRows.length && selectedData.selectedRows[i] + 1 < items.length); i++) {
						items.splice(selectedData.selectedRows[i] + 1, 0, items.splice(selectedData.selectedRows[i], 1)[0]);
					}
					break;

				case 4:
					// push down
					for (i = 1, j = selectedData.selectedRows.length; i <= selectedData.selectedRows.length; i++, j--) {
						items.splice(items.length - i, 0, items.splice(selectedData.selectedRows[j - 1], 1)[0]);
					}
					break;
			}

			// refresh grid content
			platformGridAPI.items.data(gridId, items);
			platformGridAPI.rows.selection({gridId: gridId, rows: selectedData.selectedItems});
		}

		function sortNumber(toSort) {
			// sort correctly. Not 1, 10, 6, 7, 8(example)
			return toSort.sort(function (a, b) {
				return a - b;
			});
		}

		function isGridSelected(gridId) {
			// grid searchfield not allowed active. filterPanel.gridConfigurator -> searchfield
			return (getGridSelectedInfos(gridId).selectedRows.length > 0 && $('.filterPanel.gridConfigurator').children().val().trim().length === 0);
		}

		function getGridSelectedInfos(gridId) {
			// platformGridAPI.rows.selection -> only for single items
			// but, multiselection get not a toolbar function, this is maybe the solution
			let selectedInfo = {};
			let grid = platformGridAPI.grids.element('id', gridId);
			let gridinstance = grid ? grid.instance : undefined;

			// one or multiple selection
			selectedInfo.selectedRows = angular.isDefined(gridinstance) ? gridinstance.getSelectedRows() : [];

			// need for selection in grid
			selectedInfo.selectedItems = selectedInfo.selectedRows.map(function (row) {
				// get row-data
				return gridinstance.getDataItem(row);
			});

			return selectedInfo;
		}

		function registerOnNavigate(callback){
			onNavigateCallback = callback;
		}

		function getVisibleColumns() {
			return [
				{
					id: 'fieldName',
					formatter: 'description',
					name: 'Label name',
					name$tr$: 'cloud.desktop.formConfigLabelName',
					groupName: 'Labels',
					field: 'name',
					width: 180
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
					width: 180,
					navigator: {
						moduleName: 'userLabel.Translation',
						navFunc: function (info, item){
							if(onNavigateCallback){
								onNavigateCallback();
							}
							setTimeout(()=>{
								naviService.navigate({moduleName: 'basics.customize-userLabel'}, item, info);
							}, 100);
						},
						hide: function (item) {
							return !item.labelCode || !platformPermissionService.hasRead(customizePermissions);
						}
					}
				}, {
					id: 'userFieldName',
					formatter: 'description',
					name: 'User label name',
					name$tr$: 'cloud.desktop.formConfigCustomerLabelName',
					groupName: 'Labels',
					field: 'userLabelName',
					width: 180,
					editor: 'description',
					focusable: true
				}, {
					id: 'kbenter',
					formatter: 'boolean',
					name: 'Enter',
					name$tr$: 'cloud.desktop.formConfigAllowEnterNavigation',
					field: 'keyboard.enter',
					width: 60,
					cssClass: 'cell-center',
					editor: 'boolean',
					headerChkbox: true,
					focusable: true
				}, {
					id: 'width',
					formatter: 'integer',
					name: 'Width',
					name$tr$: 'cloud.desktop.gridWidthHeader',
					field: 'width',
					width: 40,
					cssClass: 'cell-right',
					editor: 'integer',
					focusable: true
				}
			];
		}

		function getAvailableColumns() {
			return [
				{
					id: 'fieldName',
					formatter: 'description',
					name: 'Label name',
					name$tr$: 'cloud.desktop.formConfigLabelName',
					field: 'name',
					width: 300,
					sortable: true
				}
			];
		}
	}
})();