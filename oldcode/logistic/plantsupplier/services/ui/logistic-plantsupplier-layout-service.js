/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	var moduleName = 'logistic.plantsupplier';

	/**
	 * @ngdoc service
	 * @name logisticPlantSupplierLayoutService
	 * @function
	 * @requires platformUIConfigInitService
	 *
	 * @description
	 * The UI layout service for the plant supplier entity.
	 */
	angular.module(moduleName).service('logisticPlantSupplierLayoutService', LogisticPlantSupplierLayoutService);

	LogisticPlantSupplierLayoutService.$inject = ['platformUIConfigInitService', 'logisticPlantsupplierContainerInformationService',
		'logisticPlantSupplierTranslationService', 'logisticPlantSupplierConstantValues'];

	function LogisticPlantSupplierLayoutService(platformUIConfigInitService, logisticPlantsupplierContainerInformationService,
		logisticPlantSupplierTranslationService, logisticPlantSupplierConstantValues) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: logisticPlantsupplierContainerInformationService.getPlantSupplierLayout(),
			dtoSchemeId: logisticPlantSupplierConstantValues.schemes.plantSupplier,
			translator: logisticPlantSupplierTranslationService
		});
	}
})(angular);
