(function (angular) {
	/* global globals */
	'use strict';
	let myModule = angular.module('timekeeping.shiftmodel');

	/**
	 * @ngdoc service
	 * @name timekeepingShiftModel2GroupDataService
	 * @description pprovides methods to access, create and update timekeeping shiftModel2group entities
	 */
	myModule.service('timekeepingShiftModel2GroupDataService', TimekeepingShiftModel2GroupDataService);

	TimekeepingShiftModel2GroupDataService.$inject = ['_', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'timekeepingShiftModelConstantValues', 'timekeepingShiftModelDataService'];

	function TimekeepingShiftModel2GroupDataService(_, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, basicsCommonMandatoryProcessor, timekeepingShiftModelConstantValues, timekeepingShiftModelDataService) {
		let self = this;
		let timekeepingShiftModel2GroupServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'timekeepingShiftModel2GroupDataService',
				entityNameTranslationID: 'timekeeping.shiftmodel.timekeepingShiftModel2GroupEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'timekeeping/shiftModel/shift2group/',
					endRead: 'listByParent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						let selected = timekeepingShiftModelDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: true, create: 'flat'},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(
					timekeepingShiftModelConstantValues.schemes.shift2Group)],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							let selected = timekeepingShiftModelDataService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
				entityRole: {
					leaf: {itemName: 'Shift2Groups', parentService: timekeepingShiftModelDataService}
				}
			}
		};

		let serviceContainer = platformDataServiceFactory.createService(timekeepingShiftModel2GroupServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'timekeepingShiftModel2GroupValidationService'
		}, timekeepingShiftModelConstantValues.schemes.shift2Group));
		let service = serviceContainer.service;
		return service;
	}
})(angular);
