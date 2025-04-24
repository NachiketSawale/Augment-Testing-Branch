/**
 * Created by uestuenel on 11.11.2015.
 */
/* global globals, _ */
(function () {
	'use strict';

	function QtoSidebarWizardService($q, $http, $injector, platformSidebarWizardConfigService, $translate, platformTranslateService, platformModalService, platformModalFormConfigService,
		qtoMainHeaderDataService, platformSidebarWizardCommonTasksService, qtoMainCreatePestWizardDataService, qtoMainCreateWipWizardService,
		qtoMainDetailService, basicsCommonLoadingService, qtoMainSearchDetailDataWizardService,basicsCommonChangeStatusService,qtoMainRenumberDetailDialogService, qtoMainStructureDataService,qtoBoqStructureService) {
		let service = {};


		let qtoWizardID = 'qtoMainSidebarWizards';

		function disableRecord() {
			return platformSidebarWizardCommonTasksService.provideDisableInstance(qtoMainHeaderDataService,
				'Disable Record', 'cloud.common.disableRecord', 'Code',
				'qto.main.disableDone', 'qto.main.alreadyDisabled', 'code', 11);
		}

		function enableRecord() {
			return platformSidebarWizardCommonTasksService.provideEnableInstance(qtoMainHeaderDataService,
				'Enable Record', 'cloud.common.enableRecord', 'Code',
				'qto.main.enableDone', 'qto.main.alreadyEnabled', 'code', 12);
		}

		function choiceDataFile(callback){
			let fileElement = angular.element('<input type="file"/>');
			fileElement.attr('accept', '.d11, .x31, .crbx, .xml');
			fileElement.change(function () {
				let fileData = this.files[0];

				// invoke Boq side part CRBX importing
				if(fileData.name.toLowerCase().endsWith('.crbx')){
					let selectedItem = qtoMainHeaderDataService.getSelected();
					let boqTempDataService = {
						getRootBoqItem: function (){
							return {BoqHeaderFk: selectedItem.BoqHeaderFk};
						},
						getSelectedProjectId: function (){
							return selectedItem.ProjectFk;
						},
						isWicBoq: function (){
							return false;
						},
						getQtoHeaderId: function (){
							return selectedItem.Id;
						}
					};

					$injector.get('boqMainCrbSiaService').importCrbSia(boqTempDataService, fileData);

					return;
				}

				if(angular.isFunction(callback)){
					callback(fileData);
				}
			});
			fileElement.click();
		}

		function doImportREB(qtoHeader, result) {
			basicsCommonLoadingService.show();
			$http({
				method: 'POST',
				url: globals.webApiBaseUrl + 'qto/main/exchange/importreb',
				headers: {'Content-Type': undefined},
				transformRequest: function (data) {
					let resultData = data.resultData;
					let formData = new FormData();
					formData.append('model', data.qtoHeaderId);
					formData.append('file', resultData.FileData);

					$injector.get('qtoMainRebImportWizardService').setFormData(formData, resultData);

					return formData;
				},
				data: {
					resultData: result,
					qtoHeaderId: qtoHeader.Id
				}
			}).then(function (response) {
				let isFailed = false;
				if (response.data) {
					qtoHeader.DetailTotal = response.data.DetailTotal;

					if (response.data.XmlImport) {
						if (response.data.WarningMessage) {
							platformModalService.showMsgBox(response.data.WarningMessage, 'cloud.common.informationDialogHeader', 'info');
							isFailed = true;
						}
					} else {
						if (response.data.timeStr && response.data.timeStr.m_StringValue) {
							console.log(response.data.timeStr.m_StringValue);
						}

						if(response.data.existAddressList){
							let message = $translate.instant('qto.main.existAddressList', {
								linereference: '[' + response.data.existAddressList.join('][').toString() + ']'
							});
							platformModalService.showMsgBox(message, 'cloud.common.informationDialogHeader', 'info');
							isFailed = true;
						}else if (response.data.errorQtoAddrssRange) {
							let message = $translate.instant('qto.main.errorQtoAddrssRange', {
								linereference: '[' + response.data.errorQtosCode.join('][').toString() + ']'
							});
							platformModalService.showMsgBox(message, 'cloud.common.informationDialogHeader', 'info');
							isFailed = true;
						} else if (response.data.errorQtosCode && response.data.errorQtosCode.length) {

							let message = $translate.instant('qto.main.errorQtosCode', {
								linereference: '[' + response.data.errorQtosCode.join('][').toString() + ']'
							});
							platformModalService.showMsgBox(message, 'cloud.common.informationDialogHeader', 'info');
							isFailed = true;
						}
					}
				}

				if (!isFailed) {
					qtoMainDetailService.load();
					qtoMainStructureDataService.load();
					qtoBoqStructureService.load();

					let message = $translate.instant('basics.common.importXML.importSuccessful');
					message += '<br>' + $translate.instant('qto.main.rebImport.importTotal', { param: response.data.DetailTotal });
					message += '<br>' + $translate.instant('qto.main.rebImport.iQTotal', { param: response.data.IQTotal });
					message += '<br>' + $translate.instant('qto.main.rebImport.bQTotal', { param: response.data.BQTotal });
					message += '<br>' + $translate.instant('qto.main.rebImport.wQTotal', { param: response.data.WQTotal });
					message += '<br>' + $translate.instant('qto.main.rebImport.aQTotal', { param: response.data.AQTotal });
					platformModalService.showMsgBox(message, 'cloud.common.informationDialogHeader', 'info');
				}
			}, function () {

			}).finally(function () {
				basicsCommonLoadingService.hide();
			});
		}

		service.disableRecord = disableRecord().fn;

		service.enableRecord = enableRecord().fn;

		let changeQtoStatus = function changeQtoStatus() {
			return basicsCommonChangeStatusService.provideStatusChangeInstance(
				{
					mainService: qtoMainHeaderDataService,
					statusField: 'QTOStatusFk',
					title: 'qto.main.wizard.create.ChangeQTOStatus.title',
					statusName: 'qto',
					projectField: 'ProjectFk',
					statusDisplayField: 'DescriptionInfo.Translated',
					updateUrl: 'qto/main/header/changestatus'
				}
			);
		};

		service.changeQtoStatus = changeQtoStatus().fn;
		let showCreatePesDialog = function (selectedHeader) {
			qtoMainHeaderDataService.updateAndExecute(function () {
				qtoMainCreatePestWizardDataService.execute(selectedHeader);
			});
		};

		let showInfoDialog = function (bodyText) {
			let modalOptions = {
				headerTextKey: $translate.instant('cloud.common.informationDialogHeader'),
				bodyTextKey: bodyText,
				showOkButton: true,
				iconClass: 'ico-info'
			};
			platformModalService.showDialog(modalOptions);
		};

		let showNoContractDialog = function () {
			showInfoDialog($translate.instant('qto.main.wizard.create.pes.NoContract'));
		};

		let showNoSelectedPesDialog = function(){
			showInfoDialog($translate.instant('qto.main.wizard.create.pes.noPes'));
		};

		let showNotCreatedPesDialog = function(){
			showInfoDialog($translate.instant('qto.main.wizard.create.pes.NotCreatedPes'));
		};

		let showNoSelectedWipDialog = function(){
			showInfoDialog($translate.instant('qto.main.wizard.create.wip.noSalesWip'));
		};

		let showNotCreatedWipDialog = function(){
			showInfoDialog($translate.instant('qto.main.wizard.create.wip.NotCreatedWip'));
		};

		let showNoSelectedQtoDialog = function () {
			showInfoDialog($translate.instant('qto.main.wizard.create.wip.NoSelectedQto'));
		};


		let changeDetailQtoStatus = function changeDetailQtoStatus() {
			return basicsCommonChangeStatusService.provideStatusChangeInstance(
				{
					mainService: qtoMainHeaderDataService,
					getDataService: function () {
						return qtoMainDetailService;
					},
					statusField: 'QtoDetailStatusFk',
					title: 'qto.main.wizard.ChangeQTODetailStatus.title',
					statusName: 'qtodetail',
					statusDisplayField: 'DescriptionInfo.Translated',
					updateUrl: 'qto/main/detail/changestatus'
				}
			);
		};

		service.changeDetailQtoStatus = changeDetailQtoStatus().fn;


		service.createPes = function createPes() {
			let selectedHeader = qtoMainHeaderDataService.getSelected();

			if (!selectedHeader || !Object.getOwnPropertyNames(selectedHeader).length) {
				let modalOptions = {
					headerTextKey: $translate.instant('cloud.common.informationDialogHeader'),
					bodyTextKey: $translate.instant('qto.main.wizard.disableProgressError'),
					showOkButton: true,
					iconClass: 'ico-info'
				};
				platformModalService.showDialog(modalOptions);
			} else {
				if(selectedHeader.QtoTargetType === 2 || selectedHeader.QtoTargetType === 4){
					showNoSelectedPesDialog();
				}
				else if(selectedHeader.QtoTargetType === 3){
					showNotCreatedPesDialog();
				}
				else{
					let qtoHeaderId = selectedHeader.Id;
					qtoMainCreatePestWizardDataService.setQtoHeaderId(qtoHeaderId);
					qtoMainCreatePestWizardDataService.getContractId(qtoHeaderId).then(function (response) {
						if (response.length > 0) {
							showCreatePesDialog(selectedHeader);
						} else {
							showNoContractDialog();
						}
					});
				}

			}
		};

		service.createBill = function(){
			let qtoHeaderSelected = angular.copy(qtoMainHeaderDataService.getSelected());
			if(qtoHeaderSelected !== null){
				if(qtoHeaderSelected.QtoTargetType === 1 || qtoHeaderSelected.QtoTargetType === 3){
					showNoSelectedWipDialog();
				}
				else if(qtoHeaderSelected.QtoTargetType === 4){
					showNotCreatedWipDialog();
				}
				else{
					qtoMainCreateWipWizardService.showQtoHeaderScopeDialog(true, qtoHeaderSelected, 'bill');
				}
			}else{
				showNoSelectedQtoDialog();
			}
		};

		service.createWIP = function(){
			let qtoHeaderSelected = angular.copy(qtoMainHeaderDataService.getSelected());
			if(qtoHeaderSelected !== null){
				if(qtoHeaderSelected.QtoTargetType === 1 || qtoHeaderSelected.QtoTargetType === 3){
					showNoSelectedWipDialog();
				}
				else if(qtoHeaderSelected.QtoTargetType === 4){
					showNotCreatedWipDialog();
				}
				else{
					qtoMainCreateWipWizardService.showQtoHeaderScopeDialog(true, qtoHeaderSelected, 'wip');
				}
			}else{
				showNoSelectedQtoDialog();
			}
		};

		function checkQtoDetailHaveError(){
			let deferred = $q.defer();
			let validationErrorInfo = '';
			let details = qtoMainDetailService.getList();

			_.forEach(details, function(detail){
				if (detail.__rt$data && detail.__rt$data.errors) {
					let errorStr = '';

					_.forEach(detail.__rt$data.errors, function(error){
						if(error && !_.isEmpty(error)){
							errorStr += error.error + '<br>';
						}
					});

					if(errorStr !== '') {
						errorStr = detail.Code + ': <br>' + errorStr;
					}

					validationErrorInfo += errorStr;
				}
			});

			if(validationErrorInfo !== ''){
				validationErrorInfo += 'Do you want to continue to do the REB Export?';
				let modalOptions = {
					headerTextKey: $translate.instant('cloud.common.informationDialogHeader'),
					bodyTextKey: validationErrorInfo,
					showYesButton: true,
					showCancelButton: true,
					iconClass: 'ico-warning'
				};

				deferred.promise =  platformModalService.showDialog(modalOptions);
			}else{
				deferred.resolve({'yes': true});
			}

			return deferred.promise;
		}

		let QTO_SCOPE = {
			RESULT_HIGHLIGHTED: {
				value: 0,
				label:$translate.instant('qto.main.wizard.HighlightedQto')
			},
			RESULT_SET: {
				value: 1,
				label: $translate.instant('qto.main.wizard.ResultSet')
			},
			ALL_QTO: {
				value: 2,
				label: $translate.instant('qto.main.wizard.EntireQto')
			}
		};

		service.exportREBFormConfig = function exportREBFormConfig() {
			return {
				'fid': 'qto.main.RebExport',
				'version': '1.1.0',
				'showGrouping': true,
				'groups': [
					{
						gid: 'default',
						header$tr$: 'qto.main.rebImport.baseGroup',
						header: 'Basic Setting',
						isOpen: true,
						attributes: [
							'rebformatid', 'qtoscope', 'exportqtodocinfo'
						]
					},
					{
						gid: 'additional',
						header$tr$: 'qto.main.ExportREBFormConfig.AdditionalSetting',
						header: 'Additional Setting',
						isOpen: true,
						visible: false,
						attributes: [
							'includeQtoDetail', 'includeSheets', 'includeGenerateDate'
						]
					}
				],
				rows: [
					{
						gid: 'default',
						rid: 'rebFormatId',
						label: $translate.instant('qto.main.RebFormat'),
						model: 'rebFormatId',
						type: 'select',
						options: {
							items: [{Id: 0, Name: 'DA11'}, {Id: 1, Name: 'X31'}, {Id: 2, Name: 'CRBX'}, {Id: 3, Name: 'XML'}],
							valueMember: 'Id',
							displayMember: 'Name'
						}
					},
					{
						gid: 'default',
						rid: 'exportQtoDocInfo',
						model: 'ExportQtoDocInfo',
						type: 'boolean',
						visible: true,
						label: $translate.instant('qto.main.ExportREBFormConfig.ExportQtoDocInfo'),
						label$tr$: $translate.instant('qto.main.ExportREBFormConfig.ExportQtoDocInfo'),
					},
					{
						gid: 'default',
						rid: 'qtoScope',
						model: 'qtoScope',
						type: 'radio',
						visible: true,
						label: $translate.instant('qto.main.wizard.QtoScope'),
						label$tr$: $translate.instant('qto.main.wizard.QtoScope'),
						options: {
							valueMember: 'value',
							labelMember: 'label',
							items: [
								{
									value: QTO_SCOPE.RESULT_HIGHLIGHTED.value,
									label: $translate.instant('qto.main.wizard.HighlightedQto'),
									label$tr$: QTO_SCOPE.RESULT_HIGHLIGHTED.label,
									checked: true,
									'initialState': 'checked'
								},
								{
									value: QTO_SCOPE.RESULT_SET.value,
									label: $translate.instant('qto.main.wizard.ResultSet'),
									label$tr$: QTO_SCOPE.RESULT_SET.label
								},
								{
									value: QTO_SCOPE.ALL_QTO.value,
									label: $translate.instant('qto.main.wizard.EntireQto'),
									label$tr$: QTO_SCOPE.ALL_QTO.label
								}
							]
						}
					},
					{
						gid: 'additional',
						rid: 'includeQtoDetail',
						model: 'IncludeQtoDetail',
						type: 'boolean',
						visible: true,
						label: $translate.instant('qto.main.wizard.includeQtoDetail'),
						label$tr$: $translate.instant('qto.main.wizard.includeQtoDetail'),
					},
					{
						gid: 'additional',
						rid: 'includeSheets',
						model: 'IncludeSheets',
						type: 'boolean',
						visible: true,
						label: $translate.instant('qto.main.wizard.includeSheets'),
						label$tr$: $translate.instant('qto.main.wizard.includeSheets'),
					}
					,
					{
						gid: 'additional',
						rid: 'includeGenerateDate',
						model: 'IncludeGenerateDate',
						type: 'boolean',
						visible: true,
						label: $translate.instant('qto.main.wizard.includeGenerateDate'),
						label$tr$: $translate.instant('qto.main.wizard.includeGenerateDate'),
					}
				]
			};

		};

		service.exportREB = function(initDate)
		{
			let initDataItem = (initDate && angular.isDefined(initDate.rebFormatId)) ? initDate : {
				rebFormatId: 0,
				qtoScope:2,
				IncludeSheets: true,
				IncludeQtoDetail: true,
				IncludeGenerateDate: true,
				ExportQtoDocInfo: false
			};
			qtoMainHeaderDataService.updateAndExecute(function()
			{
				if (qtoMainHeaderDataService.getSelected()) {
					checkQtoDetailHaveError().then(function (dialogResult) {
						if (dialogResult && dialogResult.yes) {
							platformModalService.showDialog({
								headerText: $translate.instant('qto.main.RebExport'),
								dataItem: initDataItem,
								templateUrl: globals.appBaseUrl + 'qto.main/templates/qto-main-export-qto-document.html',
								backdrop: false,
								width: '500px',
								uuid: '8653a8365a154d959bc45e22e8e6281e'
							}).then(function (result) {
								if (result.ok) {
									basicsCommonLoadingService.show();

									let qtoDetails = [];

									if(result.data.qtoScope === 0){
										qtoDetails = qtoMainDetailService.getSelectedEntities();
									}else if(result.data.qtoScope ===1){
										qtoDetails = qtoMainDetailService.getCurrentResultSet();
									}

									let params ={
										QtoHeaderId : qtoMainHeaderDataService.getSelected().Id,
										ExportType :result.data.rebFormatId,
										QtoScope :result.data.qtoScope,
										QtoDetailIds : _.map(qtoDetails,'Id'),
										IncludeSheets: result.data.IncludeSheets,
										IncludeQtoDetail: result.data.IncludeQtoDetail,
										IncludeGenerateDate: result.data.IncludeGenerateDate,
										ExportQtoDocInfo: result.data.ExportQtoDocInfo
									};

									return $http.post(globals.webApiBaseUrl + 'qto/main/exchange/exportreb',params).then(function (response) {
										let link = angular.element(document.querySelectorAll('#downloadLink'));
										link[0].href = response.data;
										link[0].download = response.headers('Content-Disposition').slice(21);
										link[0].type = 'application/octet-stream';
										link[0].click();
									},
									function () {
									}).finally(function () {
										basicsCommonLoadingService.hide();
									}
									);
								}
							}
							);
						}
					});
				}
				else
				{
					showInfoDialog($translate.instant('qto.main.qtoHeaderMissing'));
				}
			});
		};

		service.importREB = function () {
			qtoMainHeaderDataService.updateAndExecute(function () {
				let qtoHeader = qtoMainHeaderDataService.getSelected();
				if (!qtoHeader) {
					showInfoDialog($translate.instant('qto.main.qtoHeaderMissing'));
					return;
				}

				let qtoStatusItem = $injector.get('qtoHeaderReadOnlyProcessor').getItemStatus(qtoHeader);
				if (qtoHeader.PrjChangeStutasReadonly || qtoStatusItem && qtoStatusItem.IsReadOnly) {
					showInfoDialog($translate.instant('qto.main.qtoHeaderReadOnly'));
					return;
				}

				$http.get(globals.webApiBaseUrl + 'qto/main/header/iscrbqtoboq?boqHeaderFk=' + qtoHeader.BoqHeaderFk).then(function (respone) {
					$injector.get('qtoMainRebImportWizardService').showDialog(qtoHeader, respone.data).then(function (result) {
						if (result.ok) {
							doImportREB(qtoHeader, result.data);
						}
					});
				});
			});
		};

		service.searchQtoDetails = function searchQtoDetails() {
			qtoMainHeaderDataService.updateAndExecute(qtoMainSearchDetailDataWizardService.showQtoDetailPortalDialog);
		};

		service.renumberQtoDetails = function renumberQtoDetails(){
			qtoMainHeaderDataService.updateAndExecute(qtoMainRenumberDetailDialogService.showDialog);
		};

		let qtoWizardConfig = {
			showImages: true,
			showTitles: true,
			showSelected: true,
			items: [
				{
					id: 1,
					text: 'Change Disable/Enable Wizard',
					text$tr$: 'qto.main.wizard.changeWizardCaption',
					groupIconClass: 'sidebar-icons ico-wiz-change-status',
					visible: true,
					subitems: [
						platformSidebarWizardCommonTasksService.provideDisableInstance(qtoMainHeaderDataService,
							'Disable Record', 'cloud.common.disableRecord', 'Code',
							'qto.main.disableDone', 'qto.main.alreadyDisabled', 'code', 11),
						platformSidebarWizardCommonTasksService.provideEnableInstance(qtoMainHeaderDataService,
							'Enable Record', 'cloud.common.enableRecord', 'Code',
							'qto.main.enableDone', 'qto.main.alreadyEnabled', 'code', 12)
					]
				},
				{
					id: 2,
					text: 'GroupName',
					text$tr$: 'qto.main.wizard.header',
					visible: false,
					subitems: [
						{
							id: 21,
							text: 'Create Pes',
							text$tr$: 'qto.main.wizard.create.pes.title',
							fn: service.createPes
						}
					]
				},
				{
					id: 3,
					text: 'GroupName',
					text$tr$: 'qto.main.wizard.header',
					visible: true,
					subitems: [
						{
							id: 31,
							text: 'Create WIP',
							text$tr$: 'qto.main.wizard.qtoDetail.wip.title',
							fn: service.createWIP
						}
					]
				},
				{
					id: 4,
					text: 'GroupName',
					text$tr$: 'qto.main.wizard.header',
					visible: true,
					subitems: [
						{
							id: 41,
							text: 'Search and Copy Qto Quantity Takeoff',
							text$tr$: 'qto.main.wizard.create.wip.title',
							fn: service.searchQtoDetails
						}
					]
				}
			]
		};

		service.activate = function activate() {
			platformSidebarWizardConfigService.activateConfig(qtoWizardID, qtoWizardConfig);
		};

		service.deactivate = function deactivate() {
			platformSidebarWizardConfigService.deactivateConfig(qtoWizardID);
		};

		service.UpdateBoqWqAq = function () {
			let qtoHeaderSelected = qtoMainHeaderDataService.getSelected();
			if(qtoHeaderSelected !== null){
				if(qtoHeaderSelected.QtoTargetType === 3 || qtoHeaderSelected.QtoTargetType === 4){
					$http.post(globals.webApiBaseUrl + 'qto/main/detail/updateqtoresult2boqqty?qtoHeaderId=' + qtoHeaderSelected.Id).then(function () {
						qtoMainHeaderDataService.refresh();
					});
				} else {
					showInfoDialog($translate.instant('qto.main.selectWqAqType'));
				}
			}else{
				showNoSelectedQtoDialog();
			}
		};

		let changeQtoSheetStatus = function changeQtoSheetStatus() {
			return basicsCommonChangeStatusService.provideStatusChangeInstance(
				{
					mainService: qtoMainHeaderDataService,
					getDataService: function () {
						return qtoMainStructureDataService;
					},
					statusField: 'QtoSheetStatusFk',
					title: 'qto.main.wizard.ChangeQTOSheetStatus.title',
					statusName: 'qtosheet',
					statusDisplayField: 'DescriptionInfo.Translated',
					updateUrl: 'qto/main/sheet/changestatus'
				}
			);
		};

		service.changeQtoSheetStatus =  changeQtoSheetStatus().fn;

		platformTranslateService.registerModule('qto.main');

		let loadTranslations = function () {
			platformTranslateService.translateObject(qtoWizardConfig, ['text']);
		};

		// register translation changed event
		platformTranslateService.translationChanged.register(loadTranslations);

		if (!platformTranslateService.registerModule('procurement.rfq')) {
			loadTranslations();
		}

		service.toggleSideBarWizard = function () {
			let wizService = $injector.get('basicsConfigWizardSidebarService');
			let qtoHeader = qtoMainHeaderDataService.getSelected();
			if (qtoHeader) {
				wizService.disableWizards(qtoHeader.IsBackup);
			}
		};

		return service;
	}

	angular.module('qto.main').factory('qtoMainSidebarWizardService',
		['$q', '$http', '$injector', 'platformSidebarWizardConfigService', '$translate', 'platformTranslateService', 'platformModalService', 'platformModalFormConfigService',
			'qtoMainHeaderDataService', 'platformSidebarWizardCommonTasksService', 'qtoMainCreatePestWizardDataService', 'qtoMainCreateWipWizardService',
			'qtoMainDetailService', 'basicsCommonLoadingService', 'qtoMainSearchDetailDataWizardService','basicsCommonChangeStatusService',
			'qtoMainRenumberDetailDialogService', 'qtoMainStructureDataService','qtoBoqStructureService', QtoSidebarWizardService]);
})();
