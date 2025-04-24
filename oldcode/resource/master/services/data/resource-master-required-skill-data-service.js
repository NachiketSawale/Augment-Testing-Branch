/**
 * Created by baf on 04.10.2018
 */

(function (angular) {
	'use strict';
	var myModule = angular.module('resource.master');

	/**
	 * @ngdoc service
	 * @name resourceMasterDataService
	 * @description pprovides methods to access, create and update resource master required skill entities
	 */
	myModule.service('resourceMasterRequiredSkillDataService', ResourceMasterRequiredSkillDataService);

	ResourceMasterRequiredSkillDataService.$inject = ['_', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'resourceMasterMainService', 'resourceMasterConstantValues'];

	function ResourceMasterRequiredSkillDataService(_, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
	  basicsCommonMandatoryProcessor, resourceMasterMainService, values) {
		var self = this;
		var resourceMasterServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'resourceMasterDataService',
				entityNameTranslationID: 'resource.master.requiredSkillEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'resource/master/requiredskill/',
					endRead: 'listbyparent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						var selected = resourceMasterMainService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: true, create: 'flat'},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(
					values.schemes.requiredSkill)],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							var selected = resourceMasterMainService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
				entityRole: {
					leaf: {itemName: 'RequiredSkills', parentService: resourceMasterMainService}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(resourceMasterServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'resourceMasterRequiredSkillValidationService'
		}, values.schemes.requiredSkill));
	}
})(angular);
