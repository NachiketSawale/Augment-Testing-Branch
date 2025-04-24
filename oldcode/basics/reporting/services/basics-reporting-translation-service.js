/**
 * Created by sandu on 15.06.2015.
 */
/**
 * Created by sandu on 15.06.2015.
 */
(function (angular) {
	'use strict';

	var moduleName = 'basics.reporting';

	/**
	 * @ngdoc service
	 * @name basicsReportingTranslationService
	 * @description provides translation for this module
	 */
	angular.module(moduleName).service('basicsReportingTranslationService', ['platformUIBaseTranslationService', 'basicsReportingReportDetailLayout', 'basicsReportingReportParameterDetailLayout', 'basicsReportingReportParameterValuesDetailLayout',

		function (platformUIBaseTranslationService, basicsReportingReportDetailLayout, basicsReportingReportParameterDetailLayout, basicsReportingReportParameterValuesDetailLayout) {

			var localBuffer = {};
			platformUIBaseTranslationService.call(this, new Array(basicsReportingReportDetailLayout, basicsReportingReportParameterDetailLayout, basicsReportingReportParameterValuesDetailLayout), localBuffer);

		}
	]);
})(angular);
