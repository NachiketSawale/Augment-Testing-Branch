/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';
	let moduleName = 'basics.costcodes';

	/**
	 * @ngdoc service
	 * @name basicsCostCodesUIConfigurationService
	 * @function
	 *
	 * @description
	 * basicsCostCodesUIConfigurationService is the config service for all costcodes views.
	 */
	angular.module(moduleName).factory('basicsCostCodesUIConfigurationService', ['$injector', '$translate','basicsLookupdataConfigGenerator',
		function ($injector,$translate,basicsLookupdataConfigGenerator) {

			return {
				getBasicsCostCodesDetailLayout: function () {
					return {
						'fid': 'basics.costcodes.detailform',
						'version': '1.0.0',
						'showGrouping': true,
						'addValidationAutomatically': true,
						'groups': [
							{
								'gid': 'basicData',
								'attributes': ['code', 'descriptioninfo', 'description2info', 'factorcosts', 'realfactorcosts', 'factorquantity', 'realfactorquantity', 'factorhour', 'costcodetypefk', 'estcosttypefk', 'islabour', 'israte', 'uomfk', 'rate',
									'currencyfk', 'dayworkrate', 'remark', 'isbudget', 'iscost', 'iseditable', 'isprojectchildallowed', 'co2source','co2sourcefk', 'co2project','isactive','issubcontractedwork','iscorporatework','isconsortiumwork']
							},
							{
								'gid': 'assignments',
								'attributes': ['costcodeportionsfk', 'costgroupportionsfk', 'abcclassificationfk', 'prcstructurefk', 'contrcostcodefk', 'efbtype221fk',  'efbtype222fk','vhbsheetgctypefk','vhbsheetdjctypefk']

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
							'code': {
								'mandatory': true,
								'searchable': true
							},
							// 'descriptioninfo':{
							// maxLength : 255
							// },
							// 'description2info':{
							// maxLength : 255
							// },
							'factorcosts': {
								'change': 'change'
							},
							'realfactorcosts': {
								'readonly': true
							},
							'factorquantity':{
								'change': 'change'
							},
							'realfactorquantity': {
								'readonly': true
							},
							'currencyfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'basicsCurrencyLookupDataService',
								enableCache: true
							}),
							'uomfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'basicsUnitLookupDataService',
								cacheEnable: true
							}),
							'costcodetypefk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.costcodes.costcodetype', 'Description', {
								isFastDataRecording: true
							}),
							'estcosttypefk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('estimate.lookup.costtype', 'Description', {
								isFastDataRecording: true
							}),
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
							co2source:{
								readonly: true
							},
							co2sourcefk: {
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
							},
							'isactive': {
								'readonly': true
							},
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
				},

				getBasicsCostCodesReferenceLayout: function () {
					return {
						'fid': 'basics.costcodes.reference',
						'version': '1.0.0',
						'addValidationAutomatically': true,
						'groups': [
							{
								'gid': 'basicData',
								'attributes': ['source','detailsstack']
							},
						],
						'overloads': {
							'source': {
								'readonly': true
							},
							'detailsstack': {
								'grid': {
									// isTransient: filterInfos.isRuleParamTransient,
									editor: 'lookup',
									editorOptions: {
										'directive': 'basics-costcodes-details-stack-lookup',
										lookupOptions: {
											'showClearButton': false,
											'showEditButton': false
										}
									},
									formatter: 'imageselect',
									formatterOptions: {
										dataServiceName: 'estimateParameterFormatterService',
										dataServiceMethod: 'getItemByParamAsync',
										// itemServiceName:filterInfos.serviceName,
										// itemName: filterInfos.itemName,
										serviceName: 'estimateParameterFormatterService'
										// RootServices : filterInfos.RootServices
									}
								}
							}
						}
					};
				}
			};
		}
	]);
})();