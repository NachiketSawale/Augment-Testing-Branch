/**
 * Created by anl on 11/14/2017.
 */

(function (angular) {
	'use strict';

	var moduleName = 'transportplanning.requisition';

	angular.module(moduleName).factory('transportplanningRequisitionMatRequisitionDataService', MatRequisitionDataService);
	MatRequisitionDataService.$inject = ['basicsCommonMandatoryProcessor', 'platformDataServiceFactory',
		'transportplanningRequisitionMainService',
		'transportplanningRequisitionMatRequisitionDataProcessor',
		'transportplanningRequisitionMatRequisitionValidationService',
		'trsGoodsTypes'];

	function MatRequisitionDataService(basicsCommonMandatoryProcessor, platformDataServiceFactory,
									   parentService,
									   dataProcessor,
									   validationService,
									   trsGoodsTypes) {

		var serviceCache = {};

		function createService(options) {
			moduleName = moduleName || options.moduleName;
			parentService = options.parentService;
			var serviceOption = {
				flatLeafItem: {
					dataProcessor: [dataProcessor],
					module: angular.module(moduleName),
					serviceName: moduleName + 'MatRequisitionDataService',
					entityNameTranslationID: 'transportplanning.requisition.matrequisition.listTitle',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'transportplanning/requisition/trsgoods/',
						endRead: 'listMaterial'
					},
					entityRole: {
						leaf: {
							itemName: 'MatRequisition',
							parentService: parentService,
							parentFilter: 'TrsRequisitionId'
						}
					},
					presenter: {
						list: {
							incorporateDataRead: function (readData, data) {
								return data.handleReadSucceeded(readData, data);
							},
							initCreationData: function initCreationData(creationData) {
								var selected = parentService.getSelected();
								creationData.PKey1 = selected.Id;
							}
						}
					},
					actions: {
						create: 'flat',
						delete: {},
						canDeleteCallBackFunc: function () {
							return parentService.getSelected() && !parentService.isSelectedItemAccepted();
						}
					}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);

			serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
				typeName: 'TrsGoodsDto',
				moduleSubModule: 'TransportPlanning.Requisition',
				validationService: validationService.getService(options.key, serviceContainer.service),
				mustValidateFields: ['MdcMaterialFk']
			});

			serviceContainer.service.canCreate = function () {
				return parentService.getSelected() && !parentService.isSelectedItemAccepted();
			};

			serviceContainer.service.onPropertyChanged = function (entity, field) {
				switch (field) {
					case 'MdcMaterialFk':
						var lookupInfo = trsGoodsTypes.lookupInfo[trsGoodsTypes.Material];
						if (lookupInfo) {
							if (entity.selectedMaterial) {
								entity.UomFk = _.get(entity.selectedMaterial, lookupInfo.uomFkPropertyName, entity.UomFk);
							}
						}
						break;
				}
				serviceContainer.service.markItemAsModified(entity);
			};

			return serviceContainer.service;
		}

		function getService(key, options) {
			if (_.isNil(serviceCache[key])) {
				serviceCache[key] = createService(options);
			}
			return serviceCache[key];
		}

		return {
			getService: getService
		};
	}
})(angular);
