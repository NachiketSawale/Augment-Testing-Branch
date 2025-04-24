/**
 * Created by wwa on 11/4/2015.
 */
(function () {
	'use strict';

	angular.module('businesspartner.main').controller('businessPartnerRelationGridController',
		['$injector', '$scope', 'businessPartnerRelationDataService', 'businessPartnerRelationUIStandardService', 'platformGridControllerService', 'businessPartnerRelationValidationService',
			/* jshint -W072 */ // many parameters because of dependency injection
			function ($injector, $scope, businessPartnerRelationDataService, businessPartnerRelationUIStandardService, platformGridControllerService, businessPartnerRelationValidationService) {

				var myGridConfig = {initCalled: false, columns: []};

				platformGridControllerService.initListController($scope, businessPartnerRelationUIStandardService, businessPartnerRelationDataService, businessPartnerRelationValidationService, myGridConfig);
			}
		]);
})();