/**
 * Created by wui on 10/15/2018.
 */

(function (angular) {
	'use strict';
	/* global globals */
	var moduleName = 'basics.material';

	angular.module(moduleName).factory('basicsMaterialScopeDataService', [
		'platformDataServiceFactory',
		'basicsMaterialRecordService',
		'basicsMaterialScopeUtilityService',
		'PlatformMessenger',
		'basicsCommonReadOnlyProcessor',
		function (platformDataServiceFactory,
			basicsMaterialRecordService,
			basicsMaterialScopeUtilityService,
			PlatformMessenger,
			basicsCommonReadOnlyProcessor) {
			var service = null;
			var serviceOption = {
				flatNodeItem: {
					module: angular.module(moduleName),
					serviceName: 'basicsMaterialScopeDataService',
					httpRead: {
						route: globals.webApiBaseUrl + 'basics/material/scope/',
					},
					httpCreate: {
						route: globals.webApiBaseUrl + 'basics/material/scope/',
						endCreate: 'createnew'
					},
					presenter: {
						list: {
							initCreationData: function initCreationData (creationData) {
								var material = basicsMaterialRecordService.getSelected();
								creationData.Id = { Id: material.Id };
								creationData.MaxNo = basicsMaterialScopeUtilityService.getMaxInt(service.getList(), 'MatScope');
							},
							handleCreateSucceeded: function (newData) {
								var list = service.getList();
								if (list.every(function (item) {
									return item.IsSelected === false;
								})) {
									newData.IsSelected = true;
								}
								return newData;
							}
						}
					},
					entityRole: {
						node: {
							itemName: 'MaterialScope',
							parentService: basicsMaterialRecordService
						}
					},
					translation: {
						uid: 'basicsMaterialScopeDataService',
						title: 'basics.material.scope.listTitle',
						columns: [
							{
								header: 'cloud.common.entityDescription',
								field: 'DescriptionInfo'
							}
						],
						dtoScheme: { typeName: 'MaterialScopeDto', moduleSubModule: 'Basics.Material' }
					},
					dataProcessor: [{processItem: readonlyProcessItem}],
					actions: {
						delete: {},
						create: 'flat',
						canCreateCallBackFunc: function () {
							return !basicsMaterialRecordService.isReadonlyMaterial();
						},
						canDeleteCallBackFunc: function () {
							return !basicsMaterialRecordService.isReadonlyMaterial();
						}
					}
				}
			};
			var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);
			service = serviceContainer.service;

			service.isSelectedChanged = new PlatformMessenger();

			var readonlyProcessorService = basicsCommonReadOnlyProcessor.createReadOnlyProcessor({
				uiStandardService: 'basicsMaterialScopeUIStandardService',
				readOnlyFields: []
			});
			function readonlyProcessItem(item) {
				if (!item) {
					return;
				}
				if (basicsMaterialRecordService.isReadonlyMaterial()) {
					readonlyProcessorService.setRowReadonlyFromLayout(item, true);
				}
			}

			return service;
		}
	]);

})(angular);