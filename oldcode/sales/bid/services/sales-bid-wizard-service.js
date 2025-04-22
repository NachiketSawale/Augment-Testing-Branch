/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	/**
	 * @ngdoc factory
	 * @name sales.bid.services: salesBidWizardService
	 * @description
	 * Provides wizard configuration and implementation of all sales bid wizards
	 */
	angular.module('sales.bid').factory('salesBidWizardService', ['_','$http','globals', '$translate', '$injector', 'platformSidebarWizardCommonTasksService', 'basicsCommonChangeStatusService', 'salesBidService', 'salesCommonBoqWizardService', 'salesBidBoqService','documentProjectDocumentsStatusChangeService','businesspartnerCertificateCertificateContainerServiceFactory',
		'platformModalService',
		function (_,$http,globals, $translate, $injector, platformSidebarWizardCommonTasksService, basicsCommonChangeStatusService, salesBidService, salesCommonBoqWizardService, salesBidBoqService,documentProjectDocumentsStatusChangeService,businesspartnerCertificateCertificateContainerServiceFactory,
				  platformModalService) {

			var service = {};

			// helper
			function assertBidIsNotReadOnly(title, bidItem) {
				var message = $translate.instant('sales.bid.bidIsReadOnly');
				return $injector.get('salesCommonStatusHelperService').assertIsNotReadOnly(title, message, salesBidService, bidItem);
			}

			// wizard functions

			// Bid      <editor-fold desc="[BoQ]">
			var changeBidStatus = function changeBidStatus() {
				return basicsCommonChangeStatusService.provideStatusChangeInstance(
					{
						projectField: 'ProjectFk',
						statusName: 'bid',
						mainService: salesBidService,
						statusField: 'BidStatusFk',
						descField: 'DescriptionInfo.Translated',
						statusDisplayField: 'Description',
						title: 'sales.bid.wizardCSChangeBidStatus',
						statusProvider: function (entity) {
							return $injector.get('basicsLookupdataSimpleLookupService').getList({
								valueMember: 'Id',
								displayMember: 'Description',
								lookupModuleQualifier: 'sales.bid.status',
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
						updateUrl: 'sales/bid/changestatus',
						handleSuccess: function handleSuccess(result) {
							if (result.changed === true && result.executed === true) {
								var item = result.entity;
								var oldItem = _.find(salesBidService.getList(), {Id: item.Id});
								if (oldItem) {
									_.each(salesBidService.getDataProcessor(), function (processor) {
										processor.processItem(item);
									});

									angular.extend(oldItem, item);
									salesBidService.setSelected({}).then(function () {
										salesBidService.setSelected(oldItem);
										salesBidService.gridRefresh();
									});
								}
								salesBidService.gridRefresh();
							}
						}
					}
				);
			};
			service.changeBidStatus = changeBidStatus().fn;

			service.changeCode = function changeCode() {
				$injector.get('salesCommonCodeChangeWizardService').showDialog();
			};
			// </editor-fold>

			// Contract      <editor-fold desc="[Contract]">
			service.createContract = function createContract() {
				var salesBidCreateContractWizardDialogService = $injector.get('salesBidCreateContractWizardDialogService');
				salesBidCreateContractWizardDialogService.createContractDialog();
			};
			// </editor-fold>

			// BoQ      <editor-fold desc="[BoQ]">
			service.generateBidBoQ = function generateBidBoQ() {
				var salesBidCreateBidWizardDialogService = $injector.get('salesBidCreateBidWizardDialogService');
				salesBidCreateBidWizardDialogService.showDialog();
			};

			service.GaebImport = function GaebImport(wizardParameter) {
				salesCommonBoqWizardService.GaebImport(salesBidService, 'salesBidBoqStructureService', wizardParameter);
			};

			service.changeSalesConfiguration = function changeSalesConfiguration() {
				let selectedBid = salesBidService.getSelected();
				let statusLookup = $injector.get('salesBidStatusLookupDataService');
				let title = 'sales.bid.entityChangeSalesBidConfig';
				let message = $translate.instant('sales.bid.noBidHeaderSelected');
				if (!$injector.get('platformSidebarWizardCommonTasksService').assertSelection(selectedBid, 'sales.bid.bidSelectionMissing', message)) {
					return;
				}
				if (selectedBid !== null) {
					statusLookup.getItemByIdAsync(selectedBid.BidStatusFk, {dataServiceName: 'salesBidStatusLookupDataService'}).then(function (bidStatus) {
						if (bidStatus.IsQuoted || bidStatus.IsReadOnly) {
							$injector.get('platformModalService').showMsgBox('sales.common.entityRestrictedStatus', title, 'info');
						}
						else {
							$injector.get('salesCommonChangeSalesTypeOrConfigurationWizardService').showChangeSalesTypeOrConfigurationWizard();
						}
					});
				}
			};


			service.createAndImportBoqs = function createAndImportBoqs(wizardParameter) {
				if (assertBidIsNotReadOnly($translate.instant('boq.main.createAndImportMultipleBoQs'), salesBidService.getSelected())) {
					salesCommonBoqWizardService.createAndImportBoqs(salesBidService, 'salesBidBoqStructureService', wizardParameter, salesBidBoqService);
				}
			};

			service.GaebExport = function GaebExport(wizardParameter) {
				salesCommonBoqWizardService.GaebExport(salesBidService, 'salesBidBoqStructureService', wizardParameter);
			};

			service.importOenOnlv = function() {
				if (assertBidIsNotReadOnly($translate.instant('boq.main.oen.onlvImport'), salesBidService.getSelected())) {
					salesCommonBoqWizardService.importOenOnlv(salesBidService, 'salesBidBoqStructureService');
				}
			};

			service.exportOenOnlv = function() {
				if (assertBidIsNotReadOnly($translate.instant('boq.main.oen.onlvExport'), salesBidService.getSelected())) {
					salesCommonBoqWizardService.exportOenOnlv(salesBidService, 'salesBidBoqStructureService');
				}
			};

			service.importCrbSia = function importCrbSia() {
				if (assertBidIsNotReadOnly($translate.instant('boq.main.siaImport'), salesBidService.getSelected())) {
					salesCommonBoqWizardService.importCrbSia(salesBidService, 'salesBidBoqStructureService');
				}
			};

			service.exportCrbSia = function exportCrbSia() {
				salesCommonBoqWizardService.exportCrbSia(salesBidService, 'salesBidBoqStructureService');
			};

			service.BoqExcelExport = function BoqExcelExport(wizardParameter) {
				salesCommonBoqWizardService.BoqExcelExport(salesBidService, 'salesBidBoqStructureService', wizardParameter);
			};

			service.BoqExcelImport = function BoqExcelImport(wizardParameter) {
				salesCommonBoqWizardService.BoqExcelImport(salesBidService, 'salesBidBoqStructureService', wizardParameter);
			};

			service.startQuantityInspector = function() {
				salesCommonBoqWizardService.startQuantityInspector(salesBidService, 'salesBidBoqStructureService');
			};

			service.scanBoq = function scanBoq(wizardParameter) {
				salesCommonBoqWizardService.scanBoq(salesBidService, 'salesBidBoqStructureService', wizardParameter);
			};

			service.selectGroups = function selectGroups(wizardParameter) {
				salesCommonBoqWizardService.selectGroups(salesBidService, 'salesBidBoqStructureService', wizardParameter);
			};

			service.RenumberBoQ = function RenumberBoQ() {
				if (assertBidIsNotReadOnly($translate.instant('boq.main.boqRenumber'), salesBidService.getSelected())) {
					salesCommonBoqWizardService.RenumberBoQ(salesBidService, 'salesBidBoqStructureService');
				}
			};
			service.formatBoQSpecification = function formatBoQSpecification(wizardParameter) {
				salesCommonBoqWizardService.formatBoQSpecification(salesBidService, 'salesBidBoqStructureService', wizardParameter);
			};

			service.TakeoverBoQ = function TakeoverBoQ() {
				// Check bid is selected
				var selectedBid = salesBidService.getSelected();
				var message = $translate.instant('sales.bid.noBidHeaderSelected');

				if (!platformSidebarWizardCommonTasksService.assertSelection(selectedBid, 'sales.bid.bidSelectionMissing', message)) {
					return;
				}
				if (assertBidIsNotReadOnly($translate.instant('sales.common.wizard.takeoverBoq'), selectedBid)) {
					$injector.get('salesCommonCopyBoqWizardService').showDialog();
				}
			};

			service.updateBoq = function updateBoq() {
				salesCommonBoqWizardService.updateBoq(salesBidService, 'salesBidBoqStructureService', 'sales.bid');
			};

			service.changeBoqHeaderStatus = function changeBoqHeaderStatus() {
				if (assertBidIsNotReadOnly($translate.instant('boq.main.wizardChangeBoqStatus'), salesBidService.getSelected())) {
					salesCommonBoqWizardService.changeBoqHeaderStatus(salesBidService, 'salesBidBoqService').fn();
				}
			};

			service.updateProjectBoq = function updateProjectBoq() {
				if (assertBidIsNotReadOnly($translate.instant('sales.common.updatePrjBoqWizard.title'), salesBidService.getSelected())) {
					var selectedRecord = salesBidService.getSelected();
					var title = 'sales.common.updatePrjBoqWizard.title';
					var message = $translate.instant('sales.bid.noBidHeaderSelected');
					if (!platformSidebarWizardCommonTasksService.assertSelection(selectedRecord, title, message)) {
						return;
					}
					$injector.get('salesCommonUpdateProjectBoqWizard').showDialog('sales.bid', selectedRecord.Id);
				}
			};

			service.changeProjectChangeStatus = function changeProjectChangeStatus() {
				if (assertBidIsNotReadOnly($translate.instant('boq.main.wizardChangeProjectChangeStatus'), salesBidService.getSelected())) {
					salesCommonBoqWizardService.changeProjectChangeStatus(salesBidService, 'salesBidBoqStructureService').fn();
				}
			};

			// </editor-fold>

			// Estimate      <editor-fold desc="[Estimate]">
			service.updateEstimate = function updateEstimate() {
				var selectedBid = salesBidService.getSelected();
				if (!platformSidebarWizardCommonTasksService.assertSelection(selectedBid, 'sales.common.wizard.updateEstimate', $translate.instant('sales.bid.noBidHeaderSelected'))) {
					return;
				}
				if (assertBidIsNotReadOnly($translate.instant('sales.common.wizard.updateEstimate'), selectedBid)) {
					$injector.get('salesCommonUpdateEstimateWizardService').showUpdateEstimateWizard();
				}
			};
			// </editor-fold>

			// Documents Project      <editor-fold desc="[Documents Project]">
			service.changeStatusForProjectDocument =documentProjectDocumentsStatusChangeService.provideStatusChangeInstance(salesBidService, 'sales.bid').fn;
			// </editor-fold>

			let certificateDataService = businesspartnerCertificateCertificateContainerServiceFactory.getDataService('sales.bid', salesBidService);

			service.changeCertificateStatus = changeCertificateStatus().fn;

			function changeCertificateStatus() {
				return basicsCommonChangeStatusService.provideStatusChangeInstance(
					{
						projectField: 'ProjectFk',
						statusName: 'certificate',
						guid: '538325604B524F328FDF436FB14F1FC8',
						mainService: salesBidService,
						dataService: certificateDataService,
						descField: 'Reference',
						statusField: 'CertificateStatusFk',
						statusDisplayField: 'DescriptionInfo.Translated',
						title: 'businesspartner.main.certificateStatusTitle',
						updateUrl: 'businesspartner/certificate/certificate/status',
						id: 17,
						// If status change, run the validateCertificateStatusFk function, as it cannot run by common function
						// if the common function has changed to be supported, this function should be removed
						handleSuccess: function (result) {
							if (result.changed) {
								var item = result.entity;
								var oldEntity = certificateDataService.getItemById(item.Id);
								if (oldEntity) {
									_.forEach(certificateDataService.getDataProcessor(), function (processor) {
										processor.processItem(item);
									});
									angular.extend(oldEntity, item);
									certificateDataService.gridRefresh();
								}
							}
						},
						doValidationAndSaveBeforeChangeStatus: true
					}
				);
			}

			service.productionForecast = function productionForecast(){
				let bidHeader = salesBidService.getSelected();
				let BID_BOQ = salesBidBoqService.getSelected();
				if (bidHeader && BID_BOQ) {
					salesBidService.updateAndExecute(function () {
						let modalCreateConfig = {
							width: '900px',
							resizeable: true,
							templateUrl: globals.appBaseUrl + 'sales.bid/templates/sales-bid-production-forecast-wizard.html',
							controller: 'salesBidProductionForecastWizardController',
							resolve: {
								'$options': function () {
									return {
										bidHeader: bidHeader,
										boqHeaderId: BID_BOQ.BoqHeader.Id
									};
								}
							}
						};
						platformModalService.showDialog(modalCreateConfig);
					});
				} else {
					platformModalService.showErrorBox('sales.bid.wizard.productionForecast.noSelection',
					  'sales.bid.wizard.productionForecast.wizardTitle', 'warning');
				}
			};

			return service;
		}

	]);
})();
