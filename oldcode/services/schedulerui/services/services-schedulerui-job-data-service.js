/**
 * Created by aljami on 18.03.2022
 */
(function () {
	'use strict';
	const servicesSchedulerUIModule = angular.module('services.schedulerui');

	/**
	 * @ngdoc service
	 * @name servicesSchedulerUIJobDataService
	 * @function
	 *
	 * @description
	 * servicesSchedulerUIJobDataService is a data service for managing ui for scheduler.
	 */
	servicesSchedulerUIModule.factory('servicesSchedulerUIJobDataService', ['_', '$rootScope', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension', '$q', '$http', 'basicsLookupdataLookupDescriptorService', 'cloudTranslationResourceValidationService', 'basicsLookupdataLookupDescriptorService', 'globals', 'cloudDesktopSidebarService', 'basicsLookupdataLookupFilterService', 'ServiceDataProcessArraysExtension', 'servicesSchedulerUIJobModifyProcessor', 'servicesSchedulerUIValidationProcessor', 'platformGridAPI', 'platformDialogService',

		function (_, $rootScope, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, $q, $http, descriptorService, resourceValidationService, basicsLookupdataLookupDescriptorService, globals, cloudDesktopSidebarService, basicsLookupdataLookupFilterService, ServiceDataProcessArraysExtension, servicesSchedulerUIJobModifyProcessor, servicesSchedulerUIValidationProcessor, platformGridAPI, platformDialogService) {

			const jobDataServiceOptions = {
				flatRootItem: {
					module: servicesSchedulerUIModule,
					serviceName: 'servicesSchedulerUIJobDataService',
					entityNameTranslationID: 'services.schedulerui.jobEntity',
					httpCreate: { route: globals.webApiBaseUrl + 'services/schedulerui/job/', endCreate: 'create' },
					httpUpdate: { route: globals.webApiBaseUrl + 'services/schedulerui/job/'},
					httpDelete: { route: globals.webApiBaseUrl + 'services/schedulerui/job/' },
					httpRead: {
						route: globals.webApiBaseUrl + 'services/schedulerui/job/',
						usePostForRead: true,
						endRead: 'listFiltered'
					},
					dataProcessor: [new ServiceDataProcessArraysExtension(['Job']), servicesSchedulerUIJobModifyProcessor],
					actions: {delete: false, create: 'flat'},
					modification: {multi: true},
					entityRole: {
						root: {
							itemName: 'Job',
							moduleName: 'cloud.desktop.moduleDisplayNameSchedulerUI',
							mainItemName: 'Job',
							handleUpdateDone: function (jobData, response, data) {
								if (response.Version > 0) {
									const item = _.find(data.itemList, function (item) {
										return item.Id === response.Id;
									});
									if (item) {
										item.Version = response.Version;
										item.ParameterList = response.ParameterList;
									}
								}
								platformGridAPI.grids.refresh('ec4d55d3ebd94dcf941e536de78aff3c');
							},
							useIdentification: true
						}
					},
					presenter: {
						list: {
							incorporateDataRead: function (itemList, data) {
								const jobs = itemList.dtos;
								const obj = {};
								_.forEach(jobs, function (item) {
									obj.actionList = [];
									item.Log = obj;
								});
								updateFilter(itemList);
								return container.data.handleReadSucceeded(jobs, data);
							}
						}
					},
					sidebarSearch: {
						options: {
							moduleName: 'services.schedulerui',
							enhancedSearchEnabled: true,
							enhancedSearchVersion: '2.0',
							orderBy: [{Field: 'Id'}],
							pattern: '',
							pageSize: 100,
							useCurrentClient: false,
							showOptions: false,
							showProjectContext: false,
							withExecutionHints: false
						}
					}
				}
			};


			const container = platformDataServiceFactory.createNewComplete(jobDataServiceOptions);
			container.data.newEntityValidator = servicesSchedulerUIValidationProcessor;
			const service = container.service;

			const taskParameterMap = new Map();
			const taskMap = new Map();

			function mapTasks(tasks) {
				_.each(tasks, function (task) {
					taskMap.set(task.Id, task);
					let i = 0;
					_.each(task.ParameterList, function (parameter) {
						parameter.Id = i++;
					});
					taskParameterMap.set(task.Id, task.ParameterList);
				});
			}

			function updateFilter(itemList) {
				const filterRequest = cloudDesktopSidebarService.getFilterRequestParams();
				cloudDesktopSidebarService.updateFilterResult({
					isPending: false,
					filterRequest: filterRequest,
					filterResult: itemList.FilterResult
				});
			}

			const filters = [{
				key: 'services-schedulerui-taskTypeFilterByUICreate',
				fn: function (task) {
					return task.UiCreate === true;
				}
			}, {
				key: 'services-schedulerui-taskTypeFilterByUIDelete',
				fn: function (task) {
					return task.UiDelete === true;
				}
			}];

			basicsLookupdataLookupFilterService.registerFilter(filters);

			service.canDelete = function () {
				const selected = service.getSelected();
				if (selected && selected.Version !== 0) {
					const task = service.getTask(selected.TaskType);
					const clonedTask = _.cloneDeep(task);
					return clonedTask && clonedTask.UiDelete;
				} else {
					return !!selected;
				}
			};

			service.getAllTasks = function () {
				return $http({
					method: 'GET',
					url: globals.webApiBaseUrl + 'services/schedulerui/job/alltasks'
				}).then(function (response) {
					mapTasks(response.data);
					return response.data;
				});
			};

			service.stopJob = function () {
				const selected = service.getSelected();
				return $http({
					method: 'Post',
					url: globals.webApiBaseUrl + 'services/scheduler/job/stopjob',
					params: {jobId: selected.Id}
				}).then(function (response) {
					return response.data;
				});
			};

			service.getTask = function (taskTypeId) {
				return taskMap.get(taskTypeId);
			};

			service.getTaskParam = function (taskTypeId) {
				return taskParameterMap.get(taskTypeId);
			};


			service.showParentChildJobs = function (childJobList){
				let itemsToDisplay = [service.getSelected()];
				itemsToDisplay.push(...childJobList);
				service.setList(itemsToDisplay);
				container.data.doClearModifications(null, container.data);
			};

			service.deleteJobs = function (deletableJobs){
				platformDialogService.showYesNoDialog('services.schedulerui.deleteConfirm', 'services.schedulerui.deleteConfirmTitle', 'no').then(function (result) {
					if (result.yes) {
						$http.post(globals.webApiBaseUrl + 'services/schedulerui/job/deleteMultiple', deletableJobs).then(function (res){
							service.refresh();
						});
					}
				});

			};

			return service;
		}
	]);
})();