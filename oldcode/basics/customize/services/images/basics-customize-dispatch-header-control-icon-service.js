/**
 * Created by baf on 2018/11/02.
 */
(function () {
	/* global globals */
	'use strict';
	var moduleName = 'basics.customize';

	/**
	 * @ngdoc service
	 * @name basicsCustomizeCostCodeIconService
	 * @function
	 *
	 * @description
	 *
	 */
	angular.module(moduleName).service('basicsCustomizeDispatchHeaderControlIconService', BasicsCustomizeDispatchHeaderControlIconService);

	BasicsCustomizeDispatchHeaderControlIconService.$inject = ['platformIconBasisService'];

	function provideImageUrl(icon) {
		return globals.appBaseUrl + 'cloud.style/content/images/control-icons.svg#ico-' + icon;
	}

	function provideTranslationKey(term) {
		return 'basics.customize.dispatchHeaderLinkage' + term;
	}

	function BasicsCustomizeDispatchHeaderControlIconService(platformIconBasisService) {
		
		platformIconBasisService.setBasicPath(undefined);

		var icons = [
			platformIconBasisService.createUrlIconWithId(1, provideTranslationKey('Reference'), provideImageUrl('reference1')),
			platformIconBasisService.createUrlIconWithId(2, provideTranslationKey('Link'), provideImageUrl('link')),
			platformIconBasisService.createUrlIconWithId(3, provideTranslationKey('Add'), provideImageUrl('plus')),
			platformIconBasisService.createUrlIconWithId(4, provideTranslationKey('Reduce'), provideImageUrl('minus')),
			platformIconBasisService.createUrlIconWithId(5, provideTranslationKey('Edit'), provideImageUrl('edit2')),
			platformIconBasisService.createUrlIconWithId(6, provideTranslationKey('Exchange'), provideImageUrl('refresh')),
			platformIconBasisService.createUrlIconWithId(7, provideTranslationKey('Correct'), provideImageUrl('status'))
		];

		platformIconBasisService.extend(icons, this);
	}
})();
