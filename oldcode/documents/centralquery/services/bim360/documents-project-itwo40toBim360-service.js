/**
 * Created by wri on 9/20/2017.
 */

(function (angular) {
	'use strict';
	var moduleName = 'documents.centralquery';

	angular.module(moduleName).factory('documentsCentralqueryITwo40toBim360Service',
		['globals','_', 'platformModalService', '$http', '$q','$translate', 'cloudDesktopSidebarService', 'platformRuntimeDataService', 'platformGridAPI',
			'cloudDeskBim360Service', 'PlatformMessenger',
			function (globals,_, platformModalService, $http, $q,$translate, cloudDesktopSidebarService, platformRuntimeDataService, platformGridAPI,
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

				var folderInfo = {};
				folderInfo.folderId =  '';
				folderInfo.folderDisplay =  '';

				service.getSelectedFolderInfo = function () {
					return folderInfo;
				};
				service.setSelectedFolderInfo = function (selectedItem) {
					folderInfo.folderId = selectedItem ? selectedItem.Id : '';
					folderInfo.folderDisplay = selectedItem ? selectedItem.FullName : '';
				};

				dlgOptions.filterStatusOptions=[
					{Id:'(all)', name:$translate.instant('documents.centralquery.bim360Documents.status_all'),value:'(all)', required:false},
					/* {Id:"open", name:$translate.instant('defect.main.bim360Issues.status_open'),value:"open", required:false},
                    {Id:"closed", name:$translate.instant('defect.main.bim360Issues.status_closed'),value:"closed", required:false},
                    {Id:"draft", name:$translate.instant('defect.main.bim360Issues.status_draft'),value:"draft", required:false},
                    {Id:"work_completed", name:$translate.instant('defect.main.bim360Issues.status_work_completed'),value:"work_completed", required:false},
                    {Id:"ready_to_inspect", name:$translate.instant('defect.main.bim360Issues.status_ready_to_inspect'),value:"ready_to_inspect", required:false},
                    {Id:"not_approved", name:$translate.instant('defect.main.bim360Issues.status_not_approved'),value:"not_approved", required:false},
                    {Id:"in_dispute", name:$translate.instant('defect.main.bim360Issues.status_in_dispute'),value:"in_dispute", required:false},
                    {Id:"answered", name:$translate.instant('defect.main.bim360Issues.status_answered'),value:"answered", required:false},
                    {Id:"void", name:$translate.instant('defect.main.bim360Issues.status_void'),value:"void", required:false} */
				];
				var dataList = [];
				service.okDisabled = function(){
					var bDisabled = true;
					if (folderInfo.folderId !== '')
					{
						if (dataList !== null)
						{
							var list = _.filter(dataList, function (item) {
								return item.Selected;
							});
							if (list.length>0)
							{
								bDisabled = false;
							}
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


				service.getProjects = function (filterKey) {
					var defer = $q.defer();
					/* var requestInfo = {};
                    var tokenInfo = cloudDeskBim360Service.getSessionAuth(0);
                    if (!tokenInfo) {
                        tokenInfo = {};
                        tokenInfo.tokenLegged = 0;
                    }
                    requestInfo.TokenInfo = tokenInfo;
                    requestInfo.FilterKey = filterKey; */

					var tokenInfoTwoLegs = cloudDeskBim360Service.getSessionAuth(0);
					var requestInfo = {
						TokenInfo: tokenInfoTwoLegs,
						TokenInfo2: null,
						ProjInfo: null,
						Options: {
							Status : dlgOptions.filterStatus,
							Path : folderInfo.folderId,
							SearchText : filterKey,
						}
					};

					$http.post(globals.webApiBaseUrl + 'documents/centralquery/bim360/projects', requestInfo)
						.then(function (response) {
							defer.resolve(response);
						}, function (error) {
							defer.reject(error);
						});
					return defer.promise;
				};

				service.getFolders = function () {
					var defer = $q.defer();
					// var tokenInfo = cloudDeskBim360Service.getSessionAuth(1);
					var tokenInfoTwoLegs = cloudDeskBim360Service.getSessionAuth(0);
					var requestInfo = {
						TokenInfo: tokenInfoTwoLegs,
						TokenInfo2: null,
						ProjInfo: {
							prjKey: prjInfo.prjKey,
							prjId: prjInfo.prjId,
							companyId: prjInfo.companyId,
							projectNo: prjInfo.projectNo,
							projectName: prjInfo.projectName,
							currency: prjInfo.currency
						},
						Options: {
							Status : dlgOptions.filterStatus,
							Path : '',
							SearchText : dlgOptions.searchText,
						}
					};
					$http.post(globals.webApiBaseUrl + 'documents/centralquery/bim360/folders', requestInfo)
						.then(function (response) {
							var responseInfo = response.data;
							if (responseInfo.TokenInfo) {
								cloudDeskBim360Service.setSessionAuth(responseInfo.TokenInfo);
							}
							defer.resolve(response);
						}, function (error) {
							defer.reject(error);
						});
					return defer.promise;
				};

				function loadDocuments(projInfo, dlgOptions) {
					// var tokenInfo = cloudDeskBim360Service.getSessionAuth(1);
					var tokenInfoTwoLegs = cloudDeskBim360Service.getSessionAuth(0);
					var requestInfo = {
						TokenInfo: tokenInfoTwoLegs,
						TokenInfo2: null,
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
							Path : folderInfo.folderId,
							SearchText : dlgOptions.searchText,
						}
					};
					var defer = $q.defer();
					$http.post(globals.webApiBaseUrl + 'documents/centralquery/bim360/loadITwoDocuments', requestInfo)
						.then(function (response) {
							var responseInfo = response.data;
							if (responseInfo.TokenInfo) {
								cloudDeskBim360Service.setSessionAuth(responseInfo.TokenInfo);
							}
							if (responseInfo.TokenInfo2) {
								cloudDeskBim360Service.setSessionAuth(responseInfo.TokenInfo2);
							}
							defer.resolve(responseInfo);
						}, function (error) {
							defer.reject(error);
						});

					return defer.promise;
				}

				service.loadDocumentFromItwo40 = function loadDocumentFromItwo40(projInfo, dlgOptions) {
					/* var tokenInfo = cloudDeskBim360Service.getSessionAuth(1);
                    var tokenIsExpired = cloudDeskBim360Service.tokenIsExpired(tokenInfo);
                    if (tokenIsExpired) {
                        return cloudDeskBim360Service.getAuthCode(loadDocuments, projInfo, dlgOptions);
                    } else {
                        return loadDocuments(projInfo, dlgOptions);
                    } */
					return loadDocuments(projInfo, dlgOptions);
				};

				function saveDocumentDefer(list,dlgOptions, projInfo) {
					// var tokenInfo = cloudDeskBim360Service.getSessionAuth(1);
					var tokenInfoTwoLegs = cloudDeskBim360Service.getSessionAuth(0);
					var requestInfo = {
						TokenInfo: tokenInfoTwoLegs,
						TokenInfo2: null,
						ProjInfo: {
							prjKey: projInfo.prjKey,
							prjId: projInfo.prjId,
							companyId: projInfo.companyId,
							projectNo: projInfo.projectNo,
							projectName: projInfo.projectName,
							currency: projInfo.currency
						},
						DocumentList: list,
						Options: {
							Status : dlgOptions.filterStatus,
							Path : folderInfo.folderId,
							SearchText : dlgOptions.searchText,
						}
					};

					var defer = $q.defer();
					$http.post(globals.webApiBaseUrl + 'documents/centralquery/bim360/uploadDocuments', requestInfo)
						.then(function (response) {
							var responseInfo = response.data;
							if (responseInfo.TokenInfo) {
								cloudDeskBim360Service.setSessionAuth(responseInfo.TokenInfo);
							}
							if (responseInfo.TokenInfo2) {
								cloudDeskBim360Service.setSessionAuth(responseInfo.TokenInfo2);
							}
							dlgOptions.DocList = JSON.parse(responseInfo.ResultMsg);
							defer.resolve(responseInfo);
						}, function (error) {
							defer.reject(error);
						});

					return defer.promise;
				}

				service.saveDocument = function (dlgOptions) {
					var list = _.filter(dataList, function (item) {
						return item.Selected;
					});

					return saveDocumentDefer(list,dlgOptions, prjInfo);
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
