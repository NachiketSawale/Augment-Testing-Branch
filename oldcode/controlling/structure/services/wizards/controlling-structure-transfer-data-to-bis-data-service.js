/**
 * Created by myh on 09/27/2019.
 */
(function (angular) {
	'use strict';
	var moduleName = 'controlling.structure';

	angular.module(moduleName).factory('controllingStructureTransferDataToBisDataService',
		['$q', '$translate', '_', 'globals', '$http', '$injector', 'platformGridAPI', 'PlatformMessenger', 'platformModalService', 'basicsCostGroupCatalogConfigDataService', 'basicsLookupdataLookupFilterService', 'controllingStructureTransferDataToBisDataValidationService',
			function ($q, $translate, _, globals, $http, $injector, platformGridAPI, PlatformMessenger, platformModalService, basicsCostGroupCatalogConfigDataService, basicsLookupdataLookupFilterService, controllingStructureTransferDataToBisDataValidationService) {

				var data = {};
				var service = {};

				angular.extend(data, {
					projectId: null,
					projectNo: null,
					project: null,
					versionDataService: null,
					itemList: [],
					historyList: [],
					classificationSize: 4,
					classificationPrefix: 'Catalog ',
					configNValid: {},
					ribHistoryId: null,
					histroyRemark: null,
					versionType: null,
					historyDescription: null,

					costGroupCatalogList: [],
					filters: [
						{
							key: 'controlling-structure-cost-group-catalog-selection-filter',
							serverSide: false,
							fn: function (item) {
								var codeGroupdCatalogField = 'Code';
								var codeGroupCatalogs = _.map(_.filter(getList(), codeGroupdCatalogField), codeGroupdCatalogField);
								return codeGroupCatalogs.includes(item.Code) === false;
							}
						}
					]
				});

				angular.extend(service, {
					getList: getList,
					getHistoryList: getHistoryList,

					setDefaultCostGroupCatalogs: setDefaultCostGroupCatalogs,

					showTransferToBisWizard: showTransferToBisWizard,
					transferData2BisData: transferData2BisData,

					getHistoryId: getHistoryId,
					getProjectId: getProjectId,
					getProject: getProject,
					getUpdateLineItemConfig: getUpdateLineItemConfig,
					getValidateResult: getValidateResult,

					registerFilters: registerFilters,
					unregisterFilters: unregisterFilters,
					getHistroysByPrjId: getHistroysByPrjId
				});

				// Auto-generate records based on classification Size
				processData();

				function getHistroysByPrjId() {
					return $http.get(globals.webApiBaseUrl + 'controlling/BisPrjHistory/list?mainItemId=' + data.projectId);
				}

				function processData() {
					for (var x = 0; x < data.classificationSize; x++) {
						var id = x + 1;
						data.itemList.push({
							Id: id,
							Classification: data.classificationPrefix + (id)
						});
					}
				}

				function getHistoryId() {
					return data.ribHistoryId;
				}

				function getProjectId() {
					return data.projectId;
				}

				function getProject(){
					return data.project;
				}

				function getList() {
					return data.itemList;
				}

				function getHistoryList(){
					return data.historyList;
				}

				function getUpdateLineItemConfig() {
					return {
						updateAQ: data.configNValid.updateAQ,
						updateIQ: data.configNValid.updateIQ,
						updateIQFrom: data.configNValid.updateIQFrom,
						updateBQ: data.configNValid.updateBQ,
						updateFQ: data.configNValid.updateFQ,
						updateRevenueFrom : data.configNValid.updateRevenueFrom,
						updateRevenue : data.configNValid.updateRevenue
					};
				}

				function getValidateResult() {
					return data.configNValid.validateResult;
				}

				function getUpdateLineItemConfigNValidateInfo(projectId) {
					var defer = $q.defer();
					data.configNValid = null;

					$http.get(globals.webApiBaseUrl + 'controlling/structure/getupdateliconfnvalidateinfo?projectId=' + projectId).then(function (response) {
						data.configNValid = response.data;
						defer.resolve();
					});

					return defer.promise;
				}

				function initHistroysByPrjId(projectId) {
					var defer = $q.defer();

					getHistroysByPrjId(projectId).then(function (response) {
						data.historyList = response.data;
						defer.resolve();
					});

					return defer.promise;
				}

				function setDefaultCostGroupCatalogs() {
					var costgroupLookupService = $injector.get('controllingStructureTransferCostgroupLookupService');

					costgroupLookupService.getList().then(function (costGroupCatalogList) {
						for (var index = 0; index < data.classificationSize; index++) {
							var enterpriseCostGroupCatalog = costGroupCatalogList[index];
							if (enterpriseCostGroupCatalog !== undefined) {
								data.itemList[index].Code = enterpriseCostGroupCatalog.Code;
								data.itemList[index].DescriptionInfo = enterpriseCostGroupCatalog.DescriptionInfo;
								data.itemList[index].IsProjectCatalog = enterpriseCostGroupCatalog.IsProjectCatalog;
							}
						}
					});
				}

				function showTransferToBisWizard(option) {
					initServiceData(option).then(function () {
						if (data.projectId !== null) {
						// Show dialog
							var modalOptions = {
								templateUrl: globals.appBaseUrl + moduleName + '/templates/Transfer-data-to-bis-data.html',
								headerText: $translate.instant('controlling.structure.transferWizardTitle'),
								headerTextKey: moduleName + '.transferdatatobis',
								backdrop: false,
								windowClass: 'form-modal-dialog',
								lazyInit: true,
								resizeable: true
							};

							platformModalService.showDialog(modalOptions);
						} else {
							platformModalService.showMsgBox(moduleName + '.noCurrentProjectSelection', moduleName + '.errorHeader', 'ico-error');
						}
					});
				}





				function getClassifications() {
					let classifications = [];

					var list = getList();

					_.forEach(list, function (item) {
						classifications.push({
							Id : item.Id,
							Code : item.Code
						});
					});

					return classifications;
				}

				function transferData(scopeDialog, scope, postData) {
					// eslint-disable-next-line no-console
					console.log('Transfer Start at : ' + Date());

					$http.post(globals.webApiBaseUrl + 'controlling/structure/transferdatatobisdata', postData).then(
						function (response) {
							updateProjectAcecessright(postData.projectId);

							let executeLogInfo = response && response.data && _.find(response.data, {MessageType: -1});
							var executeLog = executeLogInfo && executeLogInfo.Message ? executeLogInfo.Message : '';
							// eslint-disable-next-line no-console
							console.log(executeLog + 'Transfer End at : ' + Date());

							let exceptionInfo = response && response.data && _.find(response.data, {MessageType: 999});

							if(exceptionInfo && exceptionInfo.Message){
								scope.isLoading = false;

								let message = 'Error occured during transfer: ' + '\n';
								message += exceptionInfo.Message;
								message += ' \nPlease check and continue.';

								scope.error.show = true;
								scope.error.canContinue = true;
								scope.error.message = message;
								scope.error.type = 3;
								scope.isDisableOkBtn = false;
							}
							else{
								// Close transfer dialog
								scopeDialog.$close();

								var dataItems = response.data;

								// Show dialog result

								var modalOptions = {
									headerTextKey: moduleName + '.transferdatatobisExecutionReport.title',
									templateUrl: globals.appBaseUrl + moduleName + '/templates/transfer-data-to-bis-data-result-report.html',
									iconClass: 'ico-info',
									dataItems: dataItems,
									width: '1000px',
									resizeable: true
								};

								// After dialog is closed, we filter the affected line items
								var executionResultFn = function executionResultFn() {
									if(data && data.versionDataService && _.isFunction(data.versionDataService.load)){
										data.versionDataService.load();
										// reload the project controls
										$injector.get('controllingProjectcontrolsDashboardService').reload();
										let versionComparisonGrid = platformGridAPI.grids.element('id', '1861db1513a2494f8af91b462e4c8847');
										if(versionComparisonGrid && versionComparisonGrid.instance){
											$injector.get('controllingProjectcontrolsVersionComparisonService').reload();
										}
									}
								};

								var executionResultDialog = platformModalService.showDialog(modalOptions);
								executionResultDialog.then(executionResultFn, executionResultFn);

								// platformModalService.showMsgBox(moduleName + '.transferdatatobisSuccess' + response.data, moduleName +'.info', 'ico-info');
							}
						}, function (reason) {
							platformModalService.showMsgBox(reason, moduleName + '.errorHeader', 'ico-error');
						}
					);
				}

				function updateProjectAcecessright(projectId){
					$http.get(globals.webApiBaseUrl + 'controlling/structure/updateprojectaccessright?projectId=' + projectId).then(function(response){
						if(response && _.isString(response.data)){
							console.log(response.data);
						}
					});
				}

				function transferData2BisData(scopeDialog, scope, postData) {
					postData.costGroupCats = getClassifications();
					postData.estHeaderIds = _.uniq(controllingStructureTransferDataToBisDataValidationService.validatedEstHeaderIds);
					postData.skipUpdateProjectAccessright = true;

					scope.loadingText = (postData.updatePlannedQty || postData.updateInstalledQty || postData.updateBillingQty || postData.updateForecastingPlannedQty ? $translate.instant('controlling.structure.updatingQuantityNTransfering') : $translate.instant('controlling.structure.transfering')) + '...';
					transferData(scopeDialog, scope, postData);
				}

				function registerFilters() {
					basicsLookupdataLookupFilterService.registerFilter(data.filters);
				}

				function unregisterFilters() {
					basicsLookupdataLookupFilterService.unregisterFilter(data.filters);
				}

				function initServiceData(option) {
					let deferred = $q.defer();
					let project = option.project;

					if (project) {
						data.projectId = project.Id;
						data.projectNo = project.ProjectNo;
						data.project = project;
						data.versionDataService = option.controllingVersionDataService;
						data.itemList = [];
						data.getHistoryList = [];

						processData();
						setDefaultCostGroupCatalogs();

						var promises = [];

						promises.push(getUpdateLineItemConfigNValidateInfo(project.Id));
						promises.push(initHistroysByPrjId(project.Id));

						$q.all(promises).then(function () {
							deferred.resolve();
						});

					} else {
						data.projectId = null;
						deferred.resolve();
					}

					return deferred.promise;
				}

				return service;
			}]);
})(angular);