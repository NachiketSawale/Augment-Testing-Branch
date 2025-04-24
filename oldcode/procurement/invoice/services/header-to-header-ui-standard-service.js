/**
 * Created by wuj on 6/5/2015.
 */
(function () {
	'use strict';
	var modName = 'procurement.invoice';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	angular.module(modName).factory('procurementInvoiceHeader2HeaderLayout', ['procurementInvoiceHeaderDataService', '$http',
		function (procurementInvoiceHeaderDataService, $http) {
			return {
				'fid': 'procurement.invoice.header2header.detail',
				'version': '1.0.0',
				'addValidationAutomatically': true,
				'showGrouping': true,
				'groups': [
					{
						'gid': 'basicData',
						'attributes': ['invheaderchainedfk']
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],
				'translationInfos': {
					'extraModules': [modName],
					'extraWords': {
						InvHeaderChainedFk: {location: modName, identifier: 'header.code', initial: 'Entry No'}
					}
				},
				'overloads': {
					'invheaderchainedfk': {
						'navigator': {
							moduleName: '', // navigate to the same module
							'navFunc': function (item, triggerField) {
								var d = {
									ExecutionHints:false,
									IncludeNonActiveItems:null,
									PageNumber:0,
									PageSize:100,
									PKeys:[triggerField.InvHeaderChainedFk],
									PinningContext:[],
									ProjectContextId:null,
									UseCurrentClient:null
								};
								$http.post(globals.webApiBaseUrl + 'procurement/invoice/header/listinv',d).then(function(res){
									if (procurementInvoiceHeaderDataService.onReadSucceeded) {
										procurementInvoiceHeaderDataService.onReadSucceeded(res.data);
										procurementInvoiceHeaderDataService.goToFirst();
									}
								});
							}
						},
						'detail': {
							'type': 'directive',
							'directive': 'procurement-invoice-header-dialog',
							'options': {
								'filterKey': 'prc-invoice-header-filter'
							}
						},
						'grid': {
							editor: 'lookup',
							editorOptions: {
								directive: 'procurement-invoice-header-dialog',
								'lookupOptions': {
									'filterKey': 'prc-invoice-header-filter'
								}
							},
							width: 125,
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'InvHeaderChained',
								displayMember: 'Code'
							}
						},
						'mandatory': true
					}
				},
				'addition': {
					grid: [{
						lookupDisplayColumn: true,
						field: 'InvHeaderChainedFk',
						displayMember: 'Description',
						name: 'Narrative',
						name$tr$: 'procurement.invoice.header.description'
					}, {
						lookupDisplayColumn: true,
						field: 'InvHeaderChainedFk',
						displayMember: 'StatusDescriptionInfo.Translated',
						name: 'Status',
						imageSelector: 'platformStatusIconService',
						name$tr$: 'cloud.common.entityStatus',
						width: 100
					}, {
						lookupDisplayColumn: true,
						field: 'InvHeaderChainedFk',
						lookupDomain: 'dateutc',
						displayMember: 'DateInvoiced',
						name: 'Date',
						name$tr$: 'procurement.invoice.header.dateInvoiced',
						width: 100
					}, {
						lookupDisplayColumn: true,
						field: 'InvHeaderChainedFk',
						displayMember: 'Reference',
						name: 'Reference',
						name$tr$: 'procurement.invoice.header.reference',
						width: 100
					}, {
						lookupDisplayColumn: true,
						field: 'InvHeaderChainedFk',
						lookupDomain: 'dateutc',
						displayMember: 'DateReceived',
						name: 'Received',
						name$tr$: 'procurement.invoice.header.dateReceived',
						width: 100
					}, {
						lookupDisplayColumn: true,
						field: 'InvHeaderChainedFk',
						displayMember: 'TypeDescriptionInfo.Translated',
						name: 'Type',
						name$tr$: 'cloud.common.entityType',
						width: 80
					}, {
						lookupDisplayColumn: true,
						field: 'InvHeaderChainedFk',
						displayMember: 'NetTotal',
						name: 'Net Total',
						name$tr$: 'procurement.invoice.header.netTotal',
						lookupDomain: 'money',
						width: 80
					}, {
						lookupDisplayColumn: true,
						field: 'InvHeaderChainedFk',
						displayMember: 'Period',
						name: 'Period',
						name$tr$: 'procurement.invoice.header.period',
						lookupDomain: 'money',
						width: 80
					},
					{
						lookupDisplayColumn: true,
						field: 'InvHeaderChainedFk',
						displayMember: 'NetTotalOc',
						name: 'NetTotalOc',
						name$tr$: 'procurement.invoice.header.netTotalOc',
						lookupDomain: 'money',
						width: 80
					},
					{
						lookupDisplayColumn: true,
						field: 'InvHeaderChainedFk',
						displayMember: 'PeriodOc',
						name: 'PeriodOc',
						name$tr$: 'procurement.invoice.header.periodOc',
						lookupDomain: 'money',
						width: 80
					},{
						lookupDisplayColumn: true,
						field: 'InvHeaderChainedFk',
						displayMember: 'AmountNetPes',
						name: 'AmountNetPes',
						name$tr$: 'procurement.invoice.header.amountNetPES',
						lookupDomain: 'money',
						width: 80
					},{
						lookupDisplayColumn: true,
						field: 'InvHeaderChainedFk',
						displayMember: 'AmountNetPesOc',
						name: 'AmountNetPesOc',
						name$tr$: 'procurement.invoice.header.amountNetPESOc',
						lookupDomain: 'money',
						width: 80
					},{
						lookupDisplayColumn: true,
						field: 'InvHeaderChainedFk',
						displayMember: 'AmountVatPes',
						name: 'AmountVatPes',
						name$tr$: 'procurement.invoice.header.amountVatPES',
						lookupDomain: 'money',
						width: 80
					},{
						lookupDisplayColumn: true,
						field: 'InvHeaderChainedFk',
						displayMember: 'AmountVatPesOc',
						name: 'AmountVatPesOc',
						name$tr$: 'procurement.invoice.header.amountVatPESOc',
						lookupDomain: 'money',
						width: 80
					},{
						lookupDisplayColumn: true,
						field: 'InvHeaderChainedFk',
						displayMember: 'AmountNetContract',
						name: 'AmountNetContract',
						name$tr$: 'procurement.invoice.header.amountNetContract',
						lookupDomain: 'money',
						width: 80
					},{
						lookupDisplayColumn: true,
						field: 'InvHeaderChainedFk',
						displayMember: 'AmountNetContractOc',
						name: 'AmountNetContractOc',
						name$tr$: 'procurement.invoice.header.amountNetContractOc',
						lookupDomain: 'money',
						width: 80
					},{
						lookupDisplayColumn: true,
						field: 'InvHeaderChainedFk',
						displayMember: 'AmountVatContract',
						name: 'AmountVatContract',
						name$tr$: 'procurement.invoice.header.amountVatContract',
						lookupDomain: 'money',
						width: 80
					},{
						lookupDisplayColumn: true,
						field: 'InvHeaderChainedFk',
						displayMember: 'AmountVatContractOc',
						name: 'AmountVatContractOc',
						name$tr$: 'procurement.invoice.header.amountVatContractOc',
						lookupDomain: 'money',
						width: 80
					},{
						lookupDisplayColumn: true,
						field: 'InvHeaderChainedFk',
						displayMember: 'AmountNetOther',
						name: 'AmountNetOther',
						name$tr$: 'procurement.invoice.header.amountNetOther',
						lookupDomain: 'money',
						width: 80
					},{
						lookupDisplayColumn: true,
						field: 'InvHeaderChainedFk',
						displayMember: 'AmountNetOtherOc',
						name: 'AmountNetOtherOc',
						name$tr$: 'procurement.invoice.header.amountNetOtherOc',
						lookupDomain: 'money',
						width: 80
					},{
						lookupDisplayColumn: true,
						field: 'InvHeaderChainedFk',
						displayMember: 'AmountVatOther',
						name: 'AmountVatOther',
						name$tr$: 'procurement.invoice.header.amountVatOther',
						lookupDomain: 'money',
						width: 80
					},{
						lookupDisplayColumn: true,
						field: 'InvHeaderChainedFk',
						displayMember: 'AmountVatOtherOc',
						name: 'AmountVatOtherOc',
						name$tr$: 'procurement.invoice.header.amountVatOtherOc',
						lookupDomain: 'money',
						width: 80
					},{
						lookupDisplayColumn: true,
						field: 'InvHeaderChainedFk',
						displayMember: 'AmountNetReject',
						name: 'AmountNetReject',
						name$tr$: 'procurement.invoice.header.amountNetReject',
						lookupDomain: 'money',
						width: 80
					},{
						lookupDisplayColumn: true,
						field: 'InvHeaderChainedFk',
						displayMember: 'AmountNetRejectOc',
						name: 'AmountNetRejectOc',
						name$tr$: 'procurement.invoice.header.amountNetRejectOc',
						lookupDomain: 'money',
						width: 80
					},{
						lookupDisplayColumn: true,
						field: 'InvHeaderChainedFk',
						displayMember: 'AmountVatReject',
						name: 'AmountVatReject',
						name$tr$: 'procurement.invoice.header.amountVatReject',
						lookupDomain: 'money',
						width: 80
					},{
						lookupDisplayColumn: true,
						field: 'InvHeaderChainedFk',
						displayMember: 'AmountVatRejectOc',
						name: 'AmountVatRejectOc',
						name$tr$: 'procurement.invoice.header.amountVatRejectOc',
						lookupDomain: 'money',
						width: 80
					}, {
						afterId: 'InvHeaderChainedProgressId',
						id: 'InvHeaderChainedProgressId',
						field: 'InvHeaderChainedProgressId',
						name: 'description',
						name$tr$: 'procurement.invoice.header.progressid',
						width: 80
					}
					]
				}
			};
		}]);

	angular.module(modName).factory('procurementInvoiceHeader2HeaderUIStandardService',
		['platformUIStandardConfigService', 'procurementInvoiceTranslationService',
			'procurementInvoiceHeader2HeaderLayout', 'platformSchemaService', 'platformUIStandardExtentService',

			function (platformUIStandardConfigService, translationService, layout, platformSchemaService, platformUIStandardExtentService) {

				var BaseService = platformUIStandardConfigService;

				var domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'InvHeader2InvHeaderDto',
					moduleSubModule: 'Procurement.Invoice'
				});
				if (domainSchema) {
					domainSchema = domainSchema.properties;
				}
				function UIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				UIStandardService.prototype = Object.create(BaseService.prototype);
				UIStandardService.prototype.constructor = UIStandardService;

				var service = new BaseService(layout, domainSchema, translationService);

				platformUIStandardExtentService.extend(service, layout.addition, domainSchema);

				return service;
			}
		]);
})();
