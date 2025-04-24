/**
 * Created by lcn on 02/10/2025.
 */

(function (angular) {
	'use strict';

	const moduleName = 'procurement.common';

	angular.module(moduleName).factory('procurementCommonCreateAccrualTransactionFactoryController', [
		'_', '$http', '$translate', 'moment', '$injector', 'platformContextService', 'BasicsCommonDateProcessor',
		'basicsLookupdataLookupDataService', 'basicsLookupdataLookupFilterService', 'platformGridDialogService',
		function (_, $http, $translate, moment, $injector, platformContextService, BasicsCommonDateProcessor,
			basicsLookupdataLookupDataService, basicsLookupdataLookupFilterService, gridDialogService) {

			const commonTranslate = 'procurement.common.wizard.createAccrualTransaction.';

			function create(config) {
				let {$scope, translateSource, extraFilters = [], dateProcessorPara, createAccrualTransactionService, canOkFunc} = config;
				let dateProcessor = dateProcessorPara || new BasicsCommonDateProcessor(['EffectiveDate']);

				$scope.modalOptions = {
					headerText: $translate.instant(`${translateSource}title`),
					cancel: () => $scope.$close()
				};

				$scope.entity = {};
				$scope.transactions = [];
				$scope.count = 0;
				$scope.isSuccess = false;
				$scope.hasItems = false;
				$scope.isLoading = false;
				$scope.canOk = canOkFunc;

				$scope.validation = {
					voucherNoIsRequired: `${$translate.instant(commonTranslate + 'voucherNo')} ${$translate.instant(commonTranslate + 'required')}`,
					modeIsRequired: `${$translate.instant(commonTranslate + 'transactionMode')} ${$translate.instant(commonTranslate + 'required')}`,
					validatePeriod: $translate.instant('cloud.common.Error_EndDateTooEarlier')
				};

				$scope.transactionTypeOptions = {readOnly: true};
				$scope.companyYeaderOptions = {filterKey: 'basics-company-company-year-filter'};
				$scope.companyPeriodOptions = {filterKey: 'basics-company-period-filter'};

				const filters = [
					{
						key: 'basics-company-company-year-filter',
						serverSide: true,
						fn: () => `CompanyFk=${platformContextService.getContext().clientId}`
					},
					{
						key: 'basics-company-period-filter',
						fn: (item) => $scope.entity ? item.CompanyYearFk === $scope.entity.CompanyYearId : null
					},
					...extraFilters
				];

				basicsLookupdataLookupFilterService.registerFilter(filters);
				initializeData();

				function initializeData() {
					createAccrualTransactionService.init().then(({data}) => {
						if (data) {
							dateProcessor.processItem(data);
							$scope.entity = data;
							if (data.UseCompanyNumber) {
								$scope.entity.VoucherNo = 'Is Generated';
							}
						}
					});
				}

				function showMessageGridDialog(accountValidations) {
					gridDialogService.showDialog({
						columns: [{
							id: 'code',
							name$tr$: 'cloud.common.entityCode',
							formatter: 'code',
							field: 'HeaderCode',
							width: 100
						}, {
							id: 'desc',
							name$tr$: 'cloud.common.entityDescription',
							formatter: 'description',
							field: 'HeaderDescription',
							width: 150
						}, {
							id: 'errorMsg',
							name$tr$: 'cloud.common.errorMessage',
							formatter: 'remark',
							field: 'ErrorMsg',
							width: 400
						}],
						items: accountValidations,
						idProperty: 'Id',
						headerText$tr$: $scope.modalOptions.headerText,
						isReadOnly: true
					});
				}

				$scope.onOk = function () {
					let entity = angular.copy($scope.entity);
					dateProcessor.revertProcessItem(entity);

					$scope.isLoading = true;
					createAccrualTransactionService.create(entity).then(({data}) => {
						$scope.isSuccess = true;
						if (data) {
							let accountValidations = data.AccountValidations;
							if (accountValidations && accountValidations.length > 0) {
								showMessageGridDialog(accountValidations);
							} else {
								$scope.isSuccess = true;
								$scope.count = data.SuccessCount;
								$scope.transactions = data.Transactions;
							}
						}

					}).finally(() => {
						$scope.isLoading = false;
					});
				};

				$scope.success = function () {
					$scope.$close();
					createAccrualTransactionService.onCreateSuccessed.fire();
				};

				const unwatch = $scope.$watch('entity.CompanyPeriodId', (companyPeriodId) => {
					if (companyPeriodId) {
						basicsLookupdataLookupDataService.getItemByKey('companyPeriod', companyPeriodId).then((companyPeriod) => {
							if (companyPeriod) {
								const endMoment = moment(companyPeriod.EndDate).format('L');
								$scope.entity.EffectiveDate = moment(companyPeriod.EndDate);
								$scope.entity.PostingNarrative = `${$scope.entity.Abbreviation ? $scope.entity.Abbreviation + ' ' : ''}${endMoment} Accruals`;
							}
						});
					}
				});

				$scope.$on('$destroy', () => {
					unwatch();
					if (filters.length) {
						basicsLookupdataLookupFilterService.unregisterFilter(filters);
					}
				});
			}

			return {create};
		}
	]);
})(angular);



