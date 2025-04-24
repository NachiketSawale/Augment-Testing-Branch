/**
 * Created by cakiral on 03.02.2022
 */

(function (angular) {
	/* global globals _ */
	'use strict';
	let myModule = angular.module('logistic.sundrygroup');

	/**
	 * @ngdoc service
	 * @name logisticSundryGroupTaxCodeDataService
	 * @description provides methods to access, create and update Logistic SundryGroup TaxCode entities
	 */
	myModule.service('logisticSundryGroupTaxCodeDataService', LogisticSundryGroupTaxCodeDataService);

	LogisticSundryGroupTaxCodeDataService.$inject = ['platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension', 'basicsCommonMandatoryProcessor', 'logisticSundryServiceGroupDataService', 'logisticSundryServiceGroupConstantValues'];

	function LogisticSundryGroupTaxCodeDataService(platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, basicsCommonMandatoryProcessor, logisticSundryServiceGroupDataService, logisticSundryServiceGroupConstantValues) {
		let self = this;
		let logisticSundryGroupServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'logisticSundryGroupTaxCodeDataService',
				entityNameTranslationID: 'logistic.sundrygroup.logisticSundryGroupEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'logistic/sundrygroup/taxcode/',
					endRead: 'listByParent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						let selected = logisticSundryServiceGroupDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: true, create: 'flat'},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(
					logisticSundryServiceGroupConstantValues.schemes.taxCode)],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							let selected = logisticSundryServiceGroupDataService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
				entityRole: {
					leaf: {itemName: 'TaxCode', parentService: logisticSundryServiceGroupDataService}
				}
			}
		};

		let serviceContainer = platformDataServiceFactory.createService(logisticSundryGroupServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'logisticSundryGroupTaxCodeValidationService'
		}, logisticSundryServiceGroupConstantValues.schemes.taxCode));
	}
})(angular);