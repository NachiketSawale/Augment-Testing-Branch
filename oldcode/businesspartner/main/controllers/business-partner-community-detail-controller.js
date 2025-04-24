/**
 * Created by chi on 07.12.2021.
 */

(function (angular) {

	'use strict';

	var moduleName = 'businesspartner.main';

	angular.module(moduleName).controller('businessPartnerMainCommunityDetailController', businessPartnerMainCommunityDetailController);

	businessPartnerMainCommunityDetailController.$inject = [
		'$scope',
		'businessPartnerMainCommunityUIStandardService',
		'businessPartnerMainCommunityService',
		'platformDetailControllerService',
		'businesspartnerMainTranslationService',
		'businessPartnerMainCommunityValidationService'];

	function businessPartnerMainCommunityDetailController(
		$scope,
		businessPartnerMainCommunityUIStandardService,
		businessPartnerMainCommunityService,
		platformDetailControllerService,
		businesspartnerMainTranslationService,
		businessPartnerMainCommunityValidationService) {

		platformDetailControllerService.initDetailController($scope, businessPartnerMainCommunityService,
			businessPartnerMainCommunityValidationService, businessPartnerMainCommunityUIStandardService, businesspartnerMainTranslationService);
	}

})(angular);