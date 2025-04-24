/**
 * Created by shen on 6/13/2022
 */

(function (angular) {

	'use strict';

	/**
	 * @ngdoc directive
	 * @name project-stock-lookup
	 * @requires
	 * @description Dialog to select a project stock
	 */

	angular.module('project.stock').directive('projectStockDialogLookup', ['LookupFilterDialogDefinition', 'basicsLookupdataConfigGenerator', 'basicsLookupdataLookupFilterService',
		'projectStockDialogLookupDataService',
		function (LookupFilterDialogDefinitionPaging, basicsLookupdataConfigGenerator, basicsLookupdataLookupFilterService, projectStockDialogLookupDataService) {

			let formSettings = {
				fid: 'project.stock.selectionfilter',
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
					model: 'ProjectId',
					sortOrder: 1
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
						field: 'Description',
						name: 'Description',
						name$tr$: 'cloud.common.entityDescription',
						formatter: 'description',
						readonly: true,
						width: 270
					}],
				inputSearchMembers: ['Code','Description']

			};
			let lookupOptions = {
				lookupType: 'ProjectStockNew',
				valueMember: 'Id',
				displayMember: 'Code',
				title: 'Project Stock',
				filterOptions: {
					serverSide: true,
					serverKey: 'basics-site-stock-filter',
					fn: function (item){
						return projectStockDialogLookupDataService.getFilterParams(item);
					}
				},
				pageOptions: {
					enabled: true,
					size: 50
				},
				version: 3,
				uuid: '7e5404085f134191848721e09f175def'
			};
			return new LookupFilterDialogDefinitionPaging(lookupOptions, 'projectStockDialogLookupDataService', formSettings, gridSettings);
		}
	]);
})(angular);
