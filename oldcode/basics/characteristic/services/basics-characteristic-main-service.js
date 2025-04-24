(function () {
	'use strict';
	var moduleName = 'basics.characteristic';

	angular.module(moduleName).factory('basicsCharacteristicMainService', ['$http', 'platformDataServiceFactory', 'ServiceDataProcessArraysExtension',
		'platformCreateUuid', 'platformDeleteSelectionDialogService',
		function ($http, platformDataServiceFactory, ServiceDataProcessArraysExtension, platformCreateUuid, platformDeleteSelectionDialogService) {

			var serviceContainer = null;
			var service = null;
			const requestUrl = globals.webApiBaseUrl + 'basics/characteristic/group/';
			var serviceOption = {
				hierarchicalRootItem: {
					module: angular.module(moduleName),
					serviceName: 'basicsCharacteristicMainService',  // rei@11.12.15 moved to here
					httpRead: {
						route: requestUrl,
						usePostForRead: true,
						endRead: 'treefiltered'
					},
					httpCreate: {
						route: requestUrl,
						usePostForRead: true,
						endCreate: 'create'
					},
					httpUpdate: {
						route: requestUrl,
						usePostForRead: true,
						endUpdate: 'update'
					},
					httpDelete: {
						route: requestUrl,
						usePostForRead: true,
						endDelete: 'multidelete'
					},
					dataProcessor: [new ServiceDataProcessArraysExtension(['Groups'])],
					presenter: {
						tree: {
							parentProp: 'CharacteristicGroupFk',
							childProp: 'Groups',
							initCreationData: function initCreationData(creationData) {
								creationData.groupId = creationData.parentId;
							},
							incorporateDataRead: function incorporateDataRead(items, data) {
								var datas = {
									FilterResult: items.FilterResult,
									dtos: items.CharacteristicGroup || []
								};
								var dataRead = serviceContainer.data.handleReadSucceeded(datas, data);
								service.goToFirst();
								return dataRead;
							},
							isInitialSorted: true
						}
					},
					entityRole: {
						root: {
							itemName: 'Groups',
							moduleName: 'cloud.desktop.moduleDisplayNameCharacteristics',
							codeField: 'Id',
							descField: 'DescriptionInfo.Translated',
							addToLastObject: true,
							lastObjectModuleName: 'basics.characteristic'
						}
					},
					// actions: {
					// 	delete: {},
					// 	create: 'hierarchical',
					// 	canDeleteCallBackFunc: function () {
					// 		const group = service.getSelected();
					// 		console.log(group);
					// 		return false;
					// 	}
					// },
					entitySelection: {supportsMultiSelection: true},
					//sidebarSearch: {   // NO sidebar search - requirement from fre (#70696)
					//	options: sidebarSearchOptions
					//},
					translation: {
						uid: 'D7456544-C4D4-48F4-BC3A-BAC992C60E79',
						title: 'basics.characteristic.title.characteristicGroups',
						columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}],
						dtoScheme: { typeName: 'CharacteristicGroupDto', moduleSubModule: 'Basics.Characteristic' }
					}
				}
			};
			serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);
			service = serviceContainer.service;
			var refreshCount = 1;
			service.dataRefresh = dataRefresh;

			let deleteDialogId = platformCreateUuid();
			service.deleteEntities = function deleteEntities(entities) {
				platformDeleteSelectionDialogService.showDialog({
					dontShowAgain: true,
					id: deleteDialogId
				}).then(result => {
					if (result.ok || result.delete) {
						serviceContainer.data.deleteEntities(entities, serviceContainer.data);
					}
				});
			}

			return service;

			function dataRefresh(){
				if(refreshCount === 1){
					service.refresh();
					refreshCount ++;
				}
			}

		}]);
})();
