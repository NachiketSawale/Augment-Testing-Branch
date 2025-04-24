/**
 * Created by Sudarshan on 30.08.2022
 */

(function (angular) {
	/* global globals */
	'use strict';
	let myModule = angular.module('timekeeping.settlement');

	/**
	 * @ngdoc service
	 * @name timekeepingSettlementItemDataService
	 * @description pprovides methods to access, create and update settlement item entities
	 */
	myModule.service('timekeepingSettlementItemDataService', TimekeepingSettlementItemDataService);

	TimekeepingSettlementItemDataService.$inject = ['_', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'timekeepingSettlementConstantValues', 'timekeepingSettlementDataService'];

	function TimekeepingSettlementItemDataService(_, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, basicsCommonMandatoryProcessor, timekeepingSettlementConstantValues, timekeepingSettlementDataService) {
		let self = this;
		let timekeepingSettlementItemServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'timekeepingSettlementItemDataService',
				entityNameTranslationID: 'timekeeping.settlement.settlementItemEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'timekeeping/settlement/item/',
					endRead: 'listByParent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						let selected = timekeepingSettlementDataService.getSelected();
						readData.PKey1 = selected.Id;
					},
				},
				actions: {
					delete: true,
					create: 'flat'

				},
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							let selected = timekeepingSettlementDataService.getSelected();
							creationData.PKey1 = selected.Id;
						},
					},
				},
				entityRole: {
					leaf: {
						itemName: 'SettlementItems',
						parentService: timekeepingSettlementDataService,
					},
				},
				dataProcessor: [
					platformDataServiceProcessDatesBySchemeExtension.createProcessor({
						typeName: 'TimekeepingSettlementItemDto',
						moduleSubModule: 'Timekeeping.Settlement',
					})
				],
			},
		};

		let serviceContainer = platformDataServiceFactory.createService(
			timekeepingSettlementItemServiceOption,
			self
		);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'timekeepingSettlementItemValidationService'
		}, timekeepingSettlementConstantValues.schemes.item));
	}
})(angular);
