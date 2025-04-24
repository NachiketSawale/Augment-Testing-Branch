/**
 * Created by leo on 17.11.2014
 */

(function () {
	'use strict';
	var moduleName = 'scheduling.template';

	/**
	 * @ngdoc service
	 * @name schedulingTemplateActivityTemplateGroupUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layots for different containers of ActivityTemplateGroup entities
	 */
	angular.module(moduleName).factory('schedulingTemplateActivityTemplateGroupUIStandardService', ['platformUIStandardConfigService', 'schedulingTemplateTranslationService', 'schedulingTemplateActivityTemplateGroupDetailLayout', 'platformSchemaService',

		function (platformUIStandardConfigService, schedulingTemplateTranslationService, schedulingTemplateActivityTemplateGroupDetailLayout, platformSchemaService) {

			var BaseService = platformUIStandardConfigService;

			var templateGroupAttributeDomains = platformSchemaService.getSchemaFromCache( { typeName: 'ActivityTemplateGroupDto', moduleSubModule: 'Scheduling.Template'} );
			templateGroupAttributeDomains = templateGroupAttributeDomains.properties;

			function ScheduleUIStandardService(layout, scheme, translateService) {
				BaseService.call(this, layout, scheme, translateService);
			}

			ScheduleUIStandardService.prototype = Object.create(BaseService.prototype);
			ScheduleUIStandardService.prototype.constructor = ScheduleUIStandardService;

			return new BaseService(schedulingTemplateActivityTemplateGroupDetailLayout, templateGroupAttributeDomains, schedulingTemplateTranslationService);
		}
	]);

	angular.module(moduleName).factory('schedulingTemplateActivityTemplateUIStandardService', ['platformUIStandardConfigService', 'schedulingTemplateTranslationService', 'schedulingTemplateActivityTemplateUIConfig', 'platformSchemaService',

		function (platformUIStandardConfigService, schedulingTemplateTranslationService, schedulingTemplateActivityTemplateUIConfig, platformSchemaService) {

			var BaseService = platformUIStandardConfigService;

			var templateAttributeDomains = platformSchemaService.getSchemaFromCache( { typeName: 'ActivityTemplateDto', moduleSubModule: 'Scheduling.Template'} );
			templateAttributeDomains = templateAttributeDomains.properties;

			function ScheduleUIStandardService(layout, scheme, translateService) {
				BaseService.call(this, layout, scheme, translateService);
			}

			ScheduleUIStandardService.prototype = Object.create(BaseService.prototype);
			ScheduleUIStandardService.prototype.constructor = ScheduleUIStandardService;

			var schedulingTemplateActivityTemplateLayout = schedulingTemplateActivityTemplateUIConfig.getActivityDetailLayout();

			return new BaseService(schedulingTemplateActivityTemplateLayout, templateAttributeDomains, schedulingTemplateTranslationService);
		}
	]);

	angular.module(moduleName).factory('schedulingTemplateEventTemplateUIStandardService', ['platformUIStandardConfigService', 'schedulingTemplateTranslationService', 'schedulingTemplateActivityTemplateUIConfig', 'platformSchemaService',

		function (platformUIStandardConfigService, schedulingTemplateTranslationService, schedulingTemplateActivityTemplateUIConfig, platformSchemaService) {

			var BaseService = platformUIStandardConfigService;

			var eventAttributeDomains = platformSchemaService.getSchemaFromCache( { typeName: 'EventTemplateDto', moduleSubModule: 'Scheduling.Template'} );
			eventAttributeDomains = eventAttributeDomains.properties;

			function ScheduleUIStandardService(layout, scheme, translateService) {
				BaseService.call(this, layout, scheme, translateService);
			}
			var schedulingEventTemplateLayout = schedulingTemplateActivityTemplateUIConfig.getEventDetailLayout();

			ScheduleUIStandardService.prototype = Object.create(BaseService.prototype);
			ScheduleUIStandardService.prototype.constructor = ScheduleUIStandardService;

			return new BaseService(schedulingEventTemplateLayout, eventAttributeDomains, schedulingTemplateTranslationService);
		}
	]);

	angular.module(moduleName).factory('schedulingTemplateActivityTmpl2CUGrpUIStandardService', ['platformUIStandardConfigService', 'schedulingTemplateTranslationService', 'schedulingTemplateActivityTemplateUIConfig', 'platformSchemaService',

		function (platformUIStandardConfigService, schedulingTemplateTranslationService, schedulingTemplateActivityTemplateUIConfig, platformSchemaService) {

			var BaseService = platformUIStandardConfigService;

			var tmpl2CUGrpAttributeDomains = platformSchemaService.getSchemaFromCache( { typeName: 'ActivityTmpl2CUGrpDto', moduleSubModule: 'Scheduling.Template'} );
			tmpl2CUGrpAttributeDomains = tmpl2CUGrpAttributeDomains.properties;

			function ScheduleUIStandardService(layout, scheme, translateService) {
				BaseService.call(this, layout, scheme, translateService);
			}
			var schedulingTemplateActivityTmpl2CUGrpDetailLayout = schedulingTemplateActivityTemplateUIConfig.getTmplGrp2CUGrpDetailLayout();

			ScheduleUIStandardService.prototype = Object.create(BaseService.prototype);
			ScheduleUIStandardService.prototype.constructor = ScheduleUIStandardService;

			return new BaseService(schedulingTemplateActivityTmpl2CUGrpDetailLayout, tmpl2CUGrpAttributeDomains, schedulingTemplateTranslationService);
		}
	]);

})();
