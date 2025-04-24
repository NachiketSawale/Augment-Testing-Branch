/**
 * Created by baf on 30.10.2018
 */

(function (angular) {
	'use strict';
	var myModule = angular.module('resource.requisition');

	/**
	 * @ngdoc service
	 * @name resourceRequisitionRequiredSkillDataService
	 * @description pprovides methods to access, create and update resource requisition requiredSkill entities
	 */
	myModule.service('resourceRequisitionRequiredSkillDataService', ResourceRequisitionRequiredSkillDataService);

	ResourceRequisitionRequiredSkillDataService.$inject = ['platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'resourceRequisitionConstantValues', 'resourceRequisitionDataService'];

	function ResourceRequisitionRequiredSkillDataService(platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
	  basicsCommonMandatoryProcessor, resourceRequisitionConstantValues, resourceRequisitionDataService) {
		var self = this;
		var resourceRequisitionRequiredSkillServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'resourceRequisitionRequiredSkillDataService',
				entityNameTranslationID: 'resource.requisition.requiredSkillEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'resource/requisition/requiredskill/',
					endRead: 'listByParent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						var selected = resourceRequisitionDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(resourceRequisitionConstantValues.schemes.requiredSkill)],
				actions: {delete: true, create: 'flat'},
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							var selected = resourceRequisitionDataService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
				entityRole: {
					leaf: {itemName: 'RequiredSkills', parentService: resourceRequisitionDataService}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(resourceRequisitionRequiredSkillServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'resourceRequisitionRequiredSkillValidationService'
		}, resourceRequisitionConstantValues.schemes.requiredSkill ));
	}
})(angular);
