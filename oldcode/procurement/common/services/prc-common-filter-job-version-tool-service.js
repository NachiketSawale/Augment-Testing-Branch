(function (angular) {
	'use strict';

	/* global globals, _ */
	angular.module('procurement.common').factory('procurementCommonFilterJobVersionToolService',
		['$injector', 'mainViewService', '$translate', '$q', '$http', 'platformGridAPI', 'PlatformMessenger', 'platformRuntimeDataService',
			function ($injector, mainViewService, $translate, $q, $http, platformGridAPI, PlatformMessenger, platformRuntimeDataService) {

				let service = {};
				service.registerToolEvent = function ($scope, dataService, parentService) {

					dataService.onToolsUpdated = new PlatformMessenger();
					dataService.hightLightNGetJob = new PlatformMessenger();
					dataService.jobIds = [];
					dataService.jobs = [];
					dataService.showFilterBtn = false;
					dataService.initFilterMenuFlag = true;
					dataService.isManuallyFilter = false;

					dataService.setIsManuallyFilter = function setIsManuallyFilter(value) {
						dataService.isManuallyFilter = value;
					};

					dataService.setInitFilterMenuFlag = function setInitFilterMenuFlag(value) {
						dataService.initFilterMenuFlag = value;
					};

					dataService.getInitFilterMenuFlag = function getInitFilterMenuFlag() {
						return dataService.initFilterMenuFlag;
					};
					dataService.setShowFilterBtn = function setShowFilterBtn(value) {
						dataService.showFilterBtn = value;
					};

					dataService.getShowFilterBtn = function getShowFilterBtn() {
						return dataService.showFilterBtn;
					};

					dataService.setReadOnly = function setReadOnly(items) {
						let versionEstHeaderJobIds = service.getJobFksOfVersionEstHeader();
						_.forEach(items, function (item) {
							let readOnly = versionEstHeaderJobIds.includes(item.LgmJobFk);
							item.readOnlyByJob = readOnly;

							let fields = [];
							_.forOwn(item, function (value, key) {
								let field = {field: key, readonly: readOnly};
								fields.push(field);
							});
							platformRuntimeDataService.readonly(item, fields);
						});
					};

					dataService.setSelectedJobsIds = function setSelectedJobsIds(selJobs) {
						dataService.jobs = selJobs;
						let jobIds = _.map(selJobs, 'id');
						dataService.jobIds = _.filter(jobIds, function (d) {
							return d;
						});
					};
					dataService.clear = function clear() {
						dataService.jobIds = null;
						dataService.showFilterBtn = false;
					};

					function updateTools() {
						_.forEach($scope.tools.items, function (d) {
							if (d.id === 't14') {
								d.disabled = function () {
									let selectedItem = dataService.getSelected();
									return selectedItem && selectedItem.readOnlyByJob;
								};
							}
						});
						if ($scope.tools) {
							$scope.tools.update();
							platformGridAPI.grids.refresh($scope.gridId);
						}
					}

					dataService.registerSelectionChanged(updateTools);

					function addFilterTools() {
						service.addFilterBtnTools($scope, dataService, parentService);
					}

					dataService.onToolsUpdated.register(addFilterTools);

					function hightLightVersionFilter(highlightJobIds) {
						service.hightLightVersionFilterTool($scope, highlightJobIds);
					}

					dataService.hightLightNGetJob.register(hightLightVersionFilter);

					function initDefaultData() {
						if (platformGridAPI.grids.exist($scope.gridId)) {
							dataService.setInitFilterMenuFlag(false);
							dataService.setIsManuallyFilter(false);
							service.prepareFilterButtonData(parentService).then(function () {
								dataService.onToolsUpdated.fire();
								dataService.setShowFilterBtn(true);
							});
						}
					}

					if (parentService) {
						parentService.registerSelectionChanged(initDefaultData);
					}

					if (!dataService.getShowFilterBtn()) {
						dataService.onToolsUpdated.fire();
					}

					$scope.$on('$destroy', function () {
						dataService.unregisterSelectionChanged(updateTools);
						dataService.onToolsUpdated.unregister(addFilterTools);
						dataService.hightLightNGetJob.unregister(hightLightVersionFilter);
						if (parentService) {
							parentService.unregisterSelectionChanged(initDefaultData);
						}
					});
				};
				service.addFilterBtnTools = function ($scope, dataService, parentService) {
					let selItem = parentService ? parentService.getSelected() : null;

					let tools = angular.copy(service.getFilterToolbar());
					let jobFilterMenu = _.find(tools, function (tool) {
						return tool.id === 'jobFilter';
					});
					jobFilterMenu.list.items = [];
					let jobs = service.getJobs();
					if (jobs && jobs.length) {
						_.each(jobs, function (d) {
							let configTool = {
								id: d.Id,
								type: 'check',
								value: false,
								caption: d.Code,
								fn: function (item) {
									let jobFilterBtn = _.find($scope.tools.items, {'id': 'jobFilter'});
									let selJobs = [];
									if (jobFilterBtn.list && jobFilterBtn.list.items) {
										selJobs = _.filter(jobFilterBtn.list.items, {'value': true});
									}
									dataService.setSelectedJobsIds(selJobs);
									dataService.setInitFilterMenuFlag(false);
									dataService.setIsManuallyFilter(true);
									dataService.load();
									mainViewService.customData($scope.gridId, 'JobMenuID', item);
								}
							};
							jobFilterMenu.list.items.push(configTool);
						});
					}


					// version est filter button
					let versionEstFilterMenu = _.find(tools, function (tool) {
						return tool.id === 'versionFilter';
					});
					versionEstFilterMenu.list.items = [];

					let versionEstHeader = service.getVersionEstHeader();
					if (versionEstHeader && versionEstHeader.length) {

						versionEstHeader = _.groupBy(versionEstHeader, 'VersionNo');

						_.each(versionEstHeader, function (d) {
							let ids = d.length > 1 ? _.map(d, 'Id') : [d[0].Id];
							let configTool = {
								id: d[0].Id,
								type: 'check',
								value: false,
								estHeaderIds: ids,
								jobIds: _.map(d, 'LgmJobFk'),
								caption: d[0].VersionNo,
								fn: function (item, args) {
									if (parentService && !selItem) {
										return;
									}
									service.getJobIdsByEstHeader($scope, args, 'versionHeader').then(function (data) {
										let jobs = service.hightLightNGetJob($scope, data.highlightJobIds, data.cancelJobFkIds);
										dataService.setSelectedJobsIds(jobs);
										dataService.setInitFilterMenuFlag(false);
										dataService.setIsManuallyFilter(true);
										dataService.load();
										mainViewService.customData($scope.gridId, 'VersionEstMenuID', item);
									});
								}
							};
							versionEstFilterMenu.list.items.push(configTool);
						});
					}


					let activeEstHeaderMenu = {
						id: 'activeEstHeaderMenu',
						type: 'check',
						value: false,
						caption: $translate.instant('cloud.common.currentEstimates'),
						fn: function (item, args) {
							if (parentService && !selItem) {
								return;
							}

							service.getJobIdsByEstHeader($scope, args, 'activeEstHeaderMenu').then(function (data) {
								let jobs = service.hightLightNGetJob($scope, data.highlightJobIds, data.cancelJobFkIds);
								dataService.setSelectedJobsIds(jobs);
								dataService.setInitFilterMenuFlag(false);
								dataService.setIsManuallyFilter(true);
								dataService.load();
								mainViewService.customData($scope.gridId, 'GroupConfigID', item);
							});
						}
					};
					versionEstFilterMenu.list.items.push(activeEstHeaderMenu);

					if ($scope.addTools) {
						$scope.addTools(tools);
					}
				};

				service.hightLightVersionFilterTool = function ($scope, highlightJobIds) {
					service.hightLightNGetJob($scope, highlightJobIds, []);

					_.forEach($scope.tools.items, function (d) {
						if (d.id === 'versionFilter') {
							_.forEach(d.list.items, function (f) {
								if (f.id === 'activeEstHeaderMenu') {
									f.value = true;
								}
							});
						}
					});

					mainViewService.customData($scope.gridId, 'VersionEstMenuID', 'activeEstHeaderMenu');
				};


				service.filterIncorporateDataRead = function (dataService, responseData, highlightJobIds) {
					let lookupDescriptorService = $injector.get('basicsLookupdataLookupDescriptorService');
					let prcPackageEstimateHeaderDataService = $injector.get('procurementPackageEstimateHeaderDataService');

					if (dataService.getInitFilterMenuFlag && dataService.getInitFilterMenuFlag()) {
						highlightJobIds = service.getJobFksOfVersionEstHeader();
						if (highlightJobIds && highlightJobIds.length > 0) {
							if (responseData.Main && responseData.Main.length > 0) {
								responseData.Main = filterData(responseData.Main, highlightJobIds);
							} else if (responseData.dtos && responseData.dtos.length > 0) {
								responseData.dtos = filterData(responseData.dtos, highlightJobIds);
							} else {
								responseData = filterData(responseData, highlightJobIds);
							}
						}
					} else if (dataService.jobIds && dataService.jobIds.length > 0) {
						if (responseData.Main && responseData.Main.length > 0) {
							responseData.Main = filterData(responseData.Main, dataService.jobIds);
						} else if (responseData.dtos && responseData.dtos.length > 0) {
							responseData.dtos = filterData(responseData.dtos, dataService.jobIds);
						} else {
							responseData = filterData(responseData, dataService.jobIds);
						}
					}

					function filterData(datas, jobFks) {
						return _.filter(datas, function (item) {
							if (item.LgmJobFk && item.LgmJobFk > 0) {
								return jobFks.indexOf(item.LgmJobFk) > -1;
							} else if (item.EstHeaderFk) {
								let estimateItem = _.find(lookupDescriptorService.getData('EstimateMainHeader'), {Id: item.EstHeaderFk});
								if (!estimateItem && prcPackageEstimateHeaderDataService && prcPackageEstimateHeaderDataService.getList) {
									let list = prcPackageEstimateHeaderDataService.getList();
									estimateItem = _.find(list, {Id: item.EstHeaderFk});
								}
								if (estimateItem) {
									return jobFks.indexOf(estimateItem.LgmJobFk) > -1 && estimateItem.EstHeaderVersionFk === null
										&& (estimateItem.Active || estimateItem.IsActive) && estimateItem.IsGCOrder === false;
								}
							}
							return true;
						});
					}

					return responseData;
				};

				let jobs = [];
				let allEstHeader = [];
				let versionEstHeader = [];
				let jobFksOfVersionEstHeader = [];

				service.getJobFksOfVersionEstHeader = function getJobFksOfVersionEstHeader() {
					return jobFksOfVersionEstHeader;
				};

				service.prepareJobFilter = function prepareJobFilter(parentService) {
					let entity = parentService ? parentService.getSelected() : null;
					if (!entity) {
						return $q.when([]);
					}
					let projectId = entity.PrjProjectFk ? entity.PrjProjectFk : entity.ProjectFk;
					return $http.get(globals.webApiBaseUrl + 'logistic/job/ownedByProject?projectFk=' + projectId).then(function (response) {
						jobs = response.data;
						return $q.when(response.data);
					});
				};

				service.prepareVersionEstHeaderFilter = function prepareVersionEstHeaderFilter(parentService) {
					let entity = parentService ? parentService.getSelected() : null;
					if (!entity) {
						return $q.when([]);
					}

					let projectId = entity.PrjProjectFk ? entity.PrjProjectFk : entity.ProjectFk;
					let param = {
						filter: '',
						projectFk: projectId
					};

					return $http.post(globals.webApiBaseUrl + 'estimate/project/list', param).then(function (response) {
						if (response && response.data && response.data.length > 0) {
							allEstHeader = _.map(response.data, 'EstHeader');
							versionEstHeader = _.filter(allEstHeader, function (item) {
								return item.EstHeaderVersionFk && !item.IsActive;
							});
							versionEstHeader = _.orderBy(versionEstHeader, 'VersionNo');
						}
						return $q.when(allEstHeader);
					});
				};

				service.prepareJobFksOfVersionEstHeader = function (parentService) {
					let entity = parentService ? parentService.getSelected() : null;
					let projectId = entity.PrjProjectFk ? entity.PrjProjectFk : entity.ProjectFk;
					let param = {
						projectFks: [projectId],
						estHeaderIds: []
					};

					return $http.post(globals.webApiBaseUrl + 'estimate/main/header/GetJobIdsByEstHeaderIds', param).then(function (response) {
						jobFksOfVersionEstHeader = response && response.data ? response.data.versionJobIds : [];
						return $q.when(jobFksOfVersionEstHeader);
					});
				};

				let loadDataPromise = null;
				service.initFilterDataMenu = function initFilterDataMenu(dataService, parentService, highlightJobIds) {
					let entity = parentService ? parentService.getSelected() : null;
					if (!entity) {
						return $q.when(true);
					}
					if (jobs.length && allEstHeader.length) {
						if (dataService.getShowFilterBtn && !dataService.getShowFilterBtn()) {
							dataService.onToolsUpdated.fire();
							dataService.setShowFilterBtn(true);
						}
						if (dataService.getInitFilterMenuFlag && _.isFunction(dataService.getInitFilterMenuFlag) && dataService.getInitFilterMenuFlag()) {
							dataService.hightLightNGetJob.fire(highlightJobIds);
							dataService.setInitFilterMenuFlag(false);
						}
						return $q.when(true);
					}

					if (dataService.clear) {
						dataService.clear();
					}

					if (!loadDataPromise) {
						loadDataPromise = service.prepareFilterButtonData(parentService);
					}
					return loadDataPromise.then(function () {
						loadDataPromise = null;
						if (dataService.onToolsUpdated) {
							dataService.onToolsUpdated.fire();
						}
						if (dataService.setShowFilterBtn) {
							dataService.setShowFilterBtn(true);
						}

						if (dataService.getInitFilterMenuFlag && _.isFunction(dataService.getInitFilterMenuFlag) && dataService.getInitFilterMenuFlag()) {
							dataService.hightLightNGetJob.fire(highlightJobIds);
							dataService.setInitFilterMenuFlag(false);
						}

						return $q.when(true);
					});
				};

				service.prepareFilterButtonData = function prepareFilterButtonData(parentService) {
					let arrPromise = [];
					arrPromise.push(service.prepareJobFilter(parentService));
					arrPromise.push(service.prepareVersionEstHeaderFilter(parentService));
					arrPromise.push(service.prepareJobFksOfVersionEstHeader(parentService));
					return $q.all(arrPromise);
				};

				const tools = [{
					id: 'jobFilter',
					caption: 'cloud.common.jobFilter',
					type: 'dropdown-btn',
					iconClass: 'tlb-icons ico-filter-based-job',
					list: {
						showImages: false,
						cssClass: 'dropdown-menu-right',
						items: []
					}
				}, {
					id: 'versionFilter',
					caption: 'cloud.common.versionFilter',
					type: 'dropdown-btn',
					iconClass: 'tlb-icons ico-filter-based-estimate',
					list: {
						showImages: false,
						cssClass: 'dropdown-menu-right',
						items: []
					}
				}];

				service.getFilterToolbar = function () {
					return tools;
				};

				service.updateTools = function () {
					service.onToolsUpdated.fire();
				};

				service.getJobs = function getJobs() {
					return jobs;
				};
				service.getVersionEstHeader = function getVersionEstHeader() {
					return versionEstHeader;
				};
				service.getAllEstHeader = function () {
					return allEstHeader;
				};


				service.hightLightNGetJob = function (scope, highlightJobIds, cancelJobFkIds) {
					let jobFilterBtn = _.find(scope.tools.items, {'id': 'jobFilter'});
					if (jobFilterBtn.list && jobFilterBtn.list.items) {
						_.each(cancelJobFkIds, function (jobId) {
							let matchJob = _.find(jobFilterBtn.list.items, {'id': jobId});
							if (matchJob) {
								matchJob.value = false;
							}
						});
						_.each(highlightJobIds, function (jobId) {
							let matchJob = _.find(jobFilterBtn.list.items, {'id': jobId});
							if (matchJob) {
								matchJob.value = true;
							}
						});
					}

					let jobs = [];
					jobFilterBtn = _.find(scope.tools.items, {'id': 'jobFilter'});
					if (jobFilterBtn.list && jobFilterBtn.list.items) {
						jobs = _.filter(jobFilterBtn.list.items, {'value': true});
					}
					return jobs;
				};

				service.getJobIdsByEstHeader = function (scope, args, type) {
					let estHeaderIds = [];

					if (!scope.tool) {
						scope.updateTools();
					}

					if (type === 'versionHeader') {
						estHeaderIds = args.estHeaderIds;
					} else if (type === 'activeEstHeaderMenu') {
						let versionFilterBtn = _.find(scope.tools.items, {'id': 'versionFilter'});
						let activeEstHeaderMenu = _.find(versionFilterBtn.list.items, {'id': 'activeEstHeaderMenu'});
						let _estHeaders = _.filter(allEstHeader, function (item) {
							return !item.EstHeaderVersionFk && item.IsActive && !item.IsGCOrder;
						});

						if (activeEstHeaderMenu) {
							estHeaderIds = _.map(_estHeaders, 'Id');
						}
					}

					let param = {
						estHeaderIds: estHeaderIds
					};

					return $http.post(globals.webApiBaseUrl + 'estimate/main/header/GetJobIdsByEstHeaderIds', param).then(function (response) {
						let jobDatas = response && response.data ? response.data : {};
						if (!args.value) {
							jobDatas.cancelJobFkIds = jobDatas.estHeaderJobIds;
						} else {
							jobDatas.highlightJobIds = jobDatas.estHeaderJobIds;
						}
						return jobDatas;
					});

				};

				service.clear = function () {
					jobs = [];
					versionEstHeader = [];
					allEstHeader = [];
				};
				return service;

			}]);
})(angular);