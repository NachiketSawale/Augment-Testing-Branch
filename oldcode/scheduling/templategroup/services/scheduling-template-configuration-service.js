/**
 * Created by leo on 17.11.2014
 */

(function () {
	'use strict';
	var moduleName = 'scheduling.templategroup';

	/**
	 * @ngdoc service
	 * @name schedulingTemplateActivityTmplGrpEditUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layots for different containers of ActivityTemplateGroup entities
	 */
	angular.module(moduleName).factory('schedulingTemplateActivityTmplGrpEditUIStandardService', ['platformUIStandardConfigService', 'schedulingTemplateTranslationService', 'schedulingTemplateActivityTemplateGroupEditDetailLayout', 'platformSchemaService',

		function (platformUIStandardConfigService, schedulingTemplateTranslationService, schedulingTemplateActivityTemplateGroupEditDetailLayout, platformSchemaService) {

			var BaseService = platformUIStandardConfigService;

			var templateGroupAttributeDomains = platformSchemaService.getSchemaFromCache( { typeName: 'ActivityTemplateGroupDto', moduleSubModule: 'Scheduling.Template'} );
			templateGroupAttributeDomains = templateGroupAttributeDomains.properties;

			function ScheduleUIStandardService(layout, scheme, translateService) {
				BaseService.call(this, layout, scheme, translateService);
			}

			ScheduleUIStandardService.prototype = Object.create(BaseService.prototype);
			ScheduleUIStandardService.prototype.constructor = ScheduleUIStandardService;

			return new BaseService(schedulingTemplateActivityTemplateGroupEditDetailLayout, templateGroupAttributeDomains, schedulingTemplateTranslationService);
		}
	]);

	angular.module(moduleName).factory('schedulingTemplateActivityTmplGrp2CUGrpUIStandardService', ['platformUIStandardConfigService', 'schedulingTemplateTranslationService', 'platformSchemaService', 'schedulingTemplateActivityTmplGrp2CUGrpConfigurationService',

		function (platformUIStandardConfigService, schedulingTemplateTranslationService, platformSchemaService, schedulingTemplateActivityTmplGrp2CUGrpConfigurationService) {

			var BaseService = platformUIStandardConfigService;

			var tmplGrp2CUGrpAttributeDomains = platformSchemaService.getSchemaFromCache( { typeName: 'ActivityTmplGrp2CUGrpDto', moduleSubModule: 'Scheduling.Template'} );
			tmplGrp2CUGrpAttributeDomains = tmplGrp2CUGrpAttributeDomains.properties;

			function ScheduleUIStandardService(layout, scheme, translateService) {
				BaseService.call(this, layout, scheme, translateService);
			}

			ScheduleUIStandardService.prototype = Object.create(BaseService.prototype);
			ScheduleUIStandardService.prototype.constructor = ScheduleUIStandardService;

			var schedulingTemplateActivityTmplGrp2CUGrpDetailLayout = schedulingTemplateActivityTmplGrp2CUGrpConfigurationService.getTmplGrp2CUGrpDetailLayout();

			return new BaseService(schedulingTemplateActivityTmplGrp2CUGrpDetailLayout, tmplGrp2CUGrpAttributeDomains, schedulingTemplateTranslationService);
		}
	]);

})();
