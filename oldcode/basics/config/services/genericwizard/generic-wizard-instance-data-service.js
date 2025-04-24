/**
 * Created by baf on 03.05.2016
 */
(function () {
	'use strict';
	var basicsConfigModule = angular.module('basics.config');

	/**
	 * @ngdoc service
	 * @name basicsConfigGenWizardInstanceDataService
	 * @function
	 *
	 * @description
	 * basicsConfigGenWizardInstanceDataService is a data service for managing generic wizard instances
	 */
	basicsConfigModule.factory('basicsConfigGenWizardInstanceDataService', ['basicsConfigWizardXGroupService', 'platformDataServiceFactory',
		'platformDataServiceProcessDatesBySchemeExtension', 'basicsConfigMainService', 'platformDataServiceActionExtension',
		'basicsConfigGenericWizardDataProcessorFactoryService', 'genericWizardUseCaseConfigService', 'platformRuntimeDataService', 'platformVanillaDataProtectorService',

		function (basicsConfigWizardXGroupService, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
		          basicsConfigMainService, platformDataServiceActionExtension, basicsConfigGenericWizardDataProcessorFactoryService,
		          genericWizardUseCaseConfigService, platformRuntimeDataService, platformVanillaDataProtectorService) {

			var genWizardInstanceDataServiceOption = {
				flatNodeItem: {
					module: basicsConfigModule,
					serviceName: 'basicsConfigGenWizardInstanceDataService',
					entityNameTranslationID: 'basics.config.entityGenWizardInstance',
					httpCreate: {route: globals.webApiBaseUrl + 'basics/config/genwizard/instance/'},
					httpRead: {
						usePostForRead: true,
						route: globals.webApiBaseUrl + 'basics/config/genwizard/instance/'
					},
					dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
						typeName: 'GenericWizardInstanceDto',
						moduleSubModule: 'Basics.Config'
					}),
					basicsConfigGenericWizardDataProcessorFactoryService.getModuleFkDataProcessor('Module', basicsConfigMainService),
					basicsConfigGenericWizardDataProcessorFactoryService.getModuleFkDataProcessor('Wizard2Group', basicsConfigWizardXGroupService),
					{processItem: processItem}],
					actions: {delete: true, canDeleteCallBackFunc: canDelete, create: 'flat'},
					modification: {multi: true},
					entityRole: {
						node: {
							itemName: 'GenericWizardInstances',
							parentService: basicsConfigWizardXGroupService
						}
					},
					translation: {
						uid: 'basicsConfigGenWizardInstanceDataService',
						title: 'basics.config.genWizardInstanceListContainerTitle',
						columns:[
							{header: 'cloud.common.entityComment', field: 'CommentInfo'}
						],
						dtoScheme: { typeName: 'GenericWizardInstanceDto', moduleSubModule: 'Basics.Config' }
					},
					presenter: {
						list: {
							initCreationData: function initCreationData(creationData) {
								creationData.SuperEntityId = basicsConfigWizardXGroupService.getSelected().Id;
								creationData.EntityId = basicsConfigMainService.getSelected().Id;
							}
						}
					}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(genWizardInstanceDataServiceOption);

			serviceContainer.service.canCreate = function checkIfCanCreateSubordinatedEntity() {
				var options = genWizardInstanceDataServiceOption.flatNodeItem;
				var data = serviceContainer.data;
				return data.itemList.length === 0 && platformDataServiceActionExtension.canCreateSubordinatedEntity(data, options);
			};

			serviceContainer.data.initReadData = function initGenWizardInstanceReadData(readData) {
				readData.SuperEntityId = basicsConfigWizardXGroupService.getSelected().Id;
			};

			function canDelete(item){
				return  platformVanillaDataProtectorService.isVanillaData(item) ? false : item.Version === 0;
			}

			function processItem (item){
				var config = genericWizardUseCaseConfigService.getUseCaseConfiguration(item.WizardConfiGuuid);
				platformRuntimeDataService.readonly(item, [{
					field: 'WizardConfiGuuid',
					readonly: config.readonly && item.Version > 0
				}]);
			}
			return serviceContainer.service;
		}
	]);
})();