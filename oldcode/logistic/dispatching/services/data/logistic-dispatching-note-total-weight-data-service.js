/**
 * Created by Shankar on 07.09.2023
 */

(function (angular) {
	/* global globals */
	'use strict';
	let myModule = angular.module('logistic.dispatching');

	/**
	 * @ngdoc service
	 * @name logisticDispatchingNoteTotalWeightDataService
	 * @description pprovides methods to access logistic dispatch weight data entities
	 */
	myModule.service('logisticDispatchingNoteTotalWeightDataService', LogisticDispatchingNoteTotalWeightDataService);

	LogisticDispatchingNoteTotalWeightDataService.$inject = ['_', '$injector', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'platformDataServiceEntityReadonlyProcessor', 'basicsCommonMandatoryProcessor', 'logisticDispatchingConstantValues', 'logisticDispatchingHeaderDataService'];

	function LogisticDispatchingNoteTotalWeightDataService(
		_, $injector, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
		platformDataServiceEntityReadonlyProcessor, basicsCommonMandatoryProcessor, logisticDispatchingConstantValues, logisticDispatchingHeaderDataService) {
		var self = this;

		var logisticDispatchingNoteTotalWeightDataServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'logisticDispatchingNoteTotalWeightDataService',
				entityNameTranslationID: 'logistic.dispatching.weightInfoEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'logistic/dispatching/totalweight/',
					endRead: 'listbyparent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						let selected = logisticDispatchingHeaderDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: { delete: false, create: false },
				dataProcessor: [
					platformDataServiceProcessDatesBySchemeExtension.createProcessor(logisticDispatchingConstantValues.schemes.dispatchNoteTotalWeight),
					platformDataServiceEntityReadonlyProcessor
				],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							var selected = logisticDispatchingHeaderDataService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
				entityRole: {
					leaf: { itemName: 'WeightFromDispatchV', parentService: logisticDispatchingHeaderDataService }
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(logisticDispatchingNoteTotalWeightDataServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'logisticDispatchingNoteTotalWeightValidationService'
		}, logisticDispatchingConstantValues.schemes.dispatchNoteTotalWeight));
	}
})(angular);

