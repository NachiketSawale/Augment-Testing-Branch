(function (angular) {
	'use strict';

	var modName = 'procurement.common';
	angular.module(modName).factory('procurementCommonPrcBoqUIStandardService', [
		'$injector', 'procurementContextService', 'procurementCommonHelperService',
		function ($injector, moduleContext/* , procurementCommonHelperService */) {
			return {
				getDtoScheme: function () {
					return {};
				},
				getStandardConfigForListView: function () {

					var gridColumns = {
						columns: [
							{
								id: 'boqstatusfk',
								formatter: 'lookup',
								formatterOptions: {
									displayMember: 'Description',
									imageSelector: 'platformStatusIconService',
									lookupModuleQualifier: 'basics.customize.boqstatus',
									lookupSimpleLookup: true,
									valueMember: 'Id'
								},
								field: 'BoqHeader.BoqStatusFk',
								name: 'BoQ Status',
								name$tr$: 'boq.main.BoqStatusFk',
								width: 100,
								searchable: true
							},
							{
								id: 'reference',
								formatter: 'description',
								editor: 'description',
								field: 'BoqRootItem.Reference',
								name: 'Reference',
								name$tr$: 'boq.main.Reference',
								width: 100,
								searchable: true,
								sortable:true,
								sortOptions: {
									numeric: true
								}
							},
							{
								id: 'externalcode',
								formatter: 'description',
								editor: 'description',
								field: 'BoqRootItem.ExternalCode',
								name: 'ExternalCode',
								name$tr$: 'boq.main.ExternalCode',
								width: 100,
								searchable: true
							},
							{
								id: 'briefinfo',
								formatter: 'translation',
								editor: 'translation',
								field: 'BoqRootItem.BriefInfo',
								name: 'Brief Info',
								name$tr$: 'boq.main.BriefInfo',
								width: 200
							},
							{
								field: 'BoqRootItem.Finalprice',
								formatter: 'money',
								editor: 'money',
								id: 'boqrootitem.finalprice',
								name: 'Final Price',
								name$tr$: 'boq.main.Finalprice',
								width: 100
							},
							{
								field: 'BoqRootItem.FinalpriceOc',
								formatter: 'money',
								editor: 'money',
								id: 'boqrootitem.finalpriceoc',
								name: 'Final Price Oc',
								name$tr$: 'boq.main.FinalpriceOc',
								width: 100
							},
							{
								id: 'packageCode',
								field: 'PrcBoq.PackageFk',
								name$tr$: 'cloud.common.entityPackageCode',
								editor: 'lookup',
								mandatory: true,
								editorOptions: {
									directive: 'procurement-common-package-lookup',
									lookupOptions: {
										filterKey: 'prc-boq-package-filter'
									}
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'PrcPackage',
									displayMember: 'Code'
								},
								navigator: {
									moduleName: 'procurement.package',
									registerService: 'procurementPackageDataService'
								},
								width: 100
							},
							{
								id: 'packageDesc',
								field: 'PrcBoq.PackageFk',
								name$tr$: 'cloud.common.entityPackageDescription',
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'PrcPackage',
									displayMember: 'Description'
								},
								width: 120
							},
							{
								id: 'MdcControllingunitFk',
								field: 'PrcBoq.MdcControllingunitFk',
								name: '$Controlling unit code',
								name$tr$: 'cloud.common.entityControllingUnitCode',
								editor: 'lookup',
								editorOptions: {
									lookupOptions: {
										showClearButton: true,
										filterKey: 'prc-controlling-unit-filter',
										considerPlanningElement: true,
										selectableCallback: function (dataItem) {
											var boqMainService = $injector.get('prcBoqMainService');
											var headerService = $injector.get('procurementCommonPrcBoqService');
											boqMainService = boqMainService.getService(moduleContext.getMainService());
											headerService = headerService.getService(moduleContext.getMainService(), boqMainService);
											return $injector.get('procurementCommonControllingUnitFactory').checkIsAccountingElement(dataItem, headerService);
										}
									},
									directive: 'controlling-structure-dialog-lookup'
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'controllingunit',
									displayMember: 'Code'
								},
								width: 120
							},
							{
								id: 'MdcControllingUnitDes',
								field: 'PrcBoq.MdcControllingunitFk',
								name: '$Controlling unit des.',
								name$tr$: 'cloud.common.entityControllingUnitDesc',
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'controllingunit',
									displayMember: 'DescriptionInfo.Translated'
								},
								width: 150
							},
							{
								id: 'BasCurrencyFk',
								field: 'BoqHeader.BasCurrencyFk',
								name: 'Currency',
								name$tr$: 'cloud.common.entityCurrency',
								editor: 'lookup',
								editorOptions: {
									lookupDirective: 'basics-lookupdata-currency-combobox'
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'currency',
									displayMember: 'Currency'
								},
								width: 150
							},
							{
								field: 'BoqRootItem.Vat',
								formatter: 'money',
								editor: 'money',
								id: 'boqrootitem.vat',
								name: 'Vat',
								name$tr$: 'procurement.common.entityVat',
								width: 100
							},
							{
								field: 'BoqRootItem.VatOc',
								formatter: 'money',
								editor: 'money',
								id: 'boqrootitem.vatoc',
								name: 'Vat Oc',
								name$tr$: 'procurement.common.entityVatOc',
								width: 100
							},
							{
								field: 'BoqRootItem.Finalgross',
								formatter: 'money',
								editor: 'money',
								id: 'boqrootitem.finalpricegross',
								name: 'Final Price (Gross)',
								name$tr$: 'boq.main.Finalgross',
								width: 100
							},
							{
								field: 'BoqRootItem.FinalgrossOc',
								formatter: 'money',
								editor: 'money',
								id: 'boqrootitem.finalpricegrossoc',
								name: 'Final Price (Gross OC)',
								name$tr$: 'boq.main.FinalgrossOc',
								width: 100
							},
							// The backup fields are read only
							{
								id: 'boqheader.backupdescription',
								field: 'BoqHeader.BackupDescription',
								formatter: 'description',
								name$tr$: 'boq.main.Backup.Description',
								width: 100
							},
							{
								id: 'boqheader.backupcomment',
								field: 'BoqHeader.BackupComment',
								formatter: 'description',
								name$tr$: 'boq.main.Backup.Comment',
								width: 100
							},
							{
								id: 'boqheader.backupnumber',
								field: 'BoqHeader.BackupNumber',
								formatter: 'integer',
								name$tr$: 'boq.main.Backup.Number',
								width: 100
							}

						],
						addValidationAutomatically: true
					};

					// add grouping setting
					angular.forEach(gridColumns.columns, function (column) {
						angular.extend(column, {
							grouping: {
								title: column.name$tr$,
								getter: column.field,
								aggregators: [],
								aggregateCollapsed: true
							}
						});
					});

					return gridColumns;
				},
				getStandardConfigForDetailView: function () {
					return {

						'fid': 'procurement.boq.detail',
						'version': '1.1.0',
						showGrouping: true,
						title$tr$: '',
						'groups': [
							{
								'gid': 'basicData',
								'header$tr$': 'cloud.common.entityProperties',
								'isOpen': true,
								'visible': true,
								'sortOrder': 1
							}
						],
						'rows': [
							{
								'rid': 'boqstatusfk',
								'gid': 'basicData',
								'label$tr$': 'boq.main.boqstatusFk',
								'label': 'BoQ Status',
								'model': 'BoqHeader.BoqStatusFk',
								'type': 'directive',
								'directive': 'basics-lookupdata-simple',
								'options': {
									'lookupType': 'basics.customize.boqstatus',
									'displayMember': 'Description',
									'valueMember': 'Id',
									'filter': {showIcon: true},
									'lookupModuleQualifier': 'basics.customize.boqstatus',
									'imageSelector': 'platformStatusIconService'
								}
							},
							{
								'rid': 'reference',
								'gid': 'basicData',
								'label$tr$': 'boq.main.Reference',
								'label': 'Reference',
								'type': 'code',
								'model': 'BoqRootItem.Reference'
							},
							{
								'rid': 'externalcode',
								'gid': 'basicData',
								'label$tr$': 'boq.main.ExternalCode',
								'label': 'ExternalCode',
								'type': 'code',
								'model': 'BoqRootItem.ExternalCode'
							},
							{
								'rid': 'briefinfo',
								'gid': 'basicData',
								'label$tr$': 'boq.main.BriefInfo',
								'label': 'Brief Info',
								'type': 'translation',
								'model': 'BoqRootItem.BriefInfo'
							},
							{
								'rid': 'finalprice',
								'gid': 'basicData',
								'label$tr$': 'boq.main.Finalprice',
								'label': 'Final Price',
								'type': 'money',
								'model': 'BoqRootItem.Finalprice'
							},
							{
								'rid': 'finalpriceoc',
								'gid': 'basicData',
								'label$tr$': 'boq.main.FinalpriceOc',
								'label': 'Final Price Oc',
								'type': 'money',
								'model': 'BoqRootItem.FinalpriceOc'
							},
							{
								'rid': 'packageCode',
								'gid': 'basicData',
								'label$tr$': 'cloud.common.entityPackage',
								'label': 'Package',
								'type': 'directive',
								'model': 'PrcBoq.PackageFk',
								'directive': 'basics-lookupdata-lookup-composite',
								'options': {
									lookupDirective: 'procurement-common-package-lookup',
									descriptionMember: 'Description',
									lookupOptions: {
										filterKey: 'prc-boq-package-filter'
									}
								},
								navigator: {
									moduleName: 'procurement.package',
									registerService: 'procurementPackageDataService'
								}
							},
							{
								'rid': 'MdcControllingunitFk',
								'gid': 'basicData',
								'label$tr$': 'cloud.common.entityControllingUnit',
								'label': 'Controlling unit',
								'type': 'directive',
								'model': 'PrcBoq.MdcControllingunitFk',
								'directive': 'basics-lookupdata-lookup-composite',
								'options': {
									lookupDirective: 'controlling-structure-dialog-lookup',
									descriptionMember: 'DescriptionInfo.Translated',
									lookupOptions: {
										showClearButton: true,
										filterKey: 'prc-controlling-unit-filter',
										considerPlanningElement: true,
										selectableCallback: function (dataItem) {
											var boqMainService = $injector.get('prcBoqMainService');
											var headerService = $injector.get('procurementCommonPrcBoqService');
											boqMainService = boqMainService.getService(moduleContext.getMainService());
											headerService = headerService.getService(moduleContext.getMainService(), boqMainService);
											return $injector.get('procurementCommonControllingUnitFactory').checkIsAccountingElement(dataItem, headerService);
										}
									}
								}
							},
							{
								'rid': 'BasCurrencyFk',
								'gid': 'basicData',
								'label$tr$': 'cloud.common.entityCurrency',
								'label': 'Currency',
								'model': 'BoqHeader.BasCurrencyFk',
								'type': 'directive',
								'directive': 'basics-lookupdata-currency-combobox'
							}
						]
					};
				}
			};
		}]);
})(angular);