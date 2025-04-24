/**
 * Created by baf on 24.04.2019
 */

(function (angular) {
	/* global globals */
	'use strict';
	let myModule = angular.module('resource.wot');

	/**
	 * @ngdoc service
	 * @name resourceWotOperationPlantTypeDataService
	 * @description pprovides methods to access, create and update resource wot operationPlantType entities
	 */
	myModule.service('resourceWotOperationPlantTypeDataService', ResourceWotOperationPlantTypeDataService);

	ResourceWotOperationPlantTypeDataService.$inject = ['_', '$http', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'resourceWotConstantValues', 'resourceWotWorkOperationTypeDataService'];

	function ResourceWotOperationPlantTypeDataService(_, $http, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
		basicsCommonMandatoryProcessor, resourceWotConstantValues, resourceWotWorkOperationTypeDataService) {
		let self = this;
		let resourceWotOperationPlantTypeServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'resourceWotOperationPlantTypeDataService',
				entityNameTranslationID: 'resource.wot.workOperationPlantTypeEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'resource/wot/operationplanttype/',
					endRead: 'listByParent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						let selected = resourceWotWorkOperationTypeDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: true, create: 'flat'},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(
					resourceWotConstantValues.schemes.operationPlantType)],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							let selected = resourceWotWorkOperationTypeDataService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
				entityRole: {
					leaf: {itemName: 'Operation2PlantTypes', parentService: resourceWotWorkOperationTypeDataService}
				}
			}
		};

		let serviceContainer = platformDataServiceFactory.createService(resourceWotOperationPlantTypeServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'resourceWotOperationPlantTypeValidationService'
		}, resourceWotConstantValues.schemes.operationPlantType));

		serviceContainer.service.getWOTs = function getWOTs(plantFk) {
			let getTypeEndPoint = globals.webApiBaseUrl + 'resource/wot/workoperationtype/listbyplanttype';
			return $http.get(getTypeEndPoint, {params: {plantFk: plantFk}}).then(function (response) {
				return response.data;
			});
		};

		serviceContainer.service.getDefaultWOT = function getDefaultWOT(plantFk) {
			return serviceContainer.service.getWOTs(plantFk).then(function (wots) {
				return _.first(_.filter(wots,function(item){return item.IsDefault;}));
			});
		};
	}
})(angular);
