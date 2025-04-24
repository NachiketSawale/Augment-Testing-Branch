/**
 * Created by baf on 03.10.2018
 */

(function (angular) {
	/* global globals */
	'use strict';
	var myModule = angular.module('resource.skill');

	/**
	 * @ngdoc service
	 * @name resourceSkillChainDataService
	 * @description pprovides methods to access, create and update resource skill chain entities
	 */
	myModule.service('resourceSkillChainDataService', ResourceSkillChainDataService);

	ResourceSkillChainDataService.$inject = ['_', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'resourceSkillDataService', 'resourceSkillConstantValues'];

	function ResourceSkillChainDataService(_, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
		basicsCommonMandatoryProcessor, resourceSkillDataService, constValues) {
		var self = this;
		var resourceSkillChainServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'resourceSkillChainDataService',
				entityNameTranslationID: 'resource.skill.resourceSkillChainEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'resource/skill/chain/',
					endRead: 'listByParent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						var selected = resourceSkillDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: true, create: 'flat'},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(constValues.schemes.skillChain)],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							var selected = resourceSkillDataService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
				entityRole: {
					leaf: {itemName: 'ResourceSkillChains', parentService: resourceSkillDataService}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(resourceSkillChainServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'resourceSkillChainValidationService'
		}, constValues.schemes.skillChain ));
	}
})(angular);
