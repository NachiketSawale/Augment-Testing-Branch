/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {
	'use strict';
	let moduleName = 'project.costcodes';
	angular.module(moduleName).factory('projectCostCodesPriceListForJobMessengerService', projectCostCodesPriceListForJobMessengerService);
	projectCostCodesPriceListForJobMessengerService.$inject = ['$injector', 'PlatformMessenger'];
	function projectCostCodesPriceListForJobMessengerService($injector, PlatformMessenger) {
		let service = {};
		service.JobPriceVersionSelectedChanged = new PlatformMessenger();
		service.PrjCostCodesPriceVersionSelectedChanged = new PlatformMessenger();
		service.PriceListRecordSelectedChanged = new PlatformMessenger();
		service.PriceListRecordWeightingChanged = new PlatformMessenger();
		return service;
	}
})(angular);