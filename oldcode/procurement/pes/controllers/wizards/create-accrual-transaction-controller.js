/**
 * Created by lcn on 02/10/2025.
 */

(function (angular) {
	'use strict';

	var moduleName = 'procurement.pes';

	angular.module(moduleName).controller('procurementPesCreateAccrualTransactionController', [
		'$scope', 'procurementCommonCreateAccrualTransactionFactoryController', 'procurementPesCreateAccrualTransactionService',
		'platformModuleNavigationService',
		function ($scope, factoryController, procurementPesCreateAccrualTransactionService, platformModuleNavigationService) {

			$scope.goToAccountingJournal = function () {
				$scope.$close(false);

				if (!$scope.transactions?.length) {
					return;
				}

				const companyTransHeaderIds = _.chain($scope.transactions)
					.map('CompanyTransheaderFk')
					.compact()
					.uniq()
					.value();

				platformModuleNavigationService.navigate({
					moduleName: 'basics.accountingjournals',
					registerService: 'basicsAccountingJournalsMainService'
				}, companyTransHeaderIds, 'CompanyTransheaderFk');
			};

			function canOkFunc() {
				const {entity} = $scope;
				return !!entity?.VoucherNo && entity?.AccrualModeId !== null;
			}

			return factoryController.create({
				$scope: $scope,
				translateSource: 'procurement.pes.wizard.createAccrualTransaction.',
				createAccrualTransactionService: procurementPesCreateAccrualTransactionService,
				canOkFunc: canOkFunc
			});

		}
	]);
})(angular);

