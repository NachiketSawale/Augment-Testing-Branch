/**
 * Created by zwz on 9/24/2019.
 */
(function (angular) {
	'use strict';
	var moduleName = 'productionplanning.productionset';
	/**
	 * @ngdoc service
	 * @name productionplanningProductionsetMainServiceEntityPropertychangedExtension
	 * @function
	 * @requires
	 *
	 * @description
	 * productionplanningProductionsetMainServiceEntityPropertychangedExtension provides entity property-changed functionality for productionset data service
	 *
	 */
	angular.module(moduleName).factory('productionplanningProductionsetMainServiceEntityPropertychangedExtension', Service);

	Service.$inject = ['$injector', 'basicsLookupdataLookupDescriptorService'];

	function Service($injector, basicsLookupdataLookupDescriptorService) {
		var service = {};

		service.onPropertyChanged = function (entity, field, dataService) {
			var prop = 'on' + field + 'Changed';
			if (service[prop]) {
				service[prop](entity, field, dataService);
			}
		};

		service.onEventTypeFkChanged = function (entity, field, dataService) {
			var validationService = $injector.get('productionplanningProductionsetValidationService');
			var rubricConstant = $injector.get('productionplanningCommonRubricConstant');
			var extension = $injector.get('productionplanningCommonDerivedEventEntityPropertychangedExtension');
			extension.onEventTypeFkChanged(entity, field, dataService, validationService, rubricConstant.ProductionPlanning);
		};

		service.onPrjLocationFkChanged = function(entity, field, dataService){
			var locationCodeService = $injector.get('productionplanningCommonLocationInfoService');
			var location = basicsLookupdataLookupDescriptorService.getLookupItem('LocationInfo', entity.PrjLocationFk);

			if (!location && entity.PrjLocationFk !== null) {
				locationCodeService.handleNewLocation(entity, dataService);
			}
		};

		return service;
	}
})(angular);