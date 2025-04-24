/**
 * Created by lst on 12/19/2016.
 */
// eslint-disable-next-line no-redeclare
/* global angular,globals */
(function (angular) {
	'use strict';
	var moduleName = 'procurement.quote';

	angular.module(moduleName).value('procurementQuoteCreateChangeContractColumnDef', {
		getStandardConfigForListView: function () {
			return {
				columns: [
					{
						id: 'statusFk',
						field: 'Id',
						name: 'Status',
						sortable: true,
						name$tr$: 'cloud.common.entityState',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'Quote',
							displayMember: 'StatusDescriptionInfo.Description',
							imageSelector: 'platformStatusIconService'
						},
						width: 90
					},
					{
						id: 'qtnCode',
						field: 'Id',
						name: 'Reference Code',
						name$tr$: 'cloud.common.entityReferenceCode',
						sortable: true,
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'Quote',
							displayMember: 'Code'
						},
						width: 85,
						searchable: true
					},
					{
						id: 'qtnDescription',
						field: 'Id',
						name: 'Description',
						name$tr$: 'cloud.common.entityDescription',
						sortable: true,
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'Quote',
							displayMember: 'Description'
						},
						searchable: true
					},
					{
						id: 'businessPartnerFk',
						field: 'Id',
						name: 'Business Partner',
						name$tr$: 'cloud.common.entityBusinessPartner',
						width: 150,
						sortable: true,
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'Quote',
							displayMember: 'BusinessPartnerName1'
						},
						searchable: true
					},
					{
						id: 'netTotal',
						field: 'NetTotal',
						name: 'Net Total',
						name$tr$: 'procurement.quote.wizard.create.contract.dialog.netTotal',
						sortable: true,
						formatter: 'money',
						searchable: true,
						width: 100
					},
					{
						id: 'currency',
						field: 'Id',
						name: 'Currency',
						name$tr$: 'procurement.quote.wizard.create.contract.dialog.currency',
						width: 80,
						sortable: true,
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'Quote',
							displayMember: 'Currency'
						},
						searchable: true
					},
					{
						id: 'qtnVersion',
						field: 'Id',
						name: 'Version',
						name$tr$: 'cloud.common.entityVersion',
						sortable: true,
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'Quote',
							displayMember: 'QuoteVersion'
						},
						searchable: true,
						editor: 'lookup',
						editorOptions: {
							lookupType: 'procurementqtnversionlooktype',
							lookupDirective: 'procurement-quote-version-lookup',
							lookupOptions: {
								filterKey: 'procurement-quote-version-select-lookup-filter',
								showClearButton: false
							}
						},
						width: 70
					},
					{
						id: 'dateReceived',
						field: 'DateReceived',
						name: 'DateReceived',
						name$tr$: 'procurement.quote.wizard.create.contract.dialog.dateReceived',
						width: 90,
						sortable: true,
						formatter: 'date',
						searchable: true
					},
					{
						id: 'rfqHeaderFk',
						field: 'RfqHeaderFk',
						name: 'RfqHeader',
						name$tr$: 'procurement.quote.headerRfqHeaderCode',
						width: 90,
						sortable: true,
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'RfqHeader',
							displayMember: 'Code'
						},
						searchable: true
					}
				]
			};
		}
	});

	angular.module(moduleName).controller('procurementQuoteCreateChangeContractWizardsController',
		['_', '$scope', '$translate', '$state', 'platformGridAPI', 'cloudDesktopSidebarService', 'procurementQuoteCreateContractDataService',
			'$timeout', 'platformTranslateService', 'platformModalService', 'platformGridControllerService',
			'procurementQuoteCreateChangeContractColumnDef', 'procurementQuoteCreateContractWizardService',
			'basicsLookupdataLookupFilterService',
			function (_, $scope, $translate, $state, platformGridAPI, cloudDesktopSidebarService, procurementQuoteCreateContractDataService,
				$timeout, platformTranslateService, platformModalService, platformGridControllerService,
				procurementQuoteCreateChangeContractColumnDef, procurementQuoteCreateContractWizardService,
				basicsLookupdataLookupFilterService) {

				$scope.modalOptions = angular.extend($scope.modalOptions, {
					headerText: $translate.instant('procurement.quote.wizard.create.contract.dialog.title'),
					note: 'Note:',
					note1: '1. Base quotation and all addenda (change orders) will be combined as on contract.',
					note2: '2. Latest version are loaded by default. Versions are changeable. ',
					CancelButtonText: $translate.instant('cloud.common.cancel'),
					OKButtonText: $translate.instant('cloud.common.ok'),
					netTotal: 'Net Total:'
				});
				var contractIdArr = [];
				$scope.currency = '';
				$scope.created = false;
				$scope.createdText = null;
				$scope.netTotal = function () {
					var list = procurementQuoteCreateContractDataService.getList();
					var val = 0;
					if (list && list.length > 0) {
						$scope.currency = list[0].Currency.Currency;
						_.each(list, function (item) {
							val += item.NetTotal;
						});
					}
					return val;
				};

				$scope.gridId = '0172401900B04D6BA42C35062DF6375D';

				$scope.onOK = function () {
					var list = procurementQuoteCreateContractDataService.getList();
					var qtnHeaderIds = [];
					_.each(list, function (item) {
						qtnHeaderIds.push(item.Id);
					});

					var options = {
						QtnHeaderIds: qtnHeaderIds,
						HasChangeOrder: true
					};
					$scope.modalOptions.dialogLoading = true;
					procurementQuoteCreateContractWizardService.createContract(options).then(function (response) {
						var newContract = response.data;
						if (newContract) {
							// $scope.createdText = $translate.instant('procurement.common.createContractSuccessfully',{codes: newContract.Code});
							let createdText = $translate.instant('procurement.quote.wizard.create.contract.success');
							$scope.createdText = createdText;
							$scope.codeText =$translate.instant('procurement.quote.wizard.create.contract.newCode',{newCode: newContract.Code});
							contractIdArr.push(newContract.Id);
						} else {
							$scope.$close();
						}
						$scope.created = true;
						$scope.modalOptions.dialogLoading = false;
					},function () {
						$scope.modalOptions.dialogLoading = false;
					});
				};

				$scope.goToContract = function () {
					$state.go(globals.defaultState + '.' + 'procurement.contract'.replace('.', '')).then(function () {
						cloudDesktopSidebarService.filterSearchFromPKeys(contractIdArr);
					});
					$scope.$close();
				};

				if (platformGridAPI.grids.exist($scope.gridId)) {
					platformGridAPI.grids.unregister($scope.gridId);
				}

				var gridConfig = {
					columns: [],
					data: [],
					id: $scope.gridId,
					lazyInit: true,
					options: {
						indicator: false,
						editable: true,
						idProperty: 'Id',
						iconClass: ''
					},
					cellChangeCallBack: onCellChangeCallBack
				};

				$scope.onContentResized = function () {
				};
				$scope.setTools = function () {
				};

				// args = Object {row: rowIndex, cell: cellIndex, item: EditItem, grid: SlickGrid}
				function onCellChangeCallBack(args) {
					var dataList = procurementQuoteCreateContractDataService.getList();
					if (args.item && args.item.Id > 0) {
						procurementQuoteCreateContractWizardService.getItemByKey(args.item.Id).then(function (newItem) {
							for (var i = dataList.length; i > 0; i--) {
								if (dataList[i - 1].Id === args.item.Id) {
									dataList[i - 1] = angular.copy(newItem);
									break;
								}
							}
							platformGridAPI.items.data($scope.gridId, dataList);
							platformGridAPI.grids.invalidate($scope.gridId);
						});
					} else {
						for (var i = dataList.length; i > 0; i--) {
							if (!dataList[i - 1].Id) {
								dataList[i - 1] = {Id: null};
								break;
							}
						}
						platformGridAPI.items.data($scope.gridId, dataList);
						platformGridAPI.grids.invalidate($scope.gridId);
					}
				}

				platformGridControllerService.initListController($scope, procurementQuoteCreateChangeContractColumnDef,
					procurementQuoteCreateContractDataService, null, gridConfig);
				$timeout(function () {
					platformGridAPI.grids.resize($scope.gridId);
					procurementQuoteCreateContractDataService.load();
				});

				var filter = {
					key: 'procurement-quote-version-select-lookup-filter',
					serverSide: false,
					fn: function (item) {
						var selectedRfqHeaderFk = procurementQuoteCreateContractDataService.getSelected().RfqHeaderFk;
						return item.RfqHeaderFk === selectedRfqHeaderFk;
					}
				};
				basicsLookupdataLookupFilterService.registerFilter(filter);
				$scope.$on('$destroy', function () {
					procurementQuoteCreateContractWizardService.clearData();
					if (basicsLookupdataLookupFilterService.hasFilter(filter.key)) {
						basicsLookupdataLookupFilterService.unregisterFilter(filter);
					}
				});
			}
		]);

})(angular);

