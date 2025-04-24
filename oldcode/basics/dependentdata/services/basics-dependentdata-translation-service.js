(function (angular) {
	'use strict';

	var moduleName = 'basics.dependentdata';

	/**
	 * @ngdoc service
	 * @name
	 * @description provides translation for this module
	 */
	angular.module(moduleName).service('basicsDependentDataTranslationService', ['platformUIBaseTranslationService', 'basicsDependentDataDependentDataLayout', 'basicsDependentDataColumnLayoutService','basicsDependentDataChartLayoutService','basicsDependentDataChartSeriesLayoutService',

		function (platformUIBaseTranslationService, basicsDependentDataDependentDataLayout, basicsDependentDataColumnLayoutService,basicsDependentDataChartLayoutService,basicsDependentDataChartSeriesLayoutService) {

			var localBuffer = {};
			platformUIBaseTranslationService.call(this, new Array(basicsDependentDataDependentDataLayout, basicsDependentDataColumnLayoutService.getLayout(),basicsDependentDataChartLayoutService,basicsDependentDataChartSeriesLayoutService), localBuffer);

		}

	]);

})(angular);
