/**
 * Created by zwz on 5/6/2019.
 */

(function (angular) {
	'use strict';
	var moduleName = 'productionplanning.producttemplate';
	var engtaskModule = angular.module(moduleName);

	engtaskModule.factory('productionplanningProducttemplateProductDescriptionUIStandardService', UIStandardService);
	UIStandardService.$inject = ['platformSchemaService',
		'platformUIStandardConfigService',
		'platformUIStandardExtentService',
		'productionplanningProducttemplateTranslationService',
		'productionplanningProducttemplateProductDescriptionLayout',
		'productionplanningProducttemplateProductDescriptionLayoutConfig',
		'ppsCommonLayoutOverloadService'];

	function UIStandardService(platformSchemaService,
							   platformUIStandardConfigService,
							   platformUIStandardExtentService,
							   translationServ,
							   layout,
							   layoutConfig,
							   ppsCommonLayoutOverloadService) {

		function createService(key) {
			key = key || '';
			var BaseService = platformUIStandardConfigService;

			var dtoSchema = platformSchemaService.getSchemaFromCache({
				typeName: 'ProductDescriptionDto',
				moduleSubModule: 'ProductionPlanning.ProductTemplate'
			});
			var schemaProperties;
			if (dtoSchema) {
				schemaProperties = dtoSchema.properties;
			}

			function SetUIStandardService(layout, scheme, translateService) {
				BaseService.call(this, layout, scheme, translateService);
			}

			SetUIStandardService.prototype = Object.create(BaseService.prototype);
			SetUIStandardService.prototype.constructor = SetUIStandardService;

			var finalLayout = _.cloneDeep(layout);

			function filter(rows) {
				_.forEach(finalLayout.groups, function (group) {
					group.attributes = _.filter(group.attributes, function (att) {
						return !_.includes(rows, att);
					});
				});
			}

			if (key.toLowerCase().includes('cadimport')) {
				filter(['engdrawingfk', 'engtaskfk']);
			} else {
				filter( ['dbid']);
			}
			if (!key.toLowerCase().includes('stack')) {//add a special logic for stack container
				filter(['level', 'number4stack', 'number4plan']);
			}
			if (!key.toLowerCase().includes('drawing')) {
				filter(['sortcode']);
			}
			var service = new BaseService(finalLayout, schemaProperties, translationServ);

			platformUIStandardExtentService.extend(service, layoutConfig.addition, schemaProperties);

			service.getProjectMainLayout = function () {
				return finalLayout;
			};

			ppsCommonLayoutOverloadService.translateCustomUom(service);
			ppsCommonLayoutOverloadService.translateAdditionalColumns(service);
			ppsCommonLayoutOverloadService.findAndTranslate(service, 'engdrawingfkdescription',
				'productionplanning.producttemplate.engDrawingDescription');

			return service;
		}

		var serviceCache = {};

		function getService(key) {
			if (!serviceCache[key]) {
				serviceCache[key] = createService(key);
			}
			return serviceCache[key];
		}

		var service = getService();
		service.getService = getService;
		return service;
	}
})(angular);
