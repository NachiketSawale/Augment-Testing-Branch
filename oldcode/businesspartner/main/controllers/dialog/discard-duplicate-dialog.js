/**
 * Created by chi on 11/23/2015.
 */
(function (angular) {
	'use strict';

	// var module = angular.module('businesspartner.main');
	angular.module('businesspartner.main').controller('businessPartnerMainDiscardDuplicateDialogController',
		['$scope', '$translate', 'basicsCommonDialogGridControllerService', '$http', 'globals',
			/* jshint -W072 */
			function ($scope, $translate, basicsCommonDialogGridControllerService, $http, globals) {
				var fields = {
					CrefoNo: $translate.instant('businesspartner.main.creFoNo'),
					BedirektNo: $translate.instant('businesspartner.main.beDirectNo'),
					DunsNo: $translate.instant('businesspartner.main.dunsNo'),
					VatNo: $translate.instant('businesspartner.main.vatNo'),
					TaxNo: $translate.instant('businesspartner.main.taxNo'),
					TradeRegisterNo: $translate.instant('businesspartner.main.tradeRegisterNo'),
					TelephoneNumber1Dto: $translate.instant('businesspartner.main.telephoneNumber'),
					TelephoneNumberTelefaxDto: $translate.instant('businesspartner.main.telephoneFax'),
					'SubsidiaryDescriptor.TelephoneNumber1Dto': $translate.instant('businesspartner.main.telephoneNumber'),
					'SubsidiaryDescriptor.TelephoneNumberTelefaxDto': $translate.instant('businesspartner.main.telephoneFax'),
					Email: $translate.instant('businesspartner.main.email')
				};

				$scope.options = $scope.$parent.modalOptions;
				var dataService = $scope.options.dataService;
				var gridLayout = $scope.options.gridLayout;
				var invalidModel = $scope.options.getInvalidModel();
				var executionType = $scope.options.executionType;
				let requestUrl = $scope.options.url || null;
				let checkData = $scope.options.checkData ? angular.copy($scope.options.checkData) : null;
				let pageTotalLength = ($scope.options.page && $scope.options.page.totalLength) || 0;
				let pageCurrentLength = ($scope.options.page && $scope.options.page.currentLength) || 0;
				let pageSize = 100;

				var headerText = null;
				switch (invalidModel) {
					case 'TelephoneNumber1Dto':
					case 'SubsidiaryDescriptor.TelephoneNumber1Dto':
						headerText = $translate.instant('businesspartner.main.dialog.discardDuplicateTelephoneTitle');
						break;
					case 'TelephoneNumberTelefaxDto':
					case 'SubsidiaryDescriptor.TelephoneNumberTelefaxDto':
						headerText = $translate.instant('businesspartner.main.dialog.discardDuplicateTaxTitle');
						break;
					default:
						headerText = $translate.instant('businesspartner.main.dialog.discardDuplicateBusinessPartnerTitle');
				}

				var page = {
					number: 0,
					size: pageSize,
					totalLength: pageTotalLength,
					currentLength: pageCurrentLength,
					count: Math.ceil(pageTotalLength / pageSize)
				};

				$scope.htmlTranslate = {
					description: $translate.instant('businesspartner.main.dialog.discardDuplicateBusinessPartnerDescription', {invalidModel: fields[invalidModel]}),
					displayAndDiscardBtnText: $translate.instant('businesspartner.main.dialog.btn.displayAndDiscard'),
					ignoreBtnText: $translate.instant('businesspartner.main.dialog.btn.ignore')
				};
				$scope.isLoading = false;
				$scope.$parent.modalOptions.cancel = discardAndDisplay;
				$scope.$parent.modalOptions.headerText = headerText;
				$scope.discardAndDisplay = discardAndDisplay;

				$scope.ignore = ignore;
				$scope.getPageText = getPageText;
				$scope.getFirstPage = getFirstPage;
				$scope.getLastPage = getLastPage;
				$scope.getPrevPage = getPrevPage;
				$scope.getNextPage = getNextPage;
				$scope.canFirstPage = $scope.canPrevPage = canFirstOrPrevPage;
				$scope.canLastPage = $scope.canNextPage = canLastOrNextPage;
				$scope.canShowPage = canShowPage;

				var gridConfig = {
					initCalled: false,
					columns: [],
					grouping: false,
					uuid: $scope.options.UUID
				};

				basicsCommonDialogGridControllerService.initListController($scope, gridLayout, dataService, {}, gridConfig);

				function discardAndDisplay() {
					$scope.$close({executionType: executionType.discardAndDisplay, displayEntities: dataService.hasSelection() ? dataService.getSelectedEntities() : null});
				}

				function ignore() {
					$scope.$close({executionType: executionType.ignore});
				}

				function getPageText() {
					var startIndex = page.number * page.size,
						endIndex = ((page.count - (page.number + 1) > 0 ? startIndex + page.size : page.totalLength));

					if ($scope.isLoading) {
						return $translate.instant('cloud.common.searchRunning');
					}
					if (page.currentLength === 0) {
						return $translate.instant('cloud.common.noSearchResult');
					}
					return (startIndex + 1) + ' - ' + endIndex + ' / ' + page.totalLength;
				}

				function getFirstPage() {
					page.number = 0;
					getListByPage();
				}

				function getLastPage() {
					page.number = page.count - 1;
					getListByPage();
				}

				function getPrevPage() {
					if (page.number <= 0) {
						return;
					}
					page.number--;
					getListByPage();
				}

				function getNextPage() {
					if (page.count <= page.number) {
						return;
					}
					page.number++;
					getListByPage();
				}

				function canFirstOrPrevPage() {
					return page.number > 0;
				}

				function canLastOrNextPage() {
					return page.count > (page.number + 1);
				}

				function canShowPage() {
					return $scope.options.showPage;
				}

				function getListByPage() {
					checkData.PageSize = pageSize;
					checkData.PageIndex = page.number;
					$scope.isLoading = true;
					$http.post(globals.webApiBaseUrl + requestUrl, checkData)
						.then(function (response) {
							if (!response || !response.data) {
								dataService.dataList = [];
								page.currentLength = response.data.RecordsRetrieved;
							}
							else {
								dataService.dataList = response.data.Items;
								page.currentLength = response.data.RecordsRetrieved;
								page.totalLength = response.data.RecordsFound;
							}
							if (dataService.load) {
								dataService.load();
								dataService.goToFirst();
							}
						})
						.finally(function () {
							$scope.isLoading = false;
						});
				}
			}
		]);
})(angular);