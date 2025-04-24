/**
 * Created by wui on 4/6/2016.
 */
/* global globals */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,moment */

	var moduleName = 'constructionsystem.main';

	/* jshint -W072 */ // has too many parameters
	angular.module(moduleName).factory('constructionSystemMainJobDataService', [
		'$q',
		'$http',
		'$timeout',
		'$injector',
		'PlatformMessenger',
		'platformDataServiceFactory',
		'constructionSystemMainInstanceService',
		'platformModalService',
		'_',
		'constructionSystemMainInstanceProgressService',
		'cloudDesktopPinningContextService',
		'constructionSystemMainJobState',
		'cloudDesktopSidebarService',
		'constructionSystemMainInstanceState',
		'ServiceDataProcessDatesExtension',
		function (
			$q,
			$http,
			$timeout,
			$injector,
			PlatformMessenger,
			platformDataServiceFactory,
			constructionSystemMainInstanceService,
			platformModalService,
			_,
			constructionSystemMainInstanceProgressService,
			cloudDesktopPinningContextService,
			constructionSystemMainJobState,
			cloudDesktopSidebarService,
			constructionSystemMainInstanceState,
			ServiceDataProcessDatesExtension) {

			var serviceOption = {
				flatNodeItem: {
					module: angular.module(moduleName),
					httpRead: {
						route: globals.webApiBaseUrl + 'constructionsystem/main/job/',
						endRead: 'list',
						initReadData: function (readData) {
							var insHeaderId = constructionSystemMainInstanceService.getCurrentInstanceHeaderId();
							readData.filter = '?insHeaderId=' + insHeaderId;
						}
					},
					dataProcessor:[new ServiceDataProcessDatesExtension(['StartTime', 'EndTime'])],
					entityRole: {
						root: {
							itemName: 'Job',
							rootForModule: moduleName,
							lastObjectModuleName: moduleName
						},

					},
					actions: {
						create: false,
						delete: true
					}
				}
			};

			var container = platformDataServiceFactory.createNewComplete(serviceOption);

			var service = container.service;

			service.twoQResultId = 0;
			service.onEvaluationDone = new PlatformMessenger();
			service.onCalculationDone = new PlatformMessenger();
			service.onAssignObjectDone = new PlatformMessenger();

			service.disableCalculation = function() {
				return !constructionSystemMainInstanceService.getList().some(function (item) {
					return item.IsChecked && !item.IsUserModified;
				});
			};

			service.disableEvaluation = function() {
				return constructionSystemMainInstanceService.getList().length === 0;
			};

			service.doCreateItem = function (action, version) {
				var instances = constructionSystemMainInstanceService.getList().filter(function (item) {
					return item.IsChecked && !item.IsUserModified;
				});

				if (instances.length) {
					instances.forEach(function (item) {
						item.Status = constructionSystemMainInstanceState.waiting;
					});

					return $http.post(globals.webApiBaseUrl + 'constructionsystem/main/job/' + action, {
						InsHeaderId: constructionSystemMainInstanceService.getCurrentInstanceHeaderId(),
						InstanceIds: instances.map(function (item) {
							return item.Id;
						}),
						Version: version
					});
				} else {
					platformModalService.showErrorBox('Please check instances', 'Create Job Failed');
				}
			};

			service.selectCosJob = function (entity, fromCalculation) {
				var outputService = $injector.get('constructionSystemMainOutputDataService');
				if (outputService.isFilterByCalculation) {
					if (fromCalculation) {
						service.setSelected(entity);
					}
				} else {
					service.setSelected(entity);
				}
			};

			service.createObjectAssignJob = function (assignSelected) {
				constructionSystemMainInstanceService.updateAndExecute(function() {

					var cosInstances = [];
					if (assignSelected === true) {
						if (constructionSystemMainInstanceService.hasSelection()) {
							var selectedInstance = constructionSystemMainInstanceService.getSelected();
							cosInstances = [selectedInstance];
						}
					} else {
						cosInstances = _.filter(constructionSystemMainInstanceService.getList(), {IsChecked: true});
					}

					if (_.isEmpty(cosInstances)) {
						return platformModalService.showDialog({
							headerTextKey: 'cloud.common.informationDialogHeader',
							bodyTextKey: 'constructionsystem.main.assignObjectsBySelectionStatement.mustCheck',
							iconClass: 'ico-info'
						});
					}

					platformModalService.showYesNoDialog('constructionsystem.main.assignObjectsBySelectionStatement.isClear', 'constructionsystem.main.assignObjectsBySelectionStatement.wizardName', 'no')
						.then(function (result) {
							$http.post(globals.webApiBaseUrl + 'constructionsystem/main/job/assignobjectsbyselectionstatement', {
								InsHeaderId: constructionSystemMainInstanceService.getCurrentInstanceHeaderId(),
								InstanceIds: _.map(cosInstances, 'Id'),
								IsClear: result.yes
							}).then(function (response) {
								var newEntity = response.data;

								service.refresh().then(function (data) {
									newEntity = getItemById(data, newEntity.Id);
									if (newEntity) {
										service.selectCosJob(newEntity);
									}
								});
							});
						});
				});
			};

			service.createEvaluationJob = function () {
				constructionSystemMainInstanceService.updateAndExecute(function() {
					var cosInstances = constructionSystemMainInstanceService.getList();

					cosInstances.forEach(function (item) {
						item.Status = constructionSystemMainInstanceState.waiting;
					});

					$http.post(globals.webApiBaseUrl + 'constructionsystem/main/job/evalquantityqueryasync', {
						InsHeaderId: constructionSystemMainInstanceService.getCurrentInstanceHeaderId(),
						InstanceIds: _.map(cosInstances, 'Id')
					}).then(function (response) {
						var newEntity = response.data;

						service.refresh().then(function (data) {
							newEntity = getItemById(data, newEntity.Id);
							if (newEntity) {
								service.selectCosJob(newEntity);
							}
						});
					});
				});
			};

			service.createCalculationJob = function () {
				constructionSystemMainInstanceService.updateAndExecute(function(){
					var promise = service.doCreateItem('executeinstanceasync');
					if (promise) {
						promise.then(function (response) {
							var newEntity = response.data;

							service.refresh().then(function (data) {
								newEntity = getItemById(data, newEntity.Id);
								if (newEntity) {
									service.selectCosJob(newEntity, true);
								}
							});
						});
					}
				});
			};

			service.createCalculationJob2 = function () {
				constructionSystemMainInstanceService.updateAndExecute(function(){
					var promise = service.doCreateItem('executeinstanceasync', 2);
					if (promise) {
						promise.then(function (response) {
							var newEntity = response.data;

							service.refresh().then(function (data) {
								newEntity = getItemById(data, newEntity.Id);
								if (newEntity) {
									service.selectCosJob(newEntity, true);
								}
							});
						});
					}
				});
			};

			service.createApplyLineItemJob = function (newEntity) {
				constructionSystemMainInstanceService.updateAndExecute(function(){
					var list = constructionSystemMainInstanceService.getList();

					service.refresh().then(function (data) {
						newEntity = getItemById(data, newEntity.Id);
						if (newEntity) {
							service.selectCosJob(newEntity);
						}
					});

					list.filter(function (item) {
						return item.IsChecked;
					}).forEach(function (item) {
						/** @namespace newEntity.InstanceStatus */
						item.Status = newEntity.InstanceStatus;
					});
				});
			};

			var id2delete = [];

			// override framework function
			service.deleteSelection = function () {
				var item = service.getSelected();
				var dataItems = service.getList();
				var selectedIndex = dataItems.indexOf(item);

				function hasId(id) {
					return id === item.Id;
				}

				if (id2delete.find(hasId)) {
					return;
				}
				else {
					id2delete.push(item.Id);
				}

				$http.get(globals.webApiBaseUrl + 'constructionsystem/main/job/delete?id=' + item.Id).then(function (response) {
					if (response.data) {
						service.refresh().then(function () {
							var list = service.getList();
							if (list.length) {
								selectedIndex = selectedIndex - 1;
								service.setSelected(list[selectedIndex < 0 ? 0 : selectedIndex]);
							}
						});
					}
				}).finally(function () {
					_.remove(id2delete, hasId);
				});
			};

			service.stopItem = function () {
				var item = service.getSelected();
				$http.get(globals.webApiBaseUrl + 'constructionsystem/main/job/abort?id=' + item.Id);
			};

			service.canStopItem = function () {
				return service.getSelected() === null || service.getSelected() === undefined;
			};

			service.cancelItem = function () {
				var item = service.getSelected();
				$http.get(globals.webApiBaseUrl + 'constructionsystem/main/job/cancel?id=' + item.Id);
			};

			service.disableCancelItem = function () {
				return service.getSelected() === null || service.getSelected() === undefined;
			};

			service.loadJobs = function() {
				var insHeaderId = constructionSystemMainInstanceService.getCurrentInstanceHeaderId();

				if (insHeaderId === null || insHeaderId === undefined) {
					service.clear();
				}
				else {
					service.refresh();
				}
			};

			service.deleteAll = function() {
				var insHeaderId = constructionSystemMainInstanceService.getCurrentInstanceHeaderId();

				$http.get(globals.webApiBaseUrl + 'constructionsystem/main/job/deleteall?insHeaderId=' + insHeaderId)
					.then(function () {
						service.refresh();
					});
			};

			service.getScriptJobLog = function(selectItemId) {
				return $http.get(globals.webApiBaseUrl + 'constructionsystem/main/job/scriptlog?id=' + selectItemId);
			};

			service.disableDeleteAll = function() {
				return !service.getList().length;
			};

			function getItemById(collection, id) {
				return _.find(collection, function (item) {
					return item.Id === id;
				});
			}

			service.onScriptResultUpdated = new PlatformMessenger();

			service.registerSelectionChanged(function() {
				service.onScriptResultUpdated.fire();
			});

			var timeoutPromise = null;
			var refCount = 0;

			service.queryStatus = function () {
				refCount++;

				if (refCount === 1) {
					doQueryStatus();
				}

				return function () {
					refCount--;

					if (refCount === 0) {
						if (timeoutPromise) {
							$timeout.cancel(timeoutPromise);
						}
					}
				};
			};

			service.getSelectedProjectId = function () {
				var projectId = cloudDesktopSidebarService.filterRequest.projectContextId;
				if (projectId === null) {
					return -1;
				}
				else {
					return projectId;
				}
			};

			service.onSelectedJobCompleted = new PlatformMessenger();

			function doQueryStatus() {
				var dataList = service.getList(), selected = service.getSelected();
				var runningJobs = service.getList().filter(function (item) {
					return (item.JobState < constructionSystemMainJobState.finished) || (item.JobState === constructionSystemMainJobState.canceling);
				});

				if (runningJobs.length === 0) {
					timeoutPromise = $timeout(doQueryStatus, 3000);
					return;
				}

				var insHeaderId = constructionSystemMainInstanceService.getCurrentInstanceHeaderId();
				var runningJobIds = runningJobs.map(function (item) {
					return item.Id;
				});

				$http.post(globals.webApiBaseUrl + 'constructionsystem/main/job/querystatus', {
					InsHeaderId: insHeaderId,
					CosJobIds: runningJobIds
				}).then(function (response) {
					var data = response.data.CosJobs;
					var modified = false;

					data.forEach(function (item) {
						var gridItem = _.find(dataList, {Id: item.Id});
						if(item.StartTime){
							item.StartTime=moment.utc(item.StartTime);
						}
						if(item.EndTime){
							item.EndTime=moment.utc(item.EndTime);
						}
						if (gridItem) {
							if (gridItem.JobState !== item.JobState) {
								modified = true;
								gridItem.JobState = item.JobState;
								selected = service.getSelected();
								if (selected && selected === gridItem &&
									(gridItem.JobState > constructionSystemMainJobState.running &&
									gridItem.JobState !== constructionSystemMainJobState.canceling)) {
									service.onSelectedJobCompleted.fire();
								}
							}
							if (gridItem.StartTime !== item.StartTime) {
								modified = true;
								gridItem.StartTime = item.StartTime;
							}
							if (gridItem.EndTime !== item.EndTime) {
								modified = true;
								gridItem.EndTime = item.EndTime;
							}
							if (gridItem.ProgressMessage !== item.ProgressMessage) {
								modified = true;
								gridItem.ProgressMessage = item.ProgressMessage;
							}
						}
						else {
							// new job
							var outputService = $injector.get('constructionSystemMainOutputDataService');

							modified = true;
							dataList.splice(0, 0, item);

							if (!outputService.isFilterByCalculation) {
								service.setSelected(item);
							}
						}
					});

					if (modified) {
						service.gridRefresh();
					}

					// #93473 - update cos instance version
					if (angular.isArray(response.data.Instances)) {
						var cosInstanceList = constructionSystemMainInstanceService.getList();
						response.data.Instances.forEach(function (item) {
							var target = _.find(cosInstanceList, {
								InstanceHeaderFk: item.InstanceHeaderFk,
								Id: item.Id
							});
							if (target) {
								target.Version = item.Version;
							}
						});
					}

					constructionSystemMainInstanceProgressService.refresh(response.data.CosInstances);

					// #104909 - cos instance's status is not updated
					if(angular.isArray(response.data.CosInstances)){
						response.data.CosInstances.forEach(function (item) {
							var isStateChanged = false;
							var target = _.find(cosInstanceList, {
								InstanceHeaderFk: item.InstanceHeaderFk,
								Id: item.CosInstanceFk
							});

							if (target) {
								if (target.Status !== item.JobState) {
									target.Status = item.JobState;
									isStateChanged = true;
								}

								if (isStateChanged) {
									if (item.JobState === constructionSystemMainInstanceState.evaluated) {
										service.onEvaluationDone.fire({
											instance: target
										});
									}
									else if (item.JobState === constructionSystemMainInstanceState.calculated) {
										service.onCalculationDone.fire({
											instance: target
										});
									}
									else if (item.JobState === constructionSystemMainInstanceState.objectAssigned ||
										item.JobState === constructionSystemMainInstanceState.objectAssignFailed ||
										item.JobState === constructionSystemMainInstanceState.objectUnassigned) {
										service.onAssignObjectDone.fire({
											instance: target
										});
									}
								}
							}
						});
					}

					timeoutPromise = $timeout(doQueryStatus, 3000);
				});
			}
			var debounceOnInstanceChanged = _.debounce(onInstanceChanged, 200);
			function onInstanceChanged() {
				var cosInstance = constructionSystemMainInstanceService.getSelected();

				if (!cosInstance) {
					return;
				}

				var outputService = $injector.get('constructionSystemMainOutputDataService');
				var isCalculation = outputService.isFilterByCalculation;
				var url = globals.webApiBaseUrl + 'constructionsystem/main/job/latestcosjob?insHeaderId=' + cosInstance.InstanceHeaderFk + '&instanceId=' + cosInstance.Id + '&isCalculation='+isCalculation;

				$http.get(url).then(function (response) {
					var cosJob = response.data;
					var toBeSelected = service.getSelected();

					if (cosJob) {
						var list = service.getList();

						toBeSelected = _.find(list, {Id: cosJob.Id});

						if (toBeSelected) {
							service.setSelected(toBeSelected);
						}
						else {
							service.setSelected(cosJob);
						}
					}

					service.onScriptResultUpdated.fire();
				});
			}

			cloudDesktopPinningContextService.onSetPinningContext.register(service.loadJobs);
			cloudDesktopPinningContextService.onClearPinningContext.register(service.loadJobs);
			constructionSystemMainInstanceService.registerSelectionChanged(debounceOnInstanceChanged);

			return service;
		}
	]);
})(angular);