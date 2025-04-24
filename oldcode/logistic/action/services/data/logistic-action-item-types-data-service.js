	/**
 * Created by Shankar on 20.01.2025
 */

(function (angular) {
	/* global globals */
	'use strict';
	let myModule = angular.module('logistic.action');

	/**
	 * @ngdoc service
	 * @name logisticActionItemTypesDataService
	 * @description pprovides methods to access, create and update Action item types entities
	 */
	myModule.service('logisticActionItemTypesDataService', LogisticActionItemTypesDataService);

	LogisticActionItemTypesDataService.$inject = ['_', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'logisticActionConstantValues', 'logisticActionItemTemplatesDataService'];

	function LogisticActionItemTypesDataService(_, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
		basicsCommonMandatoryProcessor, logisticActionConstantValues, logisticActionItemTemplatesDataService) {
		let self = this;
		let LogisticActionItemTypesDataServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'logisticActionItemTypesDataService',
				entityNameTranslationID: 'logistic.action.actionItemTypeEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'logistic/action/itemtemp2itemtype/',
					endRead: 'listbyactionitemtemp',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						let selected = logisticActionItemTemplatesDataService.getSelected();
						readData.PKey1 = selected.Id;
					},
				},
				actions: {delete: true,create: 'flat'},
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							let selected = logisticActionItemTemplatesDataService.getSelected();
							creationData.PKey1 = selected.Id;
						},
					},
				},
				entityRole: {
					leaf: {itemName: 'ActionItemTemp2ItemTypes',parentService: logisticActionItemTemplatesDataService},
				},
				dataProcessor: [
					platformDataServiceProcessDatesBySchemeExtension.createProcessor(logisticActionConstantValues.schemes.actionItemTypes)],
			},
		};

		let serviceContainer = platformDataServiceFactory.createService(
			LogisticActionItemTypesDataServiceOption,
			self
		);
		serviceContainer.data.Initialised = true;

		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'logisticActionItemTypesValidationService'
		}, logisticActionConstantValues.schemes.actionItemTypes));


	}
})(angular);
