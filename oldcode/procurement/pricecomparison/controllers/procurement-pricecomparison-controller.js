(function (angular) {
	'use strict';

	const moduleName = 'procurement.pricecomparison';

	/**
	 * @ngdoc controller
	 * @name procurement.pricecomparison.controller:procurementPricecomparisonController
	 * @requires $scope
	 * @description
	 * #
	 * Controller for module procurement.pricecomparison.
	 */
	/* jshint -W072 */
	angular.module(moduleName).controller('procurementPricecomparisonController', [
		'$scope', '$injector', 'platformMainControllerService', 'procurementPriceComparisonMainService',
		'procurementPricecomparisonTranslationService', 'procurementCommonTabConfigService',
		'procurementPriceComparisonWizardService', 'procurementCommonSidebarSearchOptionService',
		'cloudDesktopSidebarService', 'platformNavBarService', 'platformModalService', '$rootScope', '$state', '$stateParams', 'platformModuleNavigationService','_',
		'procurementCommonNavigationService', '$window',
		function ($scope, $injector, mainControllerService, leadingService, translateService, procurementCommonTabConfigService,
			procurementPriceComparisonWizardService, procurementCommonSidebarSearchOptionService,
			cloudDesktopSidebarService, platformNavBarService, platformModalService, $rootScope, $state, $stateParams, naviService, _,
			procurementCommonNavigationService, $window) {

			var opt = {search: true, reports: false, wizards: true,auditTrail:'f8e0d52ac856448cb3b1d628b536cd20'};
			var result = mainControllerService.registerCompletely($scope, leadingService, {}, translateService, moduleName, opt);

			// mainService.registerSidebarFilter();// rei@17.6.15 already done in platformMainControllerService.registerCompletely
			procurementCommonTabConfigService.registerTabConfig(moduleName, leadingService);

			// add search option for query Base Rfq and it's Change Rfqs.
			var prcSearch = procurementCommonSidebarSearchOptionService.getProcurementSidebarSearchOptions();
			cloudDesktopSidebarService.registerSidebarContainer(prcSearch, true);
			platformNavBarService.removeAction('save');

			procurementPriceComparisonWizardService.active();

			// some place reset the value. it does not work.
			// var moduleContext = $injector.get('procurementContextService');
			// //set module context variables
			// moduleContext.setLeadingService(leadingService);
			// moduleContext.setMainService(leadingService);

			$window.onbeforeunload = function (){
				if (leadingService.checkBoqNItemModifiedData(3)) {
					return true;
				}
			};

			$rootScope.$on('$stateChangeStart', priceComparisonStateChangeStart);

			function priceComparisonStateChangeStart(event, toState, toParams, fromState){
				if (fromState.name === 'app.procurementpricecomparison') {
					if (!leadingService.getOrSetItemCheck().status || !leadingService.getOrSetBoqCheck().status) {
						leadingService.checkAndQuerySave(3, event, toState);
					}
				}
			}

			$rootScope.$on('$stateChangeSuccess', function (e, toState, toParams, fromState) {
				if (fromState.name === 'app.procurementpricecomparison' && toState.name !== 'app.procurementpricecomparison'){
					offStateChangeStart();
				}
			});

			function offStateChangeStart() {
				let listeners = $rootScope.$$listeners;
				if (listeners.$stateChangeStart && listeners.$stateChangeStart.length>0) {
					for (let i = 0; i < listeners.$stateChangeStart.length; i++) {
						if (listeners.$stateChangeStart[i] && listeners.$stateChangeStart[i].name === 'priceComparisonStateChangeStart'){
							listeners.$stateChangeStart[i] = null;
						}
					}
				}
			}

			$scope.$on('$destroy', function () {

				// resotre the default sidebar search
				var defaultSearch = procurementCommonSidebarSearchOptionService.getDefaultSidebarSearchOptions();
				// DEV-34862 cloudDesktopSidebarService.registerSidebarContainer should before platformMainControllerService.unregisterCompletely
				cloudDesktopSidebarService.registerSidebarContainer(defaultSearch, true);
				mainControllerService.unregisterCompletely(leadingService, result, translateService, opt);
				procurementCommonTabConfigService.unregisterTabConfig();

				procurementPriceComparisonWizardService.deactive();
			});
		}
	]);
})(angular);