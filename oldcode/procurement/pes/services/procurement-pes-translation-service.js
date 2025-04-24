/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	const procurementPesModuleName = 'procurement.pes',
		cloudCommonModule = 'cloud.common',
		procurementCommonModule = 'procurement.common',
		cloudDesktopModule = 'cloud.desktop',
		businessPartnerModule = 'businesspartner.main',
		modelWdeViewerModule = 'model.wdeviewer',
		boqMainModule = 'boq.main',
		controllingStructureModule = 'controlling.structure',
		logisticJobModule = 'logistic.job',
		stockModule = 'procurement.stock';

	/**
	 * @ngdoc service
	 * @name basicsCharacteristicTranslationService
	 * @description provides translation for basics Characteristic module
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(procurementPesModuleName).factory('procurementPesTranslationService',
		['$q', 'platformUIBaseTranslationService', 'platformTranslateService', 'procurementPesHeaderDetailLayout',
			'procurementPesItemDetailLayout', 'procurementPesBoqDetailLayout', 'procurementPesShipmentInfoLayout',
			'procurementPesAccrualDetailLayout', 'procurementPesProgressReportDetailLayout', 'procurementPesSelfbillingDetailLayout', 'procurementPesTransactionLayout',
			'modelViewerTranslationModules',
			function ($q, PlatformUIBaseTranslationService, platformTranslateService, procurementPesHeaderDetailLayout,
				procurementPesItemDetailLayout, procurementPesBoqDetailLayout, procurementPesShipmentInfoLayout,
				procurementPesAccrualDetailLayout, procurementPesProgressReportDetailLayout, procurementPesSelfbillingDetailLayout, procurementPesTransactionLayout,
				modelViewerTranslationModules) {

				var myPrivates = {};

				function TranslationService(layout, privates) {
					PlatformUIBaseTranslationService.call(this, layout, privates);
				}

				TranslationService.prototype = Object.create(PlatformUIBaseTranslationService.prototype);
				TranslationService.prototype.constructor = TranslationService;

				platformTranslateService.registerModule(
					[
						procurementPesModuleName,
						cloudCommonModule,
						procurementCommonModule,
						cloudDesktopModule,
						businessPartnerModule,
						modelWdeViewerModule,
						boqMainModule,
						logisticJobModule,
						controllingStructureModule,
						stockModule
					].concat(modelViewerTranslationModules));

				var service = new TranslationService(
					[
						procurementPesHeaderDetailLayout,
						procurementPesItemDetailLayout,
						procurementPesBoqDetailLayout,
						procurementPesShipmentInfoLayout,
						procurementPesAccrualDetailLayout,
						procurementPesProgressReportDetailLayout,
						procurementPesSelfbillingDetailLayout,
						procurementPesTransactionLayout
					], myPrivates);

				// for container information service use   module container lookup
				service.loadTranslations = function loadTranslations() {
					return $q.when(false);
				};

				service.getTranslationInformation = function getTranslationInformation(key) {
					var information = myPrivates.words[key];
					if (angular.isUndefined(information) || (information === null)) {
						// Remove prefix from key that's supposed to be separated by a dot and check again.
						key = key.substring(key.indexOf('.') + 1);
						information = myPrivates.words[key];
					}
					return information;
				};

				return service;
			}
		]);

})(angular);
