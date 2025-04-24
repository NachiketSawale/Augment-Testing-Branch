/**
 * Created by baf on 28.02.2018
 */

(function (angular) {
	/* global globals */
	'use strict';
	var myModule = angular.module('logistic.pricecondition');

	/**
	 * @ngdoc service
	 * @name logisticPriceConditionDataService
	 * @description provides methods to access, create and update logistic price condition entities
	 */
	myModule.service('logisticPriceConditionDataService', LogisticPriceConditionDataService);

	LogisticPriceConditionDataService.$inject = ['$http', '_', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'logisticPriceConditionConstantValues'];

	function LogisticPriceConditionDataService($http, _, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
		basicsCommonMandatoryProcessor, lpcValues) {

		var self = this;
		var logisticPriceConditionServiceOption = {
			flatRootItem: {
				module: myModule,
				serviceName: 'logisticPriceConditionDataService',
				entityNameTranslationID: 'logistic.pricecondition.priceConditionEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'logistic/pricecondition/',
					usePostForRead: true,
					endRead: 'filtered',
					endDelete: 'multidelete'
				},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(lpcValues.schemes.priceCondition)],
				entityRole: {root: {itemName: 'PriceConditions', moduleName: 'cloud.desktop.moduleDescriptionNameLogisticPriceCondition'}},
				entitySelection: {supportsMultiSelection: true},
				presenter: {list: {}},
				sidebarSearch: {
					options: {
						moduleName: 'logistic.pricecondition',
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

		var serviceContainer = platformDataServiceFactory.createService(logisticPriceConditionServiceOption, self);
		var service = serviceContainer.service;
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'logisticPriceConditionValidationService'
		}, lpcValues.schemes.priceCondition ) );


		service.navigateTo = function navigateTo(item, triggerField) {
			var goToItemId = item[triggerField];
			if(goToItemId){
				service.load().then(function () {
					var change = service.getItemById(goToItemId);
					service.setSelected(change);
				});
			}
		};

		service.createDeepCopy = function createDeepCopy() {
			var command = {
				Action: 4,
				PriceConditions: [service.getSelected()]
			};

			$http.post(globals.webApiBaseUrl + 'logistic/pricecondition/execute', command).then(function (response) {
					serviceContainer.data.handleOnCreateSucceeded(response.data.PriceConditions[0], serviceContainer.data);
				},
				function (/* error */) {
				});
		};
	}

})(angular);
