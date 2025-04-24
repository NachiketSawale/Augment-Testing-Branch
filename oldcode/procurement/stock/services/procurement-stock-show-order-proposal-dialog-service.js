/**
 * Created by jhe on 10/12/2018.
 */
// eslint-disable-next-line no-redeclare
/* global angular,globals,_ */

(function (angular) {
	'use strict';
	var moduleName = 'procurement.stock';
	/** @namespace item.Stock2matId */
	/** @namespace sotck2matFirst.Stock2matId */
	angular.module(moduleName).service('procurementStockShowOrderProposalDialogService', procurementStockShowOrderProposalDialogService);

	procurementStockShowOrderProposalDialogService.$inject = ['$translate', 'platformModalService', 'platformWizardDialogService', '$injector', '$http'];

	function procurementStockShowOrderProposalDialogService($translate, platformModalService, platformWizardDialogService, $injector, $http) {
		var service = {};
		service.showOrderProposal = function showOrderProposal(entity) {
			var selectedEntities = new Array(0);
			if (entity === null || angular.isUndefined(entity)) {
				var procurementStockDataService = $injector.get('procurementStockStockTotalDataService');
				selectedEntities = procurementStockDataService.getSelectedEntities();
				if (selectedEntities.length < 1) {
					selectedEntities = procurementStockDataService.getList();
				}
				entity = selectedEntities[0];
			} else {
				selectedEntities.push(entity);
			}

			var length = _.size(_.filter(selectedEntities, function (item) {
				return !item.IsCurrentCompany;
			}));

			if (length > 0) {
				platformModalService.showDialog({
					headerText: $translate.instant('procurement.stock.wizard.createOrderProposal.caption'),
					bodyText: $translate.instant('procurement.stock.wizard.notBelongToLoginCompanyMessage'),
					iconClass: 'ico-info'
				});
				return;
			}

			var selectedSotck2mats = selectedEntities.filter(function (item) {
				return item.Stock2matId;
			});
			if (selectedSotck2mats.length > 0) {
				if (selectedSotck2mats.length < selectedEntities.length) {
					var modalOptions2 = {
						headerText: $translate.instant('procurement.stock.wizard.createOrderProposal.caption'),
						bodyText: $translate.instant('procurement.stock.wizard.createOrderProposal.notYetHaveStockMessage', {number: selectedEntities.length - selectedSotck2mats.length}),
						showOkButton: false,
						showCancelButton: true,
						customButtons: [{
							id: 'next', caption: $translate.instant('cloud.desktop.botChat.next'), cssClass: 'ico-info', fn: function (button, event, closeFn) {
								closeFn();
								showOrderProposalWizardDialog(selectedSotck2mats);
							}
						}],
						iconClass: 'ico-info'
					};
					platformModalService.showDialog(modalOptions2);
				} else {
					showOrderProposalWizardDialog(selectedSotck2mats);
				}
			} else if (entity === null) {
				// select a project first.
				// noinspection JSDuplicatedDeclaration
				var modalOptions = {
					headerText: $translate.instant('procurement.stock.wizard.createOrderProposal.caption'),
					bodyText: $translate.instant('procurement.stock.wizard.createOrderProposal.selectStockTotalMessage'),
					iconClass: 'ico-info'
				};
				platformModalService.showDialog(modalOptions);
			} else {
				// noinspection JSDuplicatedDeclaration
				var modalOptions1 = {
					headerText: $translate.instant('procurement.stock.wizard.createOrderProposal.caption'),
					bodyText: $translate.instant('procurement.stock.wizard.createOrderProposal.stock2MatIdMessage'),
					iconClass: 'ico-info'
				};
				platformModalService.showDialog(modalOptions1);
			}
		};

		function showOrderProposalWizardDialog(selectedSotck2mats) {
			var wzConfig = {
				title$tr$: $translate.instant('procurement.stock.wizard.createOrderProposal.caption'),
				steps: []
			};
			var catalogCodes = new Array(0);
			selectedSotck2mats.map(function (item) {
				if (catalogCodes.indexOf(item.CatalogCode) === -1) {
					catalogCodes.push(item.CatalogCode);
				}
			});
			for (var i = 0; i < catalogCodes.length; i++) {
				var sotck2mats = _.filter(selectedSotck2mats, {CatalogCode: catalogCodes[i]});
				var stock2matIds = sotck2mats.map(function (item) {
					return item.Stock2matId;
				});
				var sotck2matFirst = sotck2mats[0];
				wzConfig.steps.push({
					id: sotck2matFirst.Stock2matId,
					title$tr$: sotck2matFirst.CatalogCode,
					topDescription$tr$: sotck2matFirst.CatalogDescription,
					disallowNext: false,
					number: i,
					catalogCode: sotck2matFirst.CatalogCode,
					catalogDescription: sotck2matFirst.CatalogDescription,
					stock2matIds: stock2matIds
				});
			}
			platformWizardDialogService.translateWizardConfig(wzConfig);

			var obj = {
				selector: {},
				__selectorSettings: {}
			};
			// noinspection JSUnresolvedVariable
			var stock2matId = selectedSotck2mats[0].Stock2matId;
			var catalogCode = selectedSotck2mats[0].CatalogCode;
			var catalogDescription = selectedSotck2mats[0].CatalogDescription;
			$http.get(globals.webApiBaseUrl + 'procurement/stock/orderproposal/item?prjStock2MdcMaterialFk=' + stock2matId).then(function (response) {
				var isFrameworkAgreement = _.filter(wzConfig.steps, {id: stock2matId})[0].stock2matIds.length <= 1;
				if (response.data === null || response.data === '') {
					$http.get(globals.webApiBaseUrl + 'procurement/stock/orderproposal/create?prjStock2MdcMaterialFk=' + stock2matId).then(function (response) {
						/** @namespace response.data.BasClerkReqFk */
						/** @namespace response.data.IsFrameworkAgreement */
						/** @namespace response.data.BasClerkPrcFk */
						var modalOptions = {
							headerTextKey: $translate.instant('procurement.stock.wizard.createOrderProposal.caption'),
							templateUrl: globals.appBaseUrl + 'procurement.stock/templates/create-order-proposal-wizard-dialog.html',
							width: '620px',
							iconClass: 'ico-question',
							showCancelButton: true,
							prjStock2MdcMaterialFk: stock2matId,
							prcConfigurationFk: response.data.PrcConfigurationFk,
							prcConfigurationReqFk: response.data.PrcConfigurationReqFk,
							basClerkPrcFk: response.data.BasClerkPrcFk,
							basClerkReqFk: response.data.BasClerkReqFk,
							prcPackageFk: response.data.PrcPackageFk,
							bpdBusinessPartnerFk: response.data.BpdBusinessPartnerFk,
							bpdSubsidiaryFk: response.data.BpdSubsidiaryFk,
							bpdSupplierFk: response.data.BpdSupplierFk,
							bpdContactFk: response.data.BpdContactFk,
							isLive: true,
							leadTime: response.data.LeadTime,
							log: null,
							tolerance: 0,
							description: response.data.Description,
							id: -1,
							isFrameworkAgreement: isFrameworkAgreement && response.data.IsFrameworkAgreement,
							ProjectFk: response.data.ProjectFk,
							catalogCode: catalogCode,
							catalogDescription: catalogDescription,
							value: {
								wizard: wzConfig,
								entity: obj,
								wizardName: 'wzdlg'
							},
							ItemDescription: response.data.ItemDescription
						};
						platformModalService.showDialog(modalOptions);
					});
				} else {
					/** @namespace response.data.Tolerance */
					/** @namespace response.data.PrjStock2MdcMaterialFk */
					var modalOptions = {
						headerTextKey: $translate.instant('procurement.stock.wizard.createOrderProposal.caption'),
						templateUrl: globals.appBaseUrl + 'procurement.stock/templates/create-order-proposal-wizard-dialog.html',
						width: '620px',
						iconClass: 'ico-question',
						showCancelButton: true,
						prjStock2MdcMaterialFk: response.data.PrjStock2MdcMaterialFk,
						prcConfigurationFk: response.data.PrcConfigurationFk,
						prcConfigurationReqFk: response.data.PrcConfigurationReqFk,
						basClerkPrcFk: response.data.BasClerkPrcFk,
						basClerkReqFk: response.data.BasClerkReqFk,
						prcPackageFk: response.data.PrcPackageFk,
						bpdBusinessPartnerFk: response.data.BpdBusinessPartnerFk,
						bpdSubsidiaryFk: response.data.BpdSubsidiaryFk,
						bpdSupplierFk: response.data.BpdSupplierFk,
						bpdContactFk: response.data.BpdContactFk,
						isLive: response.data.IsLive,
						leadTime: response.data.LeadTime,
						log: response.data.Log,
						tolerance: response.data.Tolerance,
						description: response.data.Description,
						id: response.data.Id,
						isFrameworkAgreement: isFrameworkAgreement && response.data.IsFrameworkAgreement,
						ProjectFk: response.data.ProjectFk,
						catalogCode: catalogCode,
						catalogDescription: catalogDescription,
						value: {
							wizard: wzConfig,
							entity: obj,
							wizardName: 'wzdlg'
						},
						ItemDescription: response.data.ItemDescription
					};
					platformModalService.showDialog(modalOptions);
				}
			});
		}

		return service;
	}
})(angular);