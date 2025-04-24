/*
 * $Id: project-calendar-calendar-configuration-service.js 535284 2019-02-27 06:26:30Z leo $
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	angular.module('project.calendar').service('projectCalendarCalendarConfigurationService', [
		'platformUIStandardConfigService', 'platformSchemaService', 'projectCalendarUIConfigurationService',
		'projectCalendarTranslationService',
		function (platformUIStandardConfigService, platformSchemaService, projectCalendarUIConfigurationService, projectCalendarTranslationService) {
			var BaseService = platformUIStandardConfigService;
			var domainSchema = platformSchemaService.getSchemaFromCache( { typeName: 'ProjectCalendarDto', moduleSubModule: 'Project.Calendar'} );
			if (domainSchema) {
				domainSchema = domainSchema.properties;
			}

			var layout = projectCalendarUIConfigurationService.getCalendarLayout();
			return new BaseService(layout, domainSchema, projectCalendarTranslationService);
		}]);
})();
