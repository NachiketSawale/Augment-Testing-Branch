/**
 * Created by aljami on 18.03.2022
 */
(function () {
	'use strict';
	const servicesSchedulerUIModule = angular.module('services.schedulerui');

	/**
	 * @ngdoc service
	 * @name servicesSchedulerUIChildJobDataService
	 * @function
	 *
	 * @description
	 * servicesSchedulerUIChildJobDataService is a data service for managing ui for scheduler.
	 */
	servicesSchedulerUIModule.factory('servicesSchedulerUIChildJobDataService', ['$rootScope', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension', '$q', '$http', 'basicsLookupdataLookupDescriptorService', 'basicsLookupdataLookupDescriptorService', 'globals', 'cloudDesktopSidebarService', 'basicsLookupdataLookupFilterService', 'ServiceDataProcessArraysExtension', 'servicesSchedulerUIChildJobModifyProcessor', 'servicesSchedulerUIJobDataService',

		function ($rootScope, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, $q, $http, descriptorService, basicsLookupdataLookupDescriptorService, globals, cloudDesktopSidebarService, basicsLookupdataLookupFilterService, ServiceDataProcessArraysExtension, servicesSchedulerUIChildJobModifyProcessor, servicesSchedulerUIJobDataService) {

			const jobDataServiceOptions = {
				flatLeafItem: {
					module: servicesSchedulerUIModule,
					serviceName: 'servicesSchedulerUIChildJobDataService',
					entityNameTranslationID: 'services.schedulerui.jobListContainerTitle.jobEntity',
					httpRead: {
						route: globals.webApiBaseUrl + 'services/schedulerui/job/',
						usePostForRead: true,
						endRead: 'getChildren'
					},
					dataProcessor: [new ServiceDataProcessArraysExtension(['Job']), servicesSchedulerUIChildJobModifyProcessor],
					actions: {delete: true, create: false},
					modification: {},
					entityRole: {
						leaf: {
							itemName: 'Job',
							parentService: servicesSchedulerUIJobDataService
						}
					},
					presenter: {
						list: {
							initCreationData: function initCreationData(creationData) {
								creationData.SuperEntityId = servicesSchedulerUIJobDataService.getSelected().Id;
							}
						}
					}
				}
			};


			const container = platformDataServiceFactory.createNewComplete(jobDataServiceOptions);
			const service = container.service;

			container.data.initReadData = function initTranslationReadData(readData) {
				let superId = servicesSchedulerUIJobDataService.getSelected().Id;
				readData.SuperEntityId = superId;
			};



			return service;
		}
	]);
})();