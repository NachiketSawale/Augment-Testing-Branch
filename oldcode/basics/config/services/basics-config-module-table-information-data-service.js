
(function (angular) {
	'use strict';
	/* global globals */
	let myModule = angular.module('basics.config');

	/**
	 * @ngdoc service
	 * @name basicsConfigModuleTableInformationDataService
	 * @description pprovides methods, create and update DataConfiguration entities
	 */
	myModule.service('basicsConfigModuleTableInformationDataService', BasicsConfigModuleTableInformationDataService);

	BasicsConfigModuleTableInformationDataService.$inject = ['_', 'globals', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'PlatformMessenger', 'basicsCommonMandatoryProcessor', 'basicsCostGroupAssignmentService', 'basicsConfigMainService',
		'basicsConfigModuleTableInformationReadonlyProcessor', 'basicsConfigConfigurableTableDataService'];

	function BasicsConfigModuleTableInformationDataService(_, globals, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
		PlatformMessenger, basicsCommonMandatoryProcessor, basicsCostGroupAssignmentService, basicsConfigMainService,
		basicsConfigModuleTableInformationReadonlyProcessor, basicsConfigConfigurableTableDataService) {
		let self = this;
		let basicsConfigModuleTableInformationDataServiceOption = {
			flatNodeItem: {
				module: myModule,
				serviceName: 'basicsConfigModuleTableInformationDataService',
				entityNameTranslationID: 'basics.config.configDataConfigurationEntity',
				httpCreate: {route: globals.webApiBaseUrl + 'basics/config/moduletableinfo/', endCreate: 'create'},
				httpRead: {
					route: globals.webApiBaseUrl + 'basics/config/moduletableinfo/',
					endRead: 'listbyparent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						let selected = basicsConfigMainService.getSelected();

						let containerSpec=  {
								IdentificationData: {
									PKey1: selected.Id
								},
								InternalName: basicsConfigMainService.getSelected().InternalName
							};
						_.assign(readData,containerSpec);
					}
				},
				dataProcessor: [basicsConfigModuleTableInformationReadonlyProcessor],
				actions: {delete: true, create: 'flat'},
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							let selected = basicsConfigMainService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
				entityRole: {
					node: {itemName: 'TableInformation', parentService: basicsConfigMainService}
				}
			}
		};

		let serviceContainer = platformDataServiceFactory.createService(basicsConfigModuleTableInformationDataServiceOption, self);
		serviceContainer.data.Initialised = true;

		this.canCreate = function canCreate() {
			return basicsConfigConfigurableTableDataService.getList().length > 0;
		};
	}
})(angular);
