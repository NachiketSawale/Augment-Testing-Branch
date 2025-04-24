(function () {
	'use strict';
	var moduleName = 'productionplanning.common';
	/**
     * @ngdoc service
     * @name productionplanningCommonProductUIStandardService
     * @function
     *
     * @description
     * For some additonal columns without existing in the product module but item module
     */
	angular.module(moduleName).factory('productionplanningCommonProductItemUIStandardService', ProductionplanningCommonProductUIStandardService);

	ProductionplanningCommonProductUIStandardService.$inject = [
		'platformUIStandardConfigService',
		'productionplanningCommonTranslationService',
		'platformSchemaService',
		'productionplanningCommonProductDetailLayout',
		'platformUIStandardExtentService',
		'productionplanningCommonProductMainLayout',
		'ppsCommonCustomColumnsServiceFactory',
		'ppsCommonLayoutOverloadService',
		'productionplanningCommonLayoutHelperService'];

	function ProductionplanningCommonProductUIStandardService(
		platformUIStandardConfigService,
		productionplanningCommonTranslationService,
		platformSchemaService,
		productionplanningCommonProductDetailLayout,
		platformUIStandardExtentService,
		productionplanningCommonProductMainLayout,
		customColumnsServiceFactory,
		ppsCommonLayoutOverloadService,
		ppsCommonLayoutHelperService) {

		var BaseService = platformUIStandardConfigService;

		var masterAttributeDomains = platformSchemaService.getSchemaFromCache({ typeName: 'ProductDto', moduleSubModule: 'ProductionPlanning.Common' });
		masterAttributeDomains = masterAttributeDomains.properties;
		var customColumnsService = customColumnsServiceFactory.getService('productionplanning.common.product');
		_.merge(masterAttributeDomains, customColumnsService.attributes);

		function MasterUIStandardService(layout, scheme, translateService) {
			BaseService.call(this, layout, scheme, translateService);
		}

		MasterUIStandardService.prototype = Object.create(BaseService.prototype);
		MasterUIStandardService.prototype.constructor = MasterUIStandardService;

		var service = new BaseService(productionplanningCommonProductDetailLayout, masterAttributeDomains, productionplanningCommonTranslationService);

		let jobLookup = {
			id: 'currentlocationjobfk',
			field: 'CurrentLocationJobFk',
			name: '*Current Location Job',
			name$tr$: 'productionplanning.common.product.entityJobFromHistory'
		};
		_.extend(jobLookup, ppsCommonLayoutHelperService.provideJobExtensionLookupOverload({
			projectFk: 'ProjectFk',
			activeJob: true,
			jobType: 'external'
		}).grid);

		let deepCloneLayout = _.cloneDeep(productionplanningCommonProductMainLayout);
		deepCloneLayout.addition.grid.push({
			id: 'currentlocationjobfk',
			field: 'CurrentLocationJobFk',
			name: '*Current Location Job',
			name$tr$: 'productionplanning.common.product.entityJobFromHistory',
			formatter: 'lookup',
			readonly: true,
			editor: null,
			formatterOptions: ppsCommonLayoutHelperService.provideJobExtensionLookupOverload({
				projectFk: 'ProjectFk',
				activeJob: true,
				jobType: 'external'
			}).grid.formatterOptions
		});
		platformUIStandardExtentService.extend(service, deepCloneLayout.addition, masterAttributeDomains);

		service.getProjectMainLayout = function () {
			return productionplanningCommonProductDetailLayout;
		};

		ppsCommonLayoutOverloadService.translateCustomUom(service);

		return service;
	}
})();
