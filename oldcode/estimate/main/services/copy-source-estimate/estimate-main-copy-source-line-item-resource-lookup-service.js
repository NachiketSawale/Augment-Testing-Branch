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
	 * @name estimateMainCopySourceLineItemResourceLookupService
	 * @function
	 * @description
	 * estimateMainCopySourceLineItemResourceLookupService is the data service for copy source estimate line item resource related functionality.
	 */

	estimateMainModule.service('estimateMainCopySourceLineItemResourceLookupService',
		['_',
			'$injector',
			'globals',
			'platformDataServiceFactory',
			'estimateMainCopySourceLineItemLookupService',
			'estimateMainResourceImageProcessor',
			'ServiceDataProcessArraysExtension',
			'platformPermissionService',
			'permissions',
			'estimateMainCopySourceProcessService',

			function (_, $injector,
				globals,
				platformDataServiceFactory,
				estimateMainCopySourceLineItemLookupService,
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
								let selectedItem = estimateMainCopySourceLineItemLookupService.getSelected();
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
									// load user defined column value
									let estimateMainResourceDynamicUserDefinedColumnService = $injector.get('estimateMainResourceDynamicUserDefinedColumnService');
									if(readData && readData.dynamicColumns && _.isArray(readData.dynamicColumns.ResoruceUDPs) && readData.dynamicColumns.ResoruceUDPs.length > 0){
										estimateMainResourceDynamicUserDefinedColumnService.attachUpdatedValueToColumn(readData.dtos, readData.dynamicColumns.ResoruceUDPs, false);
									}
									return data.handleReadSucceeded(readData.dtos, data);
								}
							}
						},

						dataProcessor: [new ServiceDataProcessArraysExtension(['EstResources']), estimateMainResourceImageProcessor, estimateMainCopySourceProcessService],
						entityRole: { node: { codeField: 'Code', itemName: 'CopySourceEstResource', moduleName: 'estimate.main.moduleDisplayNameEstimate',  parentService: estimateMainCopySourceLineItemLookupService}}
					}
				};

				let serviceContainer = platformDataServiceFactory.createNewComplete(estimateMainCopySourceLineItemResourceServiceOption);

				let service = serviceContainer.service;

				serviceContainer.data.containerUUID = serviceContainer.data.gridId = service.gridId = 'c705f90e96b3472c982488b686c0e30b';

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
