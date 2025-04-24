/*
 * Created by leo on 14.12.2021.
 */
(function (angular) {

	'use strict';

	/**
	 * @ngdoc directive
	 * @name project-stock-location-lookup
	 * @requires
	 * @description Dialog to select a project stock location
	 */

	angular.module('project.stock').directive('projectStockLocationDialogLookup', ['LookupFilterDialogDefinition', 'basicsLookupdataConfigGenerator', 'basicsLookupdataLookupFilterService',
		'projectStockLocationDialogLookupDataService','basicsCommonUtilities',
		function (LookupFilterDialogDefinitionPaging, basicsLookupdataConfigGenerator, basicsLookupdataLookupFilterService, projectStockLocationDialogLookupDataService,basicsCommonUtilities) {

			let formSettings = {
				fid: 'project.stock.location.selectionfilter',
				version: '1.0.0',
				showGrouping: false,
				groups: [
					{
						gid: 'selectionfilter',
						isOpen: true,
						visible: true,
						sortOrder: 1
					}
				],
				rows: [{
					gid: 'selectionfilter',
					rid: 'project',
					label: 'Project',
					label$tr$: 'cloud.common.entityProject',
					directive: 'basics-lookupdata-lookup-composite',
					type: 'directive',
					options: {
						lookupDirective: 'basics-lookup-data-project-project-dialog',
						descriptionMember: 'ProjectName',
						version: 3,
						lookupOptions: {
							showClearButton: true
						}
					},
					model: 'projectFk',
					sortOrder: 1
				},
				{
					gid: 'selectionfilter',
					rid: 'stock',
					label: 'Stock',
					label$tr$: 'project.stock.entityStock',
					model: 'projectStockFk',
					sortOrder: 2,
					type: 'directive',
					directive: 'basics-lookupdata-lookup-composite',
					options: {
						lookupDirective: 'basics-site-stock-lookup-dialog',
						displayMember: 'Code',
						descriptionMember: 'Description',
						lookupOptions: {
							showClearButton: true,
							defaultFilter: {'ProjectId': 'projectFk',	projectFkReadOnly: false}
						}
					}
				}]
			};
			let gridSettings = {
				columns: [
					{
						id: 'code',
						field: 'Code',
						name: 'Code',
						name$tr$: 'cloud.common.entityCode',
						readonly: true,
						formatter: 'code'
					},
					{
						id: 'description',
						field: 'DescriptionInfo',
						name: 'Description',
						name$tr$: 'cloud.common.entityDescription',
						formatter: 'translation',
						readonly: true,
						width: 270
					}],
				treeOptions: {
					parentProp: 'StockLocationFk',
					childProp: 'SubLocations'
				},
				inputSearchMembers: ['Code','Description']

			};
			let lookupOptions = {
				lookupType: 'ProjectStockLocation',
				valueMember: 'Id',
				displayMember: 'Code',
				title: 'project.stock.stockListContainerTitle',
				filterOptions: {
					serverSide: true,
					serverKey: 'project-stock-location-filter',
					fn: function (item){
						return projectStockLocationDialogLookupDataService.getFilterParams(item);
					}
				},
				pageOptions: {
					enabled: true,
					size: 100
				},
				version: 3,
				uuid: '33d0e42abb75495f8945873104b227a4'
			};
			return new LookupFilterDialogDefinitionPaging(lookupOptions, 'projectStockLocationDialogLookupDataService', formSettings, gridSettings);
		}
	]);
})(angular);
