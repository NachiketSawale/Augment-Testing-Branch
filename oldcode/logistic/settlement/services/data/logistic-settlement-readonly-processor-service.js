/**
 * Created by baf on 14.03.2018
 */

(function (angular) {
	'use strict';
	var myModule = angular.module('logistic.settlement');

	/**
	 * @ngdoc service
	 * @name logisticSettlementItemDataService
	 * @description pprovides methods to access, create and update logistic settlement item entities
	 */
	myModule.service('logisticSettlementReadOnlyProcessorService', LogisticSettlementReadOnlyProcessorService);

	LogisticSettlementReadOnlyProcessorService.$inject = ['platformDataServiceConfiguredReadonlyExtension', 'platformRuntimeDataService'];

	function LogisticSettlementReadOnlyProcessorService(platformDataServiceConfiguredReadonlyExtension, platformRuntimeDataService) {

		this.processItem = function processItem(entity) {
			let fields = [];
			platformDataServiceConfiguredReadonlyExtension.overrideReadOnlyProperties('Logistic.Settlement', 'Settlement', fields);

			platformRuntimeDataService.readonly(entity, fields);
		};
	}
})(angular);