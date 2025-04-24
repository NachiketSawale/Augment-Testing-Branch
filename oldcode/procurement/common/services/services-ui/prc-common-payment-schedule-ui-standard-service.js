(function () {
	'use strict';
	/* global $, _ */
	var modName = 'procurement.common',
		cloudCommonModule = 'cloud.common';

	angular.module( modName ).factory('procurementCommonPaymentScheduleLayout', ['prcAndSalesCommonPaymentScheduleLayout', 'prcOnlyPaymentScheduleLayout', function(commonPaymentScheduleLayout, prcOnlyPaymentScheduleLayout) {
		var basicDataArray = commonPaymentScheduleLayout.groups[0].attributes.concat(prcOnlyPaymentScheduleLayout.groups[0].attributes);
		var code = _.remove(basicDataArray, function (c) { return c === 'code'; });
		basicDataArray.unshift(code[0]);
		var prcCommonLayout = $.extend(true, {}, commonPaymentScheduleLayout, prcOnlyPaymentScheduleLayout);
		prcCommonLayout.groups[0].attributes = basicDataArray;
		return prcCommonLayout;
	}]);

	angular.module( modName ).factory('prcAndSalesCommonPaymentScheduleLayout', ['basicsLookupdataConfigGenerator', function(basicsLookupdataConfigGenerator) {
		return {
			'fid': 'procurement.common.paymentSchedule.detail',
			'version': '1.0.0',
			'addValidationAutomatically': true,
			'showGrouping': true,
			'groups': [
				{
					'gid': 'basicData',
					'attributes': ['datepayment','daterequest',
						'percentofcontract','amountnet','amountgross','remaining','amountnetoc','amountgrossoc','remainingoc',
						'commenttext','isdone','psdschedulefk','psdactivityfk','baspaymenttermfk', 'measuredperformance', 'sorting','dateposted']
				},
				{
					'gid': 'entityHistory',
					'isHistory': true
				}
			],
			'translationInfos': {
				'extraModules': [cloudCommonModule,modName],
				'extraWords': {
					Code: { location: modName, identifier: 'paymentCode', initial: 'Code' },
					Description: { location: modName, identifier: 'paymentDescription', initial: 'Description' },
					DatePayment: { location: modName, identifier: 'paymentDatePayment', initial: 'Payment Date' },
					DateRequest: { location: modName, identifier: 'paymentDateRequest', initial: 'Request Date' },
					PercentOfContract: { location: modName, identifier: 'paymentPercentOfContract', initial: 'Percent' },
					AmountNet: { location: modName, identifier: 'paymentAmountNet', initial: 'Net Amount' },
					AmountGross: { location: modName, identifier: 'paymentAmountGross', initial: 'Gross Amount' },
					Remaining: { location: modName, identifier: 'paymentRemaining', initial: 'Remaining' },
					AmountNetOc: { location: modName, identifier: 'paymentAmountNetOc', initial: 'Net Amount Oc' },
					AmountGrossOc: { location: modName, identifier: 'paymentAmountGrossOc', initial: 'Gross Amount Oc' },
					RemainingOc: { location: modName, identifier: 'paymentRemainingOc', initial: 'RemainingOc' },
					CommentText: { location: modName, identifier: 'paymentCommentText', initial: 'Comment Text' },
					IsDone: { location: modName, identifier: 'paymentIsDone', initial: 'Is Done' },
					PsdScheduleFk: { location: modName, identifier: 'paymentPsdScheduleFk', initial: 'Schedule' },
					PsdActivityFk: { location: modName, identifier: 'paymentPsdActivityFk', initial: 'Activity' },
					BasPaymentTermFk: { location: modName, identifier: 'paymentTerm', initial: 'Payment Term' },
					MeasuredPerformance: { location: modName, identifier: 'paymentmeasuredperformance', initial: 'Measured Performance %' },
					Sorting: { location: cloudCommonModule, identifier: 'entitySorting', initial: 'Sorting' },
					DatePosted: { location: modName, identifier: 'entityDatePosted', initial: 'Posting Date'}
				}
			},
			'overloads': {
				'code': {grid: {sortable: true}},
				'datepayment': {grid: {sortable: false}},
				'daterequest': {grid: {sortable: false}},
				'percentofcontract': {grid: {sortable: false}},
				'amountnet': {grid: {sortable: false}},
				'amountgross': {grid: {sortable: false}},
				'remaining': {readonly: true,grid: {sortable: false}},
				'amountnetoc': {grid: {sortable: false}},
				'amountgrossoc': {grid: {sortable: false}},
				'remainingoc': {readonly: true,grid: {sortable: false}},
				'commenttext': {grid: {sortable: false}},
				'isdone': {grid: {sortable: false}},
				'psdactivityfk': {
					'grid': {
						'editor': 'lookup',
						'editorOptions': {
							'directive': 'scheduling-main-activity-structure-lookup',
							'lookupOptions': {
								'filterKey': 'procurement-payment-schedule-activity-filter',
								'showClearButton': true
							}
						},
						'formatter': 'lookup',
						'sortable': false,
						'formatterOptions': {
							'lookupType': 'SchedulingActivity',
							'displayMember': 'Code'
						},
						'width': 100
					},
					'detail': {
						'type': 'directive',
						'directive': 'basics-lookupdata-lookup-composite',
						'options': {
							'lookupDirective': 'scheduling-main-activity-structure-lookup',
							'descriptionMember': 'Description',
							'lookupOptions': {
								'filterKey': 'procurement-payment-schedule-activity-filter',
								'descriptionMember': 'Description',
								'showClearButton': true
							}
						}
					}
				},
				'baspaymenttermfk':{
					'grid': {
						'editor': 'lookup',
						'editorOptions': {
							'directive': 'basics-lookupdata-payment-term-lookup',
							'lookupOptions': {'displayMember': 'Code', 'showClearButton': true}
						},
						'formatter': 'lookup',
						'formatterOptions': {'lookupType': 'PaymentTerm', 'displayMember': 'Code'},
						'width': 80
					},
					'detail': {
						'type': 'directive',
						'directive': 'basics-lookupdata-lookup-composite',
						'options': {
							'lookupDirective': 'basics-lookupdata-payment-term-lookup',
							'descriptionMember': 'Description',
							'lookupOptions': {'showClearButton': true}
						}
					}
				},
				'psdschedulefk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'packageSchedulingLookupService',
					showClearButton: true,
					isComposite: true,
					desMember: 'DescriptionInfo.Translated',
					dispMember: 'Code',
					filter: function (item) {
						var prj = -1;
						if (item) {
							prj = item.ProjectFk || -1;
						}
						return prj;
					}
				},{'sortable' : false}),
				'measuredperformance': {readonly: true,grid: {sortable: false}}
			},
			'addition': {
				'grid':[{
					'lookupDisplayColumn': true,
					'field': 'BasPaymentTermFk',
					'name$tr$': 'procurement.common.paymentTermDes',
					'width': 180
				}, {
					'lookupDisplayColumn': true,
					'field': 'PsdActivityFk',
					'name$tr$': 'procurement.common.paymentPsdActivityDes',
					'width': 180
				}]
			}
		};
	}]);

	angular.module( modName ).factory('prcOnlyPaymentScheduleLayout', ['basicsLookupdataConfigGenerator', function(basicsLookupdataConfigGenerator) {
		return {
			'groups': [{
				'gid': 'basicData',
				'attributes': ['description', 'code', 'invtypefk', 'prcpsstatusfk']
			}],
			'translationInfos': {
				'extraWords': {
					Code: { location: modName, identifier: 'paymentCode', initial: 'Code' },
					InvTypeFk: {location: modName, identifier: 'invoiceType', initial: 'Invoice Type'},
					PrcPsStatusFk: { location: cloudCommonModule, identifier: 'entityStatus', initial: 'Status' }
				}
			},
			'overloads': {
				'code': {grid: {sortable: true}},
				'invtypefk': {
					'detail': {
						'type': 'directive',
						'directive': 'procurement-invoice-type-lookup',
						'options': {
							'filterKey': 'prc-invoice-invType-filter'
						}
					},
					'grid': {
						'editor': 'lookup',
						'editorOptions': {
							'directive': 'procurement-invoice-type-lookup',
							'lookupOptions': {
								'filterKey': 'prc-invoice-invType-filter'
							}
						},
						'formatter': 'lookup',
						'formatterOptions': {
							'lookupType': 'InvType',
							'displayMember': 'DescriptionInfo.Translated'
						},
						'width': 100
					}
				},
				'prcpsstatusfk': basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.procurementpaymentschedulestatus', null, {
					showIcon: true
				})
			}
		};
	}]);

	angular.module( modName ).factory('procurementCommonPaymentScheduleUIStandardService',
		['platformUIStandardConfigService', 'procurementCommonTranslationService',
			'procurementCommonPaymentScheduleLayout', 'platformSchemaService','basicsLookupdataConfigGenerator', 'platformUIStandardExtentService',

			function (platformUIStandardConfigService, translationService, layout, platformSchemaService,basicsLookupdataConfigGenerator, platformUIStandardExtentService) {

				var BaseService = platformUIStandardConfigService;

				var domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'PrcPaymentScheduleDto',
					moduleSubModule: 'Procurement.Common'
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
				// override getStandardConfigForDetailView
				var basicGetStandardConfigForDetailView = service.getStandardConfigForDetailView;
				service.getStandardConfigForDetailView = function (){
					return angular.copy(basicGetStandardConfigForDetailView());
				};
				return service;
			}
		]);
})();
