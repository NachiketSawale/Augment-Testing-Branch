/**
 * Created by baf on 05.04.2019
 */

(function (angular) {
	/* global globals */
	'use strict';
	var myModule = angular.module('logistic.sundrygroup');

	/**
	 * @ngdoc service
	 * @name logisticSundryServiceGroupAccountDataService
	 * @description pprovides methods to access, create and update logistic sundryServiceGroup account entities
	 */
	myModule.service('logisticSundryServiceGroupAccountDataService', LogisticSundryServiceGroupAccountDataService);

	LogisticSundryServiceGroupAccountDataService.$inject = ['_', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'logisticSundryServiceGroupConstantValues', 'logisticSundryServiceGroupDataService'];

	function LogisticSundryServiceGroupAccountDataService(_, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
		basicsCommonMandatoryProcessor, logisticSundryServiceGroupConstantValues, logisticSundryServiceGroupDataService) {
		var self = this;
		var logisticSundryServiceGroupAccountServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'logisticSundryServiceGroupAccountDataService',
				entityNameTranslationID: 'logistic.sundrygroup.logisticSundryServiceGroupAccountEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'logistic/sundrygroup/account/',
					endRead: 'listbyparent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						var selected = logisticSundryServiceGroupDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: true, create: 'flat'},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(
					logisticSundryServiceGroupConstantValues.schemes.account)],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							var selected = logisticSundryServiceGroupDataService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
				entityRole: {
					leaf: {itemName: 'Accounts', parentService: logisticSundryServiceGroupDataService}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(logisticSundryServiceGroupAccountServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'logisticSundryServiceGroupAccountValidationService'
		}, logisticSundryServiceGroupConstantValues.schemes.account));
	}
})(angular);
