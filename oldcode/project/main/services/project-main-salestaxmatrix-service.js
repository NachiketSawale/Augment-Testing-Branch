/**
 * Created by shen on 1/4/2022
 */

(function (angular) {
	'use strict';
	let moduleName = angular.module('project.main');
	/**
	 * @ngdoc service
	 * @name salesTaxMatrixDataService
	 * @function
	 *
	 * @description
	 * salesTaxMatrixDataService is the data service for all location related functionality.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	moduleName.service('salesTaxMatrixDataService', SalesTaxMatrixDataService);

	SalesTaxMatrixDataService.$inject = ['platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'projectMainConstantValues', 'project2SalesTaxCodeDataService'];

	function SalesTaxMatrixDataService(platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
		basicsCommonMandatoryProcessor, projectMainConstantValues, project2SalesTaxCodeDataService) {

		let self = this;
		let SalesTaxMatrixServiceOption = {
			flatLeafItem: {
				module: moduleName,
				serviceName: 'salesTaxMatrixDataService',
				entityNameTranslationID: 'project.main.salestaxmatrixListTitle',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'project/main/salestaxmatrix/',
					endRead: 'listbyparent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						let selected = project2SalesTaxCodeDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: true, create: 'flat'},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(
					projectMainConstantValues.schemes.salesTaxMatrix)],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							let selected = project2SalesTaxCodeDataService.getSelected();
							creationData.PKey1 = selected.Id;
							creationData.PKey2 = selected.ProjectFk;
						}
					}
				},
				entityRole: {
					leaf: {itemName: 'SalesTaxMatrix', parentService: project2SalesTaxCodeDataService}
				}
			}
		};


		let serviceContainer = platformDataServiceFactory.createService(SalesTaxMatrixServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'projectMainSalesTaxMatrixValidationService'
		}, projectMainConstantValues.schemes.salesTaxMatrix));
	}
})(angular);
