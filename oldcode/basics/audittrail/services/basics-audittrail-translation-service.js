(function (angular) {
	'use strict';

	var moduleName = 'basics.audittrail';

	/**
	 * @ngdoc service
	 * @name
	 * @description provides translation for this module
	 */
	angular.module(moduleName).service('basicsAuditTrailTranslationService', ['platformUIBaseTranslationService', 'basicsAuditTrailGridColumns',

		function (platformUIBaseTranslationService, basicsAuditTrailGridColumns) {

			var localBuffer = {};
			platformUIBaseTranslationService.call(this, new Array(basicsAuditTrailGridColumns), localBuffer);

		}

	]);

})(angular);
