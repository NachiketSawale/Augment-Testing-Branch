/**
 * Created by sandu on 09.06.2015.
 */
(function () {

	'use strict';

	var moduleName = 'basics.reporting';

	/**
	 * @ngdoc service
	 * @name basicsReportingUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for different containers of the module
	 */
	angular.module(moduleName).factory('basicsReportingReportUIService', basicsReportingReportUIService);

	basicsReportingReportUIService.$inject = ['platformUIStandardConfigService', 'basicsReportingTranslationService', 'basicsReportingReportDetailLayout', 'platformSchemaService'];

	function basicsReportingReportUIService(platformUIStandardConfigService, basicsReportingTranslationService, basicsReportingReportDetailLayout, platformSchemaService) {

		var BaseService = platformUIStandardConfigService;

		var domainSchema = platformSchemaService.getSchemaFromCache({
			typeName: 'ReportDto',
			moduleSubModule: 'Basics.Reporting'
		});

		function ReportingUIStandardService(layout, scheme, translateService) {
			BaseService.call(this, layout, scheme, translateService);
		}

		ReportingUIStandardService.prototype = Object.create(BaseService.prototype);
		ReportingUIStandardService.prototype.constructor = ReportingUIStandardService;

		return new BaseService(basicsReportingReportDetailLayout, domainSchema.properties, basicsReportingTranslationService);
	}

	angular.module(moduleName).factory('basicsReportingReportParameterUIService', basicsReportingReportParameterUIService);

	basicsReportingReportParameterUIService.$inject = ['platformUIStandardConfigService', 'basicsReportingTranslationService', 'basicsReportingReportParameterDetailLayout', 'platformSchemaService'];

	function basicsReportingReportParameterUIService(platformUIStandardConfigService, basicsReportingTranslationService, ReportParameterDetailLayout, platformSchemaService) {

		var BaseService = platformUIStandardConfigService;

		var domainSchema = platformSchemaService.getSchemaFromCache({
			typeName: 'ReportParameterDto',
			moduleSubModule: 'Basics.Reporting'
		});

		function ReportingUIStandardService(layout, scheme, translateService) {
			BaseService.call(this, layout, scheme, translateService);
		}

		ReportingUIStandardService.prototype = Object.create(BaseService.prototype);
		ReportingUIStandardService.prototype.constructor = ReportingUIStandardService;

		return new BaseService(ReportParameterDetailLayout, domainSchema.properties, basicsReportingTranslationService);
	}

	angular.module(moduleName).factory('basicsReportingReportParameterValuesUIService', basicsReportingReportParameterValuesUIService);

	basicsReportingReportParameterValuesUIService.$inject = ['platformUIStandardConfigService', 'basicsReportingTranslationService', 'basicsReportingReportParameterValuesDetailLayout', 'platformSchemaService'];

	function basicsReportingReportParameterValuesUIService(platformUIStandardConfigService, basicsReportingTranslationService, ReportParameterValuesDetailLayout, platformSchemaService) {

		var BaseService = platformUIStandardConfigService;

		var domainSchema = platformSchemaService.getSchemaFromCache({
			typeName: 'ReportParameterValuesDto',
			moduleSubModule: 'Basics.Reporting'
		});

		function ReportingUIStandardService(layout, scheme, translateService) {
			BaseService.call(this, layout, scheme, translateService);
		}

		ReportingUIStandardService.prototype = Object.create(BaseService.prototype);
		ReportingUIStandardService.prototype.constructor = ReportingUIStandardService;

		return new BaseService(ReportParameterValuesDetailLayout, domainSchema.properties, basicsReportingTranslationService);
	}
})();
