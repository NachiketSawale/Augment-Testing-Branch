/**
 * Created by baf on 03.10.2018
 */

(function (angular) {
	/* global globals */
	'use strict';
	var myModule = angular.module('resource.skill');

	/**
	 * @ngdoc service
	 * @name resourceSkillDataService
	 * @description provides methods to access, create and update resource skill  entities
	 */
	myModule.service('resourceSkillDataService', ResourceSkillDataService);

	ResourceSkillDataService.$inject = ['_', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'resourceSkillConstantValues'];

	function ResourceSkillDataService(_, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
		basicsCommonMandatoryProcessor, constValues) {
		var self = this;
		var resourceSkillServiceOption = {
			flatRootItem: {
				module: myModule,
				serviceName: 'resourceSkillDataService',
				entityNameTranslationID: 'resource.skill.resourceSkillEntity',
				httpCRUD: {route: globals.webApiBaseUrl + 'resource/skill/', usePostForRead: true, endRead: 'filtered', endDelete: 'multidelete'},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(constValues.schemes.skill)],
				entityRole: {root: {itemName: 'ResourceSkills', moduleName: 'cloud.desktop.moduleDisplayNameResourceSkill'}},
				entitySelection: {supportsMultiSelection: true},
				presenter: {list: {}},
				translation: {
					uid: 'resourceSkillDataService',
					title: 'resource.skill.resourceSkillEntity',
					columns: [{ header: 'cloud.common.entityDescription', field: 'DescriptionInfo' }],
					dtoScheme: constValues.schemes.skill
				},
				sidebarSearch: {
					options: {
						moduleName: 'resource.skill',
						enhancedSearchEnabled: true,
						enhancedSearchVersion: '2.0',
						pattern: '',
						pageSize: 100,
						useCurrentClient: null,
						includeNonActiveItems: false,
						showOptions: true,
						showProjectContext: false,
						withExecutionHints: true
					}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(resourceSkillServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'resourceSkillValidationService'
		}, constValues.schemes.skill ));

		serviceContainer.service.getDtoSchemeId = function getSkillDtoSchemeId() {
			return constValues.schemes.skill;
		};
	}
})(angular);
