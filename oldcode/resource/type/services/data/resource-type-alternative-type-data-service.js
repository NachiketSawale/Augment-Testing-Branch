/**
 * Created by chlai on 2025/01/24
 */

(function (angular) {
	'use strict';
	let myModule = angular.module('resource.type');

	/**
	 * @ngdoc service
	 * @name resourceTypeAlternativeTypeDataService
	 * @description provides methods to access, create and update resource type requiredSkill entities
	 */
	myModule.service('resourceTypeAlternativeTypeDataService', ResourceTypeAlternativeTypeDataService);

	ResourceTypeAlternativeTypeDataService.$inject = ['platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'resourceTypeConstantValues', 'resourceTypeDataService', 'platformRuntimeDataService'];

	function ResourceTypeAlternativeTypeDataService(platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
												  basicsCommonMandatoryProcessor, resourceTypeConstantValues, resourceTypeDataService, platformRuntimeDataService) {

		let self = this;
		let resourceTypeAlternativeResTypeOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'resourceTypeAlternativeTypeDataService',
				entityNameTranslationID: 'resource.type.alternativeResTypeEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'resource/type/alternativerestype/',
					endRead: 'listbyparent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						let selected = resourceTypeDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: true, create: 'flat'},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(
					resourceTypeConstantValues.schemes.alternativeResType), {processItem: processItem}],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							let selected = resourceTypeDataService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
				entityRole: {
					leaf: {itemName: 'AlternativeTypes', parentService: resourceTypeDataService}
				}
			}
		};

		let serviceContainer = platformDataServiceFactory.createService(resourceTypeAlternativeResTypeOption, self);
		serviceContainer.data.Initialised = false;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'resourceTypeAlternativeTypeValidationService'
		}, resourceTypeConstantValues.schemes.alternativeResType));

		function processItem(item) {
			platformRuntimeDataService.readonly(item, [{field: 'PlantGroupFk' , readonly: true}]);
		}

	}
})(angular);
