
(function () {
	'use strict';
	let moduleName = 'qto.main';

	angular.module(moduleName).factory('qtoMainCreateWipWizardService', ['globals', '_', '$injector', '$http', '$state', '$translate', '$timeout', 'platformModalService', 'cloudDesktopSidebarService',
		'platformDataServiceFactory', 'platformTranslateService', 'platformModalFormConfigService', 'projectMainService', 'qtoMainCreateWipDialogService',
		function (globals, _, $injector, $http, $state, $translate, $timeout, platformModalService, cloudDesktopSidebarService,
			platformDataServiceFactory, platformTranslateService, platformModalFormConfigService, projectMainService, qtoMainCreateWipDialogService) {


			let service = {};

			service.createItemForQto = function createItemForQto(visibleAdditionRows, qtoHeaderSelected, purposeType) {

				initializeWIP (qtoHeaderSelected, purposeType);

				if (angular.isUndefined (visibleAdditionRows) || visibleAdditionRows === null || visibleAdditionRows === false) {
					qtoMainCreateWipDialogService.showDialog (function (creationData) {
						createWip (creationData, qtoHeaderSelected ? qtoHeaderSelected.ClerkFk : 0, purposeType);
					}, true, ['projectfk'], ['performedFrom', 'performedTo', 'UpdateWith']);
				} else {
					let readOnlyRows = [];
					readOnlyRows.push ('projectfk');
					if (qtoHeaderSelected.OrdHeaderFk) {
						readOnlyRows.push ('ordheaderfk');
					}
					let unvisibleRows = [];
					unvisibleRows.push ('UpdateWith');
					qtoMainCreateWipDialogService.showDialog (function (creationData) {
						createWip (creationData, qtoHeaderSelected ? qtoHeaderSelected.ClerkFk : 0, purposeType);
					}, true, readOnlyRows, unvisibleRows, purposeType);
				}
			};

			function createWip(creationData, selectedID, purposeType) {
				let basicLookup = $injector.get ('basicsLookupdataLookupDataService');
				basicLookup.getList ('clerk').then (function (itemList) {
					let findedItem = _.find (itemList, function (item) {
						return item.Id === selectedID;
					});
					if (findedItem && findedItem.Code === null) {
						platformModalService.showErrorBox ($translate.instant ('sales.wip.createWIPFail'), $translate.instant ('cloud.common.informationDialogHeader'));
						return;
					}

					$http.post (globals.webApiBaseUrl + 'qto/main/createwip/createWipOrBilling', creationData).then (function (response) {
						let data = response.data;
						data.ProjectFk = creationData.ProjectFk;
						let isCreate = data.IsCreate;

						if (response.data.timeStr && response.data.timeStr.m_StringValue) {
							console.log (response.data.timeStr.m_StringValue);
						}

						if(data.ErrNoQtoDetail){
							let strTitle = $translate.instant ('cloud.common.informationDialogHeader');
							let strContent = $translate.instant ('qto.main.errNoQtoDetail');
							platformModalService.showMsgBox (strContent, strTitle, 'info');
							return;
						}

						if (isCreate) {
							if (selectedID) {
								if (purposeType === 'wip') {
									stateGo (data.Wip, purposeType);
								} else if (purposeType === 'bill') {
									stateGo (data.Billing, purposeType);
								}

							}
						} else {
							let strTitle = $translate.instant ('sales.wip.createWIPFail');
							let strContent = $translate.instant ('sales.wip.createWarning');
							platformModalService.showMsgBox (strContent, strTitle, 'info');
						}
					});
				});

			}

			let stateGo = function (data, purposeType) {
				let url = globals.defaultState + '.' + 'sales.wip'.replace ('.', '');
				if (purposeType === 'bill') {
					url = globals.defaultState + '.' + 'sales.billing'.replace ('.', '');
				}

				$state.go (url).then (function () {
					cloudDesktopSidebarService.filterSearchFromPKeys ([data.Id], null, data.ProjectFk);
					if (purposeType === 'wip') {
						let salesWipService = $injector.get ('salesWipService');
						salesWipService.setWipHeader(data);
						salesWipService.refresh ().then (function () {
							$timeout (function () {
								salesWipService.gridRefresh ();
								salesWipService.setSelected (data);
							}, 500);
						}
						);
					} else if (purposeType === 'bill') {
						let salesBillingService = $injector.get ('salesBillingService');
						salesBillingService.setBilHeader (data);
						salesBillingService.refresh ().then (function () {
							$timeout (function () {
								salesBillingService.gridRefresh ();
								salesBillingService.setSelected (data);
							}, 500);
						}
						);
					}
				});
			};

			function setContractTypeFk(contractFk) {
				if (!contractFk) {
					return;
				}
				$http.get (globals.webApiBaseUrl + 'sales/contract/byid?id=' + contractFk).then (function (response) {

					let tempItem ={
						OrdHeaderFk : null,
						HasOrdHeaderFk:false
					};

					if (response && response.data) {
						tempItem = {
							OrdHeaderFk : response.data.Id,
							HasOrdHeaderFk:true,
							ContractTypeFk: response.data.ContractTypeFk,
							BusinessPartnerFk: response.data.BusinesspartnerFk,
							SubsidiaryFk: response.data.SubsidiaryFk,
							CustomerFk: response.data.CustomerFk,
							ResponsibleCompanyFk: response.data.CompanyResponsibleFk
						};
					}

					qtoMainCreateWipDialogService.init(tempItem);
				});
			}

			function initializeWIP(qtoHeaderSelected, purposeType) {
				qtoMainCreateWipDialogService.setQtoHeaderId (qtoHeaderSelected.Id);
				qtoMainCreateWipDialogService.setPurposeType (purposeType);

				qtoMainCreateWipDialogService.resetToDefault ();

				if (qtoHeaderSelected && qtoHeaderSelected.OrdHeaderFk) {
					setContractTypeFk (qtoHeaderSelected.OrdHeaderFk);
				}
				if(qtoHeaderSelected.DescriptionInfo) {
					qtoHeaderSelected.DescriptionInfo.DescriptionTr = null;
				}
				if (qtoHeaderSelected) {
					qtoMainCreateWipDialogService.init ({
						PerformedFrom: _.get (qtoHeaderSelected, 'PerformedFrom', null),
						PerformedTo: _.get (qtoHeaderSelected, 'PerformedTo', null),
						QtoHeaderFk: _.get (qtoHeaderSelected, 'Id', null),
						ProjectFk: _.get (qtoHeaderSelected, 'ProjectFk', null),
						BoqHeaderFk: _.get (qtoHeaderSelected, 'BoqHeaderFk', null),// PrjBoqFk
						DescriptionInfo: _.get (qtoHeaderSelected, 'DescriptionInfo', null),
						OrdHeaderFk: purposeType === 'wip' ? _.get(qtoHeaderSelected, 'OrdHeaderFk', null):null,
						IsOrdQuantityOnly: false, // default value is false
						HasOrdHeaderFk: purposeType === 'wip' ? qtoHeaderSelected.OrdHeaderFk > 0:false,
						IsForQto: true,
						purposeType: purposeType
					});
				}
			}

			service.showQtoHeaderScopeDialog = function (visibleAdditionRows, qtoHeaderSelected, purposeType) {
				let selectHeaderService = $injector.get('qtoMainSelectHeadersService');
				selectHeaderService.setProjectId(qtoHeaderSelected.ProjectFk);
				selectHeaderService.setVisibleAdditionRows(visibleAdditionRows);
				selectHeaderService.setQtoHeaderSelected(qtoHeaderSelected);
				selectHeaderService.setPurposeType(purposeType);

				let createTile = purposeType === 'bill' ? $translate.instant('qto.main.wizard.create.wip.createBillTitle') : $translate.instant('sales.wip.createWipTitle')

				let qtoHeaderScopeDialogConfig = {
					title: createTile + '-' + $translate.instant('qto.main.wizard.QtoScope'),
					resizeable: true,
					formConfiguration: {
						fid: 'qto.main.wizard.select.qtoheaderscope',
						version: '0.1.1',
						showGrouping: true,
						groups: [
							{
								gid: 'qtoScope',
								header: 'Select QTO Scope',
								header$tr$: 'qto.main.wizard.QtoScope',
								visible: true,
								isOpen: true,
								attributes: []
							}],
						rows: [{
							gid: 'qtoScope',
							rid: 'SelectedQtoHeaders',
							type: 'directive',
							model: 'SelectedQtoHeaders',
							directive: 'qto-main-select-headers-grid',
							sortOrder: 1
						}]
					},
					showOkButton: false,
					showCancelButton: true,
					buttons: [{
						id: 'next',
						caption$tr$: 'cloud.desktop.botChat.next',
						fn: function (){
							service.createItemForQto(visibleAdditionRows, qtoHeaderSelected, purposeType);
						},
						disabled: function (){
							let markedItems = selectHeaderService.getIsMarkedIdList();
							return markedItems.length === 0;
						},
						autoClose: true
					}]
				};

				platformTranslateService.translateFormConfig(qtoHeaderScopeDialogConfig.formConfiguration);
				return platformModalFormConfigService.showDialog(qtoHeaderScopeDialogConfig);
			}

			return service;

		}]);

})();
