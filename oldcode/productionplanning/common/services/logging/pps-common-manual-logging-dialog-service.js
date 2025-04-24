(function () {
	'use strict';
	/*global globals, angular, _*/

	var moduleName = 'productionplanning.common';
	angular.module(moduleName).service('ppsCommonManualLoggingDialogService', [
		'platformTranslateService', '$translate',
		'$http', 'basicsLookupdataConfigGenerator',
		'$injector',
		function (platformTranslateService, $translate,
		          $http, basicsLookupdataConfigGenerator,
		          $injector) {
			var self = this;
			self.initController = function ($scope, params) {
				var uiService = params.uiService;
				var schemaOption = params.schemaOption;
				var dataService = params.dataService;
				var isPropertyMappedToDbColumn = params.isPropertyMappedToDbColumn;
				var translationService = params.translationService;

				var formConfig = createFormConfig(uiService, schemaOption, isPropertyMappedToDbColumn, translationService);
				platformTranslateService.translateFormConfig(formConfig);
				$scope.formContainerOptions = {
					formOptions: {
						configure: formConfig
					}
				};
				$scope.modalOptions.value = {
					recordId: dataService.getSelected().Id,
					ppsEntityId: params.ppsEntityId
				};

				// override ok function, because it will commitAllGridEdits(see modaldialog-service.js)
				// which include other grids out of dialog
				overrideButtonEvents($scope, $scope.modalOptions.value);
			};

			function createFormConfig(uiService, schemaOption, isPropertyMappedToDbColumn, translationService) {
				var config = {
					fid: 'pps.commmon.manualLogging',
					showGrouping: false,
					groups: [{
						gid: 'basics'
					}],
					rows: [
						basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
							gridLess: true,
							dataServiceName: 'ppsCommonManualLoggingColumnService',
							valMember: 'field',
							dispMember: 'name',
							showClearButton: true
						}, {
							gid: 'basics',
							rid: 'field',
							model: 'field',
							label$tr$: 'productionplanning.common.manualLog.field',
							sortOrder: 1,
						}),
						{
							gid: 'basics',
							rid: 'comment',
							model: 'comment',
							label$tr$: 'productionplanning.common.manualLog.comment',
							sortOrder: 2,
							type: 'remark',
							required: true
						}]
				};
				// override lookup data service
				var loggingColumns = getColumns(uiService, schemaOption, isPropertyMappedToDbColumn, translationService);
				var lookupDataSrv = $injector.get('ppsCommonManualLoggingColumnService');
				lookupDataSrv.getPreLoadData = function () {
					return loggingColumns;
				};
				return config;
			}

			function getColumns(uiService, schemaOption, isPropertyMappedToDbColumn, translationService) {
				var loggableCols = [];
				var columns = uiService.getStandardConfigForListView().columns;
				columns.forEach(function (col) {
					//if (col.field.toLowerCase() === col.id) {
						var field = col.field === 'DescriptionInfo' ? 'DescriptionInfo.Translated' : col.field;
						if(isPropertyMappedToDbColumn(schemaOption, field)){
							loggableCols.push({
								field: field,
								name: col.name,
								name$tr$: col.name$tr$,
								name$tr$param$: col.name$tr$param$
							});
						}
					//}
				});

				// translate columns name
				platformTranslateService.registerModule(translationService.data.allUsedModules, true).then(function () {
					loggableCols.forEach(function (col) {
						var tResult = col.name$tr$ ? $translate.instant(col.name$tr$, col.name$tr$param$) : col.name;
						if (tResult !== col.name$tr$) {
							col.name = tResult;
						}
					});
				});

				return loggableCols;
			}

			function getDialogScope($scope) {
				var dialogScope = $scope;
				while (!Object.prototype.hasOwnProperty.call(dialogScope, 'modalOptions') && dialogScope.$parent) {
					dialogScope = dialogScope.$parent;
				}
				return dialogScope;
			}

			function overrideButtonEvents($scope, value) {
				var dialogScope = getDialogScope($scope);
				dialogScope.modalOptions.ok = function () {
					dialogScope.modalOptions.isLoading = true;
					$http.post(globals.webApiBaseUrl + 'productionplanning/common/log/savemanuallog', value)
						.then(function () {
							dialogScope.$close({
								ok: true
							});
						}, function () {
							dialogScope.$close({
								ok: false
							});
						});
				};
			}

			self.disableOkButton = function (modalOptions) {
				return modalOptions.isLoading || !modalOptions.value || !modalOptions.value.comment;
			};
		}
	]);

	angular.module(moduleName).factory('ppsCommonManualLoggingColumnService', [
		'platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',
		'$q',
		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator,
		          $q) {
			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('ppsCommonManualLoggingColumnService', {
				valMember: 'field',
				dispMember: 'name',
				uuid: 'e13e5a9d5ec949edaae95ca0fb11c892'
			});
			var service = platformLookupDataServiceFactory.createInstance({
				dataAlreadyLoaded: true
			}).service;

			var orgResetCacheFn = service.resetCache;
			service.resetCache = function () {
				if (service.getPreLoadData) {
					return $q.when(service.getPreLoadData());
				} else {
					orgResetCacheFn.apply(null, arguments);
				}
			};

			var orgGetListFn = service.getList;
			service.getList = function () {
				if (service.getPreLoadData) {
					return $q.when(service.getPreLoadData());
				} else {
					orgGetListFn.apply(null, arguments);
				}
			};

			return service;
		}
	]);
})();