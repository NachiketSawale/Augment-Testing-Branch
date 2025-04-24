(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name productionplanningEngineeringPinnableEntityService
	 * @function
	 * @requires $http, cloudDesktopPinningContextService
	 *
	 * @description A pinning context service adapter for models.
	 */
	angular.module('productionplanning.engineering').factory('productionplanningEngineeringPinnableEntityService', Service);
	Service.$inject = ['$http', 'cloudDesktopPinningContextService', '$injector', '$q', 'basicsLookupdataLookupDataService'];

	function Service($http, cloudDesktopPinningContextService, $injector, $q, basicsLookupdataLookupDataService) {
		return cloudDesktopPinningContextService.createPinnableEntityService({
			token: 'productionplanning.engineering',
			retrieveInfo: function (id) {
				return basicsLookupdataLookupDataService.getItemByKey('EngHeader', id, {version: 3}).then(function (item) {
					if (item) {
						item = item ? item : {Code: '*'};
						return cloudDesktopPinningContextService.concate2StringsWithDelimiter(item.Code, item.Description, ' - ');
					}


				});
			},
			dependsUpon: ['project.main']
		});
	}
})(angular);