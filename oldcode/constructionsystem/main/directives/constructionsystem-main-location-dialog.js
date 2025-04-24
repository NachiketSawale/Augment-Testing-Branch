/**
 * Created by lnt on 10/23/2017.
 */
(function (angular) {
	'use strict';
	var moduleName = 'constructionsystem.main';

	/**
	 * @ngdoc directive
	 * @name estimateMainLocationDialog
	 * @requires  estimateMainLocationLookupService
	 * @description dropdown lookup grid to select the project location item
	 */
	angular.module(moduleName).directive('constructionsystemMainLocationDialog',
		['BasicsLookupdataLookupDirectiveDefinition', 'cloudCommonGridService', 'projectLocationMainImageProcessor', 'constructionsystemMainLineitemLocationLookupService',
			function (BasicsLookupdataLookupDirectiveDefinition, cloudCommonGridService, projectLocationMainImageProcessor, constructionsystemMainLineitemLocationLookupService) {
				var defaults = {
					lookupType: 'PrjLocationFk',
					valueMember: 'Id',
					displayMember: 'Code',
					uuid: 'd318a080c697439ebc802d5874a67737',
					columns: [
						{ id: 'Code', field: 'Code', name: 'Code', width: 180, formatter: 'code', name$tr$: 'cloud.common.entityCode' },
						{ id: 'Description', field: 'DescriptionInfo', name: 'Description', width: 300, formatter: 'translation', name$tr$: 'cloud.common.entityDescription' },
						{ id: 'qty', field: 'Quantity', name: 'Quantity', width: 120, toolTip: 'Quantity', formatter: 'quantity', name$tr$: 'cloud.common.entityQuantity', searchable:false}
					],
					width: 660,
					height: 200,
					treeOptions: {
						parentProp: 'LocationParentFk',
						childProp: 'Locations',
						initialState: 'expanded',
						inlineFilters: true,
						hierarchyEnabled: true,
						dataProcessor : function (dataList) {
							var output = [];
							cloudCommonGridService.flatten(dataList, output, 'Locations');
							for (var i = 0; i < output.length; ++i) {
								projectLocationMainImageProcessor.processItem(output[i]);
							}
							return dataList;
						}
					},
					title: { name: 'estimate.main.locationContainer' },
					buildSearchString: function (searchValue) {
						if (!searchValue) {
							return '';
						}
						return searchValue;
					},
					onDataRefresh: function ($scope) {
						constructionsystemMainLineitemLocationLookupService.loadAsync().then(function (data) {
							$scope.refreshData(data);
						});
					}
				};

				return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', defaults, {
					dataProvider: {
						myUniqueIdentifier: 'ConstructionsystemMainLocationLookupDataHandler',

						getList: function () {
							return constructionsystemMainLineitemLocationLookupService.getListAsync();
						},

						getItemByKey: function (value) {
							return constructionsystemMainLineitemLocationLookupService.getItemByIdAsync(value);
						},

						getDisplayItem: function (value) {
							return constructionsystemMainLineitemLocationLookupService.getItemByIdAsync(value);
						},

						getSearchList: function (value) {
							return constructionsystemMainLineitemLocationLookupService.getSearchList(value);
						}
					}
				});
			}
		]);
})(angular);
