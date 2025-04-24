/**
 * Created by Shankar on 22.09.2022
 */

(function (angular) {
	/* global globals */
	'use strict';
	let myModule = angular.module('logistic.plantsupplier');

	/**
	 * @ngdoc service
	 * @name logisticPlantSupplierDataService
	 * @description provides methods to access, create and update plant supplier entities
	 */
	myModule.service('logisticPlantSupplierDataService', LogisticPlantSupplierDataService);

	LogisticPlantSupplierDataService.$inject = ['_', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'logisticPlantSupplierConstantValues'];

	function LogisticPlantSupplierDataService(_, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, basicsCommonMandatoryProcessor, logisticPlantSupplierConstantValues) {
		let self = this;

		let logisticPlantSupplierServiceOption = {
			flatRootItem: {
				module: myModule,
				serviceName: 'logisticPlantSupplierDataService',
				entityNameTranslationID: 'logistic.plantsupplier.plantsuppliertEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'logistic/plantsupplier/',
					usePostForRead: true,
					endRead: 'filtered',
					endDelete: 'multidelete'
				},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
					typeName: 'PlantSupplierDto',
					moduleSubModule: 'Logistic.Plantsupplier'
				})],
				entityRole: { root: { itemName: 'Plantsupplier', moduleName: 'cloud.desktop.moduleDisplayNameLogisticplantsupplier' } },
				entitySelection: { supportsMultiSelection: true },
				presenter: { list: {} },
				actions: { delete: true, create: 'flat' },
				sidebarSearch: {
					options:{
						moduleName: 'logistic.plantsupplier',
						enhancedSearchEnabled: true,
						enhancedSearchVersion: '2.0',
						includeDateSearch: true,
						useIdentification: true,
						pattern: '',
						pageSize: 100,
						useCurrentClient: true,
						showOptions: true,
						showProjectContext: false,
						withExecutionHints: true
					}

				}
			}
		};

		let serviceContainer = platformDataServiceFactory.createService(logisticPlantSupplierServiceOption, self);
		serviceContainer.data.Initialised = true;

		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'logisticPlantSupplierValidationService'
		}, logisticPlantSupplierConstantValues.schemes.plantSupplier));

	}
})(angular);
