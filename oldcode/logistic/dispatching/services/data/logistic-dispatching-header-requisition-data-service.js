/**
 * Created by baf on 21.09.2021
 */

(function (angular) {
	/* global globals */
	'use strict';
	let myModule = angular.module('logistic.dispatching');

	/**
	 * @ngdoc service
	 * @name logisticDispatchingHeaderRequisitionDataService
	 * @description pprovides methods to access, create and update logistic dispatching headerRequisition entities
	 */
	myModule.service('logisticDispatchingHeaderRequisitionDataService', LogisticDispatchingHeaderRequisitionDataService);

	LogisticDispatchingHeaderRequisitionDataService.$inject = ['_', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'logisticDispatchingConstantValues', 'logisticDispatchingHeaderDataService'];

	function LogisticDispatchingHeaderRequisitionDataService(_, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
		basicsCommonMandatoryProcessor, logisticDispatchingConstantValues, logisticDispatchingHeaderDataService) {
		let self = this;
		let logisticDispatchingHeaderRequisitionServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'logisticDispatchingHeaderRequisitionDataService',
				entityNameTranslationID: 'logistic.dispatching.headerRequisitionEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'logistic/dispatching/dispatchheader2requisition/',
					endRead: 'listbyparent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						let selected = logisticDispatchingHeaderDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: true, create: 'flat'},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(
					logisticDispatchingConstantValues.schemes.header2Requisition)],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							let selected = logisticDispatchingHeaderDataService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
				entityRole: {
					leaf: {itemName: 'DispatchedRequisitions', parentService: logisticDispatchingHeaderDataService}
				}
			}
		};

		let serviceContainer = platformDataServiceFactory.createService(logisticDispatchingHeaderRequisitionServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'logisticDispatchingHeaderRequisitionValidationService'
		}, logisticDispatchingConstantValues.schemes.header2Requisition));
	}
})(angular);
