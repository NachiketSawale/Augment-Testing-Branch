/**
 * Created by chlai on 10.01.2025
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.reservation';

	/**
	 * @ngdoc controller
	 * @name resourceReservationStructureLayoutService
	 * @function
	 *
	 * @description
	 * This service provides layout for structure container of  Resource Reservation entity.
	 **/
	angular.module(moduleName).service('resourceReservationStructureLayoutService', ResourceReservationStructureLayoutService);

	ResourceReservationStructureLayoutService.$inject = ['platformUIConfigInitService', 'resourceReservationContainerInformationService',
		'resourceReservationTranslationService', 'platformSchemaService', 'platformUIStandardConfigService'];

	function ResourceReservationStructureLayoutService(platformUIConfigInitService, resourceReservationContainerInformationService,
		resourceReservationTranslationService, platformSchemaService, platformUIStandardConfigService) {

		let servData = {
			service: this,
			layout: resourceReservationContainerInformationService.getResourceReservationStructLayout(),
			dtoSchemeId: {
				moduleSubModule: 'Resource.Reservation',
				typeName: 'ReservationDto'
			},
			translator: resourceReservationTranslationService,
			entityInformation: { module: angular.module(moduleName), moduleName: 'Resource.Reservation', entity: 'Reservation' }
		};

		platformUIConfigInitService.createUIConfigurationService(servData);

		let attrDomians = platformSchemaService.getSchemaFromCache(servData.dtoSchemeId);

		return new platformUIStandardConfigService(servData.layout, attrDomians.properties, resourceReservationTranslationService);
	}

})(angular);