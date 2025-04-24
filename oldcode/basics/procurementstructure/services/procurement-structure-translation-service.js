/**
 * Created by wuj on 2/28/2015.
 */

(function (angular) {
	'use strict';
	var moduleName = 'basics.procurementstructure';
	angular.module(moduleName).factory('basicsProcurementstructureTranslationService',
		['$q','platformUIBaseTranslationService', 'basicsProcurementStructureLayout', 'basicsProcurementConfiguration2GeneralsLayout',
			'basicsProcurementConfiguration2CertLayout',
			'basicsProcurementAccountLayout', 'basicsProcurementClerkLayout','basicsProcurementEvaluationLayout','basicsProcurementEventLayout','basicsProcurementTaxCodeLayout',
			'procurementStructureInterCompanyLayout',
			function ($q,PlatformUIBaseTranslationService, procurementStructureLayout, configuration2GeneralsLayout,
			          configuration2CertLayout, accountLayout, clerkLayout, evaluationLayout,eventLayout,taxCodeLayout,interCompanyLayout)
			{

				function MyTranslationService(layout) {
					PlatformUIBaseTranslationService.call(this, layout);
					//for container information service use
					this.loadTranslations = function () {
						return $q.when(false);
					};
				}

				MyTranslationService.prototype = Object.create(PlatformUIBaseTranslationService.prototype);
				MyTranslationService.prototype.constructor = MyTranslationService;

				return new MyTranslationService(
					[procurementStructureLayout, configuration2GeneralsLayout, configuration2CertLayout, accountLayout, clerkLayout, evaluationLayout, eventLayout,taxCodeLayout,interCompanyLayout]
				);
			}

		]);

})(angular);