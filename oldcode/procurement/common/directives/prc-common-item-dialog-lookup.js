/**
 * Created by leo on 09.05.2019
 */
(function (angular) {

	'use strict';

	/**
	 * @ngdoc directive
	 * @name prc-item-dialog lookup
	 * @requires
	 * @description ComboBox to select a activity template
	 */

	angular.module('procurement.common').directive('prcCommonItemDialogLookup', ['LookupFilterDialogDefinition', 'basicsLookupdataConfigGenerator', 'basicsLookupdataLookupFilterService',
		'prcComonItemDialogLookupDataService',
		function (LookupFilterDialogDefinition, basicsLookupdataConfigGenerator, basicsLookupdataLookupFilterService, prcComonItemDialogLookupDataService) {

			basicsLookupdataLookupFilterService.registerFilter([
				{
					key: 'prc-invoice-con-header-filter-for-lookup',
					serverKey: 'prc-invoice-con-header-filter',
					serverSide: true,
					fn: function (item) {
						var filterObj = {
							StatusIsInvoiced: false,
							StatusIsCanceled: false,
							StatusIsVirtual: false,
							StatusIsOrdered: true
							// StatusIsDelivered: false
						};
						if (item.projectFk) {
							filterObj.ProjectFk = item.projectFk;
						}
						if (item.packageFk) {
							filterObj.PrcPackageFk = item.packageFk;
						}
						return filterObj;
					}
				},
				{
					key: 'prc-invoice-package-filter-for-lookup',
					serverSide: true,
					fn: function (item) {
						if (item && item.projectFk) {
							return {ProjectFk: item.projectFk};
						}
						return null;
					}
				}

			]);
			var formSettings = {
				fid: 'prc.common.itemfilter',
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
					type: 'directive',
					directive: 'basics-lookup-data-project-project-dialog',
					options: {
						showClearButton: true
					},
					model: 'projectFk',
					required: true,
					sortOrder: 1
				},
				{
					gid: 'selectionfilter',
					rid: 'package',
					label: 'Package Code',
					// name$tr$: 'cloud.common.entityPackageCode',
					label$tr$: 'cloud.common.entityPackageCode',
					type: 'directive',
					directive: 'procurement-common-package-lookup',
					options: {
						eagerLoad: true,
						filterKey: 'prc-invoice-package-filter-for-lookup',
						showClearButton: true,
					},
					model: 'packageFk',
					sortOrder: 2,
					required: true
				},
				{
					gid: 'selectionfilter',
					rid: 'conHeader',
					label: 'Contract',
					label$tr$: 'cloud.common.entityContract',
					type: 'directive',
					directive: 'prc-con-header-dialog',
					options: {
						filterKey: 'prc-invoice-con-header-filter-for-lookup',
						showClearButton: true
					},
					model: 'conHeaderFk',
					sortOrder: 3
				}]
			};

			var gridSettings = {
				columns: [
					{
						id: 'itemNo',
						field: 'Itemno',
						name: 'Item no',
						name$tr$: 'procurement.common.prcItemItemNo',
						readonly: true
					},
					{
						id: 'description1',
						field: 'Description1',
						name: 'Description1',
						name$tr$: 'cloud.common.entityDescription',
						formatter: 'description',
						readonly: true
					},
					{
						id: 'description2',
						field: 'Description2',
						name: 'Description2',
						name$tr$: 'cloud.common.entityDescription',
						formatter: 'description',
						readonly: true
					},
					{
						id: 'mdcMaterialFk',
						field: 'MdcMaterialFk',
						name: 'Material',
						name$tr$: 'cloud.common.prcItemMaterialNo',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'MaterialCommodity',
							displayMember: 'Code'
						},

						width: 200,
					},
					{
						id: 'quantity',
						field: 'Quantity',
						name: 'Quantity',
						name$tr$: 'cloud.common.entityQuantity',
						formater: 'number'
					},
					{
						id: 'price',
						field: 'Price',
						name: 'Price',
						name$tr$: 'cloud.common.entityPrice',
						formater: 'number'
					},
					{
						id: 'mdcControllingunitFk',
						field: 'MdcControllingunitFk',
						name: 'MdcControllingunitFk',
						name$tr$: 'cloud.common.entityControllingUnitDesc',
						formatter: 'lookup',
						formatterOptions: {lookupType: 'Controllingunit', displayMember: 'DescriptionInfo.Translated'},
					},
					{
						id: 'mdcControllingunitFk2',
						field: 'MdcControllingunitFk',
						name: 'MdcControllingunitFk',
						name$tr$: 'cloud.common.entityControllingUnitCode',
						formatter: 'lookup',
						formatterOptions: {lookupType: 'Controllingunit', displayMember: 'Code'},
					},
				],
				inputSearchMembers: ['Itemno', 'Description1', 'Description2']
			};
			var lookupOptions = {
				lookupType: 'PrcItemEntityLookup',
				valueMember: 'Id',
				displayMember: 'Itemno',
				title: 'procurement.common.dialogTitleItem',
				filterOptions: {
					serverSide: true,
					serverKey: 'procurement-common-item-filter',
					fn: function (item) {
						return prcComonItemDialogLookupDataService.getFilterParams(item);
					}
				},
				pageOptions: {
					enabled: true,
					size: 100
				},
				version: 3,
				uuid: 'c3f56abd6c224f309b2ff72a56a66663'
			};
			return new LookupFilterDialogDefinition(lookupOptions, 'prcComonItemDialogLookupDataService', formSettings, gridSettings);
		}
	]);
})(angular);