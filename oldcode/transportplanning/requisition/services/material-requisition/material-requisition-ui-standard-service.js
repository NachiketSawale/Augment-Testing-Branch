/**
 * Created by anl on 11/14/2017.
 */

(function (angular) {
	'use strict';

	var moduleName = 'transportplanning.requisition';

	angular.module(moduleName).factory('transportplanningRequisitionMatRequisitionUIStandardService', MatRequisitionUIStandardService);
	MatRequisitionUIStandardService.$inject = [
		'platformUIStandardConfigService',
		'platformSchemaService', 'platformUIStandardExtentService',
		'transportplanningRequisitionTranslationService',
		'transportplanningRequisitionMatRequisitionDetailLayout',
		'transportplanningRequisitionMatRequisitionLayoutConfig'];

	function MatRequisitionUIStandardService(platformUIStandardConfigService,
											 platformSchemaService, platformUIStandardExtentService,
											 translationService,
											 detailLayout,
											 layoutConfig) {

		var serviceCache = {};

		function createService(dataService) {
			var BaseService = platformUIStandardConfigService;

			var attributeDomains = platformSchemaService.getSchemaFromCache({
				typeName: 'TrsGoodsDto',
				moduleSubModule: 'TransportPlanning.Requisition'
			}).properties;

			var service = new BaseService(detailLayout, attributeDomains, translationService);

			platformUIStandardExtentService.extend(service, layoutConfig.addition, attributeDomains);

			//set the callback function manually, in case the detail container not load
			_.forEach(service.getStandardConfigForDetailView().rows, function (row) {
				row.change = function (entity, field) {
					dataService.onPropertyChanged(entity, field);
				};
			});

			return service;
		}

		function getService(key, dataService) {
			if (_.isNil(serviceCache[key])) {
				serviceCache[key] = createService(dataService);
			}
			return serviceCache[key];
		}

		return {
			getService: getService
		};
	}
})(angular);

