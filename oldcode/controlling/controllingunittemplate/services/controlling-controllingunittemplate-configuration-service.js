/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

// TODO: rename file to controlling-controllingunittemplate-configuration-services.js

(function (angular) {
	'use strict';
	var moduleName = 'controlling.controllingunittemplate';

	angular.module(moduleName).factory('controllingControllingunittemplateConfigurationService',
		['platformUIStandardConfigService', 'controllingControllingunittemplateTranslationService', 'platformSchemaService', 'controllingControllingunittemplateUIConfigurationService',
			function (platformUIStandardConfigService, controllingControllingunittemplateTranslationService, platformSchemaService, controllingControllingunittemplateUIConfigurationService) {
				var BaseService = platformUIStandardConfigService;
				var controltemplateDomainSchema = platformSchemaService.getSchemaFromCache(
					{typeName: 'ControltemplateDto', moduleSubModule: 'Controlling.ControllingUnitTemplate'}
				);

				if (controltemplateDomainSchema) {
					controltemplateDomainSchema = controltemplateDomainSchema.properties;
					// add additional columns
					// TODO:
				}

				function UIStandardService(layout, scheme, translateService) {
					BaseService.call(layout, scheme, translateService);
				}

				UIStandardService.prototype = Object.create(BaseService.prototype);
				UIStandardService.prototype.constructor = UIStandardService;

				// TODO: see platformUIConfigInitService.createUIConfigurationService(...)
				return new BaseService(controllingControllingunittemplateUIConfigurationService.getControlTemplateLayout(), controltemplateDomainSchema, controllingControllingunittemplateTranslationService);
			}
		]);


	angular.module(moduleName).factory('controllingControllingunittemplateUnitConfigurationService',
		['_', 'platformUIStandardConfigService', 'controllingControllingunittemplateTranslationService', 'platformSchemaService', 'controllingControllingunittemplateUIConfigurationService', 'controllingStructureDynamicAssignmentsService',
			function (_, platformUIStandardConfigService, controllingControllingunittemplateTranslationService, platformSchemaService, controllingControllingunittemplateUIConfigurationService, controllingStructureDynamicAssignmentsService) {

				var layout = controllingControllingunittemplateUIConfigurationService.getControltemplateUnitLayout();

				// dynamic assignment01-10 overloads (optional lookups)
				var assignmentAttributes = _.get(_.find(layout.groups, {'gid': 'assignments'}), 'attributes');
				controllingStructureDynamicAssignmentsService.setAssignmentOverloads(assignmentAttributes, layout.overloads);

				var BaseService = platformUIStandardConfigService;
				var controltemplateUnitDomainSchema = platformSchemaService.getSchemaFromCache(
					{typeName: 'ControltemplateUnitDto', moduleSubModule: 'Controlling.ControllingUnitTemplate'}
				);

				if (controltemplateUnitDomainSchema) {
					controltemplateUnitDomainSchema = controltemplateUnitDomainSchema.properties;
					// add additional columns
					// TODO:
				}

				function UIStandardService(layout, scheme, translateService) {
					BaseService.call(layout, scheme, translateService);
				}

				UIStandardService.prototype = Object.create(BaseService.prototype);
				UIStandardService.prototype.constructor = UIStandardService;

				// TODO: see platformUIConfigInitService.createUIConfigurationService(...)
				return new BaseService(layout, controltemplateUnitDomainSchema, controllingControllingunittemplateTranslationService);
			}
		]);

	angular.module(moduleName).factory('controllingControllingunittemplateGroupConfigurationService',
		['platformUIStandardConfigService', 'controllingControllingunittemplateTranslationService', 'platformSchemaService', 'controllingControllingunittemplateUIConfigurationService',
			function (platformUIStandardConfigService, controllingControllingunittemplateTranslationService, platformSchemaService, controllingControllingunittemplateUIConfigurationService) {
				var BaseService = platformUIStandardConfigService;
				var controltemplateGroupDomainSchema = platformSchemaService.getSchemaFromCache(
					{typeName: 'ControltemplateGroupDto', moduleSubModule: 'Controlling.ControllingUnitTemplate'}
				);

				if (controltemplateGroupDomainSchema) {
					controltemplateGroupDomainSchema = controltemplateGroupDomainSchema.properties;
					// add additional columns
					// TODO:
				}

				function UIStandardService(layout, scheme, translateService) {
					BaseService.call(layout, scheme, translateService);
				}

				UIStandardService.prototype = Object.create(BaseService.prototype);
				UIStandardService.prototype.constructor = UIStandardService;

				// TODO: see platformUIConfigInitService.createUIConfigurationService(...)
				return new BaseService(controllingControllingunittemplateUIConfigurationService.getControltemplateGroupLayout(), controltemplateGroupDomainSchema, controllingControllingunittemplateTranslationService);
			}
		]);
})(angular);


