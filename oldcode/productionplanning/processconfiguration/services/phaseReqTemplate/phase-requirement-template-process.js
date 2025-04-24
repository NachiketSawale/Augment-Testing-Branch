(function (angular) {
	'use strict';
	/* global angular, _ */
	var moduleName = 'productionplanning.processconfiguration';

	angular.module(moduleName).factory('phaseRequirementTemplateProcessor', processor);

	processor.$inject = ['platformRuntimeDataService',
		 'upstreamGoodsTypes'];

	function processor(platformRuntimeDataService, upstreamGoodsTypes) {
		var service = {};

		service.processItem = function (item) {
			 var bReadOnly = (item.UpstreamGoodsTypeFk !== upstreamGoodsTypes.Material &&
				 					   item.UpstreamGoodsTypeFk !== upstreamGoodsTypes.CostCode &&
				 					   item.UpstreamGoodsTypeFk !== upstreamGoodsTypes.CostCodeTT);
			service.setColumnsReadOnly(item, ['Quantity'], bReadOnly);
		};

		service.setColumnsReadOnly = function setColumnsReadOnly(item, columns, flag) {
			var fields = [];
			_.each(columns, function (column) {
				fields.push({field: column, readonly: flag});
			});
			platformRuntimeDataService.readonly(item, fields);
		};

		return service;
	}
})(angular);