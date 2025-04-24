/**
 *
 */
/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {


	'use strict';

	let moduleName = 'estimate.main';
	let estimateMainModule = angular.module(moduleName);
	/**
	 * @ngdoc service
	 * @name estimateMainCopySourceAssembliesResourceLookupService
	 * @function
	 * @description
	 * estimateMainResourceService is the data service for estimate line item resource related functionality.
	 */

	estimateMainModule.service('estimateMainCopySourceAssembliesResourceLookupService',
		['_',
			'globals',
			'platformDataServiceFactory',
			'estimateMainCopySourceAssembliesLookupService',
			'estimateMainResourceImageProcessor',
			'ServiceDataProcessArraysExtension',
			'platformPermissionService',
			'permissions',
			'estimateMainCopySourceProcessService',

			function (_,
				globals,
				platformDataServiceFactory,
				estimateMainCopySourceAssembliesLookupService,
				estimateMainResourceImageProcessor,
				ServiceDataProcessArraysExtension,
				platformPermissionService,
				permissions,
				estimateMainCopySourceProcessService)
			{
				let canResource = function canResource() {
					return false;
				};

				let estimateMainCopySourceLineItemResourceServiceOption = {
					hierarchicalNodeItem: {
						module: estimateMainModule,
						serviceName: 'estimateMainCopySourceLineItemResourceLookupService',
						entityNameTranslationID: 'estimate.main.copySourceLineItemResourceContainer',
						httpRead: {
							route: globals.webApiBaseUrl + 'estimate/main/resource/',
							endRead: 'tree',
							initReadData: function initReadData(readData) {
								let selectedItem = estimateMainCopySourceAssembliesLookupService.getSelected();
								readData.estHeaderFk = selectedItem.EstHeaderFk;
								readData.estLineItemFk = selectedItem.Id;
							},
							usePostForRead: true
						},
						actions: { create: 'hierarchical', canCreateCallBackFunc: canResource, canCreateChildCallBackFunc: canResource, delete: false,
							canDeleteCallBackFunc: function () {
								return false;
							}
						},
						entitySelection: {},
						setCellFocus:true,
						presenter: {
							tree: {
								parentProp: 'EstResourceFk', childProp: 'EstResources', childSort : true, isDynamicModified : true,
								incorporateDataRead: function incorporateDataRead(readData, data) {
									return data.handleReadSucceeded(readData.dtos, data);
								}
							}
						},

						dataProcessor: [new ServiceDataProcessArraysExtension(['EstResources']), estimateMainResourceImageProcessor, estimateMainCopySourceProcessService],
						entityRole: { node: { codeField: 'Code', itemName: 'CopySourceAssembliesResource', moduleName: 'cloud.desktop.moduleDisplayNameEstimate',  parentService: estimateMainCopySourceAssembliesLookupService}}
					}
				};

				let serviceContainer = platformDataServiceFactory.createNewComplete(estimateMainCopySourceLineItemResourceServiceOption);

				let service = serviceContainer.service;

				serviceContainer.data.containerUUID = serviceContainer.data.gridId = service.gridId = 'fb896283b3da4de0853f5ef2721a4870';

				service.sortTree = function sortTree(items) {
					serviceContainer.data.sortByColumn(items);
				};

				service.clearLookupData = function () {
					serviceContainer.data.itemList = [];
					serviceContainer.data.itemTree = [];
					serviceContainer.data.listLoaded.fire();
				};

				return service;

			}]);
})(angular);
