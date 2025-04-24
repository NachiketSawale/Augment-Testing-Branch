(function (angular) {
	/*global angular*/
	'use strict';
	var moduleName = 'basics.riskregister';
	angular.module(moduleName).service('basicsRiskRegisterDependencyCommonService', [
		'$injector',

		function ($injector) {
			var service = {};

			service.clearDependencies = function clearDependencies() {
				$injector.get('basicsRiskRegisterDependencyUpdateService').clear();
			};
			service.refreshRootParam = function refreshRootParam(entity, param, rootServices) {
				if (entity) {
					entity.RiskDependencies = param;

					angular.forEach(rootServices, function (serv) {
						if (serv) {
							var rootService = $injector.get(serv);
							rootService.markItemAsModified(entity);
						}
					});
				}
			};

			return service;
		}
	]);
})(angular);
