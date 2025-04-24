(function (angular) {
	'use strict';
	var moduleName = 'transportplanning.package';
	/**
	 * @ngdoc service
	 * @name platform:basicsCharacteristicTypeHelperService
	 * @function
	 * @description
	 * basicsCharacteristicTypeHelperService provide functions about packageType
	 */
	angular.module(moduleName).factory('transportplanningPackageTypeHelperService', service);
	service.$inject = ['packageTypes'];
	function service(packageTypes) {
		var service = {};

		//pkgTypes: only for those types a package may include other packages
		var pkgTypes = [
			packageTypes.Bundle,
			packageTypes.TransportRequisition,
			packageTypes.Package
		];

		//hasQtyTypes: The field “Quantity”/ “UoM” is enabled for those types
		var hasQtyTypes = [
			packageTypes.Resource,
			packageTypes.Material,
			packageTypes.Product
		];

		service.isPkg = function (type) {
			return pkgTypes.indexOf(type)!== -1;
		};

		service.hasQty = function (type) {
			return hasQtyTypes.indexOf(type)!== -1;
		};

		service.isPlaceHolder = function (type) {
			return type === packageTypes.PackageSelection;
		};



		return service;
	}
})(angular);

