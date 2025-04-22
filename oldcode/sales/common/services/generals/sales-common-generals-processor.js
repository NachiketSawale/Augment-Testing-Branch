
/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {


	'use strict';
	var moduleName = 'sales.common';
	var salesCommonModule = angular.module(moduleName);

	salesCommonModule.factory('SalesCommonGeneralsProcessor', ['_', 'platformRuntimeDataService', 'basicsLookupdataLookupDescriptorService',
		function (_, platformRuntimeDataService, basicsLookupdataLookupDescriptorService) {
			// Processor to set the "Controlling Unit" and "Tax Code" in Generals List to Readonly, based on IsCost value.
			var service = {
			};

			// load lookup items, and cache in front end.
			basicsLookupdataLookupDescriptorService.loadData(['PrcGeneralsType']);

			service.processItem = function setControllingUnitTaxCodeReadOnly(entity) {

				var generalType = _.find(basicsLookupdataLookupDescriptorService.getData('PrcGeneralsType'), {Id : entity.GeneralsTypeFk});
				if (angular.isObject(generalType)) {
					entity.IsCost                  = generalType.IsCost;
					entity.CrbPriceconditionTypeFk = generalType.CrbPriceconditionTypeFk;
				}

				service.updateReadonlyStates(entity);
			};

			service.updateReadonlyStates = function updateReadonlyStates(entity)
			{
				platformRuntimeDataService.readonly(entity, [{
					field: 'ControllingUnitFk', readonly: !entity.IsCost}, {
					field: 'TaxCodeFk',         readonly: !entity.IsCost}, {
					field: 'Value',             readonly:  entity.CrbPriceconditionTypeFk!==null
				}]);
			};

			return service;
		}]);

})(angular);
