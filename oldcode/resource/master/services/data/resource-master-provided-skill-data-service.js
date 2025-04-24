/**
 * Created by baf on 04.10.2018
 */

(function (angular) {
	'use strict';
	var myModule = angular.module('resource.master');

	/**
	 * @ngdoc service
	 * @name resourceMasterProvidedSkillDataService
	 * @description pprovides methods to access, create and update resource master providedSkill entities
	 */
	myModule.service('resourceMasterProvidedSkillDataService', ResourceMasterProvidedSkillDataService);

	ResourceMasterProvidedSkillDataService.$inject = ['_', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'resourceMasterMainService', 'resourceMasterConstantValues'];

	function ResourceMasterProvidedSkillDataService(_, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
	  basicsCommonMandatoryProcessor, resourceMasterMainService, values) {
		var self = this;
		var resourceMasterProvidedSkillServiceOption = {
			flatNodeItem: {
				module: myModule,
				serviceName: 'resourceMasterProvidedSkillDataService',
				entityNameTranslationID: 'resource.master.providedSkillEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'resource/master/providedskill/',
					endRead: 'listbyparent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						var selected = resourceMasterMainService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: true, create: 'flat'},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(
					values.schemes.providedSkill)],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							var selected = resourceMasterMainService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
				entityRole: {
					node: {itemName: 'ProvidedSkills', parentService: resourceMasterMainService}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(resourceMasterProvidedSkillServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'resourceMasterProvidedSkillValidationService'
		}, values.schemes.providedSkill));
	}
})(angular);
