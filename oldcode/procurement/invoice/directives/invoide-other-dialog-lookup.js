/**
 * Created by leo on 13.05.2019.
 */
(function (angular) {

	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	/**
	 * @ngdoc directive
	 * @name invoide-other-dialog lookup
	 * @requires
	 * @description ComboBox to select a activity template
	 */

	angular.module('procurement.invoice').directive('invoiceOtherDialogLookup', ['LookupFilterDialogDefinition', 'basicsLookupdataConfigGenerator', 'basicsLookupdataLookupFilterService',
		'invoideOtherDialogLookupDataService',
		function (LookupFilterDialogDefinition, basicsLookupdataConfigGenerator, basicsLookupdataLookupFilterService, invoideOtherDialogLookupDataService) {

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
				fid: 'prc.invoice.selectionfilter',
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
					rid: 'invHeader',
					label: 'Invoice Header',
					label$tr$: 'procurement.invoice.title.header',
					type: 'directive',
					directive: 'procurement-invoice-header-dialog',
					options: {
						'showClearButton': true
					},
					model: 'invoiceFk',
					sortOrder: 3
				}]
			};

			var gridSettings = {
				layoutOptions: {
					translationServiceName: 'procurementInvoiceTranslationService',
					uiStandardServiceName: 'procurementInvoiceOtherUIStandardService',
					schemas: [{
						typeName: 'InvOtherDto',
						moduleSubModule: 'Procurement.Invoice'
					}]
				}
			};
			var lookupOptions = {
				lookupType: 'InvOtherLookup',
				valueMember: 'Id',
				displayMember: 'Description',
				title: 'procurement.invoice.title.other',
				filterOptions: {
					serverSide: true,
					serverKey: 'invoice-other-filter',
					fn: function (item) {
						return invoideOtherDialogLookupDataService.getFilterParams(item);
					}
				},
				pageOptions: {
					enabled: true,
					size: 100
				},
				version: 3,
				uuid: 'af2c574671de430a9abd4a9d19540355'
			};
			return new LookupFilterDialogDefinition(lookupOptions, 'invoideOtherDialogLookupDataService', formSettings, gridSettings);
		}
	]);
})(angular);