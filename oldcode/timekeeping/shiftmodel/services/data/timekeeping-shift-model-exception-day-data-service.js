/**
 * Created by baf on 06.06.2019
 */

(function (angular) {
	/* global globals */
	'use strict';
	var myModule = angular.module('timekeeping.shiftmodel');

	/**
	 * @ngdoc service
	 * @name timekeepingShiftModelExceptionDayDataService
	 * @description pprovides methods to access, create and update timekeeping shiftModel exceptionDay entities
	 */
	myModule.service('timekeepingShiftModelExceptionDayDataService', TimekeepingShiftModelExceptionDayDataService);

	TimekeepingShiftModelExceptionDayDataService.$inject = ['_', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'timekeepingShiftModelConstantValues', 'timekeepingShiftModelDataService'];

	function TimekeepingShiftModelExceptionDayDataService(_, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, basicsCommonMandatoryProcessor, timekeepingShiftModelConstantValues, timekeepingShiftModelDataService) {
		var self = this;
		var timekeepingShiftModelExceptionDayServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'timekeepingShiftModelExceptionDayDataService',
				entityNameTranslationID: 'timekeeping.shiftmodel.exceptionDayEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'timekeeping/shiftmodel/exceptionday/',
					endRead: 'listbyparent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						var selected = timekeepingShiftModelDataService.getSelected();
						readData.PKey1 = selected.Id;
						delete readData.filter;
					}
				},
				actions: {delete: true, create: 'flat'},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(
					timekeepingShiftModelConstantValues.schemes.exceptionDay)],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							var selected = timekeepingShiftModelDataService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
				entityRole: {
					leaf: {itemName: 'ExceptionDays', parentService: timekeepingShiftModelDataService}
				},
				translation: { uid: 'timekeepingShiftModelExceptionDayDataService',
					title: 'timekeeping.shiftmodel.translationDescShift',
					columns: [{ header: 'cloud.common.entityDescription', field: 'DescriptionInfo' }],
					dtoScheme: {
						typeName: 'ExceptionDayDto',
						moduleSubModule: 'Timekeeping.ShiftModel'
					}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(timekeepingShiftModelExceptionDayServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'timekeepingShiftModelExceptionDayValidationService'
		}, timekeepingShiftModelConstantValues.schemes.exceptionDay));
		var service = serviceContainer.service;
		return service;
	}
})(angular);
