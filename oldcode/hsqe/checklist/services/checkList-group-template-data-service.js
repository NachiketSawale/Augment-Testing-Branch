/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */

	'use strict';
	var moduleName = 'hsqe.checklist';

	/**
	 * @ngdoc service
	 * @name hsqeCheckListGroupTemplateDataService
	 * @function
	 *
	 * @description
	 * Provides some information on all containers in the module.
	 */
	angular.module(moduleName).factory('hsqeCheckListGroupTemplateDataService', ['$injector', '$http', '$translate','platformDataServiceFactory', 'basicsLookupdataLookupDescriptorService',
		function ($injector, $http, $translate, dataServiceFactory, lookupDescriptorService) {
			var service,serviceContainer = null;

			var onReadSucceeded = function onReadSucceeded(readData, data) {
				lookupDescriptorService.attachData(readData);
				return serviceContainer.data.handleReadSucceeded(readData, data);
			};
			var groupServiceOptions = {
				hierarchicalLeafItem: {
					module: moduleName,
					serviceName: 'hsqeCheckListGroupTemplateDataService',
					httpRead: {
						route: globals.webApiBaseUrl + 'hsqe/checklisttemplate/header/', 
						endRead:'getgrouptemplate',
					},
					httpCreate: {
						route: globals.webApiBaseUrl + 'hsqe/checklisttemplate/header/',
						usePostForRead: true,
						endCreate: 'createdto'
					},
					httpUpdate: {route: globals.webApiBaseUrl + 'hsqe/checklisttemplate/header/', endUpdate: 'update'},
					httpDelete: {
						route: globals.webApiBaseUrl + 'hsqe/checklisttemplate/header/',
						usePostForRead: true,
						endDelete: 'deletedto'
					},
					presenter: {
						tree: {
							parentProp: 'HsqCheckListGroupFk',
							childProp: 'ChildItems',
							initialState: 'expanded',
							incorporateDataRead: onReadSucceeded
						}
					},
					actions: {
						delete: false, create: false
					}
				}
			};

			serviceContainer = dataServiceFactory.createNewComplete(groupServiceOptions);
			service = serviceContainer.service;
			return service;
		}
	]);
})(angular);
