/**
 * Created by wuj on 2/28/2015.
 */
(function (angular) {
	'use strict';

	var basicsProcurementStructureModule = 'basics.procurementstructure';
	var cloudCommonModule = 'cloud.common';
	var	costCodeOverloads = {
		'detail': {
			'type': 'directive',
			'directive': 'basics-cost-codes-lookup',
			'options': {
				showClearButton: true,
				filterKey: 'cost-code-isEstimateCc-and-company-filter',
				selectableCallback: function (dataItem) {
					return dataItem.IsEstimateCostCode;
				}
			}
		},
		'grid': {
			formatter: 'lookup',
			formatterOptions: {
				lookupType: 'costcode',
				displayMember: 'Code'
			},
			editor: 'lookup',
			editorOptions: {
				lookupField: 'CostCodeFk',
				lookupOptions: {
					showClearButton: true,
					filterKey: 'cost-code-isEstimateCc-and-company-filter',
					selectableCallback: function (dataItem) {
						return dataItem.IsEstimateCostCode;
					}
				},
				//directive:'estimate-main-cost-codes-lookup',
				directive: 'basics-cost-codes-lookup'
			}
		}
	};

	angular.module(basicsProcurementStructureModule)
		.value('basicsProcurementStructureLayout', {
			'fid': 'basics.procurementstructure.detailform',
			'version': '1.0.0',
			'addValidationAutomatically': true,
			'showGrouping': true,
			'groups': [
				{
					'gid': 'basicData',
					'attributes': ['code', 'descriptioninfo', 'prcstructuretypefk', 'islive']
				},
				{
					'gid': 'technicalCostCodes',
					'attributes': ['costcodefk', 'costcodeurp1fk', 'costcodeurp2fk', 'costcodeurp3fk',
						'costcodeurp4fk', 'costcodeurp5fk', 'costcodeurp6fk', 'allowassignment', 'costcodevatfk',
						'isformalhandover','isapprovalrequired', 'isstockexcluded','scurvefk', 'clerkprcfk', 'clerkreqfk', 'commenttextinfo', 'prcconfigheaderfk','basloadingcostid']

				},
				{
					'gid': 'entityHistory',
					'isHistory': true
				}
			],
			'translationInfos': {
				'extraModules': [basicsProcurementStructureModule, 'basics.costcodes'],
				'extraWords': {
					moduleName: {
						location: basicsProcurementStructureModule,
						identifier: 'moduleName',
						initial: 'Procurement Structure'
					},
					technicalCostCodes: {
						location: basicsProcurementStructureModule,
						identifier: 'technicalCostCodesGroup',
						initial: 'Technical Cost Codes'
					},
					Code: {location: cloudCommonModule, identifier: 'entityCode', initial: 'Code'},
					IsLive: {location: cloudCommonModule, identifier: 'entityIsLive', initial: 'Active'},
					PrcStructureTypeFk: {location: cloudCommonModule, identifier: 'entityType', initial: 'Type'},
					CostCodeFk: {
						location: basicsProcurementStructureModule,
						identifier: 'costCode',
						initial: 'Cost Code'
					},
					CostCodeURP1Fk: {
						location: basicsProcurementStructureModule,
						identifier: 'costCodeURP1',
						initial: 'Cost Code URP1'
					},
					CostCodeURP2Fk: {
						location: basicsProcurementStructureModule,
						identifier: 'costCodeURP2',
						initial: 'Cost Code URP2'
					},
					CostCodeURP3Fk: {
						location: basicsProcurementStructureModule,
						identifier: 'costCodeURP3',
						initial: 'Cost Code URP3'
					},
					CostCodeURP4Fk: {
						location: basicsProcurementStructureModule,
						identifier: 'costCodeURP4',
						initial: 'Cost Code URP4'
					},
					CostCodeURP5Fk: {
						location: basicsProcurementStructureModule,
						identifier: 'costCodeURP5',
						initial: 'Cost Code URP5'
					},
					CostCodeURP6Fk: {
						location: basicsProcurementStructureModule,
						identifier: 'costCodeURP6',
						initial: 'Cost Code URP6'
					},
					AllowAssignment: {
						location: basicsProcurementStructureModule,
						identifier: 'allowAssignment',
						initial: 'Allow Assignment'
					},
					CostCodeVATFk: {
						location: basicsProcurementStructureModule,
						identifier: 'costCodeVAT',
						initial: 'Cost Code VAT'
					},
					IsFormalHandover:{
						'location': basicsProcurementStructureModule,
						'identifier': 'isFormalHandover',
						'initial': 'IsFormalHandover'
					},
					IsApprovalRequired:{
						'location': basicsProcurementStructureModule,
						'identifier': 'isApprovalRequired',
						'initial': 'IsApprovalRequired'
					},
					IsStockExcluded:{
						'location': basicsProcurementStructureModule,
						'identifier': 'isStockExcluded',
						'initial': 'Is Stock Excluded'
					},
					ScurveFk: {
						'location': basicsProcurementStructureModule,
						'identifier': 'scurveFk',
						'initial': 'Scurve'
					},
					ClerkReqFk: {
						'location': basicsProcurementStructureModule,
						'identifier': 'requisitionOwnerRole',
						'initial': 'Requisition Owner Role'
					},
					ClerkPrcFk: {
						'location': basicsProcurementStructureModule,
						'identifier': 'responsibleRole',
						'initial': 'Responsible Role'
					},
					CommentTextInfo: {
						location: cloudCommonModule,
						identifier: 'entityCommentText',
						initial: 'Comment'
					},
					PrcConfigHeaderFk: {
						location: basicsProcurementStructureModule,
						identifier: 'configuration',
						initial: 'Configuration Header'
					},
					BasLoadingCostId: {
						location: basicsProcurementStructureModule,
						identifier: 'basLoadingCostId',
						initial: 'Loading Cost'
					}
				}
			},
			'overloads': {
				'code': {
					'mandatory': true
				},
				'descriptioninfo': {
					'maxLength': 252
	                },
				'prcstructuretypefk': {
					'detail': {
						'type': 'directive',
						'directive': 'basics-procurementstructure-prcstructure-type-combobox',
						'options': {
							imageSelector: 'basicsProcurementStructureImageProcessor'
						}
					},
					'grid': {
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'PrcStructureType',
							displayMember: 'DescriptionInfo.Translated',
							imageSelector: 'basicsProcurementStructureImageProcessor'
						},
						editor: 'lookup',
						editorOptions: {
							directive: 'basics-procurementstructure-prcstructure-type-combobox',
							lookupOptions: {
								imageSelector: 'basicsProcurementStructureImageProcessor'
							}
						}
					}
				},
				'islive': {
					'readonly': true
				},
				'costcodefk': costCodeOverloads,
				'costcodeurp1fk': costCodeOverloads,
				'costcodeurp2fk': costCodeOverloads,
				'costcodeurp3fk': costCodeOverloads,
				'costcodeurp4fk': costCodeOverloads,
				'costcodeurp5fk': costCodeOverloads,
				'costcodeurp6fk': costCodeOverloads,
				'costcodevatfk': costCodeOverloads,
				'scurvefk':{
					'detail': {
						'type': 'directive',
						'directive': 'basics-lookupdata-scurve-combobox',
						'options': {
							showClearButton: true
						}
					},
					'grid': {
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'Scurve',
							displayMember: 'DescriptionInfo.Translated'
						},
						editor: 'lookup',
						editorOptions: {
							lookupOptions: {showClearButton: true},
							directive: 'basics-lookupdata-scurve-combobox'
						}
					}
				},
				'clerkreqfk':{
					'grid': {
						editor: 'lookup',
						editorOptions: {
							lookupOptions: {
								showClearButton: true,
								valueMember: 'Id',
								displayMember: 'Description',
								lookupModuleQualifier: 'basics.clerk.role'
							},
							directive: 'basics-lookupdata-simple'
						},
						'formatter': 'lookup',
						'formatterOptions': {
							'lookupModuleQualifier': 'basics.clerk.role',
							'lookupType': 'basics.clerk.role',
							'valueMember': 'Id',
							'lookupSimpleLookup':true,
							'displayMember': 'Description'
						},
						'width': 140
					},
					'detail': {
						'type': 'directive',
						'directive': 'basics-lookupdata-simple',
						'options': {
							'lookupType': 'basics.clerk.role',
							'displayMember': 'Description',
							'valueMember': 'Id',
							'lookupModuleQualifier': 'basics.clerk.role'
						}
					}
				},
				'clerkprcfk':{
					'grid': {
						editor: 'lookup',
						editorOptions: {
							lookupOptions: {
								showClearButton: true,
								valueMember: 'Id',
								displayMember: 'Description',
								lookupModuleQualifier: 'basics.clerk.role'
							},
							directive: 'basics-lookupdata-simple'
						},
						'formatter': 'lookup',
						'formatterOptions': {
							'lookupModuleQualifier': 'basics.clerk.role',
							'lookupType': 'basics.clerk.role',
							'valueMember': 'Id',
							'lookupSimpleLookup':true,
							'displayMember': 'Description'
						},
						'width': 140
					},
					'detail': {
						'type': 'directive',
						'directive': 'basics-lookupdata-simple',
						'options': {
							'lookupType': 'basics.clerk.role',
							'displayMember': 'Description',
							'valueMember': 'Id',
							'lookupModuleQualifier': 'basics.clerk.role'
						}
					}
				},
				'commenttextinfo': {
					'grid': {
						'maxLength': 255
					},
					'detail': {
						'maxLength': 255
					}
				},
				'prcconfigheaderfk': {
					'detail': {
						'type': 'directive',
						'directive': 'basics-procurement-configuration-config-header-combo-box'
					},
					'grid': {
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'PrcConfigHeader',
							displayMember: 'Description'
						},
						editor: 'lookup',
						editorOptions: {
							directive: 'basics-procurement-configuration-config-header-combo-box'
						},
						width: 120
					}
				},
				'basloadingcostid': {
					'detail': {
						'type': 'directive',
						'directive': 'prc-bas-loading-cost-combobox',
						options: {
							filterKey: 'prc-bas-loading-cost-filter'
						}
					},
					'grid': {
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'prcbasloadingcost',
							displayMember: 'DescriptionInfo.Translated'
						},
						editor: 'lookup',
						editorOptions: {
							directive: 'prc-bas-loading-cost-combobox',
							lookupOptions: {
								filterKey: 'prc-bas-loading-cost-filter'
							}
						},
						width: 120
					}
				}
			},
			'addition': {
				grid: [
					{
						lookupDisplayColumn: true,
						field: 'CostCodeFk',
						displayMember: 'DescriptionInfo.Translated',
						name$tr$: 'basics.procurementstructure.costCodeDescription',
						width: 150
					},
					{
						lookupDisplayColumn: true,
						field: 'CostCodeURP1Fk',
						displayMember: 'DescriptionInfo.Translated',
						name$tr$: 'basics.procurementstructure.costCodeURP1Description',
						width: 125
					},
					{
						lookupDisplayColumn: true,
						field: 'CostCodeURP2Fk',
						displayMember: 'DescriptionInfo.Translated',
						name$tr$: 'basics.procurementstructure.costCodeURP2Description',
						width: 150
					},
					{
						lookupDisplayColumn: true,
						field: 'CostCodeURP3Fk',
						displayMember: 'DescriptionInfo.Translated',
						name$tr$: 'basics.procurementstructure.costCodeURP3Description',
						width: 150
					},
					{
						lookupDisplayColumn: true,
						field: 'CostCodeURP4Fk',
						displayMember: 'DescriptionInfo.Translated',
						name$tr$: 'basics.procurementstructure.costCodeURP4Description',
						width: 150
					},
					{
						lookupDisplayColumn: true,
						field: 'CostCodeURP5Fk',
						displayMember: 'DescriptionInfo.Translated',
						name$tr$: 'basics.procurementstructure.costCodeURP5Description',
						width: 150
					},
					{
						lookupDisplayColumn: true,
						field: 'CostCodeURP6Fk',
						displayMember: 'DescriptionInfo.Translated',
						name$tr$: 'basics.procurementstructure.costCodeURP6Description',
						width: 150
					},
					{
						lookupDisplayColumn: true,
						field: 'CostCodeVATFk',
						displayMember: 'DescriptionInfo.Translated',
						name$tr$: 'basics.procurementstructure.costCodeVATDescription',
						width: 150
					}
				]
			}
		});

})(angular);



