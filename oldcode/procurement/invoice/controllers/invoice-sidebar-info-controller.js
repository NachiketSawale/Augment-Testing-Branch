/**
 * Created by lja on 2015/11/2.
 */

(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	var moduleName = 'procurement.invoice';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('procurementInvoiceSideBarInfoController',
		['$scope', 'procurementInvoiceHeaderDataService', '$translate',
			'procurementCommonSideBarInfoService', 'procurementCommonSideBarInfoDependentDataService',
			'basicsLookupdataLookupDescriptorService', 'procurementCommonSideBarInfoDependentDataUIService',
			'procurementCommonSideBarInfoDataServiceFactory',
			function ($scope, dataService, $translate,
				procurementCommonSideBarInfoService, procurementCommonSideBarInfoDependentDataService,
				basicsLookupdataLookupDescriptorService, procurementCommonSideBarInfoDependentDataUIService,
				procurementCommonSideBarInfoDataServiceFactory) {

				var amountHeader = {
						NetHeader: $translate.instant('procurement.invoice.sidebar.reConciliationNet'),
						GrossHeader: $translate.instant('procurement.invoice.sidebar.reConciliationGross'),
						VatHeader: $translate.instant('procurement.invoice.sidebar.reConciliationVat')
					},
					headerItemFields = [
						{
							model: 'InvStatus.Description',
							iconUrl: 'getStatusIconUrl()'
						},
						{
							model: 'DateInvoiced',
							description: '"Date Invoiced"',
							description$tr$: 'procurement.invoice.sidebar.dateInvoiced',
							domain: 'date',
							iconClass: 'tlb-icons ico-date'
						},
						{
							model: 'DateReceived',
							description: '"Date Received"',
							description$tr$: 'procurement.invoice.sidebar.dateReceived',
							domain: 'date',
							iconClass: 'tlb-icons ico-date'
						},
						{
							model: 'DatePosted',
							description: '"Posting Date"',
							description$tr$: 'procurement.invoice.sidebar.datePosted',
							domain: 'date',
							iconClass: 'tlb-icons ico-date'
						}
					],
					reConService,
					theModule = 'invoice';

				function init() {

					$scope.reConciliationItem = null;
					$scope.reConciliationHeader = '';

					reConService = createReConciliationService();

					$scope.config = procurementCommonSideBarInfoService.extend($scope, dataService, theModule, headerItemFields)
						.concat(
							procurementCommonSideBarInfoService.businessPartnerHandler($scope),
							getReConciliationConfig(reConService),
							procurementCommonSideBarInfoDependentDataUIService.createConfig($scope, theModule)
						);
				}

				function createReConciliationService() {
					var service = new procurementCommonSideBarInfoDataServiceFactory.Create([]);
					service.selectionChangedRegister(onReConciliationItemChange);
					return service;
				}

				function getReConciliationConfig(dataService) {

					var template = procurementCommonSideBarInfoService.getTotalItemCustomTemplate();

					return [
						{
							panelType: 'text',
							header: 'reConciliationHeader',
							model: 'reConciliationItem',
							showSlider: true,
							dataService: dataService,
							items: [
								{
									itemType: 'custom',
									customTemplate: template,
									description: '"Amount"',
									description$tr$: 'procurement.invoice.sidebar.amount.title',
									model: 'Amount',
									domain: 'money'
								},
								{
									itemType: 'custom',
									customTemplate: template,
									description: '"From Pes"',
									description$tr$: 'procurement.invoice.sidebar.amount.fromPes',
									model: 'FromPes',
									domain: 'money'
								},
								{
									itemType: 'custom',
									customTemplate: template,
									description: '"From Contract"',
									description$tr$: 'procurement.invoice.sidebar.amount.fromContract',
									model: 'FromContract',
									domain: 'money'
								},
								{
									itemType: 'custom',
									customTemplate: template,
									description: '"From Other"',
									description$tr$: 'procurement.invoice.sidebar.amount.fromOther',
									model: 'FromOther',
									domain: 'money'
								},
								{
									itemType: 'custom',
									customTemplate: template,
									description: '"FromBillingSchema"',
									description$tr$: 'procurement.invoice.sidebar.amount.fromBillingSchema',
									model: 'FromBillingSchema',
									domain: 'money'
								},
								{
									itemType: 'custom',
									customTemplate: template,
									description: '"Rejections"',
									description$tr$: 'procurement.invoice.sidebar.amount.fromRejections',
									model: 'Rejections',
									domain: 'money'
								},
								{
									itemType: 'custom',
									customTemplate: template,
									description: '"Balance"',
									description$tr$: 'procurement.invoice.sidebar.amount.fromBalance',
									model: 'Balance',
									domain: 'money'
								}
							]
						}
					];
				}

				function getCurrency(currencyFk) {
					var currency = basicsLookupdataLookupDescriptorService.getLookupItem('Currency', currencyFk);
					return currency && currency.Description ? '(' + currency.Description + ')' : '';
				}

				/**
				 * get amount data from headerItem into a array to create service
				 * @param headerItem
				 * @returns {Array}
				 */
				function getReConciliationFromHeader(headerItem) {

					if (!headerItem || !headerItem.Id) {
						return [];
					}

					var base = ['Gross', 'Net', 'Vat'],

						mapping = [ // model->headerItem[model]  key-> result[key]
							{
								key: 'Amount',
								model: ''
							},
							{
								key: 'FromPes',
								model: 'Pes'
							},
							{
								key: 'FromContract',
								model: 'Contract'
							},
							{
								key: 'FromOther',
								model: 'Other'
							},
							{
								key: 'Rejections',
								model: 'Reject'
							},
							{
								key: 'Balance',
								model: 'Balance'
							},
							{
								key: 'headerTitle'// for header title translate
							}
						],
						result = [];

					for (var i = 0; i < base.length; i++) {
						var AmountBase = 'Amount' + base[i];
						var item = {
							mark: base[i]// for billSchema binding
						};
						for (var j = 0; j < mapping.length; j++) {
							if (mapping[j].model !== void 0) {
								// get the model data in headerItem
								var model = AmountBase + mapping[j].model;
								item[mapping[j].key] = headerItem[model] || '';
							} else {
								// get the header title
								item[mapping[j].key] = getReConciliationTitle(amountHeader[base[i] + 'Header']);
							}
						}
						result.push(item);
					}

					// FromBillingSchema
					addUpBillingSchema(result, headerItem);

					return result;
				}

				// FromBillingSchemaGross FromBillingSchemaVat FromBillingSchemaNet
				function addUpBillingSchema(source, headerItem) {
					for (var i = 0; i < source.length; i++) {
						source[i].FromBillingSchema = headerItem['FromBillingSchema' + source[i].mark];
					}
				}

				function getReConciliationTitle(title) {
					return title + ':' + getCurrency($scope.headerItem.CurrencyFk);
				}

				function onReConciliationItemChange() {
					$scope.reConciliationItem = reConService.getSelected();
					/** @namespace $scope.reConciliationItem.headerTitle */
					$scope.reConciliationHeader = $scope.reConciliationItem && $scope.reConciliationItem.headerTitle ?
						$scope.reConciliationItem.headerTitle : '';
				}

				init();

				var unWatchHeader = $scope.$watch('headerItem', function () {
					reConService.init(getReConciliationFromHeader($scope.headerItem));
					onReConciliationItemChange();
				});

				$scope.$on('$destroy', function () {
					unWatchHeader();
					reConService = null;
				});

			}

		]);
})(angular);