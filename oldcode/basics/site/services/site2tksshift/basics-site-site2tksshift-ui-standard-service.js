/**
 * Created by lav on 11/28/2019.
 */
(function () {
	'use strict';
	var moduleName = 'basics.site';

	angular.module(moduleName).service('basicsSite2TksShiftUIStandardService', UIStandardService);

	UIStandardService.$inject = ['platformUIConfigInitService', 'basicsSiteTranslationService',
		'basicsSite2TksShiftLayout'];

	function UIStandardService(platformUIConfigInitService, basicsSiteTranslationService,
							   site2TksShiftLayout) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: site2TksShiftLayout,
			dtoSchemeId: {
				moduleSubModule: 'Basics.Site',
				typeName: 'Site2TksShiftDto'
			},
			translator: basicsSiteTranslationService
		});
	}
})();