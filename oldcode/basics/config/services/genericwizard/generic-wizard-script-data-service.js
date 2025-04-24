/**
 * Created by baf on 2016-05-04
 */
(function () {
	'use strict';
	var basicsConfigModule = angular.module('basics.config');

	/**
	 * @ngdoc service
	 * @name basicsConfigGenWizardStepScriptDataService
	 * @function
	 *
	 * @description
	 * basicsConfigGenWizardStepScriptDataService is a data service for managing scripts applied in steps of generic wizards
	 */
	basicsConfigModule.factory('basicsConfigGenWizardScriptDataService', ['basicsConfigGenWizardStepDataService', 'platformDataServiceFactory',
		'platformDataServiceProcessDatesBySchemeExtension', 'basicsConfigGenericWizardDataProcessorFactoryService', 'basicsConfigWizardXGroupService',
		'basicsConfigGenWizardInstanceDataService', 'platformVanillaDataProtectorService',

		function (basicsConfigGenWizardStepDataService, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
		          basicsConfigGenericWizardDataProcessorFactoryService, basicsConfigWizardXGroupService, basicsConfigGenWizardInstanceDataService, platformVanillaDataProtectorService) {

			var genWizardStepScriptDataServiceOption = {
				flatLeafItem: {
					module: basicsConfigModule,
					serviceName: 'basicsConfigGenWizardStepScriptDataService',
					entityNameTranslationID: 'basics.config.entityProperty',
					httpCreate: {route: globals.webApiBaseUrl + 'basics/config/genwizard/stepscript/'},
					httpRead: {
						usePostForRead: true,
						route: globals.webApiBaseUrl + 'basics/config/genwizard/stepscript/'
					},
					dataProcessor: [
						platformDataServiceProcessDatesBySchemeExtension.createProcessor({
							typeName: 'GenericWizardStepScriptDto',
							moduleSubModule: 'Basics.Config'
						}),
						basicsConfigGenericWizardDataProcessorFactoryService.getInstanceFkDataProcessor('Instance', basicsConfigWizardXGroupService),
						basicsConfigGenericWizardDataProcessorFactoryService.getStepFkDataProcessor('Step', basicsConfigGenWizardStepDataService)
					],
					actions: {delete: true, canDeleteCallBackFunc: canDelete, create: 'flat'},
					entityRole: {
						leaf: {
							itemName: 'Scripts',
							parentService: basicsConfigGenWizardStepDataService
						}
					},
					modification: {multi: true},
					translation: {
						uid: 'basicsConfigGenWizardStepScriptDataService',
						title: 'basics.config.genWizardStepScriptListContainerTitle',
						columns:[
							{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}
						],
						dtoScheme: { typeName: 'GenericWizardStepScriptDto', moduleSubModule: 'Basics.Config' }
					},
					presenter: {
						list: {
							initCreationData: function initCreationData(creationData) {
								creationData.EntityId = basicsConfigGenWizardInstanceDataService.getSelected().Id;
								creationData.SuperEntityId = basicsConfigGenWizardStepDataService.getSelected().Id;
							}
						}
					}
				}
			};

			function canDelete(item){
				return !platformVanillaDataProtectorService.isVanillaData(item);
			}

			var serviceContainer = platformDataServiceFactory.createNewComplete(genWizardStepScriptDataServiceOption);

			serviceContainer.data.initReadData = function initGenWizardStepScriptReadData(readData) {
				readData.SuperEntityId = basicsConfigGenWizardStepDataService.getSelected().Id;
			};

			return serviceContainer.service;
		}
	]);
})();