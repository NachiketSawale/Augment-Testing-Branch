/**
 * Created by baf on 2019/09/19
 */

(function (angular) {
	'use strict';
	var myModule = angular.module('basics.customize');

	/**
	 * @ngdoc service
	 * @name basicsCustomizeProjectCatalogConfigurationDefaultService
	 * @description provides method to get the default project catalog configuration for the current login company
	 */
	myModule.service('basicsCustomizeProjectCatalogConfigurationDefaultService', BasicsCustomizeProjectCatalogConfigurationDefaultService);
	
	BasicsCustomizeProjectCatalogConfigurationDefaultService.$inject = ['_', '$http'];
	
	function BasicsCustomizeProjectCatalogConfigurationDefaultService(_, $http) {
		this.getDefault = function getDefault() {
			return $http.get(globals.webApiBaseUrl + 'basics/customize/projectcatalogconfigurationtype/default').then(function(res) {
				return res.data;
			});
		};
	}
})(angular);