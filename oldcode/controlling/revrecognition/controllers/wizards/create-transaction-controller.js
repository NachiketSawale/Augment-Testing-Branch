/**
 * Created by alm on 9/8/2021.
 */

(function (angular) {
	'use strict';

	var moduleName = 'controlling.revrecognition';

	angular.module(moduleName).controller('controllingRevenuerecognitionCreateTransactionController', [
		'$scope',
		'globals',
		'$http',
		'$translate',
		'moment',
		'$injector',
		'platformContextService',
		'basicsLookupdataLookupDataService',
		'basicsLookupdataLookupFilterService',
		'platformDialogService',
		'platformGridDialogService',
		function ($scope,
			globals,
			$http,
			$translate,
			moment,
			$injector,
			platformContextService,
			basicsLookupdataLookupDataService,
			basicsLookupdataLookupFilterService,
			dialogService,
			gridDialogService
		) {

			$scope.modalOptions = {};
			$scope.entity={CompanyYearId:null,CompanyPeriodId:null};
			$scope.modalOptions.headerText = $translate.instant('controlling.revrecognition.createTransaction.title');
			$scope.modalOptions.cancel = function () {
				$scope.$close(false);
			};
			$scope.isSuccess = false;
			$scope.isLoading = false;
			$scope.validation = {
				voucherNoIsRequired: $translate.instant('controlling.revrecognition.createTransaction.voucherNo') + ' ' + $translate.instant('procurement.pes.required')
			};
			$scope.transactionTypeOptions = {
				readOnly: true
			};
			$scope.companyYeaderOptions = {
				filterKey: 'basics-company-companyyear-filter'
			};
			$scope.companyPeriodOptions = {
				filterKey: 'basics-company-period-filter'
			};

			var filters = [{
				key: 'basics-company-companyyear-filter',
				serverSide: true,
				fn: function () {
					return 'CompanyFk=' + platformContextService.getContext().clientId;
				}
			}, {
				key: 'basics-company-period-filter',
				fn: function (item){
					if($scope.entity){
						return item.CompanyYearFk===$scope.entity.CompanyYearId;
					}
					return null;
				}
			}];
			basicsLookupdataLookupFilterService.registerFilter(filters);


			var contextUrl = globals.webApiBaseUrl + 'controlling/RevenueRecognition/wizard/transactionInit';
			$http.get(contextUrl).then(function (response) {
				if(response.data) {
					$scope.entity = response.data;

					if(response.data.UseCompanyNumber) {
						$scope.entity.VoucherNo = 'Is Generated';
					}
				}
			});
			$scope.canOk = function () {
				return $scope.entity && (!!$scope.entity.VoucherNo);
			};
			$scope.transactions = [];
			$scope.count = 0;
			$scope.transactioncount = 0;
			$scope.onOk = function () {
				var data = angular.copy($scope.entity);
				if(data.CompanyPeriodId<=0){
					var strTitle = 'controlling.revrecognition.createRevenueRecognition.title';
					var strBody = 'controlling.revrecognition.createRevenueRecognition.selectPeriodRequire';
					dialogService.showMsgBox(strBody, strTitle, 'info');
					return false;
				}
				$scope.isLoading = true;
				$http.post(globals.webApiBaseUrl + 'controlling/RevenueRecognition/wizard/createTransaction', data).then(function (res) {
					if (res.data) {
						let accountValidations = res.data.accountValidations;
						if(accountValidations&&accountValidations.length>0){
							showMessageGridDialog(accountValidations);
						}
						else {
							$scope.isSuccess = true;
							$scope.count = res.data.successCount;
							var headerService = $injector.get('controllingRevenueRecognitionHeaderDataService');
							var header = headerService.getSelected();
							headerService.refresh().then(function () {
								headerService.setSelected(header);
							});
						}
					}
				}).finally(function () {
					$scope.isLoading = false;
				});
			};

			function showMessageGridDialog(accountValidations){
				gridDialogService.showDialog({
					columns: [{
						id: 'ProjectNo',
						name$tr$: 'controlling.revrecognition.entityProjectFk',
						formatter: 'code',
						field: 'ProjectNo',
						width: 100
					}, {
						id: 'desc',
						name$tr$: 'controlling.revrecognition.transaction.projectName',
						formatter: 'description',
						field: 'ProjectName',
						width: 150
					}, {
						id: 'errormsg',
						name$tr$: 'cloud.common.errorMessage',
						formatter: 'remark',
						field: 'ErrorMsg',
						width: 400
					}],
					items:accountValidations,
					idProperty: 'Id',
					headerText$tr$: 'controlling.revrecognition.transaction.createAccrualsWizardTitle',
					isReadOnly: true
				});
			}

			$scope.success = function () {
				$scope.$close();
				var header=$injector.get('controllingRevenueRecognitionHeaderDataService').getSelected();
				if (header) {
					var controllingRevenueRecognitionAccrualService=$injector.get('controllingRevenueRecognitionAccrualService');
					controllingRevenueRecognitionAccrualService.load();
				}
			};

			var unwatch = $scope.$watch('entity.CompanyPeriodId', function () {
				if ($scope.entity) {
					var companyPeriodId=$scope.entity.CompanyPeriodId;
					if(companyPeriodId) {
						basicsLookupdataLookupDataService.getItemByKey('companyPeriod', companyPeriodId).then(function (companyPeriod) {
							$scope.entity.PostingNarrative = 'Accruals';
							var endmoment = moment(companyPeriod.EndDate).format('L');
							$scope.entity.PostingNarrative = endmoment + ' ' + $scope.entity.PostingNarrative;
							if ($scope.entity.Abbreviation) {
								$scope.entity.PostingNarrative = $scope.entity.Abbreviation + ' ' + $scope.entity.PostingNarrative;
							}
						});
					}
				}
			});

			$scope.$on('$destroy', function () {
				unwatch();
				basicsLookupdataLookupFilterService.unregisterFilter(filters);
			});
		}
	]);

})(angular);
