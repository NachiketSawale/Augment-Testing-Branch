/**
 * Created by chk on 7/20/2016.
 */

(function (angular) {
	'use strict';
	var moduleName = 'procurement.package';

	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_ */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('procurementPackageImportWizardService',
		['$q', '$http', 'procurementContextService', 'procurementPackageDataService', 'platformModalService', 'PlatformMessenger', 'platformRuntimeDataService',
			function ($q, $http, moduleContext, packageDataService, platformModalService, PlatformMessenger, platformRuntimeDataService) {

				var service = {};

				service.modalOptions = {
					resizeable: true,
					templateUrl: globals.appBaseUrl + 'procurement.package/partials/procurement-package-import-result-dialog.html',
					bodyText: 'Import result:',
					cancelBtnText: 'OK',
					columns: [
						{
							id: 'Status',
							field: 'Status',
							name: 'Status',
							name$tr$: 'procurement.common.import.status',
							width: 100
						},
						{
							id: 'Error',
							field: 'Error',
							name: 'Error',
							name$tr$: 'procurement.common.import.error',
							width: 200
						},
						{
							id: 'Warning',
							field: 'Warning',
							name: 'Warning',
							name$tr$: 'procurement.common.import.warning',
							width: 300
						}
					],
					width: '600px'
				};

				service.analysisFileComplete = new PlatformMessenger();

				service.execute = function () {
					var modalOptions = {
						headerTextKey: 'procurement.package.wizard.import.header',
						templateUrl: globals.appBaseUrl + 'procurement.package/partials/procurement-package-import-view.html'
					};

					platformModalService.showDialog(modalOptions);
				};

				service.packageImportFile = function packageImportFile(filePath) {
					var defer = $q.defer();
					var result = /\.[^.]+/.exec(filePath.name);
					if (_.isArray(result) && result.length > 0 && result[0].toLowerCase() !== '.d93') {
						defer.resolve('selected file extension must be d93');
					} else {
						$http({
							method: 'POST',
							url: globals.webApiBaseUrl + 'procurement/package/import/importfileinfo',
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
							if (successData && successData.data) {
								defer.resolve(successData.data);
							}
						}, function (failure) {
							defer.reject(failure);
						});
					}
					return defer.promise;
				};

				service.validateDialogStructureFk = function validateDialogStructureFk(entity, strValue) {
					var itemData = entity.ResponseData;
					$http.get(globals.webApiBaseUrl + 'basics/procurementconfiguration/configuration/getByStructure?structureId=' + strValue + '&rubricId=31').then(function (response) {
						itemData.ConfigurationFk = response.data;
					});
				};

				service.validateProjectFk = function validateProjectFk(entity, model) {
					if (entity.ResponseData.PrjProjectFk > 0) {
						platformRuntimeDataService.readonly(entity, [{field: model, readonly: true}]);
					} else {
						platformRuntimeDataService.readonly(entity, [{field: model, readonly: false}]);
					}
				};

				service.importPackage = function importPackage(entity) {
					var defer = $q.defer();
					var result = [];
					$http.post(globals.webApiBaseUrl + 'procurement/package/import/importpackage', entity).then(function (res) {
						if (res.data) {
							/** @namespace res.data.PrcPackageImportDto */
							var item = {
								Id: res.data.PrcPackageImportDto.Id,
								Status: res.data.PrcPackageImportDto.Status === 3 ? 'Failed' : 'Succeeded',
								Error: res.data.PrcPackageImportDto.ErrorMessage,
								Warning: res.data.PrcPackageImportDto.WarningMessages.length > 0 ? res.data.PrcPackageImportDto.WarningMessages.join('\n') : null
							};
							_.extend(item, {PrcPackageDto: res.data.PrcPackageDto});
							result.push(item);
						}
						_.extend(service.modalOptions, {result: result});
						defer.resolve(result);
					}, function (error) {
						result.push({
							Id: 1,
							Status: 'Failed',
							Error: error
						});
						_.extend(service.modalOptions, {result: result});
						defer.reject(result);
					});
					return defer.promise;
				};

				return service;
			}]);
})(angular);
