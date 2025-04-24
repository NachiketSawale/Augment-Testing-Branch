/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {
	'use strict';
	let moduleName = 'estimate.main';

	/**
	 * @ngdoc directive
	 * @name estimateMainLocationDialog
	 * @requires  estimateMainLocationLookupService
	 * @description dropdown lookup grid to select the project location item
	 */
	angular.module(moduleName).directive('estimateMainLocationDialog',
		['BasicsLookupdataLookupDirectiveDefinition', 'cloudCommonGridService', 'projectLocationMainImageProcessor', 'estimateMainLocationLookupService',
			function (BasicsLookupdataLookupDirectiveDefinition, cloudCommonGridService, projectLocationMainImageProcessor, estimateMainLocationLookupService) {
				let defaults = {
					lookupType: 'estLineItemLocation',
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
							let output = [];
							cloudCommonGridService.flatten(dataList, output, 'Locations');
							for (let i = 0; i < output.length; ++i) {
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
						estimateMainLocationLookupService.loadAsync().then(function (data) {
							$scope.refreshData(data);
						});
					}
				};

				return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', defaults, {
					dataProvider: {
						myUniqueIdentifier: 'EstimateMainLocationLookupDataHandler',

						getList: function () {
							return estimateMainLocationLookupService.getListAsync();
						},

						getItemByKey: function (value,options) {
							return estimateMainLocationLookupService.getItemByIdAsync(value,options);
						},

						getDisplayItem: function (value,options) {
							return estimateMainLocationLookupService.getItemByIdAsync(value,options);
						},

						getSearchList: function (value) {
							return estimateMainLocationLookupService.getSearchList(value);
						}
					}
				});
			}
		]);
})(angular);
