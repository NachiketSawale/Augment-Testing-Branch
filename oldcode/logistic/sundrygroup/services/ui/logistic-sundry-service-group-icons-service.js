/**
 * Created by baf on 05.03.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.sundrygroup';

	/**
	 * @ngdoc service
	 * @name logisticSundryServiceGroupValidationService
	 * @description provides validation methods for logistic sundrygroup  entities
	 */
	angular.module(moduleName).service('logisticSundryServiceGroupIconService', LogisticSundryServiceGroupIconService);

	LogisticSundryServiceGroupIconService.$inject = ['platformIconBasisService', 'basicsCustomizeResourceFolderIconService', 'basicsCustomizeResourceTypeIconService'];

	function LogisticSundryServiceGroupIconService(platformIconBasisService, basicsCustomizeResourceFolderIconService, basicsCustomizeResourceTypeIconService) {
		var self = this;
		platformIconBasisService.combine(self, [basicsCustomizeResourceFolderIconService, basicsCustomizeResourceTypeIconService]);
	}

})(angular);
