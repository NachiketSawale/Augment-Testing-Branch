/*
 * Created by lcn on 11/4/2021.
 */

(function (angular) {
	'use strict';
	/* global angular */
	var moduleName = 'basics.salestaxcode';
	/**
     * @ngdoc service
     * @name basicsUnitTranslationService
     * @description
     */
	angular.module(moduleName).factory('basicsSalesTaxCodeTranslationService', ['platformUIBaseTranslationService', 'basicsSalesTaxCodeLayout', 'basicsSalesTaxMatrixLayout',

		function (PlatformUIBaseTranslationService, basicsSalesTaxCodeLayout, basicsSalesTaxMatrixLayout) {

			function MyTranslationService(layout) {
				PlatformUIBaseTranslationService.call(this, layout);
			}

			MyTranslationService.prototype = Object.create(PlatformUIBaseTranslationService.prototype);
			MyTranslationService.prototype.constructor = MyTranslationService;

			var service = new MyTranslationService(
				[
					basicsSalesTaxCodeLayout,
					basicsSalesTaxMatrixLayout

				]
			);


			return service;
		}
	]);
})(angular);
