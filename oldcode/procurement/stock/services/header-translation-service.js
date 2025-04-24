// eslint-disable-next-line func-names
// eslint-disable-next-line no-redeclare
/* global angular */
(function (angular) {
	'use strict';
	var modName = 'procurement.stock';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(modName).factory('procurementStockTranslationService', ['platformUIBaseTranslationService', '$q',
		'procurementStockLayout','procurementStockStockTotalLayout','procurementStockTransactionLayout', 'procurementStockOrderProposalLayout','procurementStockAccrualDetailLayout','procurementStockItemInfoLayout',
		// eslint-disable-next-line func-names
		function (PlatformUIBaseTranslationService, $q, procurementStockLayout,procurementStockStockTotalLayout,procurementStockTransactionLayout, procurementStockOrderProposalLayout,procurementStockAccrualDetailLayout,procurementStockItemInfoLayout) {
			// eslint-disable-next-line func-names
			function MyTranslationService(layout) {
				PlatformUIBaseTranslationService.call(this, layout);
			}

			MyTranslationService.prototype = Object.create(PlatformUIBaseTranslationService.prototype);
			MyTranslationService.prototype.constructor = MyTranslationService;

			var service = new MyTranslationService(
				[
					procurementStockLayout,
					procurementStockStockTotalLayout,
					procurementStockTransactionLayout,
					procurementStockOrderProposalLayout,
					procurementStockAccrualDetailLayout,
					procurementStockItemInfoLayout
				]
			);

			// for container information service use
			service.loadTranslations = function loadTranslations() {
				return $q.when(false);
			};

			return service;
		}

	]);

})(angular);