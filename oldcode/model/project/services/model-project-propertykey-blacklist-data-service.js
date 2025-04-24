/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';
	var myModule = angular.module('model.project');

	/**
	 * @ngdoc service
	 * @name modelProjectPropertyKeyBlackListDataService
	 * @description Provides methods to access, create and update the project-specific property key comparison
	 *              blacklist.
	 */
	myModule.service('modelProjectPropertyKeyBlackListDataService', ModelProjectPropertyKeyBlackListDataService);

	ModelProjectPropertyKeyBlackListDataService.$inject = ['platformDataServiceFactory', 'projectMainService'];

	function ModelProjectPropertyKeyBlackListDataService(platformDataServiceFactory, projectMainService) {
		var self = this;
		var serviceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'modelProjectPropertyKeyBlackListDataService',
				entityNameTranslationID: 'model.project.blackList',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'model/project/blacklist/',
					endRead: 'list',
					usePostForRead: false,
					initReadData: function initReadData(readData) {
						var selectedProject = projectMainService.getSelected();
						readData.filter = '?projectFk=' + (selectedProject ? selectedProject.Id : '0');
					}
				},
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							//Get the current Selected Project Id
							var selectedProjectId = projectMainService.getSelected().Id;
							if (selectedProjectId) {
								creationData.PKey1 = selectedProjectId;
							}
						}
					}
				},
				actions: {
					delete: true,
					create: 'flat'
				},
				entityRole: {
					leaf: {
						itemName: 'ModelComparePropertykeyBlackList',
						parentService: projectMainService
					}
				}
			}
		};
		var serviceContainer = platformDataServiceFactory.createService(serviceOption, self);
		serviceContainer.data.Initialised = true;
	}
})(angular);
