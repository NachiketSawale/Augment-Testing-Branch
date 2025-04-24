/**
 * Created by lcn on 10/25/2018.
 */
/**
 * Created by joj on 2017/4/13.
 */
(function (angular) {
	'use strict';

	// controlling-Structure-Prj-Controlling-Unit-Lookup
	angular.module('controlling.structure').directive('controllingStructureDialogLookup', ['globals', 'platformModalService', 'BasicsLookupdataLookupDirectiveDefinition', 'controllingStructureImageProcessor',
		function (globals, platformModalService, BasicsLookupdataLookupDirectiveDefinition, controllingStructureImageProcessor) {

			var defaults = {
				version: 3,
				uuid: '47783C48D2834CADA2B45F5D8B176701',
				lookupType: 'controllingunit',
				valueMember: 'Id',
				displayMember: 'Code',

				minWidth: '700px',
				maxWidth: '90%',
				columns: [
					{
						id: 'code',
						field: 'Code',
						name: 'Code',
						width: 100,
						name$tr$: 'cloud.common.entityCode'
					},
					{
						id: 'Description',
						field: 'DescriptionInfo',
						name: 'Description',
						formatter: 'translation',
						width: 150,
						name$tr$: 'cloud.common.entityDescription'
					},
					{
						id: 'companyCode',
						field: 'CompanyFk',
						name: 'CompanyCode',
						width: 120,
						name$tr$: 'cloud.common.entityCompanyCode',
						sortable: true,
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'company',
							displayMember: 'Code'
						},
						searchable: false
					},
					{
						id: 'companyName',
						field: 'CompanyFk',
						name: 'CompanyName',
						width: 120,
						name$tr$: 'cloud.common.entityCompanyName',
						sortable: true,
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'company',
							displayMember: 'CompanyName'
						},
						searchable: false
					},
					{
						id: 'projectNo',
						field: 'PrjProjectFk',
						name: 'projectNo',
						width: 120,
						name$tr$: 'cloud.common.entityProjectNo',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'project',
							displayMember: 'ProjectNo'
						},
						searchable: false
					},
					{
						id: 'projectName',
						field: 'PrjProjectFk',
						name: 'projectName',
						width: 150,
						name$tr$: 'cloud.common.entityProjectName',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'project',
							displayMember: 'ProjectName'
						},
						searchable: false
					},
					{
						id: 'qty',
						field: 'Quantity',
						name: 'Quantity',
						width: 120,
						toolTip: 'Quantity',
						formatter: 'quantity',
						name$tr$: 'cloud.common.entityQuantity',
						searchable:false},
					{
						id: 'qtyuom',
						field: 'UomFk',
						name: 'UomFk',
						width: 120,
						toolTip: 'QuantityUoM',
						name$tr$: 'cloud.common.entityUoM',
						formatter: 'lookup',
						formatterOptions:
							{lookupType: 'uom',
								displayMember: 'Unit'
							},
						searchable:false
					}
				],
				title: {name: 'cloud.common.controllingCodeTitle'},
				pageOptions: {
					enabled: true,
					size: 10
				},
				dialogOptions: {
					height:'627px',
					template:'',
					templateUrl: globals.appBaseUrl + 'controlling.structure/templates/controlling-structure-dialog.html'
				},
				treeOptions: { // popup tree
					parentProp: 'ControllingunitFk',
					childProp: 'ChildItems',
					initialState: 'expanded',
					inlineFilters: true,
					hierarchyEnabled: true,
					idProperty: 'Id'
				},
				popupOptions: {
					width: 420,
					height: 300,
					templateUrl: 'grid-popup-lookup.html',
					footerTemplateUrl: 'lookup-popup-footer.html',
					controller: 'basicsLookupdataGridPopupController',
					showLastSize: true
				},
				disableDataCaching: true,
				resizeable: true,
				buildSearchString: function (searchValue) {
					if (!searchValue) {
						return '';
					}
					var searchString = 'Code.Contains("%SEARCH%") Or DescriptionInfo.Description.Contains("%SEARCH%")';
					return searchString.replace(/%SEARCH%/g, searchValue);
				}
			};

			return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', defaults, {
				processData: function (dataList) {
					controllingStructureImageProcessor.processTree(dataList, 'ChildItems');
					return dataList;
				}
			});

		}]);
})(angular);
