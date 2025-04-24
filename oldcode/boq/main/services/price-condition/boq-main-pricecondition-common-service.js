
(function () {
	'use strict';
	var moduleName = 'boq.main';

	/**
	 * @ngdoc service
	 * @name boqMainPriceConditionCommonService
	 * @function
	 *
	 * @description
	 * boqMainPriceConditionCommonService
	 */
	angular.module(moduleName).factory('boqMainPriceConditionCommonService', ['_', '$injector', 'mainViewService',
		function (_, $injector, mainViewService) {
			let service = {};

			service.getPriceConditionServiceByModule = function recalculate(moduleName) {
				let dataService = null, priceConditioniContainerConfig = null;
				let allViews = mainViewService.getAllViews();
				switch (moduleName) {
					case 'boq.main':
						priceConditioniContainerConfig = _.find(allViews, {uuid: '4f906f233da944a4b9952f57999a8baf'.toLowerCase()});
						break;
					case 'procurement.contract':
						priceConditioniContainerConfig = _.find(allViews, {uuid: '698ED3B0BC7B4E8B8A43876FA38979C6'.toLowerCase()});
						break;
					case 'procurement.requisition':
						priceConditioniContainerConfig = _.find(allViews, {uuid: '9FC06C9F0FCB401499C7F737B290A4E3'.toLowerCase()});
						break;
					case 'procurement.package':
						priceConditioniContainerConfig = _.find(allViews, {uuid: 'EE119AFB7FDC48D6996394B35CE59B9F'.toLowerCase()});
						break;
					case 'procurement.quote':
						priceConditioniContainerConfig = _.find(allViews, {uuid: '877D6DCD1AB94FA1BA78ADF9B13A8C59'.toLowerCase()});
						break;
					case 'procurement.pes':
						priceConditioniContainerConfig = _.find(allViews, {uuid: '07812EAEE55C406CAD0F0E894B57A2B4'.toLowerCase()});
						break;
					case 'sales.bid':
						priceConditioniContainerConfig = _.find(allViews, {uuid: 'D33710E56CAB4D87A3DDEEB71A246A51'.toLowerCase()});
						break;
					case 'sales.billing':
						priceConditioniContainerConfig = _.find(allViews, {uuid: '9A9514E0540B425DA3936E3E795188C3'.toLowerCase()});
						break;
					case 'sales.contract':
						priceConditioniContainerConfig = _.find(allViews, {uuid: 'BF7F76E4B70F462D9926A3ED5EA3C8CD'.toLowerCase()});
						break;
					case 'sales.wip':
						priceConditioniContainerConfig = _.find(allViews, {uuid: 'C0D4AC896FF44A359888FDEC239E2B2E'.toLowerCase()});
						break;
					default:
						break;
				}
				if (priceConditioniContainerConfig && Object.prototype.hasOwnProperty.call(priceConditioniContainerConfig, 'dataService')) {
					if (angular.isString(priceConditioniContainerConfig.dataService)) {
						dataService = $injector.get(priceConditioniContainerConfig.dataService);
					} else {
						dataService = priceConditioniContainerConfig.dataService;
					}
				}
				return dataService;
			};

			return service;
		}]);
})();