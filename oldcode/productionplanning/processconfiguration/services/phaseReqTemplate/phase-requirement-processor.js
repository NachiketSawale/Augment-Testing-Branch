(function (angular) {
	'use strict';
	/* global angular, _ */
	var moduleName = 'productionplanning.processconfiguration';

	angular.module(moduleName).factory('phaseRequirementProcessor', processor);

	processor.$inject = ['platformRuntimeDataService',
		'upstreamGoodsTypes'];

	function processor(platformRuntimeDataService, upstreamGoodsTypes) {
		var service = {};

		service.processItem = function (item) {
			var bReadOnly = (item.PpsUpstreamGoodsTypeFk !== upstreamGoodsTypes.Material &&
									  item.PpsUpstreamGoodsTypeFk !== upstreamGoodsTypes.CostCode &&
									  item.PpsUpstreamGoodsTypeFk !== upstreamGoodsTypes.CostCodeTT);
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