/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	/* jshint -W072 */ // many parameters because of dependency injection
	var boqMainModule = 'boq.main';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	angular.module('procurement.requisition')
		.factory('procurementRequisitionTranslationService', ['platformUIBaseTranslationService','$q',
			'procurementRequisitionHeaderLayout', 'basicsMaterialPriceConditionLayout','procurementRequisitionVariantLayout','procurementRequisitionBoqVariantLayout','procurementRequisitionItemVariantLayout',
			'modelViewerTranslationModules',

			function (PlatformUIBaseTranslationService, $q,procurementRequisitionHeaderLayout, priceConditionLayout,procurementRequisitionVariantLayout,procurementRequisitionBoqVariantLayout,procurementRequisitionItemVariantLayout,
				modelViewerTranslationModules) {

				function MyTranslationService(layout) {
					PlatformUIBaseTranslationService.call(this, layout);
				}

				MyTranslationService.prototype = Object.create(PlatformUIBaseTranslationService.prototype);
				MyTranslationService.prototype.constructor = MyTranslationService;

				var service = new MyTranslationService([{translationInfos:{extraModules: [boqMainModule].concat(modelViewerTranslationModules)}},
					procurementRequisitionHeaderLayout, priceConditionLayout,procurementRequisitionVariantLayout,procurementRequisitionBoqVariantLayout,procurementRequisitionItemVariantLayout]);

				// for container information service use   module container lookup
				service.loadTranslations = function loadTranslations() {
					return $q.when(false);
				};

				return service;
			}

		]);

})(angular);
