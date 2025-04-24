/**
 * Created by lcn on 02/10/2025.
 */

(function (angular) {
	'use strict';

	const moduleName = 'procurement.stock';

	angular.module(moduleName).controller('procurementStockCreateAccrualTransactionController', [
		'$scope', '$q', 'procurementCommonCreateAccrualTransactionFactoryController', 'procurementStockCreateAccrualTransactionService',
		'basicsLookupdataLookupDataService', 'BasicsCommonDateProcessor',
		function ($scope, $q, factoryController, procurementStockCreateAccrualTransactionService, basicsLookupdataLookupDataService, BasicsCommonDateProcessor) {

			const dateProcessor = new BasicsCommonDateProcessor(['EffectiveDate_Start', 'EffectiveDate_End', 'StartDate', 'EndDate']);

			const unwatchFunctions = [
				watchCompanyYearId('CompanyYearId_Start', 'CompanyPeriodId_Start'),
				watchCompanyYearId('CompanyYearId_End', 'CompanyPeriodId_End'),
				$scope.$watchGroup(['entity.CompanyPeriodId_Start', 'entity.CompanyPeriodId_End'], updatePostingNarrative)
			];

			$scope.companyPeriodStartOptions = {filterKey: 'basics-company-period-filter-start'};
			$scope.companyPeriodEndOptions = {filterKey: 'basics-company-period-filter-end'};

			function updatePostingNarrative() {
				const {CompanyPeriodId_Start, CompanyPeriodId_End, Abbreviation} = $scope.entity || {};
				if (!CompanyPeriodId_Start && !CompanyPeriodId_End) return;

				Promise.all([
					basicsLookupdataLookupDataService.getItemByKey('companyPeriod', CompanyPeriodId_Start),
					basicsLookupdataLookupDataService.getItemByKey('companyPeriod', CompanyPeriodId_End)
				]).then(([startData, endData]) => {
					if (!startData || !endData) {
						return;
					}

					dateProcessor.processItem(startData);
					dateProcessor.processItem(endData);

					Object.assign($scope.entity, {
						EffectiveDate_Start: startData.StartDate,
						EffectiveDate_End: endData.EndDate
					});

					const startMoment = moment(startData.StartDate).format('L');
					const endMoment = moment(endData.EndDate).format('L');
					const dateRange = CompanyPeriodId_Start === CompanyPeriodId_End ? endMoment : `${startMoment} To ${endMoment}`;

					$scope.entity.PostingNarrative = `${Abbreviation ? Abbreviation + ' ' : ''}${dateRange} Inventory Adjustment`;
				});
			}

			function watchCompanyYearId(yearKey, periodKey) {
				return $scope.$watch(`entity.${yearKey}`, (newVal, oldVal) => {
					if (!_.isNil(oldVal) && newVal !== oldVal) {
						basicsLookupdataLookupDataService.getList('companyPeriod').then(data => {
							const period = data.find(item => item.CompanyYearFk === newVal);
							if (period) {
								dateProcessor.processItem(period);
								$scope.entity[periodKey] = period.Id;
							}
						});
					}
				});
			}

			function canOkFunc() {
				const {EffectiveDate_Start, EffectiveDate_End, VoucherNo} = $scope.entity || {};
				return VoucherNo && !(Date.parse(EffectiveDate_Start) > Date.parse(EffectiveDate_End));
			}

			$scope.isValidatePeriod = function () {
				const {EffectiveDate_Start, EffectiveDate_End} = $scope.entity || {};
				return EffectiveDate_Start && EffectiveDate_End && (Date.parse(EffectiveDate_Start) > Date.parse(EffectiveDate_End));
			};

			$scope.$on('$destroy', () => unwatchFunctions.forEach(fn => fn()));

			return factoryController.create({
				$scope,
				translateSource: 'procurement.stock.wizard.createAccrualTransaction.',
				createAccrualTransactionService: procurementStockCreateAccrualTransactionService,
				extraFilters: [
					{
						key: 'basics-company-period-filter-start',
						fn: item => ($scope.entity ? item.CompanyYearFk === $scope.entity.CompanyYearId_Start : null)
					},
					{
						key: 'basics-company-period-filter-end',
						fn: item => ($scope.entity ? item.CompanyYearFk === $scope.entity.CompanyYearId_End : null)
					}
				],
				canOkFunc,
				dateProcessorPara: dateProcessor
			});
		}
	]);
})(angular);


