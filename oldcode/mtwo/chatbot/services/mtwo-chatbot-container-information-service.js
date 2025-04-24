/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';
	var mtwoChatBotModule = angular.module('mtwo.chatbot');

	/**
	 * @ngdoc service
	 * @name mtwoChatBotContainerInformationService
	 * @function
	 *
	 * @description
	 * Provides some information on all containers in the module.
	 */


	mtwoChatBotModule.factory('mtwoChatbotContainerInformationService', ['_','$injector', 'platformLayoutHelperService', 'mtwoChatbotConstantValues', 'mtwoChatbotLayoutHelperService', 'mtwoChatBotUIConfigurationService','mtwoChatBotWf2intentDataService',

		function (_,$injector, platformLayoutHelperService, mtwoChatbotConstantValues, mtwoChatbotLayoutHelperService, mtwoChatBotUIConfigurationService,mtwoChatBotWf2intentDataService) {
			var service = {};
			service.getMtwoChatbotServiceInfos = function getMtwoChatbotServiceInfos() {
				return {
					standardConfigurationService: 'mtwoChatbotLayoutService',
					dataServiceName: 'mtwoChatBotConfigurationDataService',
					validationServiceName: 'mtwoChatbotConfigurationValidationService',
					ContainerType: 'Grid'
				};
			};

			service.getWf2intentServiceInfos = function getWf2intentServiceInfos() {
				return {
					standardConfigurationService: 'mtwoChatbotWf2intentLayoutService',
					dataServiceName: 'mtwoChatBotWf2intentDataService',
					validationServiceName: 'mtwoChatbotWf2intentValidationService',
					ContainerType: 'Grid'
				};

			};
			service.getHeaderServiceInfos = function getMtwoChatbotHeaderServiceInfos() {
				return {
					standardConfigurationService: 'mtwoChatbotHeaderLayoutService',
					dataServiceName: 'mtwoChatBotHeaderDataService',
					validationServiceName: 'mtwoChatbotValidationService',
					ContainerType: 'Grid'
				};
			};

			/*
						service.getMtwoChatbotConfigurationLayout = function getMtwoChatbotConfigurationLayout() {
							var res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'mtwo.chatbot', ['code', 'description', 'nlpappid', 'nlpmodelname', 'culture','isactive'])
							res.overloads= platformLayoutHelperService.getOverloads(['nlpmodelname'], service);
							return res;
						}
			*/
			service.getMtwoChatbotWf2intentLayout = function getMtwoChatbotWf2intentLayout() {
				var res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'mtwo.chatbot', ['code', 'description', 'wfetemplatefk', 'intent']);
				res.overloads = platformLayoutHelperService.getOverloads(['wfetemplatefk'], service);
				return res;
			};
			/* jshint -W074 */ // There is no complexity; try harder, J.S.Hint.
			service.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
				var config = {};
				var guids = mtwoChatbotConstantValues.uuid.container;
				switch (guid) {
					case guids.configurationList: // mtwochatbotConfigurationController
						config = platformLayoutHelperService.getStandardGridConfig(service.getMtwoChatbotServiceInfos(), mtwoChatBotUIConfigurationService.getConfigurationListLayout);
						config.listConfig = {
							initCalled: false,
							columns: [],
							rowChangeCallBack: function rowChangeCallBack() {
								mtwoChatBotWf2intentDataService.load();
							}
						};
						break;
					case guids.wf2intent:
						config = platformLayoutHelperService.getStandardGridConfig(service.getWf2intentServiceInfos(), mtwoChatBotUIConfigurationService.getWf2intentListLayout);
						break;
					case guids.header:
						config = platformLayoutHelperService.getStandardGridConfig(service.getHeaderServiceInfos(), mtwoChatBotUIConfigurationService.getHeaderListLayout);
						config.listConfig = {
							initCalled: false,
							columns: [],
							rowChangeCallBack: function rowChangeCallBack() {
								$injector.get('mtwoChatbotNlpIntentLookupDataService').fleshLookupData();
							}
						};
						break;
				}
				return config;
			};

			service.getOverload = function getOverload(overload) {
				var ovl = null;
				switch (overload) {
					case 'wfetemplatefk':
						ovl = mtwoChatbotLayoutHelperService.provideWorkflowOverload();
						//   ovl = basicsLookupdataConfigGeneratorExtension.provideGenericLookupConfig('businesspartner.customergroup', null, { showClearButton: true });
						break;
				}
				return ovl;
			};
			return service;

		}
	]);
})(angular);
