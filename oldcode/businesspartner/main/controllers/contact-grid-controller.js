(function () {
	'use strict';

	angular.module('businesspartner.main').controller('businessPartnerMainContactListController',
		['$q', '$scope', 'businesspartnerMainContactDataService', 'businessPartnerMainContactUIStandardService', 'platformGridControllerService',
			'businessPartnerMainContactValidationService', 'businessPartnerMainVcardExtension', 'businesspartnerMainContactPhotoDataService', '$translate', 'bascisCommonClerkDataServiceFactory',
			'_', 'businesspartnerMainHeaderDataService', 'basicsCommonInquiryHelperService',
			/* jshint -W072 */ // many parameters because of dependency injection
			function ($q, $scope, dataService, uiStandardService, platformGridControllerService,
			          validationService, businessPartnerMainVcardExtension, photoService, $translate, bascisCommonClerkDataServiceFactory,
			          _, businesspartnerMainHeaderDataService, basicsCommonInquiryHelperService) {

				let myGridConfig = {initCalled: false, columns: []};

				platformGridControllerService.initListController($scope, uiStandardService, dataService, validationService(dataService), myGridConfig);

				const extParams = dataService.getExtParams();

				$scope.addTools([
					{
						id: 'copycontact',
						caption: $translate.instant('cloud.common.taskBarDeepCopyRecord'),
						type: 'item',
						iconClass: 'tlb-icons ico-copy-paste-deep',
						fn: function () {
							$scope.isLoading = true;
							dataService.copyPaste();
						},
						disabled: function () {
							return !dataService.canCopy();
						},
						permission: 'dcf7db231fd14eb085244f685e6a1fec#c'
					},
					{
						id: 'filterByBranch',
						sort: 0,
						caption: 'businesspartner.main.filterByBranch',
						iconClass: 'tlb-icons ico-filter',
						type: 'check',
						fn: function (btnId, btn) {
							dataService.clickBtnFilterByBranch(btn.value);
						},
						disabled: function () {
							if (extParams?.subsidiaryFk){
								return false;
							}

							return dataService.filterBtnDisabled;
						}
					}]);

				function finishLoading() {
					$scope.isLoading = false;
				}

				function resetFilterBranchValue() {
					if ($scope.tools) {
						const filterBtn = _.find($scope.tools.items, {id: 'filterByBranch'});
						if (filterBtn) {
							_.set(filterBtn, 'value', dataService.filterBranchValue)
							if (_.isFunction($scope.tools.refresh)) {
								$scope.tools.refresh();
							}
						}
					}
				}

				if (dataService.finishLoadingEvent) {
					dataService.finishLoadingEvent.register(finishLoading);
				}
				dataService.changeFilterbtnValueMessenger.register(resetFilterBranchValue);
				businessPartnerMainVcardExtension.addVcardSupport($scope, dataService, photoService);
				bascisCommonClerkDataServiceFactory.getService('businesspartner.contact.clerk', 'businesspartnerMainContactDataService', null, true, 'businesspartnerMainContactClerkExtendDataService');
				if (!dataService.filterBranchValue) {
					resetFilterBranchValue();
				}

				basicsCommonInquiryHelperService.activateProvider($scope, false);

				$scope.$on('$destroy', function () {
					dataService.changeFilterbtnValueMessenger.unregister(resetFilterBranchValue)

				});
			}
		]);
})();