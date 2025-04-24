/**
 * Created by baf on 19.03.2019
 */

(function (angular) {
	/* global globals */
	'use strict';
	var myModule = angular.module('logistic.cardtemplate');

	/**
	 * @ngdoc service
	 * @name logisticCardTemplateDataService
	 * @description provides methods to access, create and update logistic cardTemplate  entities
	 */
	myModule.service('logisticCardTemplateDataService', LogisticCardTemplateDataService);

	LogisticCardTemplateDataService.$inject = ['_', '$http','platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'logisticCardTemplateConstantValues'];

	function LogisticCardTemplateDataService(_, $http, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
		basicsCommonMandatoryProcessor, logisticCardTemplateConstantValues) {
		var self = this;
		var logisticCardTemplateServiceOption = {
			flatRootItem: {
				module: myModule,
				serviceName: 'logisticCardTemplateDataService',
				entityNameTranslationID: 'logistic.common.cardTemplateEntity',
				httpCRUD: {route: globals.webApiBaseUrl + 'logistic/cardtemplate/cardtemplate/', usePostForRead: true, endRead: 'filtered', endDelete: 'multidelete' },
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(logisticCardTemplateConstantValues.schemes.cardTemplate)],
				entityRole: {root: {itemName: 'Templates', moduleName: 'cloud.desktop.moduleDisplayNameLogisticCardTemplate'}},
				entitySelection: {supportsMultiSelection: true},
				presenter: {list: {}},
				sidebarSearch: {
					options: {
						moduleName: 'logistic.cardtemplate',
						enhancedSearchEnabled: true,
						enhancedSearchVersion: '2.0',
						pattern: '',
						pageSize: 100,
						useCurrentClient: null,
						includeNonActiveItems: null,
						showOptions: false,
						showProjectContext: false,
						withExecutionHints: true
					}
				},
				translation: {
					uid: 'logisticCardTemplateDataService',
					title: 'logistic.cardtemplate.cardTemplateListTitle',
					columns: [{ header: 'cloud.common.entityDescription', field: 'DescriptionInfo' }],
					dtoScheme: logisticCardTemplateConstantValues.schemes.cardTemplate
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(logisticCardTemplateServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'logisticCardTemplateValidationService'
		}, logisticCardTemplateConstantValues.schemes.cardTemplate));

		var service = serviceContainer.service;
		service.createDeepCopy = function createDeepCopy() {
			var command = {
				Action: 4,
				JobCardTemplates:   [service.getSelected()]
			};

			$http.post(globals.webApiBaseUrl + 'logistic/cardtemplate/cardtemplate/execute', command).then(function (response) {
				serviceContainer.data.handleOnCreateSucceeded(response.data.Templates[0], serviceContainer.data);
			},
			function (/* error */) {
			});
		};

	}
})(angular);
