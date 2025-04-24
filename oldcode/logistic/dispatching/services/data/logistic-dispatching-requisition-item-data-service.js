/**
 * Created by nitsche on 15.09.2021
 */

(function (angular) {
	/* global globals */
	'use strict';
	var myModule = angular.module('logistic.dispatching');

	/**
	 * @ngdoc service
	 * @name logisticDispatchingRequisitionItemDataService
	 * @description pprovides methods to access, create and update logistic dispatching requisitionItem entities
	 */
	myModule.service('logisticDispatchingRequisitionItemDataService', LogisticDispatchingRequisitionItemDataService);

	LogisticDispatchingRequisitionItemDataService.$inject = ['_', '$injector', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'logisticDispatchingConstantValues', 'platformDataServiceEntityReadonlyProcessor'];

	function LogisticDispatchingRequisitionItemDataService(
		_, $injector, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
		basicsCommonMandatoryProcessor, logisticDispatchingConstantValues, platformDataServiceEntityReadonlyProcessor)
	{
		var self = this;
		let logisticDispatchingRecordDataService = $injector.get('logisticDispatchingRecordDataService');
		var logisticDispatchingRequisitionItemServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'logisticDispatchingRequisitionItemDataService',
				entityNameTranslationID: 'logistic.dispatching.requisitionItemEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'logistic/dispatching/requisitionItemV/',
					endRead: 'listByParent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						let selected = logisticDispatchingRecordDataService.getSelected();
						readData.PKey1 = selected.RequisitionFk;
					}
				},
				actions: {delete: false, create: false},
				dataProcessor: [
					platformDataServiceProcessDatesBySchemeExtension.createProcessor(logisticDispatchingConstantValues.schemes.requisitionItem),
					platformDataServiceEntityReadonlyProcessor
				],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							var selected = logisticDispatchingRecordDataService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
				entityRole: {
					leaf: {itemName: 'RequisitionItemV', parentService: logisticDispatchingRecordDataService}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(logisticDispatchingRequisitionItemServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'logisticDispatchingRequisitionItemValidationService'
		}, logisticDispatchingConstantValues.schemes.requisitionItem));
	}
})(angular);
