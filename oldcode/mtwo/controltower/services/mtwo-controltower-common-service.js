/**
 * Created by waldrop on 6/18/2019
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name mtwoControlTowerCommonService
	 * @function
	 *
	 * @destription
	 * mtwoControlTowerCommonService is the shared service for all ControlTower related functionality
	 *
	 */

	var moduleName = 'mtwo.controltower';
	var ControlTowerModule = angular.module(moduleName);

	ControlTowerModule.factory('mtwoControlTowerCommonService', MtwoControlTowerCommonService);

	MtwoControlTowerCommonService.$inject = ['$injector', '_'];

	function MtwoControlTowerCommonService($injector, _) {
		var service = {};
		var isPremium = null;

		service.setPremiumStatus = function setPremiumStatus() {
			var basicCustomizeSystemoptionLookupDataService = $injector.get('basicCustomizeSystemoptionLookupDataService');
			if (basicCustomizeSystemoptionLookupDataService) {
				var systemOptions = basicCustomizeSystemoptionLookupDataService.getList();
				if (systemOptions && systemOptions.length > 0) {
					var items = _.filter(systemOptions, function (systemOption) {
						if (systemOption.Id === 10023) {
							return systemOption;
						}
					});
					if (items && items.length > 0) {
						isPremium = !!(items[0] && items[0].ParameterValue && (items[0].ParameterValue > 0 || items[0].ParameterValue.toLowerCase() === 'true'));
					} else {
						isPremium = false;
					}
				}
			}
		};

		service.resolvePremiumStatus = function resolvePremiumStatus() {
			var q = $injector.get('$q');
			var list = $injector.get('basicCustomizeSystemoptionLookupDataService').getList();
			q.resolve(list);

		};
		service.getPremiumStatus = function getPremiumStatus() {
			if (isPremium !== null) {
				return isPremium;
			}
			return false;
		};

		return service;
	}
})(angular);
