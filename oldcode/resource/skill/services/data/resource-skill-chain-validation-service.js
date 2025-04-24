/**
 * Created by baf on 03.10.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.skill';

	/**
	 * @ngdoc service
	 * @name resourceSkillChainValidationService
	 * @description provides validation methods for resource skill chain entities
	 */
	angular.module(moduleName).service('resourceSkillChainValidationService', ResourceSkillChainValidationService);

	ResourceSkillChainValidationService.$inject = ['platformValidationServiceFactory', 'resourceSkillConstantValues', 'resourceSkillChainDataService', 'platformDataValidationService'];

	function ResourceSkillChainValidationService(platformValidationServiceFactory, resourceSkillConstantValues, resourceSkillChainDataService, platformDataValidationService) {
		var self = this;

		platformValidationServiceFactory.addValidationServiceInterface(resourceSkillConstantValues.schemes.skillChain, {
			mandatory: platformValidationServiceFactory.determineMandatoryProperties(resourceSkillConstantValues.schemes.skillChain)
		},
		self,
		resourceSkillChainDataService);

		self.validateChainedSkillFk = function validateChainedSkillFk(entity, value, model) {
			var items = resourceSkillChainDataService.getList();
			return platformDataValidationService.validateIsUnique(entity, value, model, items, this, resourceSkillChainDataService);
		};
	}
})(angular);
