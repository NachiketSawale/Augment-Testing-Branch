/**
 * Created by zov on 30/01/2019.
 */
(function () {
	'use strict';
	/*global angular*/

	var moduleName = 'transportplanning.transport';
	var transportModule = angular.module(moduleName);
	transportModule.factory('trsTransportResRequisitionFilterDataService', [
		'$injector',
		function ($injector) {
			var resRequisitionDSOption = {
				module: transportModule,
				serviceName: 'trsTransportResRequisitionFilterDataService',
				dataProcessorName: 'trsTransportCheckResRequisitionReadOnlyProcessor',
				lastObjectModuleName: moduleName,
				usePostForRead: true
			};
			return $injector.get('productionplanningCommonResRequisitionDataServiceFactory').getOrCreateService(resRequisitionDSOption);
		}

	]);
})();