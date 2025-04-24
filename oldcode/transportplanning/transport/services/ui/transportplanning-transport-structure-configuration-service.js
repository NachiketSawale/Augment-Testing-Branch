(function () {
	'use strict';
	var moduleName = 'transportplanning.transport';
	/**
	 * @ngdoc service
	 * @name transportplanningTransportStructureConfigurationService
	 * @function
	 *
	 * @description
	 * This service provides standard configuration  for Transport Structure container
	 */
	angular.module(moduleName).factory('transportplanningTransportStructureConfigurationService', ConfigurationService);

	ConfigurationService.$inject = ['platformUIStandardConfigService',
		'platformUIStandardExtentService',
		'platformSchemaService',
		'transportplanningTransportTranslationService',
		'transportplanningTransportLayout',
		'ppsCommonCustomColumnsServiceFactory'];

	function ConfigurationService(platformUIStandardConfigService,
								  platformUIStandardExtentService,
								  platformSchemaService,
								  transportplanningTransportTranslationService,
								  transportLayout,
								  customColumnsServiceFactory) {

		function getLayout() {
			var layout = _.cloneDeep(transportLayout);
			//fix translation warning in the console.
			var array = ['prjlocationfk', 'mdccontrollingunitfk', 'uomfk', 'basuomweightfk'];
			_.each(array, function (item) {
				layout.overloads[item] = {};
			});

			return layout;
		}

		var BaseService = platformUIStandardConfigService;

		var dtoSchema = platformSchemaService.getSchemaFromCache({
			typeName: 'TrsRouteDto',
			moduleSubModule: 'TransportPlanning.Transport'
		});
		var schemaProperties;
		if (dtoSchema) {
			var array = ['ProjectName','ProjectNo','EarliestFinish','EarliestStart','LatestFinish','LatestStart',
				'PlannedDelivery','PlannedFinish','PlannedStart','ActualDelivery','ActualFinish','ActualStart'
			];
			_.each(array,function (property) {
				dtoSchema.properties[property].grouping = 'TransportPlanning.Transport.'+property;
			});

			schemaProperties = dtoSchema.properties;
			var customColumnsService = customColumnsServiceFactory.getService(moduleName);
			_.merge(schemaProperties, customColumnsService.attributes);

			// SumActualDistance
			// SumDistance
			// SumExpenses
			// SumPackagesWeight

			schemaProperties = dtoSchema.properties;
		}
		function TransportUIStandardService(layout, scheme, translateService) {
			BaseService.call(this, layout, scheme, translateService);
		}

		TransportUIStandardService.prototype = Object.create(BaseService.prototype);
		TransportUIStandardService.prototype.constructor = TransportUIStandardService;

		return new BaseService(getLayout(), schemaProperties, transportplanningTransportTranslationService);


	}
})();