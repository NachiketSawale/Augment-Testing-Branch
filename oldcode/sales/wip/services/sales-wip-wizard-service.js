/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';


	/**
	 * @ngdoc factory
	 * @name sales.wip.services: salesWipWizardService
	 * @description
	 * Provides wizard configuration and implementation of all sales wip wizards
	 */
	angular.module('sales.wip').factory('salesWipWizardService', ['_', 'globals', '$http', '$injector', '$translate', 'basicsCommonChangeStatusService', 'platformSidebarWizardConfigService', 'salesWipService', 'platformTranslateService', 'salesCommonBoqWizardService', 'salesWipCreateBillWizardDialogService', 'salesWipBoqService', 'salesWipTransactionDataService','documentProjectDocumentsStatusChangeService',
		function (_, globals, $http, $injector, $translate, basicsCommonChangeStatusService, platformSidebarWizardConfigService, salesWipService, platformTranslateService, salesCommonBoqWizardService, salesWipCreateBillWizardDialogService, salesWipBoqService, salesWipTransactionDataService,documentProjectDocumentsStatusChangeService) {

			var service = {};

			// helper
			function assertWipIsNotReadOnly(title, wipItem) {
				var message = $translate.instant('sales.wip.wipIsReadOnly');
				return $injector.get('salesCommonStatusHelperService').assertIsNotReadOnly(title, message, salesWipService, wipItem);
			}

			// Wip      <editor-fold desc="[Wip]">
			var changeWipStatus = function changeWipStatus() {
				return basicsCommonChangeStatusService.provideStatusChangeInstance(
					{
						projectField: 'ProjectFk',
						statusName: 'wip',
						mainService: salesWipService,
						statusField: 'WipStatusFk',
						descField: 'DescriptionInfo.Translated',
						statusDisplayField: 'Description',
						title: 'sales.wip.wizardCSChangeWipStatus',
						statusProvider: function (entity) {
							return $injector.get('basicsLookupdataSimpleLookupService').getList({
								valueMember: 'Id',
								displayMember: 'Description',
								lookupModuleQualifier: 'sales.wip.status',
								filter: {
									customIntegerProperty: 'BAS_RUBRIC_CATEGORY_FK',
									field: 'RubricCategoryFk'
								}
							}).then(function (respond) {
								return _.filter(respond, function (item) {
									return (item.RubricCategoryFk === entity.RubricCategoryFk) && item.isLive;
								});
							});
						},
						updateUrl: 'sales/wip/changestatus',
						handleSuccess: function handleSuccess(result){
							var item = result.entity;
							if (result.changed === true && result.executed === true) {
								var oldItem = _.find(salesWipService.getList(), {Id: item.Id});
								if (oldItem) {
									_.each(salesWipService.getDataProcessor(), function (processor) {
										processor.processItem(item);
									});

									angular.extend(oldItem, item);
									salesWipService.setSelected({}).then(function(){
										salesWipService.setSelected(oldItem);
										salesWipService.gridRefresh();
									});
								}
							}
						}
					}
				);
			};
			service.changeWipStatus = changeWipStatus().fn;

			service.changeCode = function changeCode() {
				$injector.get('salesCommonCodeChangeWizardService').showDialog();
			};

			service.setPreviousWip = function setPreviousWip() {
				var selectedWips = salesWipService.getSelectedEntities(),
					title = 'sales.wip.setPreviousWipWizardTitle',
					msg = $translate.instant('sales.wip.noCurrentWipSelection');

				// process if only one wip is selected
				if (_.size(selectedWips) === 1) {
					var selectedWip = _.first(selectedWips);

					// check wip status (readonly?)
					if (!assertWipIsNotReadOnly($translate.instant(title), selectedWip)) {
						return;
					}

					var filters = [{
						key: 'sales-wip-set-previouswip-filter',
						serverKey: 'sales-wip-previouswip-filter-by-server',
						serverSide: true,
						fn: function (/* dlgEntity , state */) {
							var selectedWip = salesWipService.getSelected();
							return {
								WipId: selectedWip.Id, // no self reference
								ContractId: selectedWip.OrdHeaderFk,
								ProjectId: selectedWip.ProjectFk
							};
						}
					}];
					$injector.get('basicsLookupdataLookupFilterService').registerFilter(filters);

					// TODO: implement wizard here
					var dataItem = {
						WipId: selectedWip.Id,
						PreviousWipId: selectedWip.PrevWipHeaderFk,
						OrdHeaderId: selectedWip.OrdHeaderFk,
						ProjectId: selectedWip.ProjectFk
					};
					var modalDialogConfig = {
						title: $translate.instant(title),
						dataItem: dataItem,
						formConfiguration: {
							fid: 'sales.wip.setPreviousWipWizardDialog',
							version: '0.1.0',
							showGrouping: false,
							groups: [{
								gid: 'baseGroup',
								attributes: ['previousWipId']
							}],
							rows: [
								// (Previous) WIP
								{
									gid: 'baseGroup',
									rid: 'previousWipId',
									model: 'PreviousWipId',
									sortOrder: 1,
									label: 'Previous WIP',
									label$tr$: 'sales.wip.previousWip',
									type: 'directive',
									directive: 'basics-lookupdata-lookup-composite',
									options: {
										lookupDirective: 'sales-common-wip-dialog-v2',
										descriptionMember: 'DescriptionInfo.Translated',
										lookupOptions: {
											filterKey: 'sales-wip-set-previouswip-filter',
											showClearButton: true
										}
									}
								}
							]
						},
						dialogOptions: {
							disableOkButton: function disableOkButton() {
								return dataItem.PreviousWipId === selectedWip.PrevWipHeaderFk;
							}
						},
						handleOK: function handleOK(result) {
							if (_.has(result, 'data.PreviousWipId')) {
								var PreviousWipId = _.get(result, 'data.PreviousWipId');
								if (PreviousWipId > 0 && _.isObject(selectedWip)) {
									// check if change of previous wip reference is possible
									// TODO:
								} else if (_.isNull(PreviousWipId)) {
									// check if deletion of previous wip reference is possible
									// TODO:
								}
								// assign new previous wip header or null
								selectedWip.PrevWipHeaderFk = PreviousWipId;
								_.each(salesWipService.getDataProcessor(), function (proc) {
									proc.processItem(selectedWip);
								});
								salesWipService.markItemAsModified(selectedWip);

							}
							$injector.get('basicsLookupdataLookupFilterService').unregisterFilter(filters);
						},
						handleCancel: function handleCancel() {
							$injector.get('basicsLookupdataLookupFilterService').unregisterFilter(filters);
						}
					};

					platformTranslateService.translateFormConfig(modalDialogConfig.formConfiguration);
					$injector.get('platformModalFormConfigService').showDialog(modalDialogConfig);

				} else {
					$injector.get('platformSidebarWizardCommonTasksService').showErrorNoSelection(title, msg);
				}
			};
			// </editor-fold>

			// Create Wizards / Tools      <editor-fold desc="[Create Wizards / Tools]">
			service.createBill = function createBill() {
				salesWipCreateBillWizardDialogService.createBillDialog();
			};

			service.createAccruals = function createAccruals() {
				$injector.get('salesWipCreateAccrualsWizardService').showDialog();
			};

			service.generateTransactions = function () {
				var header = salesWipService.getSelected();
				var platformModalService = $injector.get('platformModalService');

				if (!header) {
					platformModalService.showMsgBox('sales.contract.noWipHeaderSelected', 'cloud.common.informationDialogHeader', 'info');
				}
				else {
					$injector.get('$http').get(globals.webApiBaseUrl + 'sales/wip/transaction/generate?mainItemId=' + header.Id).then(function (res) {
						if (res.data === 0) {
							platformModalService.showMsgBox('sales.wip.noNewTransactionGenerated', 'cloud.common.informationDialogHeader', 'info');
						}

						$injector.get('salesWipTransactionDataService').load();
					}).finally(function () {
						$injector.get('salesWipValidationDataService').load();
					});
				}
			};
			// </editor-fold>

			// BoQ      <editor-fold desc="[BoQ]">
			service.GaebImport = function GaebImport(wizardParameter) {
				salesCommonBoqWizardService.GaebImport(salesWipService, 'salesWipBoqStructureService', wizardParameter);
			};

			service.createAndImportBoqs = function createAndImportBoqs(wizardParameter) {
				if (assertWipIsNotReadOnly($translate.instant('boq.main.createAndImportMultipleBoQs'), salesWipService.getSelected())) {
					salesCommonBoqWizardService.createAndImportBoqs(salesWipService, 'salesWipBoqStructureService', wizardParameter, salesWipBoqService);
				}
			};

			service.GaebExport = function GaebExport(wizardParameter) {
				salesCommonBoqWizardService.GaebExport(salesWipService, 'salesWipBoqStructureService', wizardParameter);
			};

			service.importOenOnlv = function() {
				if (assertWipIsNotReadOnly($translate.instant('boq.main.oen.onlvImport'), salesWipService.getSelected())) {
					salesCommonBoqWizardService.importOenOnlv(salesWipService, 'salesWipBoqStructureService');
				}
			};

			service.exportOenOnlv = function() {
				if (assertWipIsNotReadOnly($translate.instant('boq.main.oen.onlvExport'), salesWipService.getSelected())) {
					salesCommonBoqWizardService.exportOenOnlv(salesWipService, 'salesWipBoqStructureService');
				}
			};

			service.importCrbSia = function importCrbSia() {
				if (assertWipIsNotReadOnly($translate.instant('boq.main.siaImport'), salesWipService.getSelected())) {
					salesCommonBoqWizardService.importCrbSia(salesWipService, 'salesWipBoqStructureService');
				}
			};

			service.exportCrbSia = function exportCrbSia() {
				salesCommonBoqWizardService.exportCrbSia(salesWipService, 'salesWipBoqStructureService');
			};

			service.boqExportExcel = function(wizardParameter) {
				salesCommonBoqWizardService.BoqExcelExport(salesWipService, 'salesWipBoqStructureService', wizardParameter);
			};

			service.boqImportExcel = function(wizardParameter) {
				salesCommonBoqWizardService.BoqExcelImport(salesWipService, 'salesWipBoqStructureService', wizardParameter);
			};

			service.startQuantityInspector = function() {
				salesCommonBoqWizardService.startQuantityInspector(salesWipService, 'salesWipBoqStructureService');
			};

			service.scanBoq = function scanBoq(wizardParameter) {
				salesCommonBoqWizardService.scanBoq(salesWipService, 'salesWipBoqStructureService', wizardParameter);
			};

			service.selectGroups = function selectGroups(wizardParameter) {
				salesCommonBoqWizardService.selectGroups(salesWipService, 'salesWipBoqStructureService', wizardParameter);
			};

			service.RenumberBoQ = function RenumberBoQ() {
				if (assertWipIsNotReadOnly($translate.instant('boq.main.boqRenumber'), salesWipService.getSelected())) {
					salesCommonBoqWizardService.RenumberBoQ(salesWipService, 'salesWipBoqStructureService');
				}
			};

			service.TakeoverBoQ = function TakeoverBoQ() {
				// Check wip is selected
				var selectedWip = salesWipService.getSelected();
				var message = $translate.instant('sales.wip.noWipHeaderSelected');

				if (!$injector.get('platformSidebarWizardCommonTasksService').assertSelection(selectedWip, 'sales.wip.wipSelectionMissing', message)) {
					return;
				}
				if (assertWipIsNotReadOnly($translate.instant('sales.common.wizard.takeoverBoq'), selectedWip)) {
					$injector.get('salesCommonCopyBoqWizardService').showDialog();
				}
			};

			service.updateBoq = function updateBoq(){
				salesCommonBoqWizardService.updateBoq(salesWipService, 'salesWipBoqStructureService', 'sales.wip');
			};

			service.changeBoqHeaderStatus = function changeBoqHeaderStatus() {
				if (assertWipIsNotReadOnly($translate.instant('boq.main.wizardChangeBoqStatus'), salesWipService.getSelected())) {
					salesCommonBoqWizardService.changeBoqHeaderStatus(salesWipService, 'salesWipBoqService').fn();
				}
			};
			service.changeSalesConfiguration = function changeSalesConfiguration() {
				let selectedWip = salesWipService.getSelected();
				let statusLookup = $injector.get('salesWipStatusLookupDataService');
				let title = 'sales.wip.entityChangeSalesWipConfig';
				let message = $translate.instant('sales.wip.noWipHeaderSelected');

				if (!$injector.get('platformSidebarWizardCommonTasksService').assertSelection(selectedWip, 'sales.wip.wipSelectionMissing', message)) {
					return;
				}

				if (selectedWip !== null) {
					statusLookup.getItemByIdAsync(selectedWip.WipStatusFk, {dataServiceName: 'salesWipStatusLookupDataService'}).then(function (wipStatus) {
						if (wipStatus.IsBilled || wipStatus.IsAccepted || wipStatus.IsAccrued || wipStatus.IsCanceled || wipStatus.IsReadOnly) {
							$injector.get('platformModalService').showMsgBox('sales.common.entityRestrictedStatus', title, 'info');
						}
						else {
							$injector.get('salesCommonChangeSalesTypeOrConfigurationWizardService').showChangeSalesTypeOrConfigurationWizard();
						}
					});
				}
			};

			function updateQuantity() {
				var platformSidebarWizardCommonTasksService = $injector.get('platformSidebarWizardCommonTasksService'),
					platformModalFormConfigService = $injector.get('platformModalFormConfigService'),
					selectedItem = salesWipService.getSelected(),
					title = 'sales.wip.wizard.updateWipIQ',
					msg = $translate.instant('sales.wip.wizard.noCurrentSelection');

				if (platformSidebarWizardCommonTasksService.assertSelection(selectedItem, title, msg)) {
					var pesQtyUpdateConfig = {
						title: $translate.instant(title),
						dataItem: {
							selectedItem: 'IsSchedule',
							isUpdateLineItem : false
						},
						formConfiguration: {
							fid: 'sales.wip.wizard.updateWipIQ',
							version: '0.1.1',
							showGrouping: false,
							groups: [
								{
									gid: 'baseGroup',
									attributes: ['selectedItem', 'isUpdateLineItem']
								}
							],
							'overloads': {},
							rows: [
								{
									gid: 'baseGroup',
									rid: 'updateWipQuantity',
									label: 'Update Wip Quantity',
									label$tr$: 'scheduling.main.updateWipIQ',
									type: 'radio',
									model: 'selectedItem',
									options: {
										labelMember: 'Description',
										valueMember: 'Value',
										groupName: 'updateWipQuantityConfig',
										items: [
											{Id: 1, Description: $translate.instant('sales.wip.wizard.schedule'), Value: 'IsSchedule'},
											{Id: 2, Description: $translate.instant('sales.wip.wizard.pes'), Value: 'IsPes'}
										]
									},
									sortOrder: 1
								},
								{
									gid: 'baseGroup',
									rid: 'updateLineItem',
									label$tr$: 'sales.wip.wizard.updateLineItem',
									type: 'boolean',
									model: 'isUpdateLineItem',
									sortOrder: 2
								}
							]
						},
						handleOK: function handleOK(result) {
							if (result && result.ok && result.data) {
								var selectedHeader = salesWipService.getSelected();
								var pesHeaders = salesWipService.getSelectedEntities();
								var postData = {
									'WipHeaderIds': pesHeaders ? _.map(pesHeaders, 'Id') : [],
									'IsSchedule': result.data.selectedItem === 'IsSchedule',
									'IsPes' : result.data.selectedItem === 'IsPes',
									'IsUpdateLineItem': result.data.isUpdateLineItem
								};
								$http.post(globals.webApiBaseUrl + 'sales/wip/boq/updatewipquantity', postData).then(function(){
									salesWipService.load().then(function(){
										salesWipService.setSelected({}).then(function(){
											// FIXME: quick fix for #106177 (resource access layer exception, wrong entity version for update)
											// salesWipService.setSelected(selectedHeader);
											salesWipService.setSelected(_.find(salesWipService.getList(), {Id: selectedHeader.Id}));
											platformSidebarWizardCommonTasksService.showSuccessfullyDoneMessage('sales.wip.wizard.updatedQuantity');
										});
									});

								});
							}
						}
					};
					platformTranslateService.translateFormConfig(pesQtyUpdateConfig.formConfiguration);
					pesQtyUpdateConfig.scope = platformSidebarWizardConfigService.getCurrentScope();
					platformModalFormConfigService.showDialog(pesQtyUpdateConfig);
				}
			}

			service.updateQuantity = updateQuantity;

			service.updateDirectCostPerUnit = function updateDirectCostPerUnit() {
				var selectedWip = salesWipService.getSelected();
				if (assertWipIsNotReadOnly('Update Direct Cost per Unit', selectedWip)) { // TODO: translation
					salesWipService.updateDirectCostPerUnit(_.get(selectedWip, 'Id'));
				}
			};
			// </editor-fold>

			// Documents Project      <editor-fold desc="[Documents Project]">
			service.changeStatusForProjectDocument =documentProjectDocumentsStatusChangeService.provideStatusChangeInstance(salesWipService, 'sales.wip').fn;
			// </editor-fold>

			return service;
		}
	]);
})();
