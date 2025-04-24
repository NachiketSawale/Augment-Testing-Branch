/**
 * Created by chi on 07.12.20201.
 */

(function (angular) {

	'use strict';

	var moduleName = 'businesspartner.main';

	angular.module(moduleName).controller('businessPartnerMainCommunityListController', businessPartnerMainCommunityListController);

	businessPartnerMainCommunityListController.$inject = [
		'$scope',
		'platformGridControllerService',
		'businessPartnerMainCommunityUIStandardService',
		'businessPartnerMainCommunityService',
		'businessPartnerMainCommunityValidationService'];

	function businessPartnerMainCommunityListController(
		$scope,
		platformGridControllerService,
		businessPartnerMainCommunityUIStandardService,
		businessPartnerMainCommunityService,
		businessPartnerMainCommunityValidationService) {

		var myGridConfig = {initCalled: false, columns: []};

		platformGridControllerService.initListController($scope, businessPartnerMainCommunityUIStandardService, businessPartnerMainCommunityService, businessPartnerMainCommunityValidationService, myGridConfig);
	}

})(angular);