/**
 * Created by chi on 2/11/2022.
 */

(function (angular) {
	'use strict';

	let moduleName = 'businesspartner.certificate';

	/* jshint -W072 */// has too many parameters
	angular.module(moduleName).factory('businessPartnerCertificate2SubsidiaryDialogDataService', businessPartnerCertificate2SubsidiaryDialogDataService);

	businessPartnerCertificate2SubsidiaryDialogDataService.$inject = [
		'globals',
		'platformDataServiceFactory',
		'platformDataValidationService',
		'platformDataServiceModificationTrackingExtension',
		'_',
		'basicsCommonMandatoryProcessor',
		'businessPartnerCertificateToSubsidiaryValidationServiceFactory',
		'platformRuntimeDataService',
		'platformModuleStateService',
		'platformDataServiceValidationErrorHandlerExtension'];

	function businessPartnerCertificate2SubsidiaryDialogDataService(
		globals,
		platformDataServiceFactory,
		platformDataValidationService,
		platformDataServiceModificationTrackingExtension,
		_,
		basicsCommonMandatoryProcessor,
		businessPartnerCertificateToSubsidiaryValidationServiceFactory,
		platformRuntimeDataService,
		platformModuleStateService,
		platformDataServiceValidationErrorHandlerExtension) {

		return {
			create: create
		};

		function create(execModuleName, certificateDataService, certificate2SubsidiaryDataService) {
			let rootModuleName = 'simple.root';
			let rootModule = {
				name: rootModuleName
			};
			let rootServiceOptions = {
				flatRootItem: {
					module: rootModule,
					serviceName: 'SimpleRootDataService',
					entityRole: {
						root: {
							itemName: 'SimpleRoot',
							moduleName: rootModuleName,
							addToLastObject: false,
							lastObjectModuleName: rootModuleName
						}
					},
					httpRead: {
						useLocalResource: true,
						resourceFunction: function () {
							let selected = certificateDataService.getSelected();
							return selected ? [selected] : [];
						}
					},
					presenter: {
						list: {
							incorporateDataRead: incorporateDataRead
						}
					},
					entitySelection: {},
					modification: {},
					actions: {delete: true, create: 'flat'}
				}
			};

			let rootContainer = platformDataServiceFactory.createNewComplete(rootServiceOptions);
			let rootService = rootContainer.service;
			let rootData = rootContainer.data;
			rootData.showHeaderAfterSelectionChanged = null;
			rootData.doUpdate = null;
			rootData.isRealRootForOpenedModule = isRealRootForOpenedModule;

			let serviceOptions = {
				flatLeafItem: {
					module: rootModule,
					serviceName: 'businessPartnerCertificate2SubsidiaryDataDialogService',
					entityRole: {
						leaf: {
							itemName: 'Certificate2Subsidiary',
							parentService: rootService,
							doesRequireLoadAlways: true
						}
					},
					httpRead: {
						useLocalResource: true,
						resourceFunction: function () {
							return angular.copy(certificate2SubsidiaryDataService.getList());
						}
					},
					httpCreate: {
						route: globals.webApiBaseUrl + 'businesspartner/certificate/certificate2subsidiary/',
						endCreate: 'create'
					},
					presenter: {list: {initCreationData: initCreationData}}
				}
			};

			let container = platformDataServiceFactory.createNewComplete(serviceOptions);
			let service = container.service;
			service.clear = clear;
			service.storeChanges = storeChanges;
			service.assertAllValidate = assertAllValidate;
			container.data.addUsingContainer = null;
			let validationService = businessPartnerCertificateToSubsidiaryValidationServiceFactory.create(execModuleName, service);
			container.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
				typeName: 'Certificate2subsidiaryDto',
				moduleSubModule: 'BusinessPartner.Certificate',
				validationService: validationService,
				mustValidateFields: ['SubsidiaryFk']
			});
			loadData();
			return service;

			function incorporateDataRead(responseData, data) {
				responseData = responseData || [];
				let dataRead = data.handleReadSucceeded(responseData, data);
				rootService.goToFirst();
				return dataRead;
			}

			function initCreationData(creationData) {
				let selected = rootService.getSelected();
				creationData.PKey1 = selected.Id;
			}

			function isRealRootForOpenedModule() {
				return false;
			}

			function loadData() {
				rootService.load();
			}

			function clear() {
				platformDataServiceModificationTrackingExtension.clearModificationsInRoot(rootService);
				let list = service.getList();
				platformDataValidationService.removeDeletedEntitiesFromErrorList(list, service);
				platformModuleStateService.clearState(rootService);
			}

			function storeChanges() {
				let toCreate = [];
				let toUpdate = [];
				let toDelete = [];
				let updateData = platformDataServiceModificationTrackingExtension.getModifications(service);
				if (!updateData) {
					return;
				}

				if (updateData[container.data.itemName + 'ToSave']) {
					let toSave = updateData[container.data.itemName + 'ToSave'];
					_.forEach(toSave, function (item) {
						if (item.Version === 0) {
							toCreate.push(item);
						} else {
							toUpdate.push(item);
						}
					});
				}

				if (updateData[container.data.itemName + 'ToDelete']) {
					toDelete = updateData[container.data.itemName + 'ToDelete'];
				}

				let dataList = certificate2SubsidiaryDataService.getList();
				if (toCreate.length > 0) {
					_.forEach(toCreate, function (item) {
						certificate2SubsidiaryDataService.doAfterCreation(angular.copy(item));
					});
				}

				if (toUpdate.length > 0) {
					_.forEach(toUpdate, function (item) {
						let foundItem = _.find(dataList, { Id: item.Id });
						if (!foundItem) {
							return;
						}
						foundItem.SubsidiaryFk = item.SubsidiaryFk;
						certificate2SubsidiaryDataService.markItemAsModified(foundItem);
					});
				}

				if (toDelete.length > 0) {
					_.forEach(toDelete, function (item) {
						let foundItem = _.find(dataList, { Id: item.Id });
						if (!foundItem) {
							return;
						}
						certificate2SubsidiaryDataService.deleteItem(foundItem);
					});
				}

				certificate2SubsidiaryDataService.storeCacheFor();
			}

			function assertAllValidate() {
				return platformDataServiceValidationErrorHandlerExtension.assertAllValid(rootService, rootContainer.data.isRealRootForOpenedModule());
			}
		}
	}
})(angular);