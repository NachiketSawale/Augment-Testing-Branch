/**
 * Created by wri on 9/20/2017.
 */

(function (angular) {
	/* global globals */
	'use strict';
	// var moduleName = 'defect.main';

	angular.module('project.inforequest').factory('projectInfoRequestBim360Service',
		['_', 'platformModalService', '$http', '$q', '$translate', 'cloudDesktopSidebarService', 'platformRuntimeDataService', 'platformGridAPI',
			'cloudDeskBim360Service', 'PlatformMessenger',
			function (_, platformModalService, $http, $q, $translate, cloudDesktopSidebarService, platformRuntimeDataService, platformGridAPI,
				cloudDeskBim360Service, PlatformMessenger) {
				// data service
				var service = {};

				var prjInfo = {};

				service.setSelectedPrjInfo = function (selectedItem) {
					prjInfo.prjKey = selectedItem ? selectedItem.PrjKey : '';
					prjInfo.projectNo = selectedItem ? selectedItem.ProjectNo : '';
					prjInfo.projectName = selectedItem ? selectedItem.ProjectName : '';
					prjInfo.currency = selectedItem ? selectedItem.Currency : '';
					prjInfo.prjId = selectedItem ? selectedItem.PrjId : '';
					prjInfo.companyId = selectedItem ? selectedItem.CompanyId : '';
					dlgOptions.searchBtnDisabled = selectedItem ? '' : 'disabled';
				};

				var dlgOptions = {};

				dlgOptions.filterStatusOptions = [
					{
						Id: '(all)',
						name: $translate.instant('project.inforequest.bim360RFIs.status_all'),
						value: '(all)',
						required: false
					},
					{
						Id: 'draft',
						name: $translate.instant('project.inforequest.bim360RFIs.status_draft'),
						value: 'draft',
						required: false
					},
					{
						Id: 'submitted',
						name: $translate.instant('project.inforequest.bim360RFIs.status_submitted'),
						value: 'submitted',
						required: false
					},
					{
						Id: 'open',
						name: $translate.instant('project.inforequest.bim360RFIs.status_open'),
						value: 'open',
						required: false
					},
					{
						Id: 'answered',
						name: $translate.instant('project.inforequest.bim360RFIs.status_answered'),
						value: 'answered',
						required: false
					},
					{
						Id: 'rejected',
						name: $translate.instant('project.inforequest.bim360RFIs.status_rejected'),
						value: 'rejected',
						required: false
					},
					{
						Id: 'closed',
						name: $translate.instant('project.inforequest.bim360RFIs.status_closed'),
						value: 'closed',
						required: false
					},
					{
						Id: 'void',
						name: $translate.instant('project.inforequest.bim360RFIs.status_void'),
						value: 'void',
						required: false
					}
				];

				service.okDisabled = function () {
					var bDisabled = true;
					if (!_.isNil(dataList)) {
						var list = _.filter(dataList, function (item) {
							return item.Selected;
						});
						if (list.length > 0) {
							bDisabled = false;
						}
					}
					var strResult = '';
					if (bDisabled) {
						strResult = 'disabled';
					}
					dlgOptions.OKBtnDisabled = strResult;
				};

				service.getSelectedPrjInfo = function () {
					return prjInfo;
				};
				service.getDlgOptions = function () {
					// dlgOptions.filterStatus = '';
					return dlgOptions;
				};

				service.getRfiStatus = function () {
					return dlgOptions.filterStatusOptions;
				};

				service.getProjects = function (filterKey) {
					var defer = $q.defer();
					var requestInfo = {};
					var tokenInfo = cloudDeskBim360Service.getSessionAuth(0);
					if (!tokenInfo) {
						tokenInfo = {};
						tokenInfo.tokenLegged = 0;
					}
					requestInfo.TokenInfo = tokenInfo;
					requestInfo.FilterKey = filterKey;
					$http.post(globals.webApiBaseUrl + 'defect/main/bim360/projects', requestInfo)
						.then(function (response) {
							defer.resolve(response);
						}, function (error) {
							defer.reject(error);
						});
					return defer.promise;
				};

				function loadRFIs(projInfo, dlgOptions) {
					var tokenInfo = cloudDeskBim360Service.getSessionAuth(1);
					var tokenInfoTwoLegs = cloudDeskBim360Service.getSessionAuth(0);
					var requestInfo = {
						TokenInfo: tokenInfo,
						TokenInfo2: tokenInfoTwoLegs,
						ProjInfo: {
							prjKey: projInfo.prjKey,
							prjId: projInfo.prjId,
							companyId: projInfo.companyId,
							projectNo: projInfo.projectNo,
							projectName: projInfo.projectName,
							currency: projInfo.currency
						},
						Options: {
							Status: dlgOptions.filterStatus,
							ImportDocument: dlgOptions.importDocument,
							SearchText: dlgOptions.searchText,
							ShowImported: dlgOptions.showImported
						}
					};
					var defer = $q.defer();
					$http.post(globals.webApiBaseUrl + 'project/rfi/informationrequest/bim360/rfis', requestInfo)
						.then(function (response) {
							var responseInfo = response.data;
							if (responseInfo.TokenInfo) {
								cloudDeskBim360Service.setSessionAuth(responseInfo.TokenInfo);
							}
							if (responseInfo.TokenInfo2) {
								cloudDeskBim360Service.setSessionAuth(responseInfo.TokenInfo2);
							}
							defer.resolve(responseInfo);
						}, function (error){
							defer.reject(error);
						});

					return defer.promise;
				}

				service.loadRFIsFormBim360 = function loadRFIsFormBim360(projInfo, dlgOptions) {
					var tokenInfo = cloudDeskBim360Service.getSessionAuth(1);
					var tokenIsExpired = cloudDeskBim360Service.tokenIsExpired(tokenInfo);
					if (tokenIsExpired) {
						return cloudDeskBim360Service.getAuthCode(loadRFIs, projInfo, dlgOptions);
					} else {
						return loadRFIs(projInfo, dlgOptions);
					}
				};

				function saveRFIsDefer(projInfo, list, dlgOptions) {
					var tokenInfo = cloudDeskBim360Service.getSessionAuth(1);
					var tokenInfoTwoLegs = cloudDeskBim360Service.getSessionAuth(0);
					var requestInfo = {
						TokenInfo: tokenInfo,
						TokenInfo2: tokenInfoTwoLegs,
						ProjInfo: {
							prjKey: projInfo.prjKey,
							prjId: projInfo.prjId,
							companyId: projInfo.companyId,
							projectNo: projInfo.projectNo,
							projectName: projInfo.projectName,
							currency: projInfo.currency
						},
						RfiList: list,
						Options: {
							Status: dlgOptions.filterStatus,
							ImportDocument: dlgOptions.importDocument,
							SearchText: dlgOptions.searchText,
							ShowImported: dlgOptions.showImported
						}
					};
					var defer = $q.defer();
					$http.post(globals.webApiBaseUrl + 'project/rfi/informationrequest/bim360/saveRFIs', requestInfo)
						.then(function (response) {
							var responseInfo = response.data;
							if (responseInfo.TokenInfo) {
								cloudDeskBim360Service.setSessionAuth(responseInfo.TokenInfo);
							}
							if (responseInfo.TokenInfo2) {
								cloudDeskBim360Service.setSessionAuth(responseInfo.TokenInfo2);
							}
							dlgOptions.RfiList = responseInfo;
							defer.resolve(responseInfo);
						}, function (error){
							defer.reject(error);
						});

					return defer.promise;
				}

				service.saveRFIs = function (projInfo, dlgOptions) {
					var list = _.filter(dataList, function (item) {
						return item.Selected;
					});

					return saveRFIsDefer(projInfo, list, dlgOptions);
				};

				var currentItem;
				service.getSelected = function () {
					var qDefer = $q.defer();
					qDefer.reject(currentItem);
					return qDefer.promise;
				};

				service.getSelectedItem = function () {
					var state = service.getSelected();
					if (state.$$state) {
						if (state.$$state.value) {
							return state.$$state.value;
						}
					}
				};

				service.setSelected = function (item) {
					var qDefer = $q.defer();
					currentItem = item;
					qDefer.reject(currentItem);
					return qDefer.promise;
				};
				var dataList = [];
				service.setDataList = function (value) {
					dataList = value;
				};

				service.getList = function () {
					return dataList;
				};
				service.refreshGrid = function () {
					service.getList();
					service.listLoaded.fire();
				};

				service.listLoaded = new PlatformMessenger();

				service.registerListLoaded = function registerListLoaded(callBackFn) {
					service.listLoaded.register(callBackFn);
				};
				service.unregisterListLoaded = function (callBackFn) {
					service.listLoaded.unregister(callBackFn);
				};

				service.unregisterSelectionChanged = function () {

				};

				service.setSelectedEntities = function () {
				};

				return service;
			}]);
})(angular);
