/**
 * Created by miu on 11/24/2021.
 */
(function(angular) {

	'use strict';
	var moduleName = 'procurement.common';
	// eslint-disable-next-line no-redeclare
	/* global angular */

	/**
	 * @ngdoc directive
	 * @name procurement.common.directive:prcCommonBoqItemColumnCombox
	 * @element div
	 * @restrict A
	 * @description
	 * Strategy combobox.
	 *
	 */
	angular.module(moduleName).directive('prcCommonBoqItemColumnCombox', ['_', '$q', '$injector', 'BasicsLookupdataLookupDirectiveDefinition', 'prcCommonBoqItemColumnDefinitionService',
		function (_, $q, $injector, BasicsLookupdataLookupDirectiveDefinition, columnDefinitionService) {

			let columns = [];
			let defaults = {
				lookupType: 'BoqItemColumn',
				valueMember: 'Field',
				displayMember: 'Description',
				showCustomInputContent: true,
				// eslint-disable-next-line no-unused-vars
				formatter: function (ngModel, displayItem, displayText, lookupSetting, entity) {// items =>currentItem.quoteStatus (currently selected)
					let dataView = lookupSetting.dataView;
					let selectColumns = [];

					if (!dataView.dataCache.isLoaded) {
						dataView.loadData('');
						dataView.dataCache.isLoaded = true;
					}

					let selectedItem=[];
					selectedItem = _.filter(dataView.dataFilter.data, {Selected: true});

					let formatString = '';
					if (selectedItem && selectedItem.length > 0) {
						var item = selectedItem[0];
						formatString = '<span style="padding-left: 2px;">' + item.Description + '</span>';
						if (selectedItem.length > 1) {
							formatString += ' (Mixed)';
						}
					}
					selectedItem.forEach(function (item) {
						selectColumns.push(item.Field);
					});
					dataView.scope.$parent.$parent.updateModeOption.selectedColumns = angular.copy(selectColumns);
					return formatString;
				},
				columns: [
					{id: 'selected', field: 'Selected', name: 'Selected', width: 50, formatter: 'boolean', editor: 'boolean', headerChkbox: false},
					{
						id: 'description',
						field: 'Description',
						name: 'Description',
						width: 100,
						name$tr$: 'cloud.common.entityDescription',
						// eslint-disable-next-line no-unused-vars
						formatter: function (row, cell, value, columndef, dataContext) {
							return '<span class="pane-l">' + value + '</span>';
						}
					}
				],
				selectableCallback: function () {
					return false;
				},
				uuid: '1456095b6a4e4cc78d5461971b395e76'
			};

			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults,
				{
					dataProvider: {
						getList: function () {
							if (columns.length === 0) {
								columns = columnDefinitionService.getFilteredColumns();
							}
							return $q.when(columns);
						},
						getItemByKey: function (key) {
							return _.find(columns, {id: key});
						}
					},
					processData: function (itemList) {
						if (itemList && itemList.length > 0) {
							_.forEach(itemList, function (item) {
								item.Selected = false;
							});
						}
						return itemList;
					}
				});
		}]);
})(angular);