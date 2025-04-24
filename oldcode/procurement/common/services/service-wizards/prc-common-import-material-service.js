/**
 * Created by lcn on 1/15/2019.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_ */
	var moduleName = 'procurement.common';
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('procurementCommonImportMaterialService',
		['$q', '$http', '$translate', 'platformModalService', 'PlatformMessenger',
			function ($q, $http, $translate, platformModalService, PlatformMessenger) {

				var service = {}/* , self = this */;

				var prcHeaderFK;
				var _moduleName;
				service.analysisFileComplete = new PlatformMessenger();

				service.execute = function (HeaderDataService, DataService, ModuleName) {
					_moduleName = ModuleName;
					var header = HeaderDataService.getSelected();
					var reqHeaderEntity = DataService.getSelected();
					var msg = $translate.instant('procurement.common.importD94.noCurrentQuoteSelection');
					// var importSuccessful = $translate.instant('procurement.common.importD94.importSuccessful');

					if (!header || !reqHeaderEntity || angular.isUndefined(header.Id) || angular.isUndefined(reqHeaderEntity.Id)) {
						platformModalService.showMsgBox(msg, 'Info', 'ico-info');
						return;
					}
					else {
						prcHeaderFK = reqHeaderEntity.PrcHeaderFk;
					}

					var modalOptions = {
						headerTextKey: 'procurement.common.importD94.header',
						templateUrl: globals.appBaseUrl + 'procurement.common/partials/prc-common-import-view.html',
						iconClass: 'ico-warning',
						windowClass: 'msgbox'
					};

					platformModalService.showDialog(modalOptions).then(function (res) {
						if (res !== undefined) {
							if (res.ok) {
								HeaderDataService.callRefresh().then(function () {
									DataService.currentSelectItem = reqHeaderEntity;
								});
							}
						}
					});
				};

				service.ImportFile = function ImportFile(filePath) {
					var defer = $q.defer();
					var result = /\.[^.]+$/.exec(filePath.name);// jshint ignore:line
					if (_.isArray(result) && result.length > 0 && result[0].toLowerCase() !== '.d94') {
						defer.resolve('selected file extension must be d94');
					} else {
						$http({
							method: 'POST',
							url: globals.webApiBaseUrl + 'procurement/common/wizard/importfileinfo',
							headers: {'Content-Type': undefined},
							transformRequest: function (data) {
								var fd = new FormData();
								fd.append('model', angular.toJson(data.model));
								if (data.file) {
									fd.append('file', data.file);
								}
								return fd;
							},
							data: {file: filePath}
						}).then(function (successData) {
							if (successData) {
								defer.resolve(true);
							}
						}, function (failure) {
							defer.reject(failure);
						});
					}
					return defer.promise;
				};

				service.importMaterial = function importMaterial(fileName) {
					return $http({
						method: 'GET',
						url: globals.webApiBaseUrl + 'procurement/common/wizard/importmaterial?fileName=' + fileName + '&mainItemId=' + prcHeaderFK + '&moduleName=' + _moduleName
					}).then(function (response) {
						response.Applystatus = true;
						return response;
					}, function (response) {
						response.Applystatus = false;
						return response;
					});
				};

				service.importMaterialForWarning = function importMaterialForWarning(xmlData) {
					var postData = {xmlData: xmlData, mainItemId: prcHeaderFK, moduleName: _moduleName};
					return $http.post(globals.webApiBaseUrl + 'procurement/common/wizard/importmaterialforwarning', postData);
				};
				return service;
			}]);
})(angular);

