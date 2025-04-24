/**
 * Created by baf on 03.12.2018
 */

(function (angular) {
	'use strict';
	var myModule = angular.module('resource.type');

	/**
	 * @ngdoc service
	 * @name resourceTypeRequiredSkillDataService
	 * @description pprovides methods to access, create and update resource type requiredSkill entities
	 */
	myModule.service('resourceTypeRequiredSkillDataService', ResourceTypeRequiredSkillDataService);

	ResourceTypeRequiredSkillDataService.$inject = ['platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'resourceTypeConstantValues', 'resourceTypeDataService'];

	function ResourceTypeRequiredSkillDataService(platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
		basicsCommonMandatoryProcessor, resourceTypeConstantValues, resourceTypeDataService) {

		var self = this;
		var resourceTypeRequiredSkillServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'resourceTypeRequiredSkillDataService',
				entityNameTranslationID: 'resource.skill.resourceTypeRequiredSkillEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'resource/type/requiredSkill/',
					endRead: 'listByParent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						var selected = resourceTypeDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: true, create: 'flat'},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(
					resourceTypeConstantValues.schemes.requiredSkill)],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							var selected = resourceTypeDataService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
				entityRole: {
					leaf: {itemName: 'RequiredSkills', parentService: resourceTypeDataService}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(resourceTypeRequiredSkillServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'resourceTypeRequiredSkillValidationService'
		}, resourceTypeConstantValues.schemes.requiredSkill));
	}
})(angular);
