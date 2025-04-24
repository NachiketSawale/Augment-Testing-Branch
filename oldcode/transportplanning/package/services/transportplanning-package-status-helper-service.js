(function (angular) {
	'use strict';
	var moduleName = 'transportplanning.package';
	/**
	 * @ngdoc service
	 * @name platform:transportplanningPackageStatusHelperService
	 * @function
	 * @description
	 * transportplanningPackageStatusHelperService provide functions about judging pkg status
	 */
	angular.module(moduleName).factory('transportplanningPackageStatusHelperService', service);
	service.$inject = ['_', 'transportplanningPackageStatusLookupService'];
	function service(_, pkgStatusLookupServ) {
		var service = {};


		service.isTransportable = function (statusId) {
			var statusList = pkgStatusLookupServ.getList();
			var status = _.find(statusList, {Id: statusId});
			return status && status.Istransportable;

		};

		// service.isComplete = function (statusId) {
		// 	var statusList = pkgStatusLookupServ.getList();
		// 	var status = _.find(statusList, {Id: statusId});
		// 	return status && status.Isinpackaging === false &&
		// 		status.Isdeletable === false &&
		// 		status.Istransportable === false;
		//
		// };


		return service;
	}
})(angular);

