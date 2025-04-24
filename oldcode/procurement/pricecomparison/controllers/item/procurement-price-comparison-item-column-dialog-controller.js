(function (angular) {
	'use strict';

	var moduleName = 'procurement.pricecomparison';

	angular.module(moduleName).value('procurementPriceComparisonItemColumnDialogDef', {
		getStandardConfigForListView: function () {
			return {
				columns: [
					{
						id: 'businessPartnerFk',
						field: 'Id',
						name: 'Business Partner',
						name$tr$: 'cloud.common.entityBusinessPartner',
						width: 120,
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'Quote',
							displayMember: 'BusinessPartnerName1'
						}
					},
					{
						id: 'qtnVersion',
						field: 'Id',
						name: 'Version',
						name$tr$: 'cloud.common.entityVersion',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'Quote',
							displayMember: 'QuoteVersion'
						}
					},
					{
						id: 'statusFk',
						field: 'Id',
						name: 'Status',
						name$tr$: 'cloud.common.entityState',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'Quote',
							displayMember: 'StatusDescriptionInfo.Description',
							imageSelector: 'platformStatusIconService'
						}
					},
					{
						id: 'qtnCode',
						field: 'Id',
						name: 'Reference Code',
						name$tr$: 'cloud.common.entityReferenceCode',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'Quote',
							displayMember: 'Code'
						}
					},
					{
						id: 'qtnDescription',
						field: 'Id',
						name: 'Description',
						name$tr$: 'cloud.common.entityDescription',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'Quote',
							displayMember: 'Description'
						}
					},
					{
						id: 'rfqHeaderCode',
						field: 'RfqHeaderFk',
						name: 'Rfq Header Code',
						name$tr$: 'procurement.quote.headerRfqHeaderCode',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'RfqHeader',
							displayMember: 'Code'
						},
						searchable: true
					},
					{
						id: 'rfqHeaderDescription',
						field: 'RfqHeaderFk',
						name: 'Rfq Header Description',
						name$tr$: 'procurement.quote.headerRfqHeaderDescription',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'RfqHeader',
							displayMember: 'Description'
						},
						searchable: true
					},
					{
						id: 'currencyDescription',
						field: 'Id',
						name: 'Currency',
						name$tr$: 'cloud.common.entityCurrency',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'Quote',
							displayMember: 'Currency'
						}
					},
					{
						id: 'exchangeRate',
						field: 'Id',
						name: 'Rate',
						name$tr$: 'cloud.common.entityRate',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'Quote',
							displayMember: 'ExchangeRate'
						}
					},
					{
						id: 'subsidiaryFk',
						field: 'Id',
						name: 'Subsidiary',
						name$tr$: 'cloud.common.entitySubsidiary',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'Quote',
							displayMember: 'SubsidiaryDescription'
						}
					},
					{
						id: 'supplierCode',
						field: 'Id',
						name: 'Supplier Code',
						name$tr$: 'cloud.common.entitySupplierCode',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'Quote',
							displayMember: 'SupplierCode'
						},
						width: 120
					},
					{
						id: 'supplierDescription',
						field: 'Id',
						width: 120,
						name: 'Supplier Description',
						name$tr$: 'cloud.common.entitySupplierDescription',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'Quote',
							displayMember: 'SupplierDescription'
						}
					},
					{
						id: 'remark',
						field: 'Id',
						name: 'Remarks',
						name$tr$: 'cloud.common.entityRemark',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'Quote',
							displayMember: 'Remark'
						}
					},
					{
						id: 'userDefined1',
						field: 'Id',
						name: 'User Defined 1',
						name$tr$: 'cloud.common.entityUserDefined',
						name$tr$param$: {'p_0': '1'},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'Quote',
							displayMember: 'UserDefined1'
						}
					},
					{
						id: 'userDefined2',
						field: 'Id',
						name: 'User Defined 2',
						name$tr$: 'cloud.common.entityUserDefined',
						name$tr$param$: {'p_0': '2'},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'Quote',
							displayMember: 'UserDefined2'
						}
					},
					{
						id: 'userDefined3',
						field: 'Id',
						name: 'User Defined 3',
						name$tr$: 'cloud.common.entityUserDefined',
						name$tr$param$: {'p_0': '3'},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'Quote',
							displayMember: 'UserDefined3'
						}
					},
					{
						id: 'userDefined4',
						// field: 'UserDefined4',
						field: 'Id',
						name: 'User Defined 4',
						name$tr$: 'cloud.common.entityUserDefined',
						name$tr$param$: {'p_0': '4'},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'Quote',
							displayMember: 'UserDefined4'
						}
					},
					{
						id: 'userDefined5',
						field: 'Id',
						name: 'User Defined 5',
						name$tr$: 'cloud.common.entityUserDefined',
						name$tr$param$: {'p_0': '5'},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'Quote',
							displayMember: 'UserDefined5'
						}
					}
				]
			};
		}
	});

	/**
	 * @ngdoc controller
	 * @name procurement.pricecomparison.controller:procurementPriceComparisonColumnDialogController
	 * @requires $scope
	 * @description
	 * #
	 * Controller of column dialog.
	 */
	/* jshint -W072 */
	angular.module(moduleName).controller('procurementPriceComparisonItemColumnDialogController', [
		'$scope', '$timeout', '$translate', 'platformGridControllerService', 'procurementPriceComparisonItemColumnDialogDef',
		'procurementPriceComparisonItemColumnDialogService', 'platformGridAPI','procurementPriceComparisonColumnDialogFactory',
		function ($scope, $timeout, $translate, platformGridControllerService, columnDef, itemDataService, platformGridAPI, dataFactory) {
			
			var customSetting = angular.extend({}, $scope.modalOptions.customSetting);
			var dataService = itemDataService;
			if (customSetting) {
				dataService = dataFactory.getServiceContainer(customSetting, {compareType: $scope.modalOptions.compareType});
			}
			var gridConfig = {
				initCalled: false,
				columns: [],
				grouping: false
			};

			$scope.gridId = 'AC83B258980146F7B1F80E9E39FDDBC4';
			$scope.onContentResized = function () {
			};
			$scope.setTools = function (tools) {
				$scope.tools = tools || {};

				// avoid error in console of explorer.
				$scope.tools.update = function () {
				};
			};

			$scope.onOK = function () {
				var selectedItem = dataService.getSelected();
				var selectedData = {
					'selectedItem' : selectedItem
				};
				$scope.$close({isOK: true,hasSelection: dataService.hasSelection(),selectedItem: selectedItem, data: selectedData});
			};

			$scope.modalOptions.onCancel = function () {
				// when the popup grid is being closed, keep the grid in API
				$scope.$close({isOK: false});
			};

			$scope.modalOptions.headerText =  $translate.instant('procurement.pricecomparison.compareQuotationColumns');

			// TODO: grid only show the first time (this feature should be fixed in platformgrid.directive.js)
			// clean the grid first due to the directive only save the grid onStateChange
			// but in the popup modal, no state change.
			if (platformGridAPI.grids.exist($scope.gridId)) {
				platformGridAPI.grids.unregister($scope.gridId);
			}

			platformGridControllerService.initListController($scope, columnDef, dataService, null, gridConfig);
			dataService.gridId = $scope.gridId;

			// when controller initialized, refresh to show grid (height) correctly, then load data.
			$timeout(function () {
				platformGridAPI.grids.resize($scope.gridId);
				dataService.load();
			});
		}
	]);
})(angular);