/**
 * Created by baf on 02.03.2018
 */

(function (angular) {
	/* global globals */
	'use strict';
	var myModule = angular.module('logistic.sundryservice');

	/**
	 * @ngdoc service
	 * @name logisticSundryServiceDataService
	 * @description provides methods to access, create and update logistic sundryService  entities
	 */
	myModule.service('logisticSundryServiceDataService', LogisticSundryServiceDataService);

	LogisticSundryServiceDataService.$inject = ['_', '$http', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'logisticSundryServiceConstantValues'];

	function LogisticSundryServiceDataService(_, $http, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
		basicsCommonMandatoryProcessor, logisticSundryServiceConstantValues) {
		var self = this;
		var logisticSundryServiceServiceOption = {
			flatRootItem: {
				module: myModule,
				serviceName: 'logisticSundryServiceDataService',
				entityNameTranslationID: 'logistic.sundryservice.sundryServiceEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'logistic/sundryService/',
					usePostForRead: true,
					endRead: 'filtered',
					endDelete: 'multidelete'
				},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(
					logisticSundryServiceConstantValues.schemes.sundryService)],
				entityRole: {
					root: {
						itemName: 'SundryServices',
						moduleName: 'cloud.desktop.moduleDisplayNameLogisticSundryService'
					}
				},
				entitySelection: {supportsMultiSelection: true},
				presenter: {list: {}},
				translation: {
					uid: 'logisticSundryServiceGroupDataService',
					title: 'logistic.sundryservice.listSundryServiceTitle',
					columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}],
					dtoScheme: logisticSundryServiceConstantValues.schemes.sundryService
				},
				sidebarSearch: {
					options: {
						moduleName: 'logistic.sundryservice',
						enhancedSearchEnabled: true,
						enhancedSearchVersion: '2.0',
						pattern: '',
						pageSize: 100,
						useCurrentClient: null,
						includeNonActiveItems: false,
						showOptions: true,
						showProjectContext: false,
						withExecutionHints: true
					}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(logisticSundryServiceServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'logisticSundryServiceValidationService'
		}, logisticSundryServiceConstantValues.schemes.sundryService));

		var service = serviceContainer.service;

		service.createDeepCopy = function createDeepCopy() {
			var command = {
				Action: 4,
				SundryServices: [service.getSelected()]
			};

			$http.post(globals.webApiBaseUrl + 'logistic/sundryservice/execute', command)
				.then(function (response) {
					serviceContainer.data.handleOnCreateSucceeded(response.data.SundryServices[0], serviceContainer.data);
				},
				function (/* error */) {
				});
		};

		return service;
	}

})(angular);
