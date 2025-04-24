/**
 * Created by Shankar on 10.04.2023
 */

(function (angular) {
	/* global globals */
	'use strict';
	let myModule = angular.module('logistic.dispatching');

	/**
	 * @ngdoc service
	 * @name logisticDispatchingNoteSettledDataService
	 * @description pprovides methods to access,create and update logistic dispatching note settled entities
	 */
	myModule.service('logisticDispatchingNoteSettledDataService', LogisticDispatchingNoteSettledDataService);

	LogisticDispatchingNoteSettledDataService.$inject = ['_', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'logisticDispatchingConstantValues', 'logisticDispatchingHeaderDataService'];

	function LogisticDispatchingNoteSettledDataService(_, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
		basicsCommonMandatoryProcessor, logisticDispatchingConstantValues, logisticDispatchingHeaderDataService) {
		let self = this;
		let logisticDispatchingNoteSettledDataServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'logisticDispatchingNoteSettledDataService',
				entityNameTranslationID: 'logistic.dispatching.dispatchNoteSettledEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'logistic/dispatching/dispatchheadernotesettled/',
					endRead: 'listbyparent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						let selected = logisticDispatchingHeaderDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: { delete: false, create: false },
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(
					logisticDispatchingConstantValues.schemes.dispatchNoteSettled)],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							let selected = logisticDispatchingHeaderDataService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
				entityRole: {
					leaf: { itemName: 'DispatchNoteSettledV', parentService: logisticDispatchingHeaderDataService }
				}
			}
		};

		let serviceContainer = platformDataServiceFactory.createService(logisticDispatchingNoteSettledDataServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'logisticDispatchingNoteSettledValidationService'
		}, logisticDispatchingConstantValues.schemes.dispatchNoteSettled));
	}
})(angular);
