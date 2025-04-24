/**
 * created by miu 11/23/2021
 *
 */
(function (angular) {
	'use strict';
	angular.module('procurement.common').controller('procurementCommonUpdateVersionBoqHeaderListWizardGridController', [
		'_', '$scope', 'platformGridAPI', 'basicsCommonDialogGridControllerService', 'procurementCommonPrcBoqService', 'prcBoqMainService', 'procurementContextService',
		'procurementCommonUpdateVersionBoqService','$injector',
		function (_, $scope, platformGridAPI, basicsCommonDialogGridControllerService, procurementCommonPrcBoqService, prcBoqMainService, moduleContext,
			updateVersionBoqService, $injector) {
			prcBoqMainService = prcBoqMainService.getService(moduleContext.getMainService());
			procurementCommonPrcBoqService = procurementCommonPrcBoqService.getService(moduleContext.getMainService(), prcBoqMainService);

			let selectedItems = [];

			$scope.gridId = 'f84261a155284579a214d0887e34e13a';
			$scope.grid = {
				state: $scope.gridId
			};
			$scope.data = {
				state: $scope.gridId
			};
			let gridColumns = [
				{
					id: 'isChecked',
					field: 'IsChecked',
					formatter: 'boolean',
					editor: 'boolean',
					name: 'Select',
					name$tr$: 'basics.common.checkbox.select',
					validator: onChange,
					width: 80
				},
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
					searchable: true
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
								return $injector.get('procurementCommonControllingUnitFactory').checkIsAccountingElement(dataItem, null);
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
				}
			];
			let gridConfig = {
				columns: angular.copy(gridColumns),
				data: [],
				id: $scope.gridId,
				gridId: $scope.gridId,
				lazyInit: true,
				options: {
					skipPermissionCheck: true,
					collapsed: false,
					indicator: true
				}
			};
			if (!platformGridAPI.grids.exist($scope.gridId)) {
				platformGridAPI.grids.config(gridConfig);
			} else {
				platformGridAPI.columns.configuration($scope.gridId, angular.copy(gridColumns));
			}
			let dataList = angular.copy(procurementCommonPrcBoqService.getList());
			handleReadOnlyExtend(dataList);
			_.map(dataList, function (item) {
				item.IsChecked = true;
				selectedItems.push(item);
			});
			updateVersionBoqService.boqHeaders(selectedItems);
			platformGridAPI.items.data($scope.gridId, dataList);
			function onChange(item, isChecked) {
				// var dataList = platformGridAPI.items.data($scope.gridId);
				let boq = _.find(selectedItems, {Id: item.Id});
				if (!boq) {
					if (isChecked === true) {
						selectedItems.push(item);
					}
				} else {
					if (isChecked === false) {
						_.remove(selectedItems, function (selectedItem) {
							return selectedItem.Id === item.Id;
						});
					}
				}
				updateVersionBoqService.boqHeaders(selectedItems);
			}

			function handleReadOnlyExtend(itemList){
				_.forEach(itemList, function (item){
					if (item.__rt$data) {
						if (item.__rt$data.readonly) {
							let readOnlyList=[
								{ field: 'BoqRootItem.ExternalCode', readonly: true },
								{ field: 'PrcBoq.MdcControllingunitFk', readonly: true }
							];
							item.__rt$data.readonly = _.concat(item.__rt$data.readonly, readOnlyList);
						}
					}
				});
			}
		}]);
})(angular);