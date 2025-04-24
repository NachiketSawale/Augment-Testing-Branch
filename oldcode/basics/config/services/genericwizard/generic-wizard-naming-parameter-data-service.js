(function () {
	'use strict';
	var basicsConfigModule = angular.module('basics.config');

	/**
	 * @ngdoc service
	 * @name basicsConfigGenWizardNamingParameterDataService
	 * @function
	 *
	 * @description
	 * basicsConfigGenWizardNamingParameterDataService is a data service for managing naming parameters of generic wizards
	 */
	basicsConfigModule.factory('basicsConfigGenWizardNamingParameterDataService', ['basicsConfigGenWizardInstanceDataService', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension', 'basicsCommonMandatoryProcessor',

		function (basicsConfigGenWizardInstanceDataService, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, mandatoryProcessor) {

			var genWizardNamingParameterServiceOption = {
				flatLeafItem: {
					module: basicsConfigModule,
					serviceName: 'basicsConfigGenWizardNamingParameterDataService',
					entityNameTranslationID: 'basics.config.genWizardNamingParameterContainerTitle',
					httpCreate: {route: globals.webApiBaseUrl + 'basics/config/genwizard/namingparameter/'},
					httpRead: {
						usePostForRead: true,
						route: globals.webApiBaseUrl + 'basics/config/genwizard/namingparameter/'
					},
					dataProcessor: [
						platformDataServiceProcessDatesBySchemeExtension.createProcessor({
							typeName: 'GenericWizardNamingParameterDto',
							moduleSubModule: 'Basics.Config'
						})
					],
					actions: {delete: true, create: 'flat', suppressAutoCreate: true},
					modification: {multi: true},
					entityRole: {
						leaf: {
							itemName: 'NamingParameter',
							parentService: basicsConfigGenWizardInstanceDataService
						}
					},
					presenter: {
						list: {
							initCreationData: function initCreationData(creationData) {
								creationData.SuperEntityId = basicsConfigGenWizardInstanceDataService.getSelected().Id;
							}
						}
					}
				}
			};

			let serviceContainer = platformDataServiceFactory.createNewComplete(genWizardNamingParameterServiceOption);
			serviceContainer.data.newEntityValidator = mandatoryProcessor.create({
				typeName: 'GenericWizardNamingParameterDto',
				moduleSubModule: 'Basics.Config',
				validationService: 'basicsConfigGenWizardValidationService'
			});

			serviceContainer.data.initReadData = function initGenWizardNamingParameterReadData(readData) {
				readData.SuperEntityId = basicsConfigGenWizardInstanceDataService.getSelected().Id;
			};

			return serviceContainer.service;
		}
	]);
})();