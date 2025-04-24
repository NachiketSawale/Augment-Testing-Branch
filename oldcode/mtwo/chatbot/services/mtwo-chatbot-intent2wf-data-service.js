(function (angular) {
	/* global globals */
	'use strict';
	var myModule = angular.module('mtwo.chatbot');

	/**
	 * @ngdoc service
	 * @name mtwoChatBotWf2intentDataService
	 * @description pprovides methods to access, create and update Wf2intent  entities
	 */
	myModule.service('mtwoChatBotWf2intentDataService', MtwoChatBotWf2intentDataService);

	MtwoChatBotWf2intentDataService.$inject = ['_','$http', '$q', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'mtwoChatbotConstantValues', 'mtwoChatBotHeaderDataService','basicsCommonMandatoryProcessor','mtwoChatBotConfigurationDataService'];

	function MtwoChatBotWf2intentDataService(_,$http, $q, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
		basicsCommonMandatoryProcessor, mtwoChatbotConstantValues, mtwoChatBotHeaderDataService,mandatoryProcessor,mtwoChatBotConfigurationDataService) {

		var self = this;
		var mtwoChatbotConfigurationWf2intentOption = {
			flatNodeItem: {
				module: myModule,
				serviceName: 'mtwoChatBotWf2intentDataService',
				entityNameTranslationID: 'mtwo.chatbot.mtwoChatbotWf2intentEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'mtwo/chatbot/wf2intent/',
					endRead: 'listByParent',
					endDelete: 'multidelete',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						var selected = mtwoChatBotHeaderDataService.getSelected();
						var selectedConfig = mtwoChatBotConfigurationDataService.getSelected();
						readData.PKey1 = selected.Id;
						if(!_.isNil(selectedConfig)) readData.PKey2 = selectedConfig.Id;
					}
				},
				actions: {delete:false, create: false},
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
					node: {itemName: 'Wf2intents', parentService: mtwoChatBotHeaderDataService} // todo checkin  Wf2intents completedto
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(mtwoChatbotConfigurationWf2intentOption, self);
		serviceContainer.data.newEntityValidator = mandatoryProcessor.create({
			mustValidateFields: true,
			typeName: 'MtoCbtWf2intentDto',
			moduleSubModule: 'Mtwo.ChatBot',
			validationService: 'mtwoChatbotWf2intentValidationService'
		});
		serviceContainer.data.Initialised = true;
		this.generateFields = function () {
			var deferred = $q.defer();
			var headerId = mtwoChatBotHeaderDataService.getSelected();
			$http.get(globals.webApiBaseUrl + 'mtwo/chatbot/wf2intent/getdefalutnlpintentdata?headerId=' + headerId.Id)
				.then(function (response) {
					deferred.resolve(response.data);
				});
			return deferred.promise;
		};
		var data = serviceContainer.data;
		this.setList = function (items) {
			data.itemList.length = 0;
			_.forEach(items, function (item) {
				data.itemList.push(item);
			});
			data.listLoaded.fire();
		};
		this.filterData = function() {
			var deferred = $q.defer();
			var headerId = mtwoChatBotHeaderDataService.getSelected().Id;
			var languageId = mtwoChatBotConfigurationDataService.getSelected().LanguageId;
			var url = 'mtwo/chatbot/wf2intent/filtered?headerId=' + headerId;
			if(!_.isNil(languageId)) {
				url += '&langId=' + languageId;
			}
			$http.get(globals.webApiBaseUrl + url)
				.then(function (response) {
					deferred.resolve(response.data);
				});
			return deferred.promise;
		};
	}
})(angular);
