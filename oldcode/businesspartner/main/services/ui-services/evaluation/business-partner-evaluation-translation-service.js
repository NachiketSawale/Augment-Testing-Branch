(function (angular) {
	'use strict';
	let moduleName = 'businesspartner.main';

	angular.module(moduleName).service('businessPartnerEvaluationTranslationService', ['$q', 'platformUIBaseTranslationService',
		'commonBusinessPartnerBusinessPartnerEvaluationDetailLayout', 'businessPartnerEvaluationDetailLayout', 'businessPartnerEvaluationItemDataDetailLayout',
		'businessPartnerEvaluationGroupDataDetailLayout', 'businessPartnerEvaluationDocumentDataDetailLayout',
		/* jshint -W072 */
		function ($q, platformUIBaseTranslationService,
			businessPartnerBusinessPartnerEvaluationDetailLayout, businessPartnerEvaluationDetailLayout, businessPartnerEvaluationItemDataDetailLayout,
			businessPartnerEvaluationGroupDataDetailLayout, businessPartnerEvaluationDocumentDataDetailLayout) {
			let layouts = [businessPartnerBusinessPartnerEvaluationDetailLayout, businessPartnerEvaluationDetailLayout, businessPartnerEvaluationItemDataDetailLayout,
				businessPartnerEvaluationGroupDataDetailLayout, businessPartnerEvaluationDocumentDataDetailLayout];
			let localBuffer = {};

			function TranslationService(layouts) {
				platformUIBaseTranslationService.call(this, layouts, localBuffer);
			}

			TranslationService.prototype = Object.create(platformUIBaseTranslationService.prototype);
			TranslationService.prototype.constructor = TranslationService;
			let service = new TranslationService(layouts);

			// platformUIBaseTranslationService.call(this, layouts, localBuffer);
			// for container information service use   module container lookup
			service.loadTranslations = function loadTranslations() {
				return $q.when(false);
			};
			return service;
		}
	]);
})(angular);
