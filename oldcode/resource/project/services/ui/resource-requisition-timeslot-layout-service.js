/**
 * Created by shen on 28.01.2025
 */


(function (angular) {
	'use strict';
	const moduleName = 'resource.project';

	/**
	 * @ngdoc controller
	 * @name resourceProjectRequisitionTimeslotLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of requisition timeslot entity.
	 **/
	angular.module(moduleName).service('resourceProjectRequisitionTimeslotLayoutService', ResourceProjectRequisitionTimeslotLayoutService);

	ResourceProjectRequisitionTimeslotLayoutService.$inject = ['platformUIConfigInitService', 'resourceProjectContainerInformationService', 'resourceProjectConstantValues', 'resourceProjectTranslationService'];

	function ResourceProjectRequisitionTimeslotLayoutService(platformUIConfigInitService, resourceProjectContainerInformationService, resourceProjectConstantValues, resourceProjectTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: resourceProjectContainerInformationService.getRequisitionTimeslotLayout(),
			dtoSchemeId: resourceProjectConstantValues.schemes.requisitionTimeslot,
			translator: resourceProjectTranslationService
		});
	}
})(angular);