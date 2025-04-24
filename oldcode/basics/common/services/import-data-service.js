/**
 * Created by lcn on 3/5/2019.
 */
/**
 * Created by lcn on 1/15/2019.
 */
(function (angular) {
	'use strict';
	const moduleName = 'basics.common';
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('basicsCommonImportDataService',
		['$q', '$http', '$translate', '$injector', 'platformModalService', 'PlatformMessenger', 'globals', '_',
			function ($q, $http, $translate, $injector, platformModalService, PlatformMessenger, globals, _) {

				const service = {}/* , self = this */;
				let _moduleName;
				service.analysisFileComplete = new PlatformMessenger();

				service.execute = function (HeaderDataService, ModuleName) {
					_moduleName = ModuleName;
					const header = getHeader();
					const styleOption = getStyleOption(HeaderDataService);
					$translate.instant('basics.common.importXML.importSuccessful');
					const modalOptions = {
						templateUrl: globals.appBaseUrl + 'basics.common/partials/basics-common-import-view.html',
						iconClass: 'ico-warning',
						windowClass: 'msgbox',
						headerName: header.name,
						showStyle: header.show,
						styleOption: styleOption
					};

					platformModalService.showDialog(modalOptions).then(function (res) {
						if (res !== undefined) {
							if (res.ok) {
								/* if (_moduleName === 'basics.costgroups') {
									$injector.get('basicsCostGroups1DataService').refresh();
									$injector.get('basicsCostGroups2DataService').refresh();
									$injector.get('basicsCostGroups3DataService').refresh();
									$injector.get('basicsCostGroups4DataService').refresh();
									$injector.get('basicsCostGroups5DataService').refresh();
								} else { */
								HeaderDataService.load();
								// }
							}
						}
					});
				};

				service.ImportFile = function ImportFile(filePath) {
					const defer = $q.defer();
					const result = /\.[^.]+/.exec(filePath.name);
					if (_.isArray(result) && result.length > 0 && result[0].toLowerCase() !== '.xml') {
						defer.resolve('selected file extension must be XML');
					} else {
						$http({
							method: 'POST',
							url: globals.webApiBaseUrl + 'basics/common/file/importfileinfo',
							headers: {'Content-Type': undefined},
							transformRequest: function (data) {
								const fd = new FormData();
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

				service.importData = function importData(fileName, costGroup) {
					if (_moduleName !== 'basics.costgroups') {
						costGroup = 0;
					}
					return $http.get(globals.webApiBaseUrl + 'basics/common/file/importdata?fileName=' + fileName + '&moduleName=' + _moduleName + '&costGroup=' + costGroup);
				};

				function getHeader() {
					if (_moduleName === 'basics.currency')
						return {name: $translate.instant('basics.currency.Currency'), show: false};
					if (_moduleName === 'basics.unit')
						return {name: $translate.instant('basics.unit.entityUnitTitle'), show: false};
					if (_moduleName === 'basics.costgroups')
						return {name: $translate.instant('basics.costgroups.moduleName'), show: true};
					if (_moduleName === 'basics.costcodes')
						return {name: $translate.instant('basics.costcodes.costCodes'), show: false};
				}

				function getStyleOption(HeaderDataService) {
					if (_.isFunction(HeaderDataService.getStyleOptions)) {
						return HeaderDataService.getStyleOptions();
					}
					return [];
				}

				return service;
			}]);
})(angular);

