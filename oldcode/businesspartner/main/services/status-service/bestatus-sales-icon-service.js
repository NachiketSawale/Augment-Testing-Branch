(function (angular) {
	'use strict';
	let moduleName = 'businesspartner.main';
	// eslint-disable-next-line no-redeclare
	/* global angular,_ */

	/**
	 * @ngdoc service
	 * @name businesspartnerMainStatusSalesIconService
	 * @function
	 *
	 * @description
	 *
	 */
	angular.module(moduleName).service('businesspartnerMainStatusSalesIconService', businesspartnerMainStatusSalesIconService);

	businesspartnerMainStatusSalesIconService.$inject = ['platformStatusIconService'];

	function businesspartnerMainStatusSalesIconService(platformStatusIconService) {

		angular.extend(this, platformStatusIconService);// jshint ignore:line
		this.select = function select(item) { // jshint ignore:line
			let id = _.get(item, 'Status2Icon') || _.get(item, 'status2Icon');
			return _.isUndefined(id) ? '' : this.getImageResById(id);
		};

	}
})(angular);
