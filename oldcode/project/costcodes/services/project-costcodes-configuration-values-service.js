/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	let moduleName = 'project.costcodes';

	/**
	 * @ngdoc service
	 * @name projectCostCodesConfigurationValuesService
	 * @function
	 *
	 * @description
	 * projectCostCodesConfigurationValuesService is the config service for all project costcode's views.
	 */
	angular.module(moduleName).factory('projectCostCodesConfigurationValuesService', ['$injector', 'basicsLookupdataConfigGenerator',

		function ( $injector, basicsLookupdataConfigGenerator) {
			let service = {};

			let projectCostCodesDetailLayout = {

				'fid': 'project.costcodes.detailform',
				'version': '1.0.0',
				'showGrouping': true,
				addValidationAutomatically: true,
				'groups': [
					{
						'gid': 'basicData',
						'attributes': ['code', 'description', 'description2', 'bascostcode.factorcosts', 'bascostcode.realfactorcosts',  'factorcosts', 'realfactorcosts', 'factorhour', 'bascostcode.factorhour', 'bascostcode.factorquantity',
							'bascostcode.realfactorquantity', 'factorquantity', 'realfactorquantity', 'bascostcode.rate', 'rate', 'bascostcode.dayworkrate', 'dayworkrate', 'bascostcode.currencyfk', 'currencyfk', 'bascostcode.uomfk', 'uomfk',
							'islabour', 'israte', 'isdefault', 'iseditable', 'remark', 'bascostcode.costcodetypefk', 'costcodetypefk', 'bascostcode.estcosttypefk', 'estcosttypefk', 'bascostcode.islabour', 'bascostcode.israte', 'bascostcode.remark',
							'isbudget', 'iscost', 'ischildallowed', 'bascostcode.isprojectchildallowed', 'co2source', 'co2project','issubcontractedwork','iscorporatework','isconsortiumwork']
					},
					{
						'gid': 'assignments',
						'attributes': [  'costcodeportionsfk', 'costgroupportionsfk', 'abcclassificationfk', 'prcstructurefk', 'contrcostcodefk', 'efbtype221fk', 'efbtype222fk','vhbsheetgctypefk','vhbsheetdjctypefk', 'co2sourcefk']
					},
					{
						'gid': 'userDefText',
						'isUserDefText': true,
						'attributes': [ 'userdefined1', 'userdefined2', 'userdefined3', 'userdefined4', 'userdefined5']
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],

				'overloads': {

					'realfactorcosts': {
						'readonly': true
					},
					'realfactorquantity': {
						'readonly': true
					},
					'rate':{
						'readonly': true
					},
					'factorcosts': {
						'readonly': true
					},
					'factorhour': {
						'readonly': true
					},
					'factorquantity': {
						'readonly': true
					},
					'dayworkrate': {
						'readonly': true
					},
					'issubcontractedwork': {
						readonly: true
					},

					'uomfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'basicsUnitLookupDataService',
						cacheEnable: true }),

					'currencyfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'basicsCurrencyLookupDataService',
						enableCache: true,
						readonly: true
					}),

					'bascostcode.uomfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'basicsUnitLookupDataService',
						cacheEnable: true,
						readonly: true
					}),

					'bascostcode.currencyfk':basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'basicsCurrencyLookupDataService',
						enableCache: true,
						readonly: true
					}),

					'lgmjobfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'logisticJobLookupByProjectDataService',
						readonly: false,
						cacheEnable: true,
						additionalColumns: false,
						filter: function () {
							return  $injector.get('projectMainService').getIfSelectedIdElse(null);
						}
					}),

					'bascostcode.costcodetypefk': basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.costcodes.costcodetype', 'Description'),

					'estcosttypefk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('estimate.lookup.costtype', 'Description'),

					'bascostcode.estcosttypefk': basicsLookupdataConfigGenerator.provideReadOnlyConfig('estimate.lookup.costtype', 'Description'),

					'bascostcode.abcclassificationfk': basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.costcodes.abcclassification', 'Description'),

					'bascostcode.costcodeportionsfk': basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.costcodes.costcodeportions', 'Description'),

					'bascostcode.costgroupportionsfk': basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.costcodes.costgroupportions', 'Description'),

					'costcodetypefk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.costcodes.costcodetype', 'Description'),

					'abcclassificationfk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.costcodes.abcclassification', 'Description'),

					'costcodeportionsfk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.costcodes.costcodeportions', 'Description'),

					'costgroupportionsfk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.costcodes.costgroupportions', 'Description'),

					'prcstructurefk': {
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								lookupDirective: 'basics-procurementstructure-structure-dialog',
								descriptionMember: 'DescriptionInfo.Translated',
								lookupOptions: {
									showClearButton: true
								}
							}
						},
						'grid': {
							editor: 'lookup',
							editorOptions: {
								lookupOptions: {
									showClearButton: true
								},
								directive: 'basics-procurementstructure-structure-dialog'
							},
							width: 150,
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'prcstructure',
								displayMember: 'Code'
							}
						}
					},

					'contrcostcodefk': {
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								lookupDirective: 'basics-cost-codes-controlling-lookup',
								descriptionMember: 'DescriptionInfo.Translated',
								lookupOptions: {
									showClearButton: true
								}
							},
							'change': 'change'
						},
						'grid': {
							editor: 'lookup',
							editorOptions: {
								lookupOptions: {
									showClearButton: true
								},
								directive: 'basics-cost-codes-controlling-lookup'
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'ControllingCostCode',
								displayMember: 'Code'
							}
						}
					},
					'efbtype221fk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.efbtype', 'Description'),
					'efbtype222fk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.efbtype', 'Description'),
					'vhbsheetgctypefk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.vhbsheetgctype', 'Description'),
					'vhbsheetdjctypefk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.vhbsheetdjctype', 'Description'),
					'co2project':{
						readonly: true
					},
					'co2source':{
						readonly: true
					},
					'co2sourcefk': {
						readonly: true,
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-source-name-lookup',
							'options': {
								version: 3
							}
						},
						'grid': {
							editor: 'lookup',
							editorOptions: {
								lookupDirective: 'basics-lookupdata-source-name-lookup'
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'co2sourcename',
								displayMember: 'DescriptionInfo.Translated',
								version: 3
							}
						}
					}
				},
				'addition': {
					grid: [
						{
							lookupDisplayColumn: true,
							field: 'ContrCostCodeFk',
							name$tr$: 'basics.costcodes.controllingCostCodeDescription',
							displayMember: 'DescriptionInfo.Translated',
							width: 125
						},
						{
							lookupDisplayColumn: true,
							field: 'PrcStructureFk',
							name$tr$: 'basics.costcodes.prcStructureDescription',
							displayMember: 'DescriptionInfo.Translated',
							width: 125
						}
					]
				}

			};

			service.getProjectCostCodesDetailLayout = function(){
				let groups = projectCostCodesDetailLayout.groups;

				angular.forEach(groups, function(grp){
					if(grp.hasOwnProperty('attributes')){
						angular.forEach(grp.attributes, function(attr){
							if(attr.indexOf('bascostcode') >= 0 && attr.indexOf('fk') === -1 ){
								projectCostCodesDetailLayout.overloads[attr] = {'readonly': true};
							}
						});
					}
				});

				return projectCostCodesDetailLayout;
			};

			return service;
		}
	]);
})(angular);

