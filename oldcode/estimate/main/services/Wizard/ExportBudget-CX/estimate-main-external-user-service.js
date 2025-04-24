/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals, _, $ */
	'use strict';

	angular.module('estimate.main').factory('estimateMainExternalUserService', ['$http','platformContextService', 'platformModalService','$timeout', '$translate','$injector', '$q',
		function ($http,platformContextService, platformModalService, $timeout, $translate, $injector, $q) {
			let service = {},
				userList = [];

			service.loadData = function loadData() {
				if(scope.Context.InitialValues.AutoTransferIfConditionValid){
					// this case, it will be invoked manually
					return $q.when([]);
				}
				service.loadExternalUserData();
			};

			service.loadExternalUserData = function() {
				userList = [];
				scope.noCxApiUser = false;
				let externalSourceType = scope.Context.InitialValues.ExternalSourceType || 19;
				return $http.get(globals.webApiBaseUrl + 'basics/customize/ExternalSource2User/getexternaluserconfig?sourceType='+externalSourceType+'&internalUserId=' + platformContextService.getCurrentUserId()).then(function (result) {
					if(result && result.data){
						scope.Context.iTWOcxCredential.ApiUrl = result.data.ApiUrl;
						_.forEach(result.data.list, function (item) {
							userList.push({Id: item.Id, Username: item.Username, Password: item.Password, ApiUrl: item.ApiUrl});
						});
						if(userList.length > 0) {
							scope.Context.iTWOcxCredential.UserName = userList[0].Username;
							scope.Context.iTWOcxCredential.Password = userList[0].Password;
							scope.Context.iTWOcxCredential.UserId = userList[0].Id;
							scope.Entity.UserId = userList[0].Id;
							service.loginToCxBySelectedUser();
						}
					}

					scope.Context.InitialValues.noCxApiUser = scope.noCxApiUser = userList.length === 0;
				});
			};

			let scope = {};
			service.setScope= function($scope){
				scope = $scope;
			};

			service.getList = function getList() {
				return userList;
			};

			service.getItem = function (id) {
				return _.find(userList, function (item) {
					return item.Id === id;
				});
			};

			service.loginToCxBySelectedUser = function () {
				scope.Context.CxApiResult = {};
				let baseCxApiUrl = scope.Context.iTWOcxCredential.ApiUrl;
				let apiRoute = scope.Context.InitialValues.ApiRoute || '/Login/ByEmail?email={UserName}&encryptedPassword={Password}';
				apiRoute = apiRoute.replace('{UserName}',scope.Context.iTWOcxCredential.UserName);
				apiRoute = apiRoute.replace('{Password}',scope.Context.iTWOcxCredential.Password);
				scope.Context.CxApiResult.DocIsPosting = true;
				$.ajax({
					type: 'post',
					dataType: 'json',
					url: baseCxApiUrl + apiRoute,
					contentType:'text/json',
					success: function (data) {
						if(data && data.IsSuccess){
							scope.Context.iTWOcxSessions = data;
							// if(data.PrjUser && data.PrjUser.PrjUserCode && scope.Context.iTWOcxDocument.ActionCodes.indexOf(data.PrjUser.PrjUserCode) === -1){
							// scope.Context.iTWOcxDocument.ActionCodes.push(data.PrjUser.PrjUserCode);
							// }

							if(scope.Context.InitialValues.AutoTransferIfConditionValid){
								getCxProject(data);
							}else {
								scope.Context.CxApiResult.DocIsPosting = false;
							}
						}
						if(!data || !data.IsSuccess){
							HandlePostResout(false, $translate.instant('estimate.main.exportBudget2CxWizard.LoginToCxErrContext'));
						}
						scope.isLoading = false;
					},
					error: function (/* data */) {
						scope.isLoading = false;
						HandlePostResout(false, $translate.instant('estimate.main.exportBudget2CxWizard.LoginToCxErrTitle'));
					}
				});
			};

			service.loginToITWOcx = function () {
				scope.isLoading = true;
				$http.get(globals.webApiBaseUrl + 'basics/common/stringhandle/formarttomd5?str='+scope.Context.iTWOcxCredential.Password).then(function (result) {
					if(result && result.data){
						scope.Context.iTWOcxCredential.Password = result.data;
						service.loginToCxBySelectedUser();
					}
				});
			};

			function getCxProject(data) {
				$.ajax({
					beforeSend: function(xhr) {
						xhr.setRequestHeader('key', scope.Context.iTWOcxSessions.Key);
					},
					type: 'get',
					url: scope.Context.iTWOcxCredential.ApiUrl + scope.Context.InitialValues.ApiGetCxProjectRoute,
					dataType: 'json',
					success: function (response) {
						if(response && response.Items && response.Items.length > 0){
							data.PrjUserList = response.Items;
							TransferDocToiTWOcx(data);

						}else {
							HandlePostResout(false, $translate.instant('estimate.main.exportBudget2CxWizard.noMatchedProject'));
						}

					},
					error: function (response) {
						HandlePostResout(false,  response.toString());
					}
				});
			}

			function TransferDocToiTWOcx(data) {
				let projectInfo = $injector.get('estimateMainService').getSelectedProjectInfo();
				scope.Context.CxApiResult = {};
				if(projectInfo){
					let matchProjectNo = '';
					_.forEach(data.PrjUserList, function (item) {
						if(item.Name.toUpperCase() === projectInfo.ProjectNo.toUpperCase()){
							matchProjectNo = item.Name;
						}
					});

					if(matchProjectNo){
						scope.Entity.CxProject = matchProjectNo;
						scope.Context.iTWOcxCredential.CxProject = matchProjectNo;
						scope.Context.CxApiResult = {};
						scope.Context.InitialValues.noCxApiUser = false;
						scope.Context.CxApiResult.DocIsPosting = true;
						scope.Context.iTWOcxCredential.ApiPostDocRoute = scope.Context.InitialValues.ApiPostDocRoute || '/{ProjectName}/Budget/Create?';

						$.ajax({
							beforeSend: function(xhr) {
								xhr.setRequestHeader('key', scope.Context.iTWOcxSessions.Key);
							},
							type: 'post',
							url: scope.Context.iTWOcxCredential.ApiUrl + scope.Context.iTWOcxCredential.ApiPostDocRoute.replace('{ProjectName}', scope.Context.iTWOcxCredential.CxProject ),
							data: JSON.stringify(scope.Context.iTWOcxDocument),
							contentType: 'application/json',
							success: function (data) {
								HandlePostResout(data.IsSuccess, data.ErrorMessages[0]);

							},
							error: function (data) {
								HandlePostResout(false, $translate.instant('estimate.main.exportBudget2CxWizard.publishDocToCxErr') + ':' + data.toString());
							}
						});
					}else{
						HandlePostResout(false, $translate.instant('estimate.main.exportBudget2CxWizard.noMatchedProject'));
					}
				}else{
					HandlePostResout(false, $translate.instant('estimate.main.createMaterialPackageWizard.noProjectItemSelected'));
				}
			}

			function HandlePostResout(isSuccess, ErrorMessages) {
				scope.Context.CxApiResult = scope.Context.CxApiResult || {};
				scope.Context.CxApiResult.HasPostDoc = true;
				scope.Context.CxApiResult.DocIsPosting = false;
				scope.Context.CxApiResult.IsSuccess = isSuccess;
				scope.Context.CxApiResult.ErrorMessages = ErrorMessages;
			}

			return service;
		}]);

	angular.module('estimate.main').factory('estimateMainExternalUserServiceV1', ['$http','platformContextService', 'platformModalService','$timeout', '$translate',
		function ($http,platformContextService, platformModalService, $timeout, $translate) {
			let service = {},
				userList = [];

			service.loadExternalUserData = function(externalSourceType) {
				userList = [];
				return $http.get(globals.webApiBaseUrl + 'basics/customize/ExternalSource2User/getexternaluserconfig?sourceType='+externalSourceType+'&internalUserId=' + platformContextService.getCurrentUserId()).then(function (result) {
					if(result && result.data){
						let data = {ApiUrl: result.data.ApiUrl};
						if(result.data.list.length > 0) {
							data.Username = userList[0].Username;
							data.Password = userList[0].Password;
						}
						return data;
					}else{
						return null;
					}
				});
			};

			service.transferDocToiTWOcx = function(scope, matchProjectNo) {

				scope.Context.iTWOcxCredential.CxProject = matchProjectNo;
				scope.Context.CxApiResult = {};
				scope.Context.InitialValues.noCxApiUser = false;
				scope.Context.CxApiResult.DocIsPosting = true;
				scope.Context.iTWOcxCredential.ApiPostDocRoute = scope.Context.InitialValues.ApiPostDocRoute || '/{ProjectName}/Budget/Create?';

				$.ajax({
					beforeSend: function(xhr) {
						xhr.setRequestHeader('key', scope.Context.CxSession.Key);
					},
					type: 'post',
					url: scope.Context.iTWOcxCredential.BaseApiUrl + scope.Context.iTWOcxCredential.ApiPostDocRoute.replace('{ProjectName}', scope.Context.iTWOcxCredential.CxProject ),
					data: JSON.stringify(scope.Context.iTWOcxDocument),
					contentType: 'application/json',
					success: function (data) {
						HandlePostResout(data.IsSuccess, data.ErrorMessages[0]);

					},
					error: function (data) {
						HandlePostResout(false, $translate.instant('estimate.main.exportBudget2CxWizard.publishDocToCxErr') + ':' + data.toString());
					}
				});

				function HandlePostResout(isSuccess, ErrorMessages) {
					scope.Context.CxApiResult = scope.Context.CxApiResult || {};
					scope.Context.CxApiResult.HasPostDoc = true;
					scope.Context.CxApiResult.DocIsPosting = false;
					scope.Context.CxApiResult.IsSuccess = isSuccess;
					scope.Context.CxApiResult.ErrorMessages = ErrorMessages;
				}
			};


			return service;
		}]);
})(angular);
