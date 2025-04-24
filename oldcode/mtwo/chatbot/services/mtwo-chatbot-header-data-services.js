(function () {
	/* global globals */
	'use strict';
	var moduleName = 'mtwo.chatbot';
	var resourceModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name mtwoChatBotHeaderDataService
	 * @function
	 * @requires
	 *
	 * @description
	 * The UI configuration service for the module.
	 */
	/*
	mtwoChatBotHeaderDataService
	*/
	resourceModule.factory('mtwoChatBotHeaderDataService', ['_', '$injector','$q', '$http', 'platformDataServiceFactory', 'basicsLookupdataLookupDescriptorService','platformRuntimeDataService','platformDataServiceProcessDatesBySchemeExtension','basicsCommonMandatoryProcessor',
		function (_, $injector,$q,$http, platformDataServiceFactory, basicsLookupdataLookupDescriptorService,runtimeDataService,platformDataServiceProcessDatesBySchemeExtension,mandatoryProcessor) {
			var service = {};
			var serviceContainer = {};
			service.handleOnUpdate = function (updateData, response, data) {
				serviceContainer.data.handleOnUpdateSucceeded(updateData, response, data, true);
			};
			var factoryOptions = {
				flatRootItem: {
					module: resourceModule,
					serviceName: 'mtwoChatBotHeaderService',
					entityNameTranslationID: 'mtwo.chatbot.header',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'mtwo/chatbot/header/',
						endRead: 'listfilter',
						endDelete: 'multidelete',
						usePostForRead: true
					},
					entitySelection: {supportsMultiSelection: true},
					entityRole: {
						root: {
							itemName: 'CbtHeaders',
							moduleName: 'cloud.desktop.moduleDisplayNameMtwoChatbot',
							addToLastObject: true,
							lastObjectModuleName: moduleName,
							useIdentification: true,
							handleUpdateDone: function (updateData, response, data) {
								data.handleOnUpdateSucceeded(updateData, response, data, true);
								// create configuration for this header
								let headerId = updateData.MainItemId;
								let defer = $q.defer();
								$http.get(globals.webApiBaseUrl + 'mtwo/chatbot/header/createconfiguration' + '?headerid=' + headerId).then(function (response) {
									defer.resolve(response.data);
									$injector.get('mtwoChatBotConfigurationDataService').load();
								});

								if(updateData.ConfigurationsToSave !== null) {
									$injector.get('mtwoChatbotNlpIntentLookupDataService').fleshLookupData();
								}
							}
						}
					},
					dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
						typeName: 'MtoCbtHeaderDto',
						moduleSubModule: 'Mtwo.ChatBot'
					})],
					presenter: {
						list: {
							incorporateDataRead: function (readData, data) {
								angular.forEach(readData, function (item) {
									if(!_.isNil(item.ModuleId)) {
										runtimeDataService.readonly(item, [{field: 'IsGeneral', readonly: true}]);
									}
								});
								var dataRead = serviceContainer.data.handleReadSucceeded(readData, data);
								return dataRead;
							}
						}
					},
					sidebarSearch: {
						options: {
							moduleName: moduleName,
							enhancedSearchEnabled: true,
							enhancedSearchVersion: '2.0',
							pattern: '',
							pageSize: 100,
							useCurrentClient: true,
							includeNonActiveItems: false,
							showOptions: true,
							showProjectContext: false,
							withExecutionHints: true
						}
					}
				}
			};

			serviceContainer = platformDataServiceFactory.createNewComplete(factoryOptions);
			serviceContainer.data.newEntityValidator = mandatoryProcessor.create({
				mustValidateFields: true,
				typeName: 'MtoCbtHeaderDto',
				moduleSubModule: 'Mtwo.ChatBot',
				validationService: 'mtwoChatbotValidationService'
			});
			service = serviceContainer.service;
			service.loadAfterNavigation = function loadAfterNavigation(item, triggerField) {
				if (triggerField === 'Id') {
					service.load();
				}
			};
			return service;
		}]);
})(angular);
