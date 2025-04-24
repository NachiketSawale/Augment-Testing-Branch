/**
 * Created by zwz on 2020/8/14.
 */

(function (angular) {
	'use strict';

	var moduleName = 'transportplanning.transport';
	var module = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name transportplanningTransportLogExtension
	 * @function
	 * @requires $injector
	 * @description
	 * transportplanningTransportLogExtension provides log functionality for transport data service
	 */
	module.service('transportplanningTransportLogExtension', LogExtension);
	LogExtension.$inject = ['$injector'];

	function LogExtension($injector) {

		this.addLogMethods = function (service) {

			service.onAddManualLogSucceeded = function onAddManualLogSucceeded() {
				var utilSrv = $injector.get('transportplanningTransportUtilService');
				// refresh log-list
				if (utilSrv.hasShowContainerInFront('transportplanning.transport.log.list')) {
					var serviceOptions = {
						'serviceName': 'transportplanningTransportLogDataService',
						'parentServiceName': 'transportplanningTransportMainService',
						'translationServiceName': 'transportplanningTransportTranslationService',
						'endRead': 'listbyrouteid',
						'parentFilter': 'routeId'
					};
					var logListDataSrv = $injector.get('ppsCommonLogDataServiceFactory').getOrCreateService(serviceOptions);
					logListDataSrv.load();
				}
			};
		};

	}
})(angular);