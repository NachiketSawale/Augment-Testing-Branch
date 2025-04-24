/**
 * Created by wui on 2/24/2016.
 */

(function(angular){
	'use strict';
	/* global _ */
	var moduleName = 'constructionsystem.main';

	angular.module(moduleName).factory('constructionSystemMainLineItemLayoutService',[
		'$injector', 'basicsLookupdataConfigGenerator', 'basicsLookupdataConfigGeneratorExtension', 'constructionSystemMasterTestDataService',
		function($injector, basicsLookupdataConfigGenerator, basicsLookupdataConfigGeneratorExtension, constructionSystemMasterTestDataService){

			// eslint-disable-next-line no-unused-vars
			var getProjectId = function getProjectId() {
				// use TestInput Container's ProjectFk to filter Project loaction/ Cost Group 1-5;
				var data = constructionSystemMasterTestDataService.getCurrentEntity();
				var projectId = data && data.ProjectFk ? data.ProjectFk : null;
				return projectId ? projectId.toString() : '-1';
			};

			var detailsOverload = {
					'grid': {
						formatter: function(row,cell,value){
							if(angular.isUndefined(value) || value === null){
								return '';
							}
							return _.toUpper(value);
						}// 'description' TODO:Replae function with description
					}
				},
				addColumns = [{
					id: 'Description',
					field: 'DescriptionInfo',
					name: 'Description',
					grouping:true,
					width: 300,
					formatter: 'translation',
					name$tr$: 'cloud.common.entityDescription'
				}];
			return {
				getEstimateMainLineItemDetailLayout: function (custom) {
					if(custom && typeof custom === 'function'){
						getProjectId = custom;
					}

					function getSortCodeConfig(serviceName, haschange) {
						var config = {
							detail: {
								'type': 'inputselect',
								required: false,
								'options': {
									valueMember: 'Id',
									displayMember: 'Code',
									modelIsObject: false,
									inputDomain: 'code',
									serviceName: serviceName,
									serviceMethod: 'getList'
								},
								formatter: 'lookup',
								formatterOptions: {
									dataServiceName: serviceName,
									displayMember: 'Code'
								}
							},
							grid: {
								editor: 'inputselect',
								formatter: 'lookup',
								formatterOptions: {
									dataServiceName: serviceName,
									displayMember: 'Code'
								},
								required: false,
								editorOptions: {
									valueMember: 'Id',
									displayMember: 'Code',
									modelIsObject: false,
									inputDomain: 'code',
									serviceName: serviceName,
									serviceMethod: 'getList'
								}
							}
						};
						if(haschange){
							config.change = 'change';
						}
						return config;
					}

					function getSortCodeDesConfig(serviceName) {
						return {
							change: 'change',
							detail: {
								'type': 'inputselect',
								required: false,
								'options': {
									valueMember: 'Id',
									displayMember: 'DescriptionInfo.Translated',
									modelIsObject: false,
									inputDomain: 'description',
									serviceName: serviceName,
									serviceMethod: 'getList'
								},
								formatter: 'lookup',
								formatterOptions: {
									dataServiceName: serviceName,
									displayMember: 'DescriptionInfo.Translated'
								}
							},
							grid: {
								readonly: true,
								editor: 'select',
								formatter: 'lookup',
								formatterOptions: {
									dataServiceName: serviceName,
									displayMember: 'DescriptionInfo.Translated'
								},
								required: false
							}
						};
					}

					return {
						'fid': 'estimate.main.lineItem.detailform',
						'version': '1.0.1',
						'showGrouping': true,
						addValidationAutomatically: true,
						'groups': [
							{
								'gid': 'basicData',
								'attributes': ['info', 'code', 'estassemblyfk', 'descriptioninfo', 'estlineitemfk', 'quantitytargetdetail', 'quantitytarget', 'basuomtargetfk', 'quantitydetail', 'quantity', 'basuomfk', 'quantityfactordetail1', 'quantityfactor1', 'quantityfactordetail2', 'quantityfactor2', 'quantityfactor3', 'quantityfactor4',
									'productivityfactordetail', 'productivityfactor', 'quantityunittarget', 'quantitytotal', 'costunit', 'costfactordetail1', 'costfactor1', 'costfactordetail2', 'costfactor2', 'costunittarget', 'costtotal', 'hoursunit', 'hoursunittarget',
									'hourstotal', 'estcostriskfk', 'mdccontrollingunitfk', 'boqrootref', 'boqitemfk', 'psdactivityschedule', 'psdactivityfk', 'mdcworkcategoryfk', 'mdcassetmasterfk', 'prjlocationfk',  'prcstructurefk', 'islumpsum', 'isdisabled', 'boqwiccatfk', 'wicboqitemfk', 'wicboqheaderfk','wqquantitytarget',
									'lgmjobfk', 'dayworkrateunit', 'dayworkratetotal']},
							{
								'gid': 'sortCodes',
								'attributes': ['sortcode01fk', 'sortcode02fk', 'sortcode03fk', 'sortcode04fk', 'sortcode05fk', 'sortcode06fk', 'sortcode07fk', 'sortcode08fk', 'sortcode09fk', 'sortcode10fk','sortdesc01fk','sortdesc02fk','sortdesc03fk','sortdesc04fk','sortdesc05fk','sortdesc06fk','sortdesc07fk','sortdesc08fk','sortdesc09fk','sortdesc10fk']
							},
							{
								'gid': 'userDefText',
								'isUserDefText': true,
								'attributes': ['userdefined1', 'userdefined2', 'userdefined3', 'userdefined4', 'userdefined5', 'commenttext', 'hint', 'cosmatchtext']

							},
							{
								'gid': 'entityHistory',
								'isHistory': true
							}
						],

						'overloads': {
							'hint':{
								'readonly': true
							},
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
							'code': {
								'mandatory': true,
								'searchable': true,
								'readonly':true
							},
							'descriptioninfo': {
								'grid': {
									'maxLength': 255
								},
								'detail': {
									'maxLength': 255
								}
							},
							'estlineitemfk': {
								'readonly': true,
								grid:{
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'estlineitemfk',
										displayMember: 'Code'
									}
								}
							},
							estassemblyfk: {
								'readonly': true,
								grid: {
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'estassemblyfk',
										displayMember: 'Code'
									}
								}
							},
							'quantitydetail':detailsOverload,
							'quantitytargetdetail':detailsOverload,
							'quantityfactordetail1':detailsOverload,
							'quantityfactordetail2':detailsOverload,
							'productivityfactordetail':detailsOverload,
							'costfactordetail1':detailsOverload,
							'costfactordetail2':detailsOverload,
							'quantityunittarget': {'readonly': false},
							'quantitytotal': {'readonly': false},
							'costunit': {'readonly': true,
								'type' : 'numeric',
								'calculatetype' : 1
							},
							'costunittarget': {'readonly': false,
								'type' : 'numeric',
								'calculatetype' : 1
							},
							'costtotal': {'readonly': true},
							'hoursunit': {'readonly': true},
							'hoursunittarget': {'readonly': true},
							'hourstotal': {'readonly': true},
							'dayworkratetotal': {'readonly': true},
							'dayworkrateunit': {'readonly': true},

							'basuomtargetfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'basicsUnitLookupDataService',
								cacheEnable: true }),

							'basuomfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'basicsUnitLookupDataService',
								cacheEnable: true }),
							'estcostriskfk': basicsLookupdataConfigGeneratorExtension.provideGenericLookupConfig('estimate.lookup.costrisk', 'Description', {showClearButton: true}),

							'mdccontrollingunitfk': {
								navigator: {
									moduleName: 'controlling.structure'
								},
								'detail': {
									'type': 'directive',
									'directive': 'controlling-Structure-Prj-Controlling-Unit-Lookup',

									'options': {
										'eagerLoad': true,
										'showClearButton': true,
										'filterKey': 'est-prj-controlling-unit-filter',
										'additionalColumns': true,
										'displayMember': 'Code',
										'addGridColumns': addColumns
									}
								},
								'grid': {
									editor: 'lookup',
									editorOptions: {
										directive: 'controlling-Structure-Prj-Controlling-Unit-Lookup',
										lookupOptions: {
											showClearButton: true,
											filterKey: 'est-prj-controlling-unit-filter',
											'additionalColumns': true,
											'displayMember': 'Code',
											'addGridColumns': addColumns
										}
									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'controllingunit',
										displayMember: 'Code'
									}
								}
							},

							'boqrootref':{
								'readonly': true,
								'grid':{
									field: 'BoqItemFk',
									formatter: 'lookup',
									formatterOptions: {
										lookupType:'estboqitems',
										displayMember: 'Reference',
										dataServiceName:'constructionsystemMasterBoqRootService'
									}
								}
							},

							'boqitemfk': {
								'readonly': true,
								'grid': {
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'estboqitems',
										displayMember: 'Reference'
									}
								}
							},

							'wicboqitemfk':{
								'readonly': true,
								'grid': {
									editor: 'lookup',
									editorOptions: {
										directive: 'estimate-main-wic-item-lookup',
										lookupOptions: {
											'showClearButton': true,
											'additionalColumns':true,
											'displayMember':'Reference',
											'addGridColumns':[
												{
													id: 'brief',
													field: 'BriefInfo',
													name: 'Description',
													width: 120,
													toolTip: 'Brief',
													formatter: 'translation',
													name$tr$: 'estimate.main.briefInfo'
												}
											]
										}
									},
									field: 'WicBoqItemFk',
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'wicboqitems',
										displayMember: 'Reference',
										dataServiceName: 'constructionsystemMainBoqWicItemLookupService'
									}
								}
							},

							'boqwiccatfk': {
								'readonly': true,
								'grid': {
									field: 'BoqWicCatFk',
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'WicGroupFk',
										displayMember: 'Code',
										dataServiceName: 'boqWicGroupService'
									}
								}

							},

							'wicboqheaderfk': {
								'readonly': true,
								'grid': {
									field: 'WicBoqItemFk',
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'wicboqheaderitems',
										displayMember: 'Reference',
										dataServiceName: 'constructionsystemMainWicBoqRootItemLookupService'
									}
								}
							},

							'psdactivityschedule': {
								'navigator': {
									moduleName: 'scheduling.main'
								},
								'readonly': true,
								'detail' : {
									model: 'PsdActivityFk',
									type: 'directive',
									directive: 'estimate-main-activity-schedule',
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'estlineitemactivity',
										displayMember: 'Code',
										dataServiceName: 'estimateMainActivityScheduleLookupService'
									}
								},
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
								'navigator': {
									moduleName: 'scheduling.main'
								},
								'detail': {
									'type': 'directive',
									'directive': 'estimate-main-activity-dialog',

									'options': {
										'eagerLoad': true,
										'showClearButton': true
									}
								},
								'grid': {
									editor: 'lookup',
									editorOptions: {
										directive: 'estimate-main-activity-dialog',
										lookupOptions: {
											'showClearButton': true,
											'additionalColumns':true,
											'displayMember':'Code',
											'addGridColumns':[{
												id: 'dec',
												field: 'Description',
												name: 'Description',
												width: 120,
												toolTip: 'Description',
												formatter: 'description',
												name$tr$: 'cloud.common.entityDescription'
											}]
										}
									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'estlineitemactivity',
										displayMember: 'Code',
										dataServiceName: 'estimateMainActivityLookupService'
									}
								}
							},
							'prjlocationfk': {
								navigator: {
									moduleName: 'project.main-location'
								},
								'detail': {
									'type': 'directive',
									'directive': 'constructionsystem-main-location-dialog',

									'options': {
										'eagerLoad': true,
										'showClearButton': true
									}
								},
								'grid': {
									editor: 'lookup',
									editorOptions: {
										directive: 'constructionsystem-main-location-dialog',
										lookupOptions: {
											'showClearButton': true,
											'additionalColumns':true,
											'displayMember':'Code',
											'addGridColumns':addColumns
										}
									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'PrjLocationFk',
										displayMember: 'Code',
										dataServiceName: 'constructionsystemMainLineitemLocationLookupService'
									}
								}
							},

							'mdcworkcategoryfk': {
								'grid': {
									'formatter': 'lookup',
									'formatterOptions': {
										'lookupType': 'WorkCategory',
										'displayMember': 'Code'
									},
									'editor': 'lookup',
									'editorOptions': {
										'directive': 'basics-mdc-work-category-dialog',
										'lookupOptions': {
											'showClearButton': true,
											'additionalColumns':true,
											'displayMember':'Code',
											'addGridColumns':addColumns
										}
									},
									'width': 150
								},
								detail: {
									type: 'directive',
									directive: 'basics-lookupdata-lookup-composite',
									options: {
										lookupDirective: 'basics-mdc-work-category-dialog',
										descriptionMember: 'DescriptionInfo.Translated',
										lookupOptions: {
											showClearButton: true
										}
									}
								}
							},

							'mdcassetmasterfk': {
								'grid': {
									'formatter': 'lookup',
									'formatterOptions': {
										'lookupType': 'AssertMaster',
										'displayMember': 'Code'
									},
									'editor': 'lookup',
									'editorOptions': {
										'directive': 'basics-asset-master-dialog',
										'lookupOptions': {
											'showClearButton': true,
											'additionalColumns':true,
											'displayMember':'Code',
											'addGridColumns':addColumns
										}
									},
									'width': 150
								},
								'detail': {
									'type': 'directive',
									'directive': 'basics-lookupdata-lookup-composite',
									'options': {
										'lookupDirective': 'basics-asset-master-dialog',
										'lookupOptions': {
											'showClearButton': true
										}
									}
								}
							},

							'prcstructurefk': {
								readonly: true,
								navigator: {
									moduleName: 'basics.procurementstructure',
									registerService: 'basicsProcurementStructureService'
								},
								'grid': {
									'formatter': 'lookup',
									'formatterOptions': {
										'lookupType': 'prcstructure',
										'displayMember': 'Code'
									}
								}
							},

							'sortcode01fk': getSortCodeConfig('estimateMainSortCode01LookupDataService', true),
							'sortdesc01fk': getSortCodeDesConfig('estimateMainSortCode01LookupDataService'),
							'sortcode02fk': getSortCodeConfig('estimateMainSortCode02LookupDataService'),
							'sortdesc02fk': getSortCodeDesConfig('estimateMainSortCode02LookupDataService'),
							'sortcode03fk': getSortCodeConfig('estimateMainSortCode03LookupDataService'),
							'sortdesc03fk': getSortCodeDesConfig('estimateMainSortCode03LookupDataService'),
							'sortcode04fk': getSortCodeConfig('estimateMainSortCode04LookupDataService'),
							'sortdesc04fk': getSortCodeDesConfig('estimateMainSortCode04LookupDataService'),
							'sortcode05fk': getSortCodeConfig('estimateMainSortCode05LookupDataService'),
							'sortdesc05fk': getSortCodeDesConfig('estimateMainSortCode05LookupDataService'),
							'sortcode06fk': getSortCodeConfig('estimateMainSortCode06LookupDataService'),
							'sortdesc06fk': getSortCodeDesConfig('estimateMainSortCode06LookupDataService'),
							'sortcode07fk': getSortCodeConfig('estimateMainSortCode07LookupDataService'),
							'sortdesc07fk': getSortCodeDesConfig('estimateMainSortCode07LookupDataService'),
							'sortcode08fk': getSortCodeConfig('estimateMainSortCode08LookupDataService'),
							'sortdesc08fk': getSortCodeDesConfig('estimateMainSortCode08LookupDataService'),
							'sortcode09fk': getSortCodeConfig('estimateMainSortCode09LookupDataService'),
							'sortdesc09fk': getSortCodeDesConfig('estimateMainSortCode09LookupDataService'),
							'sortcode10fk': getSortCodeConfig('estimateMainSortCode10LookupDataService'),
							'sortdesc10fk': getSortCodeDesConfig('estimateMainSortCode10LookupDataService'),
							'cosmatchtext': { readonly: true },
							'wqquantitytarget': { readonly: true },
							'lgmjobfk': {
								'readonly': true,
								grid:{
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'logisticJob',
										valueMember: 'Id',
										displayMember: 'Code',
										version: 3
									}
								}
							}
						}
					};
				}
			};
		}
	]);

})(angular);
