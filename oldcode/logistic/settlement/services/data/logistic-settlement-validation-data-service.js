/**
 * Created by baf on 09.04.2019
 */

(function (angular) {
	'use strict';
	var myModule = angular.module('logistic.settlement');

	/**
	 * @ngdoc service
	 * @name logisticSettlementValidationDataService
	 * @description pprovides methods to access, create and update logistic settlement validation entities
	 */
	myModule.service('logisticSettlementValidationDataService', LogisticSettlementValidationDataService);

	LogisticSettlementValidationDataService.$inject = ['platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'logisticSettlementConstantValues', 'logisticSettlementDataService'];

	function LogisticSettlementValidationDataService(platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
	                                                 basicsCommonMandatoryProcessor, logisticSettlementConstantValues, logisticSettlementDataService) {
		var self = this;
		var logisticSettlementValidationServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'logisticSettlementValidationDataService',
				entityNameTranslationID: 'logistic.settlement.validationEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'logistic/settlement/validation/',
					endRead: 'listbyparent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						var selected = logisticSettlementDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: false, create: false },
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(
					logisticSettlementConstantValues.schemes.validation)],
				presenter: {
					list: {
					}
				},
				entityRole: {
					leaf: {itemName: 'Validations', parentService: logisticSettlementDataService}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(logisticSettlementValidationServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'logisticSettlementValidationValidationService'
		}, logisticSettlementConstantValues.schemes.validation));
	}
})(angular);
