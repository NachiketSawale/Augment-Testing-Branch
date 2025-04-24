(function (angular) {
	/* global globals, $, _ */
	'use strict';

	/**
	 * @ngdoc factory
	 * @name basics.company.services:basicsCompanySidebarWizardService
	 * @description
	 * Provides wizard configuration and implementation of all basics wizards
	 *
	 * @example
	 * <div paltform-layout initial-layout="name of layout", layout-options="options"></div>
	 */
	angular.module('basics.company').factory('basicsCompanySidebarWizardService', ['$translate','platformModalService',
		'platformSidebarWizardConfigService', 'basicsCompanyMainService', 'platformSidebarWizardCommonTasksService',
		'basicsCharacteristicBulkEditorService', '$http', 'basicsCompanyTransheaderService', 'basicsCommonChangeStatusService', 'platformTranslateService', 'platformModalFormConfigService', 'basicsCompanyUrlService',
		'basicsLookupdataConfigGenerator','platformDataValidationService','basicsCompanyCreationService',

		function ($translate,platformModalService,
			platformSidebarWizardConfigService, basicsCompanyMainService, platformSidebarWizardCommonTasksService,
			basicsCharacteristicBulkEditorService, $http, basicsCompanyTransheaderService, basicsCommonChangeStatusService, platformTranslateService, platformModalFormConfigService, basicsCompanyUrlService,basicsLookupdataConfigGenerator,platformDataValidationService,basicsCompanyCreationService) {

			var service = {};



			var disableCompany;
			disableCompany = function disableCalendar() {
				return platformSidebarWizardCommonTasksService.provideDisableInstance(basicsCompanyMainService, 'Disable Company', 'basics.company.disableCompany', 'CompanyName',
					'basics.company.disableCompanyDone', 'basics.company.companyAlreadyDisabled', 'comp', 11);
			};
			service.disableCalendar = disableCompany().fn;

			var enableCompany;
			enableCompany = function enableCalendar() {
				return platformSidebarWizardCommonTasksService.provideEnableInstance(basicsCompanyMainService, 'Enable Company', 'basics.company.enableCompany', 'CompanyName',
					'basics.company.enableCompanyDone', 'basics.company.companyAlreadyEnabled', 'comp', 12);
			};
			service.enableCalendar = enableCompany().fn;
			service.syncCompanyToYtwo=function syncCompanyToYtwo() {
				var header = basicsCompanyMainService.getSelectedEntities();

				if (!header ) {
					return;
				}
				header.forEach(function (item) {
					if(angular.isUndefined(item.Id)){
						return;
					}
				});
				var modalOptionsInfo={
					headerTextKey: $translate.instant('basics.company.modalInfo'),
					showOkButton: true,
					iconClass: 'ico-info'
				};
				platformModalService.showDialog({
					entities: header,
					templateUrl: globals.appBaseUrl + 'basics.company/templates/sync-company-to-customer.html',
					resizeable: false
				}).then(function (result) {
					if(result){
						return $http({
							method: 'POST',
							url: globals.webApiBaseUrl + 'basics/company/syncClientData2Customer',
							data: {
								Companies: header,
								Url: result.Url,
								UserName: result.UserName,
								Password: result.Password
							}
						}).then(function (resultData) {
							if(resultData.data){
								$.extend(modalOptionsInfo,{bodyTextKey:  $translate.instant('basics.company.syncCmpResultMsg')});
								platformModalService.showDialog(modalOptionsInfo);
							}
						});
					}
				});
			};

			service.importContent=function importContent() {
				var header = basicsCompanyMainService.getSelectedEntities();

				if (!header ) {
					return;
				}
				header.forEach(function (item) {
					if(angular.isUndefined(item.Id)){
						return;
					}
				});





				var dlgConfig = {
					templateUrl: globals.appBaseUrl + 'basics.company/templates/import-content-container.html',
					width: '650px',
					resizeable: true
				};

				platformModalService.showDialog(dlgConfig);
			};
			service.copyCompany=function copyCompany(){
				let header = basicsCompanyMainService.getSelectedEntities();

				if (!header ) {
					return;
				}
				if (header.length===0 ) {
					platformModalService.showMsgBox($translate.instant('basics.company.copyCompany.noCompanyData'), $translate.instant('basics.company.copyCompany.title'), 'error');
					return;
				}
				header.forEach(function (item) {
					if(angular.isUndefined(item.Id)){
						return;
					}
				});
				let dlgConfig = {
					templateUrl: globals.appBaseUrl + 'basics.company/templates/copy-company-container.html',
					width: '650px',
					resizeable: true
				};

				platformModalService.showDialog(dlgConfig);
			};

			service.createBusinessYearsPeriods = function createBusinessYearsPeriods(){
				let header = basicsCompanyMainService.getSelectedEntities();
				if (!header || header.length === 0) {
					platformModalService.showMsgBox($translate.instant('basics.company.createBusinessYearsPeriods.noCompanyData'), $translate.instant('basics.company.createBusinessYearsPeriods.title'), 'error');
					return;
				}

				let allSaved = _.every(header, function (e) { return (e.Version); });
				if (!allSaved) {
					platformModalService.showMsgBox($translate.instant('basics.company.createBusinessYearsPeriods.companyNoSaved'), $translate.instant('basics.company.createBusinessYearsPeriods.title'), 'error');
					return;
				}

				let dlgConfig = {
					templateUrl: globals.appBaseUrl + 'basics.company/templates/create-business-years-periods-container.html',
					company: header[0],
					width: '780px',
					resizeable: true
				};

				platformModalService.showDialog(dlgConfig);
			};

			var companyTransheaderStatus = function  companyTransheaderStatus() {
				return basicsCommonChangeStatusService.provideStatusChangeInstance(
					{
						mainService: basicsCompanyMainService,
						dataService: basicsCompanyTransheaderService,
						statusField: 'CompanyTransheaderStatusFk',
						descField: 'Description',
						projectField: 'CompanyFk',
						title:  $translate.instant('basics.customize.entityTransheaderStatus'),
						statusName: 'companytransheaderstatus',
						updateUrl: 'basics/company/transheader/changestatus',
						id: 1
					}
				);
			};
			service.companyTransheaderStatus =  companyTransheaderStatus().fn;

			var basicsWizardID = 'basicsCompanySidebarWizards';

			var basicsWizardConfig = {
				showImages: true,
				showTitles: true,
				showSelected: true,
				items: [{
					id: 1,
					text: 'Groupname - Company',
					text$tr$: 'basics.company.wizardsGroupname1',
					groupIconClass: 'sidebar-icons ico-wiz-change-status',
					visible: true,
					subitems: [
						disableCompany(),
						enableCompany(),
						companyTransheaderStatus()
					]
				}]
			};

			service.activate = function activate() {
				platformSidebarWizardConfigService.activateConfig(basicsWizardID, basicsWizardConfig);
			};

			service.deactivate = function deactivate() {
				platformSidebarWizardConfigService.deactivateConfig(basicsWizardID);
			};

			service.setCharacteristics = function setCharacteristics(userParams, wizardParams) {
				wizardParams = {};
				wizardParams.parentService = basicsCompanyMainService;
				wizardParams.sectionId = 14;
				wizardParams.moduleName = 'basics.company';
				basicsCharacteristicBulkEditorService.showEditor(userParams, wizardParams);
			};


			service.prepareTransaction = function () {
				var header = basicsCompanyMainService.getSelected();

				if (!header || !header.Id) {
					showMsg('selectedOne', null, 'selected');
					return;
				}

				var headers = basicsCompanyMainService.getSelectedEntities();
				var headerIds = headers.map(function (item) {
					return item.Id;
				});

				var state = makeTransactionDialog();

				basicsCompanyMainService.updateAndExecute(function () {
					$http.post(globals.webApiBaseUrl + 'basics/company/transaction/prepare', {
						MainItemIds: headerIds
					}).then(function () {
						// basicsCompanyMainService.currentSelectItem = header;
						// basicsCompanyMainService.refreshView();
						basicsCompanyMainService.refresh();
					}).finally(function () {
						state.isLoading = false;
						state.loadingInfo = 'Finish Generating Transaction';
					});
				});
			};

			service.prepareTransactionForAll = function () {
				var header = basicsCompanyMainService.getList();
				if (!header || header.length <= 0) {
					showMsg('noRecord');
					return;
				}
				var searchFilter = cloudDesktopSidebarService.getFilterRequestParams();

				var state = makeTransactionDialog();

				basicsCompanyMainService.updateAndExecute(function () {
					$http.post(globals.webApiBaseUrl + 'basics/company/transaction/prepareforall', searchFilter).then(function (res) {
						if (!angular.isUndefined(res.data) && res.data.length > 0) {
							showMsg('taskWait');
							// invoiceValidationDataService.addJob(res.data);
							// invoiceValidationDataService.updateAll();
							basicsCompanyMainService.refresh();
						} else {
							showMsg('taskFail', res.data);
						}

					}).finally(function () {
						state.isLoading = false;
						state.loadingInfo = 'Finish Generating Transaction';
					});
				});
			};
			function makeTransactionDialog() {
				var state = {
					loadingInfo: 'Generating Transaction',
					isLoading: true
				};
				var myDialogOptions = {
					templateUrl: globals.appBaseUrl + 'procurement.invoice/templates/transaction-dialog.html',
					controller: ['$scope',
						function ($scope) {
							$scope.state = state;
						}
					]
				};
				dialogService.showDialog(myDialogOptions);
				return state;
			}
			function showMsg(bodyText, bodyTextParam, titleParam) {
				var strBody = 'procurement.invoice.transaction.' + bodyText;
				if (bodyTextParam) {
					strBody = $translate.instant(strBody, {reason: bodyTextParam});
				} else {
					strBody = $translate.instant(strBody);
				}

				var strTitle = 'procurement.invoice.transaction.generateTransaction';
				strTitle = $translate.instant(strTitle, {status: titleParam || 'all'});
				dialogService.showMsgBox(strBody, strTitle, 'info');
			}


			function setModalCreateConfig() {
				return {
					title: $translate.instant('basics.company.setiTWOFinanceURLs'),
					dataItem: {
						url: null,
						user: null,
						password: null
					},
					formConfiguration: {
						fid: 'basics.company.setiTWOFinanceURLs',
						version: '1.0.0',
						showGrouping: false,
						groups: [
							{
								gid: 'baseGroup'
							}
						],
						rows: [
							{
								gid: 'baseGroup',
								rid: 'url',
								label: 'Url',
								label$tr$: 'basics.company.entityCompanyUrl',
								type: 'url',
								visible: true,
								sortOrder: 1,
								model: 'url'
							},
							{
								gid: 'baseGroup',
								rid: 'user',
								label: 'User',
								label$tr$: 'basics.company.entityUrlUser',
								type: 'description',
								visible: true,
								sortOrder: 2,
								model: 'user'
							},
							{
								gid: 'baseGroup',
								rid: 'password',
								label: 'Password',
								label$tr$: 'basics.company.entityUrlPassword',
								type: 'password',
								visible: true,
								sortOrder: 3,
								model: 'password'
							}
						]
					}
				};
			}

			service.iTWOFinanceURLs = function (){
				let company =  basicsCompanyMainService.getSelected();
				let modalCreateConfig = setModalCreateConfig();

				modalCreateConfig.handleOK = function handleOK(result) {
					let data = {
						Company: company,
						Url: result.data.url,
						User: result.data.user,
						UrlPassword: result.data.password
					};
					$http.post(globals.webApiBaseUrl + 'basics/company/url/createdcompanyurls', data
					).then(function (response) {
						platformSidebarWizardCommonTasksService.showSuccessfullyDoneMessage(modalCreateConfig.title);
						if(response && response.data){
							return basicsCompanyUrlService.load().then(function () {
							});
						}

					});
				};

				platformTranslateService.translateFormConfig(modalCreateConfig.formConfiguration);

				platformModalFormConfigService.showDialog(modalCreateConfig);
			};

			/*Company*/
			service.createCompany = function createCompany() {
				return basicsCompanyCreationService.createCompany(basicsCompanyMainService);
			};
			return service;
		}
	]);
})(angular);
