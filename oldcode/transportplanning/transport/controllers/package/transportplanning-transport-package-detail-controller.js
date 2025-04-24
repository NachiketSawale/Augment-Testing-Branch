(function (angular) {
	'use strict';

	var moduleName = 'transportplanning.transport';
	var module = angular.module(moduleName);

	module.controller('transportplanningTransportPackageDetailController', transportplanningTransportPackageDetailController);
	transportplanningTransportPackageDetailController.$inject = [
		'$scope',
		'_',
		'basicsLookupdataLookupDescriptorService',
		'platformDetailControllerService',
		'transportplanningTransportPackageDataService',
		'transportplanningTransportPackageUIService',
		'transportplanningTransportPackageValidationService',
		'transportplanningTransportTranslationService'];

	function transportplanningTransportPackageDetailController($scope,
															   _,
															   lookupService,
															   platformDetailControllerService,
															   dataServ,
															   confServ,
															   validServ,
															   translationServ) {
		platformDetailControllerService.initDetailController($scope, dataServ, validServ, confServ, translationServ);
	}
})(angular);