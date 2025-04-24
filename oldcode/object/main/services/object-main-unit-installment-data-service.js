/**
 * Created by baf on 07.02.2022
 */

(function (angular) {
	/* global globals */
	'use strict';
	var myModule = angular.module('object.main');

	/**
	 * @ngdoc service
	 * @name objectMainUnitInstallmentDataService
	 * @description pprovides methods to access, create and update object main unitInstallment entities
	 */
	myModule.service('objectMainUnitInstallmentDataService', ObjectMainUnitInstallmentDataService);

	ObjectMainUnitInstallmentDataService.$inject = ['_', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'objectMainConstantValues', 'objectMainUnitService', 'objectMainUnitInstallmentProcessor'];

	function ObjectMainUnitInstallmentDataService(_, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
		basicsCommonMandatoryProcessor, objectMainConstantValues, objectMainUnitService, objectMainUnitInstallmentProcessor) {
		var self = this;
		var objectMainUnitInstallmentServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'objectMainUnitInstallmentDataService',
				entityNameTranslationID: 'object.main.unitInstallmentEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'object/main/unitinstallment/',
					endRead: 'listByParent',
					endCreate: 'createEnities',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						var selected = objectMainUnitService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: true, create: 'flat'},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(
					objectMainConstantValues.schemes.unitInstallment), objectMainUnitInstallmentProcessor],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							var selected = objectMainUnitService.getSelected();
							creationData.PKey1 = selected.Id;
							creationData.PKey2 = selected.HeaderFk;
							creationData.PKey3 = selected.InstallmentAgreementFk;
						},
						handleCreateSucceeded: function(newData, data){
							_.forEach(newData, function (item) {
								self.getList().push(item);
								self.markItemAsModified(item);
							});
							//self.load();
							self.gridRefresh();
							return data.handleOnCreateSucceeded({}, data);
						}
					},
				},
				entityRole: {
					leaf: {itemName: 'UnitInstallment', parentService: objectMainUnitService}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(objectMainUnitInstallmentServiceOption, self);
		let service = serviceContainer.service;
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'objectMainUnitInstallmentValidationService'
		}, objectMainConstantValues.schemes.unitInstallment));


		service.canDelete = function canDelete(item) {
			if(item === false){
				return false;
			}
			const invoiceCreated = 2; //see database OBJ_INSTAGREESTATE
			let res = (serviceContainer.data.itemList.length > 0);
			if (res) {
				let item = service.getSelected();
				res = service.isSelection(item);
				if (item !== null) {
					if (item.InstallmentAgreementStateFk === invoiceCreated) {
						return false;
					} else {
						return res;
					}
				} else {
					return res;
				}
			} else {
				return false;
			}
		};
		return service;

	}
})(angular);
