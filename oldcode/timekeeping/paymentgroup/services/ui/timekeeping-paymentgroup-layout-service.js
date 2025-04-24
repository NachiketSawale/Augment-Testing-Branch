/*
 * $Id: timekeeping-paymentgroup-configuration-service.js 623094 2021-02-08 11:24:09Z leo $
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	var modName = 'timekeeping.paymentgroup';
	var module = angular.module(modName);

	/**
	 * @ngdoc service
	 * @name timekeepingPaymentGroupLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of timekeeping crew assignment entity
	 */
	module.service('timekeepingPaymentGroupLayoutService', TimekeepingPaymentGroupLayoutService);

	TimekeepingPaymentGroupLayoutService.$inject = ['platformUIConfigInitService', 'timekeepingPaymentgroupContainerInformationService',
		'timekeepingPaymentGroupTranslationService'];

	function TimekeepingPaymentGroupLayoutService(platformUIConfigInitService, timekeepingPaymentgroupContainerInformationService, timekeepingPaymentGroupTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: timekeepingPaymentgroupContainerInformationService.getPaymentGroupLayout(),
			dtoSchemeId: { typeName: 'PaymentGroupDto', moduleSubModule: 'Timekeeping.PaymentGroup'},
			translator: timekeepingPaymentGroupTranslationService
		});
	}
})();
