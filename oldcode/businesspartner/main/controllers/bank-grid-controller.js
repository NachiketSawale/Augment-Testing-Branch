(function (angular) {
	'use strict';

	/**
	 * @ngdoc controller
	 * @name businesspartner.main.controller: businesspartnerMainBankListControllerNew
	 * @requires $scope, platformGridControllerService
	 * @description
	 * #
	 * Controller for bank list container.
	 */
	angular.module('businesspartner.main').controller('businesspartnerMainBankListController',
		['$scope', 'platformGridControllerService', 'businesspartnerMainBankDataService', 'businessPartnerMainBankUIStandardService', 'businesspartnerMainBankValidationService',
			/* jshint -W072 */ // many parameters because of dependency injection
			function ($scope, platformGridControllerService, businesspartnerMainBankDataService, businessPartnerMainBankUIStandardService, businesspartnerMainBankValidationService) {

				let myGridConfig = {initCalled: false, columns: []};

				let validator = businesspartnerMainBankValidationService(businesspartnerMainBankDataService);

				platformGridControllerService.initListController($scope, businessPartnerMainBankUIStandardService, businesspartnerMainBankDataService, validator, myGridConfig);

				let tools = [
					{
						id: 't5',
						sort: 5,
						caption: 'cloud.common.taskBarDeepCopyRecord',
						type: 'item',
						disabled: function () {
							return businesspartnerMainBankDataService.disableDeepCopy();
						},
						iconClass: 'tlb-icons ico-copy-paste-deep',
						fn: function deepCopy() {
							businesspartnerMainBankDataService.copyPaste();
						}
					}
				];
				platformGridControllerService.addTools(tools);
			}
		]);
})(angular);