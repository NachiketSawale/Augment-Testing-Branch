/**
 * Created by wui on 2/24/2016.
 */

(function(angular){
	'use strict';

	var moduleName = 'constructionsystem.master';

	angular.module(moduleName).factory('constructionSystemMasterLineItemLayoutService',[
		'$injector', 'basicsLookupdataConfigGenerator', 'basicsLookupdataConfigGeneratorExtension', 'constructionSystemMasterTestDataService',
		function($injector, basicsLookupdataConfigGenerator, basicsLookupdataConfigGeneratorExtension, constructionSystemMasterTestDataService){

			var getProjectId = function getProjectId() {
				// use TestInput Container's ProjectFk to filter Project loaction/ Cost Group 1-5;
				var data = constructionSystemMasterTestDataService.getCurrentEntity();
				var projectId = data && data.ProjectFk ? data.ProjectFk : null;
				return projectId ? projectId.toString() : '-1';
			};

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
									'hourstotal', 'estcostriskfk', 'mdccontrollingunitfk', 'boqrootref', 'boqitemfk', 'psdactivityschedule', 'psdactivityfk',
									'mdcworkcategoryfk', 'mdcassetmasterfk', 'prjlocationfk','prcstructurefk', 'islumpsum', 'isdisabled', 'dayworkratetotal', 'dayworkrateunit']
							},
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
								'searchable': true
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

							'quantityunittarget': {'readonly': true},
							'quantitytotal': {'readonly': true},
							'costunit': {'readonly': true},
							'costunittarget': {'readonly': true},
							'costtotal': {'readonly': true},
							'hoursunit': {'readonly': true},
							'hoursunittarget': {'readonly': true},
							'hourstotal': {'readonly': true},
							'dayworkratetotal': {'readonly': true},
							'dayworkrateunit': {'readonly': true},

							// 'basuomtargetfk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.uom', 'Uom'),
							'basuomtargetfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'basicsUnitLookupDataService',
								cacheEnable: true }),
							// 'basuomfk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.uom', 'Uom'),
							'basuomfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'basicsUnitLookupDataService',
								cacheEnable: true }),
							'estcostriskfk': basicsLookupdataConfigGeneratorExtension.provideGenericLookupConfig('estimate.lookup.costrisk', 'Description', {showClearButton: true}),

							'mdccontrollingunitfk': {
								'readonly': true,
								grid: {
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'prjcontrollingunit',
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

							'psdactivityschedule':{
								'readonly': true,
								'grid':{
									field: 'PsdActivityFk',
									formatter: 'lookup',
									formatterOptions: {
										lookupType:'estlineitemactivity',
										displayMember: 'Code',
										dataServiceName:'constructionsystemMasterActivityScheduleService'
									}
								}
							},

							'psdactivityfk': {
								'readonly': true,
								'grid': {
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'estlineitemactivity',
										displayMember: 'Code'
									}
								}
							},
							'prjlocationfk': basicsLookupdataConfigGenerator.provideTreeDataServiceLookupConfig({
								moduleQualifier: 'estProjectLocationLookupDataService',
								dataServiceName: 'projectLocationLookupDataService',
								valMember: 'Id',
								dispMember: 'Code',
								filter: function () {
									return getProjectId();
								}
							}),

							'mdcworkcategoryfk': basicsLookupdataConfigGenerator.provideTreeDataServiceLookupConfig({
								moduleQualifier: 'estMdcWorkCategoryLookupDataService',
								dataServiceName: 'basicsMdcWorkCategoryLookupDataService',
								valMember: 'Id',
								dispMember: 'Code'
							}),

							'mdcassetmasterfk': basicsLookupdataConfigGenerator.provideTreeDataServiceLookupConfig({
								moduleQualifier: 'estAssetMasterLookupDataService',
								dataServiceName: 'basicsAssetMasterLookupDataService',
								valMember: 'Id',
								dispMember: 'Code'
							}),

							'prcstructurefk': {
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
							'cosmatchtext': { readonly: true }
						}
					};
				}
			};
		}
	]);

})(angular);