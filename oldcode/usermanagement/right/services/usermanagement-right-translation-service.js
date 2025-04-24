/**
 * Created by sandu on 14.09.2015.
 */
(function (angular) {
	'use strict';


	var moduleName = 'usermanagement.right';

	/**
     * @ngdoc service
     * @name usermanagementRightTranslationService
     * @description provides translation for this module
     */
	angular.module(moduleName).service('usermanagementRightTranslationService', usermanagementRightTranslationService);

	usermanagementRightTranslationService.$inject = ['platformUIBaseTranslationService', 'usermanagementRoleDetailLayout', 'usermanagementRoleXRoleDetailLayout', 'usermanagementRightDetailLayout'];

	function usermanagementRightTranslationService(platformUIBaseTranslationService, usermanagementRoleDetailLayout, usermanagementRoleXRoleDetailLayout, usermanagementRightDetailLayout) {

		var localBuffer = {};
		platformUIBaseTranslationService.call(this, new Array(usermanagementRoleDetailLayout, usermanagementRoleXRoleDetailLayout, usermanagementRightDetailLayout), localBuffer);

	}
})(angular);