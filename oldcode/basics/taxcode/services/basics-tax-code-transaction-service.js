/*
 * Created by alm on 08.31.2020.
 */

(function (angular) {
	'use strict';

	var moduleName = 'basics.taxcode';
	/**
     * @ngdoc service
     * @name basicsUnitTranslationService
     * @description provides translation for basics unit module
     */
	angular.module(moduleName).factory('basicsTaxCodeTranslationService', ['platformUIBaseTranslationService', 'basicsTaxCodeLayout', 'basicsTaxCodeMatrixLayout',

		function (PlatformUIBaseTranslationService, basicsTaxCodeLayout, basicsTaxCodeMatrixLayout) {

			function MyTranslationService(layout) {
				PlatformUIBaseTranslationService.call(this, layout);
			}

			MyTranslationService.prototype = Object.create(PlatformUIBaseTranslationService.prototype);
			MyTranslationService.prototype.constructor = MyTranslationService;

			var service = new MyTranslationService(
				[
					basicsTaxCodeLayout,
					basicsTaxCodeMatrixLayout

				]
			);


			return service;
		}
	]);
})(angular);
