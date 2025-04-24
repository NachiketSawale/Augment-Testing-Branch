(function (angular) {

	'use strict';
	const moduleName = 'basics.common';
	angular.module(moduleName).controller('commonHistoricalPriceForBoqController', [
		'$scope',
		'$injector',
		'moment',
		'procurementContextService',
		'platformGridDomainService',
		'platformGridControllerService',
		'commonHistoricalPriceForBoqFactory',
		'prcBoqMainService',
		'boqMainLineTypes',
		'procurementCommonUpdateItemPriceService',
		'_',
		'$translate',
		function (
			$scope,
			$injector,
			moment,
			moduleContext,
			platformGridDomainService,
			platformGridControllerService,
			dataService,
			prcBoqMainService,
			boqMainLineTypes,
			commonUpdateItemPriceService,
			_,
			$translate) {

			const initialFormData = {
				boqItemId: 0,
				startDate: null,
				endDate: null,
				queryFromQuotation: true,
				queryFromContract: true
			};

			const uuid = $scope.getContentValue('uuid');
			const configServiceName = $scope.getContentValue('configService');
			let configService = $injector.get(configServiceName);
			const isDynamicParent = $scope.getContentValue('isDynamicParent');
			if (isDynamicParent) {
				const dynamicParent = prcBoqMainService.getService(moduleContext.getMainService());
				configService = configService.getService(dynamicParent);
			}
			configService.init({onRowDeselected: resetData, onItemSelected: loadHistory});

			$scope.priceRange = '';
			$scope.isLoading = false;
			$scope.selectedBoqItem = null;
			$scope.formDisabled = true;
			$scope.searchForm = angular.extend(angular.copy(initialFormData), dataService.getSearchFilter());

			$scope.getBoqLabel = function () {
				if ($scope.selectedBoqItem) {
					return $scope.selectedBoqItem.Brief ? $scope.selectedBoqItem.Brief :
						($scope.selectedBoqItem.rootItem ? $scope.selectedBoqItem.rootItem.Brief :
							($scope.selectedBoqItem.BriefInfo ? $scope.selectedBoqItem.BriefInfo.Translated : ''));
				}
				return '';
			};

			$scope.search = function () {
				loadHistory();
			};

			const columnDef = {
				getStandardConfigForListView: function () {
					return {
						columns: [
							{
								id: 'sourceType',
								field: 'SourceType',
								name: 'Source Type',
								name$tr$: 'basics.common.historicalPrice.sourceType',
								width: 120,
								formatter: 'description'
							},
							{
								id: 'status',
								field: 'Status',
								name: 'Status',
								name$tr$: 'basics.common.historicalPrice.status',
								formatter: 'dynamic',
								domain: function (item, column) {
									switch (item.SourceType) {
										case  'Quotation':
											column.formatterOptions = {
												lookupType: 'QuoteStatus',
												displayMember: 'Description'
											};
											break;
										case  'Contract':
											column.formatterOptions = {
												lookupType: 'ConStatus',
												displayMember: 'DescriptionInfo.Translated'
											};
											break;

									}
									return 'lookup';
								}
							},
							{
								id: 'code',
								field: 'Code',
								name: 'Code',
								name$tr$: 'cloud.common.code',
								formatter: 'code'
							},
							{
								id: 'description',
								field: 'DescriptionInfo',
								name: 'Description',
								name$tr$: 'cloud.common.descriptionInfo',
								formatter: 'translation'
							},
							{
								id: 'unirate',
								field: 'UnitRate',
								name: 'UnitRate',
								name$tr$: 'basics.common.historicalPrice.unitRate',
								formatter: 'money'
							},
							{
								id: 'correctedunitrate',
								field: 'CorrectedUnitRate',
								name: 'CorrectedUnitRate',
								name$tr$: 'basics.common.historicalPrice.correctedUnitRate',
								formatter: 'money'
							},
							{
								id: 'uom',
								field: 'UomFk',
								name: 'UoM',
								name$tr$: 'basics.common.historicalPrice.uom',
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'Uom',
									displayMember: 'Unit'
								}
							},
							{
								id: 'date',
								field: 'Date',
								name: 'Date',
								name$tr$: 'basics.common.historicalPrice.date',
								formatter: function (row, cell, value, columnDef, dataContext) {
									if (_.isString(value)) {
										value = moment.utc(value);
										dataContext[columnDef.field] = value;
									}
									return platformGridDomainService.formatter('dateutc')(row, cell, value, columnDef, dataContext);
								},
							},
							{
								id: 'businessPartner',
								field: 'BusinessPartnerFk',
								name: 'Business Partner',
								name$tr$: 'cloud.common.businessPartner',
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'BusinessPartner',
									displayMember: 'BusinessPartnerName1'
								}
							}
						]
					};
				}
			};

			const gridConfig = {
				initCalled: false,
				columns: [],
				grouping: false,
				uuid: uuid
			};

			platformGridControllerService.initListController($scope, columnDef, dataService, null, gridConfig);

			function loadHistory() {
				$scope.selectedBoqItem = configService.getSelectedBoqItem();
				if ($scope.selectedBoqItem) {
					$scope.searchForm.boqItemId = configService.getBoqItemId($scope.selectedBoqItem);
					dataService.clearContent();
					if ($scope.searchForm.boqItemId) {
						$scope.formDisabled = false;
						dataService.setSearchFilter($scope.searchForm);
						$scope.isLoading = true;
						dataService.load().then(function (data) {
							const minData = _.minBy(data, 'UnitRate');
							const minUnitRate = commonUpdateItemPriceService.formatterMoneyType(minData, 'UnitRate');
							const maxData = _.maxBy(data, 'UnitRate');
							const maxUnitRate = commonUpdateItemPriceService.formatterMoneyType(maxData, 'UnitRate');
							$scope.priceRange = minUnitRate + ' ~ ' + maxUnitRate;

							$scope.searchForm.startDate = null;
							$scope.searchForm.endDate = null;
							$scope.searchForm.rt$hasError = function () {
								return $scope.searchForm.startDate && $scope.searchForm.endDate && $scope.searchForm.startDate > $scope.searchForm.endDate;
							};
							$scope.searchForm.rt$errorText = function () {
								if ($scope.searchForm.rt$hasError()) {
									return $translate.instant('basics.material.updatePriceWizard.DateError', {
										startDate: 'Start date',
										endDate: 'End date'
									});
								}
								return '';
							};
						}).finally(function () {
							$scope.isLoading = false;
						});
					} else {
						$scope.searchForm = angular.copy(initialFormData);
						$scope.formDisabled = true;
						$scope.priceRange = '';
					}
				} else {
					resetData();
				}
			}

			function resetData() {
				$scope.selectedBoqItem = null;
				$scope.formDisabled = true;
				$scope.priceRange = '';
				dataService.clearContent();
			}

			$scope.$on('$destroy', function () {
				configService.unregister();
			});

			loadHistory();
		}
	]);

})(angular);
