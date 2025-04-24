(function (angular) {
	'use strict';

	var moduleName = 'basics.characteristic';

	/**
	 * @ngdoc service
	 * @name
	 * @description provides translation for this module
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).service('basicsCharacteristicTranslationService',
		['platformUIBaseTranslationService',
			'basicsCharacteristicDiscreteValueLayout',
			'basicsCharacteristicGroupLayout',
			'basicsCharacteristicCharacteristicLayoutService',
			'basicsCharacteristicUsedInCompanyLayoutService',
			'basicsCharacteristicSectionDetailLayout','$q',
			'basicsCharacteristicChainCharacteristicLayout',
			function (platformUIBaseTranslationService,
		          basicsCharacteristicDiscreteValueLayout,
		          basicsCharacteristicGroupLayout,
		          basicsCharacteristicCharacteristicLayoutService,
		          basicsCharacteristicUsedInCompanyLayoutService,
		          basicsCharacteristicSectionDetailLayout,$q,
		          basicsCharacteristicChainCharacteristicLayout) {
				var service={};

				var layouts = [basicsCharacteristicCharacteristicLayoutService.getLayout(), basicsCharacteristicDiscreteValueLayout, basicsCharacteristicGroupLayout, basicsCharacteristicUsedInCompanyLayoutService.getLayout(),	basicsCharacteristicSectionDetailLayout,
					basicsCharacteristicChainCharacteristicLayout];
				var localBuffer = {};

				function TranslationService(layout) {
					platformUIBaseTranslationService.call(this, layout,localBuffer);
				}
				TranslationService.prototype = Object.create(platformUIBaseTranslationService.prototype);
				TranslationService.prototype.constructor = TranslationService;

				service = new TranslationService(layouts);
				service.loadTranslations = function loadTranslations() {
					return $q.when(false);
				};
				return service;

			}
		]);

})(angular);
