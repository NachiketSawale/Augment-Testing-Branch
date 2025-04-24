/**
 * Created by henkel on 15.09.2014.
 */
(function () {

	'use strict';
	var moduleName = 'basics.company';
	var angModule = angular.module(moduleName);

	/* jshint -W072 */ // many parameters because of dependency injection
	angModule.controller('basicsCompanyClerkController', BasicsCompanyClerkController);

	BasicsCompanyClerkController.$inject = ['$scope','platformContainerControllerService','basicsLookupdataLookupDescriptorService','basicsClerkMainService'];
	function BasicsCompanyClerkController($scope, platformContainerControllerService, basicsLookupdataLookupDescriptorService, basicsClerkMainService) {
		basicsLookupdataLookupDescriptorService.updateData('clerk', basicsClerkMainService.getList());
		platformContainerControllerService.initController($scope, moduleName, '1ED887BEC41F43CEA694ADA8C4C25254');
	}
})();