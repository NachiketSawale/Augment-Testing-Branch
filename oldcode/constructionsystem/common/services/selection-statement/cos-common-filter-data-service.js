(function (angular) {
	'use strict';
	var moduleName = 'constructionsystem.common';

	angular.module(moduleName).factory('constructionsystemCommonFilterDataService', [

		function () {

			// servcie[key].selectedFilterDefDto= null
			// key = parnet service name + constructionsystemCommonFilterDataService
			var service = {
				filter: {}
			};


			/**
			 * get filter.
			 */
			service.getSelectedFilter = function (key) {
				return (service.filter && Object.prototype.hasOwnProperty.call(service.filter,key)) ?
					service.filter[key].selectedFilterDefDto :
					null;
			};

			/**
			 * clear filter.
			 */
			service.setSelectedFilter = function (key, filterDto) {
				service.filter[key] = {
					selectedFilterDefDto: filterDto
				};
			};

			/**
			 * clear filter.
			 */
			service.clearSelectedFilter = function (key) {
				service.filter[key] = {
					selectedFilterDefDto: null
				};
			};

			/**
			 * clear filter.
			 */
			service.clearAllFilter = function () {
				service.filter = {};
			};

			return service;
		}
	]);
})(angular);