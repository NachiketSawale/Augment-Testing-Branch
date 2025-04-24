(function (angular) {
	'use strict';

	var moduleName = 'basics.userform';

	angular.module(moduleName).service('basicsUserformTranslationService', [
		'platformUIBaseTranslationService',
		'basicsUserformFormDetailLayout',

		function (
			platformUIBaseTranslationService,
			basicsUserformFormDetailLayout) {

			var localBuffer = {};
			platformUIBaseTranslationService.call(this, basicsUserformFormDetailLayout, localBuffer);

		}

	]);

})(angular);
