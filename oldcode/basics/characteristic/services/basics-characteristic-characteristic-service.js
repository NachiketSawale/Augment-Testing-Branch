(function (angular) {
	'use strict';
	var moduleName = 'basics.characteristic';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('basicsCharacteristicCharacteristicService', ['basicsCharacteristicMainService', 'platformDataServiceFactory', 'basicsLookupdataLookupDescriptorService', 'basicsLookupdataLookupFilterService', 'basicsLookupdataLookupDataService', 'cloudDesktopSidebarService', 'basicsCharacteristicTypeHelperService', 'ServiceDataProcessDatesExtension','PlatformMessenger', 'BasicsCharacteristicCharacteristicValidationProcessService',
		function (basicsCharacteristicMainService, platformDataServiceFactory, basicsLookupdataLookupDescriptorService, basicsLookupdataLookupFilterService, basicsLookupdataLookupDataService, cloudDesktopSidebarService, basicsCharacteristicTypeHelperService, ServiceDataProcessDatesExtension,PlatformMessenger, BasicsCharacteristicCharacteristicValidationProcessService) {
			var serviceContainer = null;
			var serviceOption = {
				flatNodeItem: {
					module: angular.module(moduleName),
					serviceName: 'basicsCharacteristicCharacteristicService',
					entityNameTranslationID: 'basics.characteristic.defaultContainerTitle',
					httpCreate: { route: globals.webApiBaseUrl + 'basics/characteristic/characteristic/' },
					httpRead: {
						route: globals.webApiBaseUrl + 'basics/characteristic/characteristic/',
						endRead: 'list'
					},
					actions: {
						delete: true,
						create: 'flat'
					},
					entityRole: {
						node: {
							itemName: 'Characteristic',
							parentService: basicsCharacteristicMainService
						}
					},
					presenter: {
						list: {
							initCreationData: function initCreationData(creationData) {
								creationData.GroupId = basicsCharacteristicMainService.getIfSelectedIdElse();//else is undefined
							},
							incorporateDataRead: function incorporateDataRead(readItems, data) {
								basicsLookupdataLookupDescriptorService.attachData(readItems);

								return serviceContainer.data.handleReadSucceeded(readItems.Main, data);
							}
						}
					},
					entitySelection: {},
					translation: {
						uid: 'A5301351-E78F-4DC1-9D5F-D8964F8E6930',
						title: 'basics.characteristic.title.characteristics',
						columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}],
						dtoScheme: { typeName: 'CharacteristicDto', moduleSubModule: 'Basics.Characteristic' }
					},
					dataProcessor: [new ServiceDataProcessDatesExtension(['ValidFrom', 'ValidTo']),{processItem:function(item){
						if(item.CharacteristicTypeFk === 1){
							item.DefaultValue = item.DefaultValue && item.DefaultValue.toLocaleLowerCase() === 'true'; // follow the backend logic.
						}
						else if (item.CharacteristicTypeFk === 3) {
							item.DefaultValue = item.DefaultValue ? Number.parseInt(item.DefaultValue) : null;
						}else{
							item.DefaultValue = basicsCharacteristicTypeHelperService.convertValue(item.DefaultValue, item.CharacteristicTypeFk);
						}
					}}]
				}
			};
			serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);
			serviceContainer.data.newEntityValidator = BasicsCharacteristicCharacteristicValidationProcessService;
			var service = serviceContainer.service;
			service.defaultValueChanged = new PlatformMessenger();
			service.characteristicTypeChanged = new PlatformMessenger();

			//When characteristic type change, give the default value for the corresponding type.
			//When the type is lookup, we will delete the corresponding default value data after switching the type.
			service.characteristicTypeModified = function characteristicTypeChanged(currentEntity) {
				switch (currentEntity.CharacteristicTypeFk) {
					case 1:
						currentEntity.DefaultValue = false;
						break;
					case 3:
						currentEntity.DefaultValue = 0;
						break;
					case 4:
						currentEntity.DefaultValue = '1.00';
						break;
					case 5:
						currentEntity.DefaultValue = '1.00';
						break;
					case 6:
						currentEntity.DefaultValue = '1.000';
						break;
					case 7:
					case 8:
						currentEntity.DefaultValue = '@Today';
						break;
					default:
						currentEntity.DefaultValue = null;
						break;
				}
				service.markItemAsModified(currentEntity);
				service.characteristicTypeChanged.fire(null, currentEntity);
				service.gridRefresh();
			};
			basicsLookupdataLookupDescriptorService.updateData('CharacteristicDate', basicsCharacteristicTypeHelperService.dateList);
			return service;
		}
	]);
})(angular);