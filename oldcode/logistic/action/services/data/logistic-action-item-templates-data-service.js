/**
 * Created by Shankar on 20.01.2025
 */

(function (angular) {
	/* global globals */
	'use strict';
	let myModule = angular.module('logistic.action');

	/**
	 * @ngdoc service
	 * @name logisticActionItemTemplatesDataService
	 * @description provides methods to access, create and update Action Item Templates entities
	 */
	myModule.service('logisticActionItemTemplatesDataService', LogisticActionItemTemplatesDataService);

	LogisticActionItemTemplatesDataService.$inject = ['_', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'logisticActionConstantValues', 'logisticActionTargetDataService'];

	function LogisticActionItemTemplatesDataService(_, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
		basicsCommonMandatoryProcessor, logisticActionConstantValues, logisticActionTargetDataService) {
		let self = this;
		let logisticActionItemTemplatesServiceOption = {
			flatNodeItem: {
				module: myModule,
				serviceName: 'logisticActionItemTemplatesDataService',
				entityNameTranslationID: 'logistic.action.entityActionItemTemplate',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'logistic/action/item/',
					endRead: 'listbyactiontarget',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						let selected = logisticActionTargetDataService.getSelected();
						readData.PKey1 = selected.Id;
					},
				},
				actions: {delete: true,create: 'flat'},
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							let selected = logisticActionTargetDataService.getSelected();
							creationData.PKey1 = selected.Id;
						},
					},
				},
				entityRole: {
					node: {
						itemName: 'ActionItemTemplates',
						parentService: logisticActionTargetDataService
					}
				},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
					typeName: 'ActionItemTemplateDto',
					moduleSubModule: 'Logistic.Action'
				})],
			},
		};

		let serviceContainer = platformDataServiceFactory.createService(
			logisticActionItemTemplatesServiceOption,
			self
		);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'logisticActionItemTemplatesValidationService'
		}, logisticActionConstantValues.schemes.actionItemTemplates));

	}
})(angular);
