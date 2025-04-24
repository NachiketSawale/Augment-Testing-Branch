/**
 * Created by sandu on 26.08.2015.
 */
(function (angular) {
	'use strict';

	var moduleName = 'usermanagement.user';

	/**
	 * @ngdoc service
	 * @name usermanagementUserTranslationService
	 * @description provides translation for this module
	 */
	angular.module(moduleName).service('usermanagementUserTranslationService', usermanagementUserTranslationService);

	usermanagementUserTranslationService.$inject = ['platformUIBaseTranslationService', 'usermanagementUserDetailLayout', 'usermanagementUserXGroupDetailLayout', 'usermanagementUserLogDetailLayout'];

	function usermanagementUserTranslationService(platformUIBaseTranslationService, usermanagementUserDetailLayout, usermanagementUserXGroupDetailLayout, usermanagementUserLogDetailLayout) {

		var localBuffer = {};
		platformUIBaseTranslationService.call(this, new Array(usermanagementUserDetailLayout, usermanagementUserXGroupDetailLayout, usermanagementUserLogDetailLayout), localBuffer);

	}
})(angular);
