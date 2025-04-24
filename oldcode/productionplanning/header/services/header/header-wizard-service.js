(function (angular) {
	'use strict';
	/* global globals, _ */
	const moduleName = 'productionplanning.header';
	angular.module(moduleName).factory('productionplanningHeaderWizardService', WizardService);

	WizardService.$inject = [
		'platformSidebarWizardConfigService',
		'platformSidebarWizardCommonTasksService',
		'basicsCommonChangeStatusService',
		'$q',
		'$http',
		'$translate',
		'platformDataValidationService',
		'platformModalService',
		'platformModuleNavigationService',
		'productionplanningHeaderDataService',
		'ppsUpstreamItemDataService',
		'productionplanningItemUpstreamPackagesCreationWizardHandler',
		'documentProjectDocumentsStatusChangeService',
		'basicsLookupdataLookupDescriptorService'];

	function WizardService(
		platformSidebarWizardConfigService,
		platformSidebarWizardCommonTasksService,
		basicsCommonChangeStatusService,
		$q,
		$http,
		$translate,
		platformDataValidationService,
		platformModalService,
		navigationService,
		headerDataService,
		ppsUpstreamItemDataServiceFactory,
		productionplanningItemUpstreamPackagesCreationWizardHandler,
		documentProjectDocumentsStatusChangeService,
		basicsLookupdataLookupDescriptorService) {

		let service = {};
		let wizardID = 'productionplanningHeaderSidebarWizards';

		let wizardConfig = {
			showImages: true,
			showTitles: true,
			showSelected: true,
			cssClass: 'sidebarWizard',
			items: [{
				id: 1,
				text: 'Groupname',
				text$tr$: 'productionplanning.common.wizard.wizardGroupname1',
				groupIconClass: 'sidebar-icons ico-wiz-change-status',
				visible: true,
				subitems: []
			}]
		};

		service.activate = () => {
			platformSidebarWizardConfigService.activateConfig(wizardID, wizardConfig);
		};

		service.deactivate = () => {
			platformSidebarWizardConfigService.deactivateConfig(wizardID);
		};

		let changeHeaderStatus = () => {
			return basicsCommonChangeStatusService.provideStatusChangeInstance(
				{
					id: 13,
					mainService: headerDataService,
					refreshMainService: false,
					dataService: headerDataService,
					statusField: 'HeaderStatusFk',
					title: 'productionplanning.common.header.wizard.changeHeaderStatus',
					statusName: 'productionplanningheader',
					descField: 'DescriptionInfo.Translated'
				}
			);
		};
		service.changeHeaderStatus = changeHeaderStatus().fn;

		let disableHeader = () => {
			return platformSidebarWizardCommonTasksService.provideDisableInstance(
				headerDataService,
				'Disable Item',
				'productionplanning.common.header.wizard.disableHeaderTitle',
				'Code',
				'productionplanning.common.header.wizard.enableDisableHeaderDone',
				'productionplanning.common.header.wizard.headerAlreadyDisabled',
				'header',
				11
			);
		};
		service.disableHeader = disableHeader().fn;

		let enableHeader = () => {
			return platformSidebarWizardCommonTasksService.provideEnableInstance(
				headerDataService,
				'Enable Item',
				'productionplanning.common.header.wizard.enableHeaderTitle',
				'Code',
				'productionplanning.common.header.wizard.enableDisableHeaderDone',
				'productionplanning.common.header.wizard.headerAlreadyEnabled',
				'header',
				12
			);
		};
		service.enableHeader = enableHeader().fn;

		service.changeUpstreamStatus = function changeUpstreamStatus() {
			var upstreamItemDataService = ppsUpstreamItemDataServiceFactory.getService({
				serviceKey: 'productionplanning.header.ppsitem.upstreamitem'
			});
			return (basicsCommonChangeStatusService.provideStatusChangeInstance(
				{
					statusName: 'upstream',
					mainService: headerDataService,
					dataService: upstreamItemDataService,
					refreshMainService: false,
					statusField: 'PpsUpstreamStatusFk',
					statusDisplayField: 'DescriptionInfo.Translated',
					title: 'Change Upstream Requirement Status',
					supportMultiChange: true
				}
			)).fn();
		};

		function showInfo(message) {
			var modalOptions = {
				headerTextKey: 'Info',
				bodyTextKey: message,
				showOkButton: true,
				iconClass: 'ico-warning'
			};
			platformModalService.showDialog(modalOptions);
		}

		service.changeUpStreamFormDataStatus = function (param, userParam) {
			if (!userParam) {
				showInfo('Please first select a data entity!');
				return;
			}
			var inst = basicsCommonChangeStatusService.provideStatusChangeInstance(
				{
					refreshMainService: false,
					statusName: 'formdata',
					mainService: userParam.mainService,
					dataService: userParam.dataService,
					statusField: 'FormDataStatusFk',
					codeField: 'Description',
					descField: 'Description',
					title: 'Change Form Data Status',
					updateUrl: 'basics/userform/data/changestatus',
					getDataService: function () {
						return {
							getSelected: function () {
								return userParam.dataService.getSelected();
							},
							getSelectedEntities: function () {
								return userParam.dataService.getSelectedEntities();
							},
							gridRefresh: function () {
								userParam.dataService.gridRefresh();
								var itemid = userParam.dataService.getSelected().Id;
								userParam.dataService.clearCache();
								userParam.dataService.load().then(function () {
									var item = userParam.dataService.getItemById(itemid);
									userParam.dataService.setSelected(item);
								});
							},
							getDataProcessor: function () {

							}
						};
					},
					id: 123
				}
			);
			inst.fn();
		};

		let doCreateUpstreamPackages = () => {
			var upstreamItemDataService = ppsUpstreamItemDataServiceFactory.getService({
				serviceKey: 'productionplanning.header.ppsitem.upstreamitem'
			});
			let getPackageRequestFn = (selectedItem, selectedUpstreamItems) => new Promise((resolve) => {
				var packageRequest = {
					UpstreamItems: selectedUpstreamItems,
					ProjectId: selectedItem.PrjProjectFk,
					PpsItemCode: selectedItem.Code
				};
				resolve(packageRequest);
			});
			productionplanningItemUpstreamPackagesCreationWizardHandler.doCreateUpstreamPackages(upstreamItemDataService, headerDataService, getPackageRequestFn);
		};
		service.createUpstreamPackages = () => {
			headerDataService.update().then(() => doCreateUpstreamPackages());
		};

		service.changeStatusForProjectDocument = documentProjectDocumentsStatusChangeService.provideStatusChangeInstance(headerDataService, 'productionplanning.header').fn;

		service.importPlannedQuantities = function (wizParam) {
			if (_.isNil(headerDataService.getSelected())) {
				platformModalService.showErrorBox('cloud.common.noCurrentSelection',
					'productionplanning.header.wizard.importPQs.title');
				return;
			}
			// check wizard parameter
			if (_.isNil(wizParam) || _.isNil(wizParam.CostCodeMappingConfig)) {
				platformModalService.showErrorBox('productionplanning.header.wizard.importPQs.missingWizParamError',
					'productionplanning.header.wizard.importPQs.title');
				return;
			}

			headerDataService.updateAndExecute(function () {
				if (platformDataValidationService.hasErrors(headerDataService)) {
					return;// stop when still has errors
				}
				platformModalService.showDialog({
					templateUrl: globals.appBaseUrl + moduleName + '/templates/pps-planned-quantity-import-wizard-dialog.html',
					controller: 'productionplanningPlannedQuantityImportDialogController',
					resolve: {
						$options: function () {
							return {
								costCodeMappingConfig: wizParam.CostCodeMappingConfig
							};
						}
					},
					backdrop: false,
					resizeable: true
				});
			});
		};

		service.transferPreliminary = function () {
			var title = $translate.instant('productionplanning.header.wizard.transferPreliminary.title');
			if (headerDataService.getSelectedEntities().length > 0) {
				$http.post(globals.webApiBaseUrl + 'basics/customize/ppsheadertype/list').then(function (response) {
					const currentType = _.find(response.data, {Id: headerDataService.getSelectedEntities()[0].HeaderTypeFk, IsLive: true});
					if (!currentType.IsForPreliminary) {
						let title = $translate.instant('productionplanning.header.wizard.transferPreliminary.title');
						let msg = $translate.instant('productionplanning.header.wizard.transferPreliminary.plsSelectWithPreliminary');
						return platformModalService.showMsgBox(msg, title, 'error');
					}

					if (!headerDataService.getSelectedEntities()[0].IsLive) {
						let title = $translate.instant('productionplanning.header.wizard.transferPreliminary.title');
						let msg = $translate.instant('productionplanning.header.wizard.transferPreliminary.plsSelectActive');
						return platformModalService.showMsgBox(msg, title, 'error');
					}

					let targetType = _.find(response.data, {IsDefault: true, IsForPreliminary: false, IsLive: true});
					if (!targetType) {
						let title = $translate.instant('productionplanning.header.wizard.transferPreliminary.title');
						let msg = $translate.instant('productionplanning.header.wizard.transferPreliminary.failToFindType');
						return platformModalService.showMsgBox(msg, title, 'error');
					}

					platformModalService.showDialog({
						width: '700px',
						minHeight: '200px',
						templateUrl: globals.appBaseUrl + moduleName + '/templates/pps-header-transfer-preliminary-dialog.html',
						title: '*Transfer Preliminary',
						controller: 'ppsHeaderTransferPreliminaryDialogController',
						resizeable: true,
						resolve: {
							'$options': function () {
								return {
									title: title,
									dataService: headerDataService,
									selectedItem: headerDataService.getSelectedEntities()[0],
									targetType: targetType,
								};
							}
						}
					});
				});
			} else {
				let title = $translate.instant('productionplanning.header.wizard.transferPreliminary.title');
				let msg = $translate.instant('productionplanning.header.wizard.transferPreliminary.noSelectedWarn');
				return platformModalService.showMsgBox(msg, title, 'error');
			}
		};
		service.createPreliminaryItems = () => {
			let selected = headerDataService.getSelected();
			if(selected){
				if(selected.HeaderType !== null && (selected.HeaderType.IsForPreliminary || selected.HeaderType.Isforpreliminary)){
					headerDataService.updateAndExecute(function () {
						let modalCreateConfig = {
							width: '900px',
							resizeable: true,
							templateUrl: globals.appBaseUrl + 'productionplanning.header/templates/pps-header-create-preliminary-item-dialog.html',
							controller: 'productionplanningHeaderCreatePreliminaryItemWizardController',
							resolve: {
								'$options': function () {
									return {
										selectedHeader: selected
									};
								}
							}
						};
						platformModalService.showDialog(modalCreateConfig);
					});
				} else {
					platformModalService.showErrorBox('productionplanning.header.wizard.createPreliminaryItem.noQualified',
						'productionplanning.header.wizard.createPreliminaryItem.title', 'warning');
				}
			} else {
				platformModalService.showErrorBox('productionplanning.header.wizard.createPreliminaryItem.noSelection',
					'productionplanning.header.wizard.createPreliminaryItem.title', 'warning');
			}
		};

		return service;
	}

})(angular);
