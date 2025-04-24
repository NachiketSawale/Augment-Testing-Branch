
(function (angular) {
	'use strict';
	var myModule = angular.module('basics.config');

	/**
	 * @ngdoc service
	 * @name basicsConfigModuleColumnInformationDataService
	 * @description pprovides methods, create and update DataConfiguration entities
	 */
	myModule.service('basicsConfigModuleColumnInformationDataService', BasicsConfigModuleColumnInformationDataService);

	BasicsConfigModuleColumnInformationDataService.$inject = ['platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension', 'PlatformMessenger',
		'basicsCommonMandatoryProcessor', 'basicsCostGroupAssignmentService', 'basicsConfigModuleTableInformationDataService'];

	function BasicsConfigModuleColumnInformationDataService(platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, PlatformMessenger,
	  basicsCommonMandatoryProcessor, basicsCostGroupAssignmentService, basicsConfigModuleTableInformationDataService) {
		var self = this;
		var basicsConfigModuleColumnInformationDataServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'basicsConfigModuleColumnInformationDataService',
				entityNameTranslationID: 'basics.config.configDataConfigurationEntity',
				httpCreate: {route: globals.webApiBaseUrl + 'basics/config/modulecolumninfo/', endCreate: 'create'},
				httpRead: {
					route: globals.webApiBaseUrl + 'basics/config/modulecolumninfo/',
					endRead: 'listbyparent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						var selected = basicsConfigModuleTableInformationDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: true, create: 'flat'},
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							var selected = basicsConfigModuleTableInformationDataService.getSelected();
							creationData.PKey1 = selected.Id;
							creationData.PKey2 = selected.ModuleFk;
						}
					}
				},
				entityRole: {
					leaf: {itemName: 'ColumnInformation', parentService: basicsConfigModuleTableInformationDataService, doesRequireLoadAlways: true}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(basicsConfigModuleColumnInformationDataServiceOption, self);
		serviceContainer.data.Initialised = true;

		serviceContainer.service.storeChangedColumnInfo = function storeChangedColumnInfo(colInfo) {
			if(!_.find(serviceContainer.data.itemList, function(item) {
				return item.Id === colInfo.Id;
			})) {
				serviceContainer.data.itemList.push(colInfo);
			}

			serviceContainer.service.markItemAsModified(colInfo);
		};
	}
})(angular);
