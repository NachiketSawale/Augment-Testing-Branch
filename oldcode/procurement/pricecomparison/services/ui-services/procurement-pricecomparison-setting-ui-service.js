(function (angular) {
	'use strict';
	var moduleName = 'procurement.pricecomparison';

	// return form container options
	// http://rib-s-wiki01.rib-software.com/cloud/wiki/43/form-generator#Form-configuration-definition
	angular.module(moduleName).factory('procurementPriceComparisonSettingUiService', [
		'procurementPriceComparisonSettingConfiguration',
		function (
			settingConfiguration
		) {
			return {
				getStandardConfigForDetailView: getStandardConfigForDetailView
			};

			function getStandardConfigForDetailView() {
				let configure = settingConfiguration.getCurrentConfig();
				let gids = settingConfiguration.getGids();
				let uiColumns = {
					'fid': 'procurement.pricecomparison.item.settings',
					'version': '1.0.0',
					'showGrouping': true,
					'skipTools': !!configure.isPrint,
					'uuid': configure.uiSetting.uuid,
					groups: [
						{
							gid: gids.quoteCompareField,
							header: 'Quotation Compare Fields',
							header$tr$: 'procurement.pricecomparison.compareQuotationRows',
							isOpen: true,
							visible: true,
							sortOrder: 3
						},
						{
							gid: gids.billingSchemaField,
							header: 'BillingSchema Compare Fields',
							header$tr$: 'procurement.pricecomparison.compareBillingSchemaRows',
							isOpen: true,
							visible: true,
							sortOrder: 4
						},
						{
							gid: gids.compareField,
							header: 'Compare Fields',
							header$tr$: 'procurement.pricecomparison.compareQuotationCompareFieldsTitle',
							isOpen: true,
							visible: true,
							sortOrder: 5
						}
					],
					rows: [
						{
							gid: gids.quoteCompareField,
							rid: 3,
							type: 'directive',
							model: 'quoteFields',
							directive: configure.quoteCompareField.directive
						},
						{
							gid: gids.billingSchemaField,
							rid: 4,
							type: 'directive',
							model: 'billingSchemaFields',
							directive: configure.billingSchemaField.directive
						},
						{
							gid: gids.compareField,
							rid: 5,
							type: 'directive',
							model: 'itemFields',
							directive: configure.compareField.directive
						}
					]
				};

				let uiGroups = [
					{
						gid: gids.gridLayout,
						header: 'Grid Layout',
						header$tr$: 'platform.gridContainer.configDialogTitle',
						isOpen: true,
						visible: !configure.isPrint,
						sortOrder: 1
					},
					{
						gid: gids.quoteCompareColumn,
						header: 'Quotation Compare Columns',
						header$tr$: 'procurement.pricecomparison.compareQuotationColumns',
						isOpen: true,
						visible: !configure.isPrint,
						sortOrder: 2
					}
				];
				let uiRows = [
					{
						gid: gids.gridLayout,
						rid: 1,
						type: 'directive',
						model: 'fromItem',
						directive: 'column-layout-setting-directive',
						visible: !configure.isPrint
					},
					{
						gid: gids.quoteCompareColumn,
						rid: 2,
						type: 'directive',
						model: 'biddersFields',
						directive: configure.quoteCompareColumn.directive,
						visible: !configure.isPrint
					}
				];
				if (!configure.isPrint) {
					uiColumns.groups = uiGroups.concat(uiColumns.groups);
					uiColumns.rows = uiRows.concat(uiColumns.rows);
				}

				let boqUiGroups = [
					{
						gid: gids.summaryCompareField,
						header: 'Show Summary & Position Options',
						header$tr$: 'procurement.pricecomparison.showSummaryAndPositionOptions',
						isOpen: true,
						visible: true,
						sortOrder: 6
					}
				];
				let boqUiRows = [
					{
						gid: gids.summaryCompareField,
						rid: 6,
						type: 'directive',
						model: 'fromUI',
						directive: configure.summaryCompareField.directive,
						visible: true
					}
				];
				if (!configure.isPrint && !!configure.isBoq) {
					uiColumns.groups = uiColumns.groups.concat(boqUiGroups);
					uiColumns.rows = uiColumns.rows.concat(boqUiRows);
				}

				return uiColumns;
			}

		}
	]);
})(angular);
