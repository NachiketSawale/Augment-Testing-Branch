/**
 * Created by wuj on 8/27/2015.
 */
(function (angular) {
	'use strict';
	/* jshint -W072 */ // many parameters because of dependency injection

	var moduleName = 'basics.procurementconfiguration';
	angular.module(moduleName).factory('basicsProcurementConfigHeaderTranslationService',
		['platformUIBaseTranslationService', 'basicsProcurementConfigHeaderLayout', 'basicsProcurementConfigurationLayout',
			'basicsProcurementConfiguration2BSchemaLayout', 'basicsProcurementConfiguration2StrategyLayout',
			'basicsProcurementConfigurationPrcTotalTypeLayout', 'basicsProcurementConfiguration2HeaderTextLayout',
			'basicsProcurementConfiguration2ItemTextLayout','basicsProcurementConfiguration2TabLayout',
			'basicsProcurementConfiguration2Prj2TextTypeLayout', 'basicsProcurementConfigurationRfqReportsLayout',
			'basicsProcurementConfigurationRfqDocumentsLayout','basicsProcurementConfigurationRfqDataFormatLayout', 'basPrcConfig2ConApprovalLayout',
			function (PlatformUIBaseTranslationService, procurementConfigHeaderLayout, procurementConfigurationLayout,
			          configuration2BSchemaLayout, configuration2StrategyLayout, configurationPrcTotalTypeLayout,
			          configuration2HeaderTextLayout, configuration2ItemTextLayout,configuration2TabLayout,basicsProcurementConfiguration2Prj2TextTypeLayout, basicsProcurementConfigurationRfqReportsLayout,
					  basicsProcurementConfigurationRfqDocumentsLayout,basicsProcurementConfigurationRfqDataFormatLayout, basPrcConfig2ConApprovalLayout) {
				
				function MyTranslationService(layout) {
					PlatformUIBaseTranslationService.call(this, layout);
				}

				MyTranslationService.prototype = Object.create(PlatformUIBaseTranslationService.prototype);
				MyTranslationService.prototype.constructor = MyTranslationService;

				return new MyTranslationService(
					[
						procurementConfigHeaderLayout,
						procurementConfigurationLayout,
						configuration2BSchemaLayout,
						configuration2StrategyLayout,
						configurationPrcTotalTypeLayout,
						configuration2HeaderTextLayout,
						configuration2ItemTextLayout,
						configuration2TabLayout,
						basicsProcurementConfiguration2Prj2TextTypeLayout,
						basicsProcurementConfigurationRfqReportsLayout,
						basicsProcurementConfigurationRfqDocumentsLayout,
						basicsProcurementConfigurationRfqDataFormatLayout,
						basPrcConfig2ConApprovalLayout
					]
				);
			}

		]);

})(angular);