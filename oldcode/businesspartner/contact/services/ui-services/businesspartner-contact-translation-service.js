/**
 * Created by chi on 4/16/2015.
 */
(function (angular) {
	'use strict';

	let moduleName = 'businesspartner.contact';

	/**
	 * @ngdoc service
	 * @name businesspartnerContactTranslationService
	 * @description
	 *
	 * Translation service for module businesspartner contact.
	 */
	angular.module(moduleName).service('businesspartnerContactTranslationService', [
		'$q', 'platformUIBaseTranslationService', 'businessPartnerContactLayout', 'businesspartnerContact2BpAssignmentLayout','businessPartnerContact2CompanyLayout','businessPartnerContactExtRoleLayout',
		'businessPartnerContact2ExternalLayout',
		function ($q, platformUIBaseTranslationService, businessPartnerContactLayout, businesspartnerContact2BpAssignmentLayout,businessPartnerContact2CompanyLayout,businessPartnerContactExtRoleLayout,businessPartnerContact2ExternalLayout) {

			let layouts = [businessPartnerContactLayout, businesspartnerContact2BpAssignmentLayout, businessPartnerContact2CompanyLayout, businessPartnerContactExtRoleLayout, businessPartnerContact2ExternalLayout];
			let localBuffer = {};

			function TranslationService(layouts) {
				platformUIBaseTranslationService.call(this, layouts, localBuffer);
			}

			TranslationService.prototype = Object.create(platformUIBaseTranslationService.prototype);
			TranslationService.prototype.constructor = TranslationService;

			let service = new TranslationService(layouts);
			service.loadTranslations = function loadTranslations() {
				return $q.when(false);
			};

			return service;
		}
	]);
})(angular);