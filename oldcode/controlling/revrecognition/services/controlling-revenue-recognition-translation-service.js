/**
 * Created by alm on 1/20/2021.
 */
(function (angular) {
	'use strict';

	var moduleName = 'controlling.revrecognition';

	angular.module(moduleName).factory('controllingRevenueRecognitionTranslationService', ['platformUIBaseTranslationService', 'controllingRevenueRecognitionUILayout', 'controllingRevenueRecognitionItemLayout', 'controllingRevenueRecognitionDocumentLayout','controllingRevenueRecognitionAccrualLayout','controllingRevenueRecognitionE2cLayout',

		function (PlatformUIBaseTranslationService, controllingRevenueRecognitionUILayout, controllingRevenueRecognitionItemLayout, controllingRevenueRecognitionDocumentLayout,controllingRevenueRecognitionAccrualLayout,controllingRevenueRecognitionE2cLayout) {

			function MyTranslationService(layout) {
				PlatformUIBaseTranslationService.call(this, layout);
			}

			MyTranslationService.prototype = Object.create(PlatformUIBaseTranslationService.prototype);
			MyTranslationService.prototype.constructor = MyTranslationService;

			var service = new MyTranslationService(
				[
					{translationInfos: {extraModules: [moduleName]}},
					controllingRevenueRecognitionUILayout,
					controllingRevenueRecognitionItemLayout,
					controllingRevenueRecognitionDocumentLayout,
					controllingRevenueRecognitionAccrualLayout,
					controllingRevenueRecognitionE2cLayout
				]
			);
			return service;
		}
	]);
})(angular);