/**
 * Created by wri on 9/20/2017.
 */
/* global , globals */
(function (angular) {
	'use strict';
	var moduleName = 'defect.main';

	angular.module(moduleName).factory('defectMainBim360Service',
		['_', 'platformModalService', '$http', '$q','$translate', 'cloudDesktopSidebarService', 'platformRuntimeDataService', 'platformGridAPI',
			'cloudDeskBim360Service', 'PlatformMessenger',
			function (_, platformModalService, $http, $q,$translate, cloudDesktopSidebarService, platformRuntimeDataService, platformGridAPI,
				cloudDeskBim360Service, PlatformMessenger) {
				// data service
				var service = {};

				var prjInfo = {};
				var dlgOptions = {};
				service.setSelectedPrjInfo = function (selectedItem) {
					prjInfo.prjKey = selectedItem ? selectedItem.PrjKey : '';
					prjInfo.projectNo = selectedItem ? selectedItem.ProjectNo : '';
					prjInfo.projectName = selectedItem ? selectedItem.ProjectName : '';
					prjInfo.currency = selectedItem ? selectedItem.Currency : '';
					prjInfo.prjId = selectedItem ? selectedItem.PrjId : '';
					prjInfo.companyId = selectedItem ? selectedItem.CompanyId : '';
					dlgOptions.searchBtnDisabled =  selectedItem ? '' : 'disabled';
				};

				dlgOptions.filterStatusOptions=[
					{Id:'(all)', name:$translate.instant('defect.main.bim360Issues.status_all'),value:'(all)', required:false},
					{Id:'open', name:$translate.instant('defect.main.bim360Issues.status_open'),value:'open', required:false},
					{Id:'closed', name:$translate.instant('defect.main.bim360Issues.status_closed'),value:'closed', required:false},
					{Id:'draft', name:$translate.instant('defect.main.bim360Issues.status_draft'),value:'draft', required:false},
					{Id:'work_completed', name:$translate.instant('defect.main.bim360Issues.status_work_completed'),value:'work_completed', required:false},
					{Id:'ready_to_inspect', name:$translate.instant('defect.main.bim360Issues.status_ready_to_inspect'),value:'ready_to_inspec', required:false},
					{Id:'not_approved', name:$translate.instant('defect.main.bim360Issues.status_not_approved'),value:'not_approved', required:false},
					{Id:'in_dispute', name:$translate.instant('defect.main.bim360Issues.status_in_dispute'),value:'in_dispute', required:false},
					{Id:'answered', name:$translate.instant('defect.main.bim360Issues.status_answered'),value:'answered', required:false},
					{Id:'void', name:$translate.instant('defect.main.bim360Issues.status_void'),value:'void', required:false}
				];
				var dataList = [];
				service.okDisabled = function(){
					var bDisabled = true;
					if (!_.isNil(dataList))
					{
						var list = _.filter(dataList, function (item) {
							return item.Selected;
						});
						if (list.length>0)
						{
							bDisabled = false;
						}
					}
					var strResult = '';
					if (bDisabled){
						strResult = 'disabled';
					}
					dlgOptions.OKBtnDisabled = strResult;
				};

				service.getSelectedPrjInfo = function () {
					return prjInfo;
				};
				service.getDlgOptions = function(){
					// dlgOptions.filterStatus = '';
					return dlgOptions;
				};

				service.getIssueStatus = function () {
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

				function loadIssues(projInfo, dlgOptions) {
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
							Status : dlgOptions.filterStatus,
							ImportDocument : dlgOptions.importDocument,
							SearchText : dlgOptions.searchText,
							ShowImported : dlgOptions.showImported
						}
					};
					var defer = $q.defer();
					$http.post(globals.webApiBaseUrl + 'defect/main/bim360/issues', requestInfo)
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

				service.loadIssueFormBim360 = function loadIssueFormBim360(projInfo, dlgOptions) {
					var tokenInfo = cloudDeskBim360Service.getSessionAuth(1);
					var tokenIsExpired = cloudDeskBim360Service.tokenIsExpired(tokenInfo);
					if (tokenIsExpired) {
						return cloudDeskBim360Service.getAuthCode(loadIssues, projInfo, dlgOptions);
					} else {
						return loadIssues(projInfo, dlgOptions);
					}
				};

				function saveIssueDefer(projInfo, list,dlgOptions) {
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
						IssueList: list,
						Options: {
							Status : dlgOptions.filterStatus,
							ImportDocument : dlgOptions.importDocument,
							SearchText : dlgOptions.searchText,
							ShowImported : dlgOptions.showImported
						}
					};

					var defer = $q.defer();
					$http.post(globals.webApiBaseUrl + 'defect/main/bim360/saveIssues', requestInfo)
						.then(function (response) {
							var responseInfo = response.data;
							if (responseInfo.TokenInfo) {
								cloudDeskBim360Service.setSessionAuth(responseInfo.TokenInfo);
							}
							if (responseInfo.TokenInfo2) {
								cloudDeskBim360Service.setSessionAuth(responseInfo.TokenInfo2);
							}
							dlgOptions.DefectList = responseInfo;
							defer.resolve(responseInfo);
						}, function (error){
							defer.reject(error);
						});

					return defer.promise;
				}

				service.saveIssue = function (projInfo, dlgOptions) {
					var list = _.filter(dataList, function (item) {
						return item.Selected;
					});

					return saveIssueDefer(projInfo, list, dlgOptions);
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
