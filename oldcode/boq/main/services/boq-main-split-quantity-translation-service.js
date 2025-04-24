(function (angular) {
	'use strict';

	var moduleName = 'boq.main';

	/**
	 * @ngdoc service
	 * @name
	 * @description provides translation for this module
	 */
	angular.module(moduleName).service('boqMainSplitQuantityTranslationService', ['platformUIBaseTranslationService', 'boqMainSplitQuantityConfigService',

		function (platformUIBaseTranslationService, boqMainSplitQuantityConfigService) {
			var localBuffer = {};
			platformUIBaseTranslationService.call(this, new Array(boqMainSplitQuantityConfigService.getLayout()), localBuffer);
		}

	]);

})(angular);
