(function() {
	'use strict';

	var moduleName = 'productionplanning.common';

	angular.module(moduleName).factory('ppsCommonProductTransportHistoryLayout', ppsCommonProductTransportHistoryLayout);

	ppsCommonProductTransportHistoryLayout.$inject = [];

	function ppsCommonProductTransportHistoryLayout( ) {
		return {
			fid: 'productionplanning.common.product.transport.history',
			version: '1.0.0',
			showGrouping: true,
			addValidationAutomatically: true,
			readonly: true,
			groups: [
				{
					gid: 'baseGroup',
					attributes: ['isincoming', 'module','entitycode', 'entitydescription', 'prjstockfk', 'prjstocklocationfk', 'jobfk', 'timestamp']
				}
			],
			overloads: {
				isincoming: {
					grid: {
						formatter: 'image',
						formatterOptions: {
							imageSelector: 'ppsCommonProductTransportHistoryIconService',
							tooltip: true
						}
					}
				},
				prjstockfk:{
					grid:{
						editor: null,
						formatter: 'lookup',
						formatterOptions: {
							displayMember: 'Code',
							lookupType: 'ProjectStockNew',
							version: 3
						}
					}
				},
				prjstocklocationfk:{
					grid:{
						editor: null,
						formatter: 'lookup',
						formatterOptions: {
							displayMember: 'Code',
							lookupType: 'ProjectStockLocation',
							version: 3
						}
					}
				},
				jobfk:{
					grid: {
						editor: null,
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'logisticJob',
							displayMember: 'Code',
							version: 3
						}
					}
				}
			}
		};
	}

	angular.module(moduleName).factory('ppsCommonProductTransportHistoryUIStandardService', ppsCommonProductTransportHistoryUIStandardService);

	ppsCommonProductTransportHistoryUIStandardService.$inject = ['platformUIStandardConfigService', 'platformSchemaService',
		'productionplanningCommonTranslationService',
		'ppsCommonProductTransportHistoryLayout'];

	function ppsCommonProductTransportHistoryUIStandardService(platformUIStandardConfigService, platformSchemaService, translationService, ppsCommonProductTransportHistoryLayout) {
		var BaseService = platformUIStandardConfigService;

		var attributeDomains = platformSchemaService.getSchemaFromCache({
			typeName: 'ProductHistoryDto',
			moduleSubModule: 'ProductionPlanning.Common'
		});

		var schemaProperties = attributeDomains.properties;

		var service = new BaseService(ppsCommonProductTransportHistoryLayout, schemaProperties, translationService);

		var columns = service.getStandardConfigForListView().columns;
		_.forEach(columns, function (o) {
			o.editor = null;
		});

		return service;
	}
})();