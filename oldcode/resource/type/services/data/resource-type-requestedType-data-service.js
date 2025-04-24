/**
 * Created by shen on 1/18/2024
 */


(function (angular) {
	'use strict';
	let myModule = angular.module('resource.type');

	/**
	 * @ngdoc service
	 * @name resourceTypeRequestedTypeDataService
	 * @description provides methods to access, create and update resource type requiredSkill entities
	 */
	myModule.service('resourceTypeRequestedTypeDataService', ResourceTypeRequestedTypeDataService);

	ResourceTypeRequestedTypeDataService.$inject = ['platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'resourceTypeConstantValues', 'resourceTypeDataService', 'platformRuntimeDataService'];

	function ResourceTypeRequestedTypeDataService(platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
												  basicsCommonMandatoryProcessor, resourceTypeConstantValues, resourceTypeDataService, platformRuntimeDataService) {

		let self = this;
		let resourceTypeRequestedTypeOption = {
			flatNodeItem: {
				module: myModule,
				serviceName: 'resourceTypeRequestedTypeDataService',
				entityNameTranslationID: 'resource.type.resourceTypeRequestedTypeEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'resource/type/requestedtype/',
					endRead: 'listbyparent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						let selected = resourceTypeDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: true, create: 'flat'},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(
					resourceTypeConstantValues.schemes.requiredSkill), {processItem: processItem}],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							let selected = resourceTypeDataService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
				entityRole: {
					node: {itemName: 'RequestedTypes', parentService: resourceTypeDataService}
				}
			}
		};

		let serviceContainer = platformDataServiceFactory.createService(resourceTypeRequestedTypeOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: ''
		}, resourceTypeConstantValues.schemes.requestedType));

		function processItem(item) {
			if (item.IsRequestedEntirePeriod === true) {
				platformRuntimeDataService.readonly(item, [{field: 'Duration' , readonly: true}]);
			}
			else{
				platformRuntimeDataService.readonly(item, [{field: 'Duration' , readonly: false}]);
			}
			platformRuntimeDataService.readonly(item, [{field: 'UomDayFk' , readonly: true}]);
		}
	}
})(angular);
