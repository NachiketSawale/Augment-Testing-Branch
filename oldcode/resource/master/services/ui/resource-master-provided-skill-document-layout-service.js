/**
 * Created by henkel
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.master';

	/**
	 * @ngdoc controller
	 * @name resourceMasterProvidedSkillDocumentLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  resource master provided skill document entity.
	 **/
	angular.module(moduleName).service('resourceMasterProvidedSkillDocumentLayoutService', ResourceMasterProvidedSkillDocumentLayoutService);

	ResourceMasterProvidedSkillDocumentLayoutService.$inject = ['platformUIConfigInitService', 'resourceMasterContainerInformationService',
		'resourceMasterTranslationService', 'resourceMasterConstantValues'];

	function ResourceMasterProvidedSkillDocumentLayoutService(platformUIConfigInitService, resourceMasterContainerInformationService,
	  resourceMasterTranslationService, values) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: resourceMasterContainerInformationService.getProvidedSkillDocumentLayout(),
			dtoSchemeId: values.schemes.providedSkillDocument,
			translator: resourceMasterTranslationService
		});
	}
})(angular);