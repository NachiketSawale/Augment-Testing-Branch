/**
 * Created by shen on 1/18/2024
 */

/**
 * Created by shen on 1/18/2024
 */


(function (angular) {
	'use strict';
	let myModule = angular.module('resource.type');

	/**
	 * @ngdoc service
	 * @name resourceTypeRequestedSkillVDataService
	 * @description provides methods to access, create and update resource type requiredSkill entities
	 */
	myModule.service('resourceTypeRequestedSkillVDataService', ResourceTypeRequestedSkillVDataService);

	ResourceTypeRequestedSkillVDataService.$inject = ['platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'resourceTypeConstantValues', 'resourceTypeRequestedTypeDataService', 'platformRuntimeDataService'];

	function ResourceTypeRequestedSkillVDataService(platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
												  basicsCommonMandatoryProcessor, resourceTypeConstantValues, resourceTypeRequestedTypeDataService, platformRuntimeDataService) {

		let self = this;
		let resourceTypeRequestedSkillVOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'resourceTypeRequestedSkillVDataService',
				entityNameTranslationID: 'resource.type.resourceTypeRequestedSkillVEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'resource/type/requestedskillv/',
					endRead: 'listbyparent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						let selected = resourceTypeRequestedTypeDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: false, create: false},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(
					resourceTypeConstantValues.schemes.requestedSkillV),{processItem: (item) => { platformRuntimeDataService.readonly(item, true); }}],
				presenter: {list: {}},
				entityRole: {
					leaf: {itemName: 'RequestedSkillV', parentService: resourceTypeRequestedTypeDataService}
				}
			}
		};

		let serviceContainer = platformDataServiceFactory.createService(resourceTypeRequestedSkillVOption, self);
		serviceContainer.data.Initialised = false;
	}
})(angular);
