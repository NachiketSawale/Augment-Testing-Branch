/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	/* global globals, _ */
	'use strict';

	let module = 'qto.main';

	/**
	 * @ngdoc service
	 * @name qtoMainLineItemHelperService
	 * @description provides helper functions for LineItems functionality
	 */
	angular.module(module).service('qtoMainLineItemHelperService', ['$injector', '$translate', 'platformModuleNavigationService', 'basicsLookupdataConfigGenerator', 'basicsLookupdataConfigGeneratorExtension',
		function ($injector, $translate, naviService, basicsLookupdataConfigGenerator, basicsLookupdataConfigGeneratorExtension) {
			let service = {};

			let detailsOverload = {
					'readonly': true,
					'grid': {
						formatter: function (row, cell, value) {
							return angular.uppercase(value);
						}
					}
				},
				getEstQtyRel = {
					'readonly': true,
					'grid': {
						formatter: 'imageselect',
						formatterOptions: {
							serviceName: 'basicsEstimateQuantityRelationIconService'
						}
					}
				};

			service.getEstLineItemLayout = function (options) {

				let attributes = ['info', 'projectno', 'projectname', 'estimationcode', 'estimationdescription', 'code', 'estassemblyfk', 'descriptioninfo',
					'estlineitemfk', 'quantitytargetdetail', 'quantitytarget', 'wqquantitytarget',
					'basuomtargetfk', 'quantitydetail', 'quantity', 'basuomfk', 'externalcode', 'quantityfactordetail1', 'quantityfactor1', 'quantityfactordetail2', 'quantityfactor2', 'quantityfactor3', 'quantityfactor4',
					'productivityfactordetail', 'productivityfactor', 'quantityunittarget', 'quantitytotal', 'costunit', 'costfactordetail1', 'costfactor1', 'costfactordetail2', 'costfactor2', 'costunittarget',
					'costtotal', 'hoursunit', 'hoursunittarget', 'hourstotal', 'estcostriskfk', 'mdccontrollingunitfk', 'boqrootref', 'boqitemfk', 'psdactivityschedule', 'psdactivityfk', 'mdcworkcategoryfk',
					'mdcassetmasterfk', 'prjlocationfk', 'prcstructurefk', 'estqtyrelboqfk', 'estqtyrelactfk', 'estqtyrelgtufk', 'estqtytelaotfk', 'prjchangefk', 'islumpsum', 'isdisabled', 'isgc', 'commenttext',
					'entcostunit', 'entcostunittarget', 'entcosttotal', 'enthoursunit', 'enthoursunittarget', 'enthourstotal',
					'drucostunit', 'drucostunittarget', 'drucosttotal', 'druhoursunit', 'druhoursunittarget', 'druhourstotal',
					'dircostunit', 'dircostunittarget', 'dircosttotal', 'dirhoursunit', 'dirhoursunittarget', 'dirhourstotal',
					'indcostunit', 'indcostunittarget', 'indcosttotal', 'indhoursunit', 'indhoursunittarget', 'indhourstotal',
					'fromdate', 'todate',
					'sortcode01fk', 'sortcode02fk', 'sortcode03fk', 'sortcode04fk', 'sortcode05fk', 'sortcode06fk', 'sortcode07fk', 'sortcode08fk', 'sortcode09fk', 'sortcode10fk'];

				let moduleName = '';
				let headerService = null;
				let boqLookupDataService = null;
				let boqRootLookupDataService = null;
				let getProjectChangeLookupOptions = null;
				if (options) {
					attributes = _.union(attributes, options.extendColumns);
					moduleName = options.moduleName;
					boqLookupDataService = options.boqLookupDataService;
					boqRootLookupDataService = options.boqRootLookupDataService;
					getProjectChangeLookupOptions = options.getProjectChangeLookupOptions;
					headerService = options.headerService;
				}

				return {
					'fid': 'estimate.main.lineItem.detailform',
					'version': '1.0.0',
					'showGrouping': true,
					'addValidationAutomatically': true,
					'groups': [
						{
							'gid': 'basicData',
							'attributes': attributes
						},
						{
							'gid': 'userDefText',
							'isUserDefText': true,
							'attributes': ['userdefined1', 'userdefined2', 'userdefined3', 'userdefined4', 'userdefined5']

						},
						{
							'gid': 'entityHistory',
							'isHistory': true
						}
					],
					'overloads': {
						'info': {
							'readonly': true,
							'grid': {
								field: 'image',
								formatter: 'image',
								formatterOptions: {
									imageSelector: 'estimateMainLineItemImageProcessor'
								}
							}
						},
						'quantitydetail': detailsOverload,
						'quantitytargetdetail': detailsOverload,
						'quantityfactordetail1': detailsOverload,
						'quantityfactordetail2': detailsOverload,
						'productivityfactordetail': detailsOverload,
						'costfactordetail1': detailsOverload,
						'costfactordetail2': detailsOverload,
						'projectno': {
							readonly: true
						},
						'projectname': {
							readonly: true
						},
						'estimationcode': {
							readonly: true
						},
						'estimationdescription': {
							readonly: true
						},
						'code': {
							'mandatory': true,
							'searchable': true,
							'navigator': {
								moduleName: $translate.instant(moduleName + '.estimateLineItemGridContainerTitle'),
								navFunc: function (item, triggerField) {

									let navigator = naviService.getNavigator('estimate.main-line-item');

									angular.extend(triggerField, {
										ProjectContextId: headerService.getSelected().ProjectFk
									});

									naviService.navigate(navigator, item, triggerField);
								}
							},
							'readonly': true
						},
						'estlineitemfk': {
							'readonly': true,
							'grid': {
								editor: 'lookup',
								editorOptions: {
									directive: 'estimate-main-est-line-item-lookup-dialog',
									lookupOptions: {
										'displayMember': 'Code'
									}
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'estlineitemlookup',
									displayMember: 'Code'
								}
							}
						},
						'estassemblyfk': {
							'readonly': true,
							grid: {
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'estassemblyfk',
									displayMember: 'Code',
									dataServiceName: 'estimateMainAssemblyTemplateService'
								}
							}
						},
						'basuomtargetfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							'readonly': true,
							dataServiceName: 'basicsUnitLookupDataService',
							cacheEnable: true
						}, {required: false}),
						'basuomfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							'readonly': true,
							dataServiceName: 'basicsUnitLookupDataService',
							cacheEnable: true
						}),
						'estcostriskfk': basicsLookupdataConfigGeneratorExtension.provideGenericLookupConfig('estimate.lookup.costrisk', 'Description', {showClearButton: true}),
						'externalcode': detailsOverload,
						'mdccontrollingunitfk': {
							navigator: {
								moduleName: 'controlling.structure'
							},
							'readonly': true,
							'grid': {
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'Controllingunit',
									displayMember: 'Code'
								}
							}
						},
						'boqitemfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: boqLookupDataService,
							isComposite: true,
							desMember: 'BriefInfo.Translated',
							dispMember: 'Reference',
							cacheEnable: true,
							'readonly': true,
							filter: function (item) {
								return item.BoqHeaderFk;
							}
						}),
						'boqrootref': {
							'readonly': true,
							'grid': {
								field: 'BoqHeaderFk',
								formatter: 'lookup',
								formatterOptions: {
									displayMember: 'Reference',
									dataServiceName: boqRootLookupDataService,
									dataServiceMethod: 'getItemByIdAsync'
								}
							}
						},
						'psdactivityschedule': {
							'readonly': true,
							'grid': {
								field: 'PsdActivityFk',
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'estlineitemactivity',
									displayMember: 'Code',
									dataServiceName: 'estimateMainActivityScheduleLookupService'
								}
							}
						},
						'psdactivityfk': {
							'readonly': true,
							'grid': {
								'formatter': 'lookup',
								'formatterOptions': {
									'lookupType': 'SchedulingActivity',
									'displayMember': 'Code'
								}
							}
						},
						'prjlocationfk': {
							navigator: {
								moduleName: 'project.main-location'
							},
							'readonly': true,
							'grid': {
								'formatter': 'lookup',
								'formatterOptions': {
									'lookupType': 'ProjectLocation',
									'displayMember': 'Code'
								}
							}
						},
						'mdcworkcategoryfk': {
							'readonly': true,
							'grid': {
								'formatter': 'lookup',
								'formatterOptions': {
									'lookupType': 'WorkCategory',
									'displayMember': 'Code'
								}
							}
						},
						'mdcassetmasterfk': {
							'readonly': true,
							'grid': {
								'formatter': 'lookup',
								'formatterOptions': {
									'lookupType': 'AssertMaster',
									'displayMember': 'Code'
								}
							}
						},
						'prcstructurefk': {
							navigator: {
								moduleName: 'basics.procurementstructure'
							},
							'readonly': true,
							'grid': {
								'formatter': 'lookup',
								'formatterOptions': {
									'lookupType': 'prcstructure',
									'displayMember': 'Code'
								}
							}
						},
						'prjchangefk': {
							'grid': {
								editor: 'lookup',
								editorOptions: {
									directive: 'project-change-dialog',
									lookupOptions: getProjectChangeLookupOptions
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'projectchange',
									displayMember: 'Code'
								},
								width: 130
							}
						},
						'estqtyrelboqfk': angular.copy(getEstQtyRel),
						'estqtyrelactfk': angular.copy(getEstQtyRel),
						'estqtyrelgtufk': angular.copy(getEstQtyRel),
						'estqtytelaotfk': angular.copy(getEstQtyRel),
						'fromdate': {
							'readonly': true,
							formatter: 'dateutc'
						},
						'todate': {
							'readonly': true,
							formatter: 'dateutc'
						},
						'sortcode01fk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'projectSortCode01LookupDataService',
							showClearButton: true,
							filter: function () {
								return headerService.getSelected().ProjectFk;
							}
						}),
						'sortcode02fk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'projectSortCode02LookupDataService',
							showClearButton: true,
							filter: function () {
								return headerService.getSelected().ProjectFk;
							}
						}),
						'sortcode03fk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'projectSortCode03LookupDataService',
							showClearButton: true,
							filter: function () {
								return headerService.getSelected().ProjectFk;
							}
						}),
						'sortcode04fk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'projectSortCode04LookupDataService',
							showClearButton: true,
							filter: function () {
								return headerService.getSelected().ProjectFk;
							}
						}),
						'sortcode05fk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'projectSortCode05LookupDataService',
							showClearButton: true,
							filter: function () {
								return headerService.getSelected().ProjectFk;
							}
						}),
						'sortcode06fk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'projectSortCode06LookupDataService',
							showClearButton: true,
							filter: function () {
								return headerService.getSelected().ProjectFk;
							}
						}),
						'sortcode07fk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'projectSortCode07LookupDataService',
							showClearButton: true,
							filter: function () {
								return headerService.getSelected().ProjectFk;
							}
						}),
						'sortcode08fk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'projectSortCode08LookupDataService',
							showClearButton: true,
							filter: function () {
								return headerService.getSelected().ProjectFk;
							}
						}),
						'sortcode09fk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'projectSortCode09LookupDataService',
							showClearButton: true,
							filter: function () {
								return headerService.getSelected().ProjectFk;
							}
						}),
						'sortcode10fk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'projectSortCode10LookupDataService',
							showClearButton: true,
							filter: function () {
								return headerService.getSelected().ProjectFk;
							}
						})
					},
					'addition': {
						'grid': [
							{
								'lookupDisplayColumn': true,
								'field': 'PrjChangeFk',
								'displayMember': 'Description',
								'name$tr$': 'procurement.common.reqheaderChangeRequestDescription',
								'width': 155
							}
						]
					}
				};
			};

			service.calcTotalQuantity = function (lineItem, isIq){
				if (isIq){
					lineItem.IqTotalQuantity = lineItem.IqQuantity + (lineItem.IqPreviousQuantity ? lineItem.IqPreviousQuantity : 0);
				} else {
					lineItem.BqTotalQuantity = lineItem.BqQuantity + (lineItem.BqPreviousQuantity ? lineItem.BqPreviousQuantity : 0);
				}
			};

			service.calcPercentageQuantity = function (lineItem, isIq){
				if (isIq){
					lineItem.IqPercentageQuantity = lineItem.QuantityTotal === 0 ? 0 : lineItem.IqQuantity / lineItem.QuantityTotal * 100;
				} else {
					lineItem.BqPercentageQuantity = lineItem.QuantityTotal === 0 ? 0 : lineItem.BqQuantity / lineItem.QuantityTotal * 100;
				}
			};

			service.calcCumulativePercentage = function (lineItem, isIq){
				if (isIq){
					lineItem.IqCumulativePercentage =  lineItem.QuantityTotal === 0 ? 0 : lineItem.IqTotalQuantity / lineItem.QuantityTotal * 100;
				} else {
					lineItem.BqCumulativePercentage = lineItem.QuantityTotal === 0 ? 0 : lineItem.BqTotalQuantity / lineItem.QuantityTotal * 100;
				}
			};

			service.calcBoqQuantiyWithLineItemQty = function (boqItem, lineItems, qtyColumn){
				let qty = 0;

				if (!_.isArray(lineItems) && lineItems.length === 0) {
					return qty;
				}

				let ordQuantity = boqItem.OrdQuantity;

				let costTotalSum = _.reduce(lineItems, function (sum, lineItem) {
					return sum + lineItem.CostTotal;
				}, 0);

				if (lineItems.length === 1) {
					qty = lineItems[0].QuantityTotal !== 0 ? ordQuantity * lineItems[0][qtyColumn] / lineItems[0].QuantityTotal : 0;
				} else {
					qty = _.reduce(lineItems, function (sum, lineItem) {

						let tempQty = 0;

						if (lineItem.QuantityTotal !== 0 && costTotalSum !== 0) {
							tempQty = ordQuantity * lineItem.CostTotal * lineItem[qtyColumn] / lineItem.QuantityTotal / costTotalSum;
						}

						return sum + tempQty;
					}, 0);
				}

				return qty;
			};

			return service;
		}
	]);
})();
