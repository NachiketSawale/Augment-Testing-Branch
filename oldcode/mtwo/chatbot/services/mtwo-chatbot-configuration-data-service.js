(function (angular) {
	/* global globals */
	'use strict';
	var myModule = angular.module('mtwo.chatbot');

	/**
	 * @ngdoc service
	 * @name mtwoChatBotWf2intentDataService
	 * @description pprovides methods to access, create and update Wf2intent  entities
	 */
	myModule.service('mtwoChatBotConfigurationDataService', MtwoChatBotConfigurationDataService);

	MtwoChatBotConfigurationDataService.$inject = ['platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'mtwoChatbotConstantValues', 'mtwoChatBotHeaderDataService','basicsCommonMandatoryProcessor','$injector'];

	function MtwoChatBotConfigurationDataService(platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
		basicsCommonMandatoryProcessor, mtwoChatbotConstantValues, mtwoChatBotHeaderDataService,mandatoryProcessor,$injector) {

		var self = this;
		var mtwoChatbotConfigurationOption = {
			flatNodeItem: {
				module: myModule,
				serviceName: 'mtwoChatBotConfigurationDataService',
				entityNameTranslationID: 'mtwo.chatbot.configuration',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'mtwo/chatbot/configuration/',
					endRead: 'listfilter',
					endDelete: 'multidelete',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						var selected = mtwoChatBotHeaderDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: false, create: false},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(
					mtwoChatbotConstantValues.schemes.wf2intent)],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							var selected = mtwoChatBotHeaderDataService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
				entityRole: {
					node: {itemName: 'Configurations', parentService: mtwoChatBotHeaderDataService,
						handleUpdateDone: function (updateData, response, data) {
							data.handleOnUpdateSucceeded(updateData, response, data, true);
							if (response.Contacts && response.Contacts.length >= 1) {
								$injector.get('mtwoChatbotNlpIntentLookupDataService').fleshLookupData();
							}
						}

					} // todo checkin  Wf2intents completedto
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(mtwoChatbotConfigurationOption, self);
		serviceContainer.data.newEntityValidator = mandatoryProcessor.create({
			mustValidateFields: true,
			typeName: 'MtoCbtConfigDto',
			moduleSubModule: 'Mtwo.ChatBot',
			validationService: 'mtwoChatbotConfigurationValidationService'
		});
		serviceContainer.data.Initialised = true;
	}
})(angular);
