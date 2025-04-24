/**
 * Created by Baedeker on 2015-12-15
 */
(function (angular) {
	'use strict';
	var moduleName = 'platform';
	/**
	 * @ngdoc service
	 * @name cloud.platform.services:platformNoIconService
	 * @description
	 * Get a selector for an empty icon list.
	 */
	angular.module(moduleName).service('platformNoIconService', platformNoIconService);

	platformNoIconService.$inject = ['platformIconBasisService'];

	function platformNoIconService(platformIconBasisService) {
		/* jshint -W040 */ // Add interface to this with help of platformIconBasisService
		platformIconBasisService.extend([], this);
	}
})(angular);
