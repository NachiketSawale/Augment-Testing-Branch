/*
 * Created by alm on 01.25.2021.
 */


(function (angular) {
	/* global globals, moment, _ */

	'use strict';
	var moduleName = 'hsqe.checklist';

	/**
     * @ngdoc service
     * @name hsqeCheckListActivityDataService
     * @function
     *
     * @description
     * Provides some information on all containers in the module.
     */
	angular.module(moduleName).factory('hsqeCheckListActivityDataService', ['$injector', '$translate','platformDataServiceFactory', 'basicsLookupdataLookupDescriptorService', 'cloudDesktopSidebarService','hsqeCheckListDataService','hsqeCheckListActivityReadonlyProcessor','basicsCommonMandatoryProcessor',
		function ($injector, $translate, dataServiceFactory, lookupDescriptorService, cloudDesktopSidebarService, parentService,readonlyProcessor,basicsCommonMandatoryProcessor) {

			var service;
			var factoryOptions = {
				flatLeafItem: {
					module: moduleName,
					serviceName: 'hsqeCheckListActivityDataService',
					httpRead: {
						route: globals.webApiBaseUrl + 'hsqe/checklist/activity/',
						endRead: 'listbyfilter',
						initReadData: function (readData) {
							var mainItem = parentService.getSelected();
							readData.filter = '?mainItemId=' + mainItem.Id;
						}
					},
					httpCreate: { route: globals.webApiBaseUrl + 'hsqe/checklist/activity/', endCreate: 'create'},
					httpUpdate: {route: globals.webApiBaseUrl + 'hsqe/checklist/activity/', endUpdate: 'update'},
					httpDelete: {route: globals.webApiBaseUrl + 'hsqe/checklist/activity/', endDelete: 'delete'},
					entityRole: {
						leaf: {itemName: 'Activity', parentService: parentService}
					},
					dataProcessor:[readonlyProcessor],
					presenter: {
						list: {
							incorporateDataRead: function onReadSucceeded(readData, data) {
								var schedulingActivities = readData.SchedulingActivity || [];
								_.forEach(schedulingActivities, function (item) {
									item.PlannedStart = moment.utc(item.PlannedStart);
									item.PlannedFinish = moment.utc(item.PlannedFinish);
									item.ActualStart = moment.utc(item.ActualStart);
									item.ActualFinish = moment.utc(item.ActualFinish);
								});
								lookupDescriptorService.attachData(readData);
								var result = {
									FilterResult: readData.FilterResult,
									dtos: readData.Main || []
								};
								return serviceContainer.data.handleReadSucceeded(result, data);
							},
							initCreationData: function initCreationData(creationData) {
								var selected = parentService.getSelected();
								creationData.Id = selected.Id;
							}
						}
					},
					actions: {
						delete: {},
						create: 'flat',
						canCreateCallBackFunc: function () {
							return parentService.getHeaderEditAble();
						},
						canDeleteCallBackFunc: function () {
							return parentService.getHeaderEditAble();
						}
					}
				}
			};

			var serviceContainer = dataServiceFactory.createNewComplete(factoryOptions);
			service = serviceContainer.service;
			serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
				typeName: 'HsqCheckList2ActivityDto',
				moduleSubModule: 'Hsqe.CheckList',
				validationService: 'hsqeCheckListActivityValidationService',
				mustValidateFields: ['PsdScheduleFk', 'PsdScheduleFk']
			});
			return service;
		}
	]);
})(angular);
