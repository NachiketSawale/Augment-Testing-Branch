(function (angular) {
	'use strict';
	/* jshint -W074 */
	var moduleName = 'constructionsystem.master',
		cloudCommonModule = 'cloud.common',
		modelMainModule = 'model.main',
		schedulingScheduleModule = 'scheduling.schedule',
		basicsCommonModule = 'basics.common',
		estimateMainModule = 'estimate.main',
		schedulingMainModule = 'scheduling.main';

	// Header
	angular.module(moduleName).factory('constructionSystemMasterHeaderDetailLayout', ['basicsCommonCodeDescriptionSettingsService',
		function (basicsCommonCodeDescriptionSettingsService) {
			var headerSetting = basicsCommonCodeDescriptionSettingsService.getSettings([{
				typeName: 'CosHeaderEntity',
				modul: 'ConstructionSystem.Master'
			}]);
			var codeLength = headerSetting && headerSetting[0] && headerSetting[0].codeLength && headerSetting[0].codeLength > 0 ? headerSetting[0].codeLength : 16;
			return {
				'fid': 'constructionsystem.master.header.detail',
				'version': '1.1.0',
				'showGrouping': true,
				'addValidationAutomatically': true,
				'groups': [
					{
						'gid': 'basicData',
						'attributes': ['code', 'descriptioninfo', 'reference', 'matchcode', 'islive', 'isdistinctinstances', 'rubriccategoryfk', 'cosgroupfk', 'costypefk', 'commenttext', 'structurefk']
					},
					{
						'gid': 'form',
						'attributes': ['basformfk']
					},
					{
						'gid': 'changeOption',
						'attributes': ['changeoption.iscopylineitems', 'changeoption.ismergelineitems', 'changeoption.ischange']
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],
				'translationInfos': {
					'extraModules': [moduleName, cloudCommonModule, basicsCommonModule],
					'extraWords': {
						DescriptionInfo: {
							location: cloudCommonModule,
							identifier: 'entityDescription',
							initial: 'Description'
						},
						Reference: {location: cloudCommonModule, identifier: 'entityReference', initial: 'Reference'},
						MatchCode: {location: moduleName, identifier: 'entityMatchCode', initial: 'Match Code'},
						RubricCategoryFk: {
							location: cloudCommonModule,
							identifier: 'entityBasRubricCategoryFk',
							initial: 'Rubric Category'
						},
						CosGroupFk: {location: cloudCommonModule, identifier: 'entityGroup', initial: 'Group'},
						CosTypeFk: {location: cloudCommonModule, identifier: 'entityType', initial: 'Type'},
						CommentText: {location: cloudCommonModule, identifier: 'entityCommentText', initial: 'Comment'},
						StructureFk: {
							location: basicsCommonModule,
							identifier: 'entityPrcStructureFk',
							initial: 'Procurement Structure'
						},
						BasFormFk: {location: moduleName, identifier: 'entityBasFormFk', initial: 'Form'},
						costGroup: {location: moduleName, identifier: 'entitycostGroup', initial: 'Cost Group'},
						form: {location: moduleName, identifier: 'entityBasFormFk', initial: 'Form'},
						IsDistinctInstances: {
							location: moduleName,
							identifier: 'entityIsDistinctInstances',
							initial: 'Is Distinct Instances'
						},
						IsLive: {location: cloudCommonModule, identifier: 'entityIsLive', initial: 'Active'},
						'changeOption': {location: moduleName, identifier: 'chgOptionGridContainerTitle', initial: 'Change Option'},
						'ChangeOption.IsCopyLineItems':{location: moduleName, identifier: 'entityIsCopyLineItems', initial: 'Is Copy Line Items'},
						'ChangeOption.IsMergeLineItems': { location: moduleName, identifier: 'entityIsMergeLineItems', initial: 'Is Merge Line Items' },
						'ChangeOption.IsChange': { location: moduleName, identifier: 'entityIsChange', initial: 'Is Change' }
					}
				},
				'overloads': {
					code: {
						detail: {
							maxLength: codeLength
						},
						grid: {
							maxLength: codeLength
						}
					},
					'selectstatement': {
						'readonly': true
					},
					// 'descriptioninfo': {
					// 	'grid': {
					// 		'maxLength': 255
					// 	},
					// 	'detail': {
					// 		'maxLength': 255
					// 	}
					// },
					// 'reference': {
					// 	'grid': {
					// 		'maxLength': 255
					// 	},
					// 	'detail': {
					// 		'maxLength': 255
					// 	}
					// },
					'rubriccategoryfk': {
						'grid': {
							'formatter': 'lookup',
							'formatterOptions': {
								'lookupType': 'RubricCategoryByRubricAndCompany',
								'displayMember': 'Description'
							},
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'basics-lookupdata-rubric-category-by-rubric-and-company-lookup',
								'lookupOptions': {
									'filterKey': 'rubriccategorytrv-for-construction-system-master-filter',
									'lookupType': 'RubricCategoryByRubricAndCompany'
								}
							}
						},
						'detail': {
							'type': 'directive',
							'model': 'RubricCategoryFk',
							'directive': 'basics-lookupdata-rubric-category-by-rubric-and-company-lookup',
							'options': {
								'filterKey': 'rubriccategorytrv-for-construction-system-master-filter'
							}
						}
					},
					'cosgroupfk': {
						'grid': {
							'formatter': 'lookup',
							'formatterOptions': {
								'lookupType': 'ConstructionSystemMasterGroup',
								'displayMember': 'DescriptionInfo.Translated'
							},
							'editor': 'lookup',
							'editorOptions': {
								lookupDirective: 'construction-system-master-group-combobox',
								lookupOptions: {
									displayMember: 'DescriptionInfo.Translated'
								}
							}
						},
						'detail': {
							'type': 'directive',
							'model': 'CosGroupFk',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								lookupDirective: 'construction-system-master-group-combobox',
								descriptionMember: 'DescriptionInfo.Translated'
							}
						}
					},
					'costypefk': {
						'grid': {
							'formatter': 'lookup',
							'formatterOptions': {
								'lookupType': 'ConstructionSystemMasterType',
								'displayMember': 'Description',
								imageSelector: 'basicsCustomizeConstructionIconService'
							},
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'construction-system-master-type-combobox',
								'lookupOptions': {
									'lookupType': 'ConstructionSystemMasterType'
								}
							}
						},
						'detail': {
							'type': 'directive',
							'model': 'CosTypeFk',
							'directive': 'construction-system-master-type-combobox'
						}
					},
					'structurefk': {
						'grid': {
							'formatter': 'lookup',
							'formatterOptions': {
								'lookupType': 'Prcstructure',
								'displayMember': 'Code'
							},
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'basics-procurementstructure-structure-dialog',
								'lookupOptions': {
									'showClearButton': true
								}
							},
							'width': 150
						},
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								'lookupDirective': 'basics-procurementstructure-structure-dialog',
								'descriptionMember': 'DescriptionInfo.Translated',
								'lookupOptions': {
									'showClearButton': true
								}
							}
						}
					},
					'basformfk': {
						'grid': {
							editor: 'lookup',
							editorOptions: {
								directive: 'basics-lookup-data-by-custom-data-service-grid-less',
								lookupOptions: {
									lookupModuleQualifier: 'basicsUserFormLookupService',
									lookupType: 'basicsUserFormLookupService',
									dataServiceName: 'basicsUserFormLookupService',
									valueMember: 'Id',
									displayMember: 'DescriptionInfo.Description',
									filter: function () {
										return 60;
									},
									showClearButton: true
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'basicsUserFormLookupService',
								dataServiceName: 'basicsUserFormLookupService',
								displayMember: 'DescriptionInfo.Description',
								filter: function () {
									return 60;
								}
							},
							width: 150
						},
						detail: {
							type: 'directive',
							directive: 'basics-lookup-data-by-custom-data-service-grid-less',
							options: {
								lookupModuleQualifier: 'basicsUserFormLookupService',
								lookupType: 'basicsUserFormLookupService',
								dataServiceName: 'basicsUserFormLookupService',
								valueMember: 'Id',
								displayMember: 'DescriptionInfo.Description',
								filter: function () {
									return 60;
								},
								showClearButton: true
							}
						}
					},
					'islive':{
						'readonly': true,
						'visible': true
					}
				},
				'addition': {
					'grid': extendGrouping([
						{
							'afterId': 'structurefk',
							'id': 'structureDescription',
							'lookupDisplayColumn': true,
							'field': 'StructureFk',
							'name$tr$': 'cloud.common.entityStructureDescription',
							'sortable': true,
							'displayMember': 'DescriptionInfo.Translated',
							'width': 145
						}
					])
				}
			};
		}
	]);

	// Parameter
	angular.module(moduleName).factory('constructionSystemMasterParameterDetailLayout', ['parameterDataTypes',
		function (parameterDataTypes) {
			return {
				'fid': 'constructionsystem.master.parameter.detail',
				'version': '1.0.0',
				'addValidationAutomatically': true,
				'showGrouping': true,
				'groups': [
					{
						'gid': 'basicData',
						'attributes': ['cosparametergroupfk', 'descriptioninfo', 'variablename', 'cosparametertypefk', 'uomfk', 'cosdefaulttypefk',
							'propertyname', 'defaultvalue', 'basformfieldfk', 'sorting', 'islookup','aggregatetype']
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],
				'translationInfos': {
					'extraModules': [moduleName, cloudCommonModule],
					'extraWords': {
						CosParameterGroupFk: { location: moduleName, identifier: 'entityCosParameterGroupFk', initial: 'Parameter Group' },
						VariableName: { location: moduleName, identifier: 'entityVariableName', initial: 'VariableName' },
						CosParameterTypeFk: { location: moduleName, identifier: 'entityParameterTypeFk', initial: 'ParameterType' },
						UomFk: { location: moduleName, identifier: 'entityUomFk', initial: 'UoM' },
						CosDefaultTypeFk: { location: moduleName, identifier: 'entityDefaultTypeFk', initial: 'DefaultType' },
						PropertyName: { location: moduleName, identifier: 'entityPropertyName', initial: 'PropertyName' },
						QuantityQuery: { location: moduleName, identifier: 'entityQuantityQuery', initial: 'QuantityQuery' },
						DefaultValue: { location: moduleName, identifier: 'entityDefaultValue', initial: 'DefaultValue' },
						BasFormFieldFk: { location: moduleName, identifier: 'entityFormFieldFk', initial: 'FormFieldFk' },
						Sorting: { location: moduleName, identifier: 'entitySorting', initial: 'Sorting' },
						IsLookup: { location: moduleName, identifier: 'entityIsLookup', initial: 'Is Lookup' },
						AggregateType: { location: moduleName, identifier: 'entityAggregateType', initial: 'Aggregate Type' }
					}
				},
				'overloads': {
					'cosparametertypefk': {
						'grid': {
							'formatter': 'lookup',
							'formatterOptions': {
								'lookupType': 'CosMasterParameterType',
								'displayMember': 'Description'
							},
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'construction-system-master-parameter-type-lookup'
							}
						},
						'detail': {
							'type': 'directive',
							'directive': 'construction-system-master-parameter-type-lookup'
						}
					},
					'cosdefaulttypefk': {
						'grid': {
							'formatter': 'lookup',
							'formatterOptions': {
								'lookupType': 'CosMasterDefaultType',
								'displayMember': 'Description'
							},
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'construction-system-master-default-type-lookup'
							}
						},
						'detail': {
							'type': 'directive',
							'directive': 'construction-system-master-default-type-lookup'
						}
					},
					'uomfk': {
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-uom-lookup',
							'options': {
								showClearButton: true
							}
						},
						'grid': {
							editor: 'lookup',
							editorOptions: {
								lookupDirective: 'basics-lookupdata-uom-lookup',
								lookupOptions: {
									showClearButton: true,
									isFastDataRecording: true
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'uom',
								displayMember: 'Unit'
							}
						}
					},
					'cosparametergroupfk': {
						'detail': {
							'type': 'directive',
							'directive': 'construction-system-master-parameter-group-lookup'
						},
						'grid': {
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'CosParameterGroupLookup',
								displayMember: 'DescriptionInfo.Translated',
								dataServiceName: 'cosParameterGroupLookupService'
							},
							editor: 'lookup',
							editorOptions: {
								directive: 'construction-system-master-parameter-group-lookup',
								'lookupOptions': {
									// 'dataServiceName': 'cosParameterGroupLookupService',
									// 'displayMember': 'DescriptionInfo.Translated',
									'valueMember': 'Id'
								}
							},
							'width': 150
						}
					},
					'basformfieldfk': {
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'basics-user-form-field-lookup',
								lookupOptions: {
									filterKey: 'basformfieldfk-for-construction-system-master-filter',
									showClearButton: true
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'userformfield',
								displayMember: 'FieldName'
							},
							'width': 150
						},
						'detail': {
							'type': 'directive',
							'directive': 'basics-user-form-field-lookup',
							'options': {
								'filterKey': 'basformfieldfk-for-construction-system-master-filter',
								'showClearButton': true
							}
						}
					},
					// 'variablename': {
					// 	'grid': {
					// 		'editor': 'directive',
					// 		'editorOptions': {
					// 			'directive': 'basics-common-limit-input',
					// 			validKeys: {
					// 				regular: '^([a-zA-Z_][a-zA-Z0-9_]{0,254})?$'
					// 			},
					// 			isCodeProperty: false
					// 		},
					// 		formatter: 'description',
					// 		'width': 150
					// 	},
					// 	'detail': {
					// 		'type': 'directive',
					// 		'model': 'VariableName',
					// 		'directive': 'basics-common-limit-input',
					// 		'options': {
					// 			validKeys: {
					// 				regular: '^([a-zA-Z_][a-zA-Z0-9_]{0,254})?$'
					// 			},
					// 			isCodeProperty: false
					// 		}
					// 	}
					// },
					'defaultvalue': {
						'grid': {
							'editor': 'dynamic',
							formatter: 'dynamic',
							domain: function (item, column) {
								var domain;
								if (item.IsLookup === true) {
									domain = 'lookup';
									column.field = 'DefaultValue';

									column.editorOptions = {
										lookupDirective: 'construction-system-master-parameter-value-lookup',
										lookupType: 'CosParameterValueLookup',
										dataServiceName: 'cosParameterValueLookupService',
										valueMember: 'Id',
										displayMember: 'DescriptionInfo.Translated',
										showClearButton: true
									};

									column.formatterOptions = {
										lookupType: 'CosParameterValueLookup',
										dataServiceName: 'cosParameterValueLookupService',
										displayMember: 'DescriptionInfo.Translated',
										'valueMember': 'Id'
									};
								}
								else {
									switch (item.CosParameterTypeFk) {
										case parameterDataTypes.Integer:
											domain = 'integer';
											column.DefaultValue = null;
											column.field = 'DefaultValue';
											column.editorOptions = null;
											column.formatterOptions = null;

											break;
										case parameterDataTypes.Decimal1:
											domain = 'decimal';
											column.DefaultValue = null;
											column.field = 'DefaultValue';
											column.editorOptions = { decimalPlaces: 1 };
											column.formatterOptions = { decimalPlaces: 1 };

											break;
										case parameterDataTypes.Decimal2:
											domain = 'decimal';
											column.DefaultValue = null;
											column.field = 'DefaultValue';
											column.editorOptions = { decimalPlaces: 2 };
											column.formatterOptions = { decimalPlaces: 2 };

											break;
										case parameterDataTypes.Decimal3:
											domain = 'decimal';
											column.DefaultValue = null;
											column.field = 'DefaultValue';
											column.editorOptions = { decimalPlaces: 3 };
											column.formatterOptions = { decimalPlaces: 3 };


											break;
										case parameterDataTypes.Decimal4:
											domain = 'decimal';
											column.DefaultValue = null;
											column.field = 'DefaultValue';
											column.editorOptions = { decimalPlaces: 4 };
											column.formatterOptions = { decimalPlaces: 4 };

											break;
										case parameterDataTypes.Decimal5:
											domain = 'decimal';
											column.DefaultValue = null;
											column.field = 'DefaultValue';
											column.editorOptions = { decimalPlaces: 5 };
											column.formatterOptions = { decimalPlaces: 5 };

											break;
										case parameterDataTypes.Decimal6:
											domain = 'decimal';
											column.DefaultValue = null;
											column.field = 'DefaultValue';
											column.editorOptions = { decimalPlaces: 6 };
											column.formatterOptions = { decimalPlaces: 6 };

											break;
										case 7:
										case 8:
										case 9:
											break;
										case parameterDataTypes.Boolean:
											domain = 'boolean';
											column.DefaultValue = null;
											column.field = 'DefaultValue';
											column.editorOptions = null;
											column.formatterOptions = null;
											break;
										case parameterDataTypes.Date:
											domain = 'dateutc';
											column.DefaultValue = null;
											column.field = 'DefaultValue';
											column.editorOptions = null;
											column.formatterOptions = null;

											break;
										case parameterDataTypes.Text:
											domain = 'description';
											column.DefaultValue = null;
											column.field = 'DefaultValue';
											column.editorOptions = null;
											// column.maxLength= 255;
											column.formatterOptions = null;

											break;
										default:
											domain = 'description';
											column.DefaultValue = null;
											column.field = 'DefaultValue';
											column.editorOptions = null;
											column.formatterOptions = null;
											break;
									}
								}
								return domain;
							},
							'width': 150
						},
						'detail': {
							'type': 'directive',
							'directive': 'construction-system-master-dynamic-type-value-control',
							'options': {
								rid: 'defaultvalue',
								model: 'DefaultValue',
								rowTypeFields: {
									isLookup: 'IsLookup',
									parameterType: 'CosParameterTypeFk'
								},
								watchFields: ['IsLookup', 'CosParameterTypeFk'],
								lookupDirective: 'construction-system-master-parameter-value-lookup'
							}
						}
					},
					'propertyname': {
						'detail': {
							'type': 'directive',
							'directive': 'construction-system-common-model-object-property-combobox',
							'options': {
								showClearButton: true,
								isTextEditable: true
							}
						},
						'grid': {
							editor: 'lookup',
							editorOptions: {
								lookupOptions: {
									showClearButton: true,
									isTextEditable: true
								},
								directive: 'construction-system-common-model-object-property-combobox'
							}
						}
					},
					'aggregatetype': {
						'detail': {
							'type': 'directive',
							'directive': 'construction-system-master-parameter-aggregate-type-lookup'
						},
						'grid': {
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'constructionSystemMasterAggregateType',
								displayMember: 'Description',
								dataServiceName: 'cosParameterAggregateTypeLookupService'
							},
							editor: 'lookup',
							editorOptions: {
								directive: 'construction-system-master-parameter-aggregate-type-lookup',
								'lookupOptions': {
									'valueMember': 'Id'
								}
							},
							'width': 150
						}
					}
				},
				'addition': {
					'grid': [

					]
				}
			};
		}
	]);

	// Controlling Group
	angular.module(moduleName).factory('constructionSystemMasterControllingGroupDetailLayout', ['basicsLookupdataConfigGenerator',
		function (basicsLookupdataConfigGenerator) {
			return {
				'fid': 'constructionsystem.master.controllinggroup.detail',
				'version': '1.1.0',
				'showGrouping': true,
				'addValidationAutomatically': true,
				'groups': [
					{
						'gid': 'basicData',
						'attributes': ['code', 'commenttext', 'mdccontrollinggroupfk', 'mdccontrollinggroupdetailfk']
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],
				'translationInfos': {
					'extraModules': [moduleName],
					'extraWords': {
						MdcControllingGroupFk: { location: moduleName, identifier: 'entityMdcControllingGroupFk', initial: 'Controlling Group' },
						MdcControllingGroupDetailFk: { location: moduleName, identifier: 'entityMdcControllingGroupDetailFk', initial: 'Controlling Group Detail' },
						CommentText: { location: cloudCommonModule, identifier: 'entityCommentText', initial: 'Comment' }
					}
				},
				'overloads': {
					'mdccontrollinggroupfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig(
						{
							dataServiceName: 'basicsCustomControlingGroupLookupDataService',
							enableCache: true,
							desMember: 'DescriptionInfo.Translated',
							isComposite: true
						}, {
							required: true
						}),
					'mdccontrollinggroupdetailfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig(
						{
							dataServiceName: 'controllingGroupDetailLookupDataService',
							filter: function (item) {
								return item && item.MdcControllingGroupFk ? item.MdcControllingGroupFk : null;
							},
							desMember: 'DescriptionInfo.Translated',
							isComposite: true,
							showClearButton: false,
							enableCache: true
						}, {
							required: true
						})
				},
				'addition': {
					'grid': [

					]
				}
			};
		}
	]);

	// Activity Template
	angular.module(moduleName).factory('constructionSystemMasterActivityTemplateDetailLayout', ['basicsLookupdataConfigGenerator',
		function (basicsLookupdataConfigGenerator) {
			return {
				'fid': 'constructionsystem.master.activitytemplate.detail',
				'version': '1.1.0',
				'showGrouping': true,
				'addValidationAutomatically': true,
				'groups': [
					{
						'gid': 'basicData',
						'attributes': ['code', 'commenttext', 'activitytemplatefk']
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],
				'translationInfos': {
					'extraModules': [moduleName, cloudCommonModule, schedulingMainModule],
					'extraWords': {
						ActivityTemplateFk: { location: moduleName, identifier: 'entityActivityTemplateFk', initial: 'Activity Template' },
						CommentText: { location: cloudCommonModule, identifier: 'entityCommentText', initial: 'Comment' }
					}
				},
				'overloads': {
					'activitytemplatefk': {
						'grid': {
							'formatter': 'lookup',
							'formatterOptions': {
								'lookupType': 'activitytemplatefk',
								'displayMember': 'Code'
							},
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'scheduling-activity-template-lookup-dialog'
							}
						},
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								'lookupDirective': 'scheduling-activity-template-lookup-dialog',
								'descriptionMember': 'DescriptionInfo.Translated',
								'lookupOptions': {
								}
							}
						}
					}
				},
				'addition': {
					'grid': [
						{
							'afterId': 'activitytemplatefk',
							'id': 'activitytemplateDescription',
							'lookupDisplayColumn': true,
							'field': 'ActivityTemplateFk',
							'name$tr$': 'constructionsystem.master.entityActivityTemplateDescription',
							'sortable': true,
							'displayMember': 'DescriptionInfo.Translated',
							'width': 145
						},
						basicsLookupdataConfigGenerator.provideGenericLookupConfigForGrid({
							lookupName: 'basics.customize.schedulemethod',
							att2BDisplayed:  'Description',
							readOnly: true,
							confObj: {
								id: 'schedulingMethodFk',
								field: 'ActivityTemplate.SchedulingMethodFk',
								name: 'Scheduling Method',
								name$tr$: 'scheduling.main.schedulingMethod'
							}
						}),
						basicsLookupdataConfigGenerator.provideGenericLookupConfigForGrid({
							lookupName: 'basics.customize.tasktype',
							att2BDisplayed:  'Description',
							readOnly: true,
							confObj: {
								id: 'TaskTypeFk',
								field: 'ActivityTemplate.TaskTypeFk',
								name: 'Task Type',
								name$tr$: 'cloud.common.entityType'
							}
						}),
						basicsLookupdataConfigGenerator.provideGenericLookupConfigForGrid({
							lookupName: 'basics.customize.constrainttype',
							att2BDisplayed:  'Description',
							readOnly: true,
							confObj: {
								id: 'ConstraintTypeFk',
								field: 'ActivityTemplate.ConstraintTypeFk',
								name: 'Constraint Type',
								name$tr$: 'scheduling.main.constraint'
							}
						}),
						basicsLookupdataConfigGenerator.provideGenericLookupConfigForGrid({
							lookupName: 'basics.customize.activitypresentation',
							att2BDisplayed:  'Description',
							readOnly: true,
							confObj: {
								id: 'ActivityPresentationFk',
								field: 'ActivityTemplate.ActivityPresentationFk',
								name: 'Activity Presentation',
								name$tr$: 'scheduling.main.activityPresented'
							}
						}),
						basicsLookupdataConfigGenerator.provideGenericLookupConfigForGrid({
							lookupName: 'basics.customize.progressreportmethod',
							att2BDisplayed:  'Description',
							readOnly: true,
							confObj: {
								id: 'ProgressReportMethodFk',
								field: 'ActivityTemplate.ProgressReportMethodFk',
								name: 'Progress Report Method',
								name$tr$: 'scheduling.main.progressReportMethod'
							}
						}),
						{
							id: 'QuantityUoMFk',
							field: 'ActivityTemplate.QuantityUoMFk',
							name: 'Quantity Uom',
							name$tr$: 'cloud.common.entityUoM',
							formatter: 'lookup',
							formatterOptions: {
								'lookupType': 'basicsUnitLookupDataService',
								'dataServiceName': 'basicsUnitLookupDataService',
								'displayMember': 'Unit'
							}
						},
						{
							id: 'Perf1UoMFk',
							field: 'ActivityTemplate.Perf1UoMFk',
							name: 'Perf1Uom',
							name$tr$: 'scheduling.main.perfUoM',
							name$tr$param$:{
								number: 1
							},
							formatter: 'lookup',
							formatterOptions: {
								'lookupType': 'basicsUnitLookupDataService',
								'dataServiceName': 'basicsUnitLookupDataService',
								'displayMember': 'Unit'
							}
						},
						{
							id: 'Perf2UoMFk',
							field: 'ActivityTemplate.Perf2UoMFk',
							name: 'Perf2Uom',
							name$tr$: 'scheduling.main.perfUoM',
							name$tr$param$:{
								number: 2
							},
							formatter: 'lookup',
							formatterOptions: {
								'lookupType': 'basicsUnitLookupDataService',
								'dataServiceName': 'basicsUnitLookupDataService',
								'displayMember': 'Unit'
							}
						},
						{
							lookupDisplayColumn: true,
							id: 'specification',
							field: 'ActivityTemplateFk',
							name: 'Specification',
							name$tr$: 'cloud.common.EntitySpec',
							'displayMember': 'Specification',
							'width': 145
						},
						{
							lookupDisplayColumn: true,
							id: 'controllingunittemplate',
							field: 'ActivityTemplateFk',
							name: 'Controlling Unit Template',
							name$tr$: 'constructionsystem.master.controllingUnitTemplate',
							'displayMember': 'ControllingUnitTemplate',
							'width': 145
						},
						{
							lookupDisplayColumn: true,
							id: 'performancefactor',
							field: 'ActivityTemplateFk',
							name: 'Performance Factor',
							name$tr$: 'scheduling.main.performanceFactor',
							'displayMember': 'PerformanceFactor',
							'width': 145
						}
					],
					'detail': [
						basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm('basics.customize.schedulemethod', 'Description', {
							gid: 'basicData',
							rid: 'SchedulingMethodFk',
							model: 'ActivityTemplate.SchedulingMethodFk',
							label: 'Scheduling Method',
							label$tr$: 'scheduling.main.schedulingMethod',
							readonly: true
						}),
						basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm('basics.customize.tasktype', 'Description', {
							gid: 'basicData',
							rid: 'TaskTypeFk',
							model: 'ActivityTemplate.TaskTypeFk',
							label: 'Task Type',
							label$tr$: 'cloud.common.entityType',
							readonly: true
						}),
						basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm('basics.customize.constrainttype', 'Description', {
							gid: 'basicData',
							rid: 'ConstraintTypeFk',
							model: 'ActivityTemplate.ConstraintTypeFk',
							label: 'Constraint Type',
							label$tr$: 'scheduling.main.constraint',
							readonly: true
						}),
						basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm('basics.customize.activitypresentation', 'Description', {
							gid: 'basicData',
							rid: 'ActivityPresentationFk',
							model: 'ActivityTemplate.ActivityPresentationFk',
							label: 'Activity Presentation',
							label$tr$: 'scheduling.main.activityPresented',
							readonly: true
						}),
						basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm('basics.customize.progressreportmethod', 'Description', {
							gid: 'basicData',
							rid: 'ProgressReportMethodFk',
							model: 'ActivityTemplate.ProgressReportMethodFk',
							label: 'Progress Report Method',
							label$tr$: 'scheduling.main.progressReportMethod',
							readonly: true
						}),
						basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({dataServiceName: 'basicsUnitLookupDataService'},{
							'rid': 'QuantityUoMFk',
							'gid': 'basicData',
							'model': 'ActivityTemplate.QuantityUoMFk',
							'label': 'Quantity Uom',
							'label$tr$': 'cloud.common.entityUoM',
							'readonly': true
						}),
						basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({dataServiceName: 'basicsUnitLookupDataService'},{
							'rid': 'Perf1UoMFk',
							'gid': 'basicData',
							'model': 'ActivityTemplate.Perf1UoMFk',
							'label': 'perfUoM',
							'label$tr$': 'scheduling.main.perfUoM',
							'label$tr$param$': {number: 1},
							'readonly': true
						}),
						basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({dataServiceName: 'basicsUnitLookupDataService'},{
							'rid': 'Perf2UoMFk',
							'gid': 'basicData',
							'model': 'ActivityTemplate.Perf2UoMFk',
							'label': 'Perf2Uom',
							'label$tr$': 'scheduling.main.perfUoM',
							'label$tr$param$': {number: 2},
							'readonly': true
						}),
						{
							'rid': 'specification',
							'gid': 'basicData',
							'model': 'ActivityTemplateFk',
							'label': 'specification',
							'label$tr$': 'cloud.common.EntitySpec',
							'type': 'directive',
							'directive': 'scheduling-activity-template-lookup-dialog',
							'options': {
								displayMember: 'Specification',
								readOnly: true
							}
						},
						{
							'afterId': 'specification',
							'rid': 'controllingunittemplate',
							'gid': 'basicData',
							'model': 'ActivityTemplateFk',
							'label': 'Controlling Unit Template',
							'label$tr$': 'constructionsystem.master.controllingUnitTemplate',
							'type': 'directive',
							'directive': 'scheduling-activity-template-lookup-dialog',
							'options': {
								displayMember: 'ControllingUnitTemplate',
								readOnly: true
							}
						},
						{
							'rid': 'performancefactor',
							'gid': 'basicData',
							'model': 'ActivityTemplateFk',
							'label': 'Performance Factor',
							'label$tr$': 'scheduling.main.performanceFactor',
							'type': 'directive',
							'directive': 'scheduling-activity-template-lookup-dialog',
							'options': {
								displayMember: 'PerformanceFactor',
								readOnly: true
							}
						}
					]
				}
			};
		}
	]);

	// Assembly
	angular.module(moduleName).factory('constructionSystemMasterAssemblyDetailLayout', [
		function () {
			return {
				'fid': 'constructionsystem.master.assembly.detail',
				'version': '1.1.0',
				'showGrouping': true,
				'addValidationAutomatically': true,
				'groups': [
					{
						'gid': 'basicData',
						'attributes': ['code', 'commenttext', 'estlineitemfk', 'estassemblycatfk']
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],
				'translationInfos': {
					'extraModules': [moduleName, cloudCommonModule],
					'extraWords': {
						CommentText: { location: cloudCommonModule, identifier: 'entityCommentText', initial: 'Comment' },
						EstLineItemFk: { location: moduleName, identifier: 'entityEstLineItemFk', initial: 'Est LineItem Code' },
						EstAssemblyCatFk: { location: moduleName, identifier: 'entityEstAssemblyCatFk', initial: 'Est Assembly Cat Code' }
					}
				},
				'overloads': {
					'estlineitemfk': {
						detail: {
							type: 'directive',
							model: 'EstLineItemFk',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								'lookupDirective': 'estimate-main-assembly-template-lookup',
								'descriptionMember': 'DescriptionInfo.Translated',
								'lookupOptions': {

								}
							}
						},
						grid: {
							editor: 'lookup',
							editorOptions: {
								directive: 'estimate-main-assembly-template-lookup'
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'estassemblyfk',
								displayMember: 'Code'
							}
						}
					},
					'estassemblycatfk': {
						detail: {
							type: 'directive',
							model: 'EstAssemblyCatFk',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								'lookupDirective': 'construction-system-master-est-assembly-cat-lookup',
								'descriptionMember': 'DescriptionInfo.Translated',
								'lookupOptions': {

								}
							}
						},
						grid: {
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'estassemblycat',
								displayMember: 'Code'
							}
						}

					}
				},
				'addition': {
					'grid': [
						{
							'afterId': 'estlineitemfk',
							'id': 'estLineItemDescription',
							'lookupDisplayColumn': true,
							'field': 'EstLineItemFk',
							'name$tr$': 'constructionsystem.master.entityEstLineItemDescription',
							'sortable': true,
							'displayMember': 'DescriptionInfo.Translated',
							'width': 145
						},
						{
							'afterId': 'estassemblycatfk',
							'id': 'estAssemblyCatDescription',
							'lookupDisplayColumn': true,
							'field': 'EstAssemblyCatFk',
							'name$tr$': 'constructionsystem.master.entityEstAssemblyCatDescription',
							'sortable': true,
							'displayMember': 'DescriptionInfo.Translated',
							'width': 145
						}
					]
				}
			};
		}
	]);

	// Parameter Group
	angular.module(moduleName).factory('constructionSystemMasterParameterGroupDetailLayout', [
		function () {
			return {
				'fid': 'constructionsystem.master.parametergroup.detail',
				'version': '1.1.0',
				'showGrouping': true,
				'addValidationAutomatically': true,
				'groups': [
					{
						'gid': 'basicData',
						'attributes': ['descriptioninfo', 'isdefault', 'sorting']
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],
				'translationInfos': {
					'extraModules': [moduleName],
					'extraWords': {
						Sorting: { location: cloudCommonModule, identifier: 'entitySorting', initial: 'Sorting' },
						IsDefault: { location: cloudCommonModule, identifier: 'entityIsDefault', initial: 'Is Default' }
					}
				},
				'overloads': {
				}
			};
		}
	]);

	// Parameter value
	angular.module(moduleName).factory('constructionSystemMasterParameterValueDetailLayout', ['constructionSystemMasterParameterDataService', 'parameterDataTypes',
		function (parentService, parameterDataTypes) {
			return {
				'fid': 'constructionsystem.master.parametervalue.detail',
				'version': '1.1.0',
				'showGrouping': true,
				'addValidationAutomatically': true,
				'groups': [
					{
						'gid': 'basicData',
						'attributes': ['descriptioninfo', 'parametervalue', 'isdefault', 'sorting']
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],
				'translationInfos': {
					'extraModules': [moduleName],
					'extraWords': {
						ParameterValue: { location: cloudCommonModule, identifier: 'entityParameterValue', initial: 'ParameterValue' },
						Sorting: { location: cloudCommonModule, identifier: 'entitySorting', initial: 'Sorting' },
						IsDefault: { location: cloudCommonModule, identifier: 'entityIsDefault', initial: 'Is Default' }
					}
				},
				'overloads': {
					'parametervalue': {
						'grid': {
							'editor': 'dynamic',
							formatter: 'dynamic',
							domain: function (item, column) {
								var domain;
								var ParameterType;
								if (angular.isDefined((parentService.getSelected() || {}).CosParameterTypeFk)) {
									ParameterType = parentService.getSelected().CosParameterTypeFk;
								}
								else {
									ParameterType = null;
								}
								switch (ParameterType) {
									case parameterDataTypes.Integer:
										domain = 'integer';
										column.field = 'ParameterValue';
										column.editorOptions = null;
										column.formatterOptions = null;

										break;
									case parameterDataTypes.Decimal1:
										domain = 'money';
										column.field = 'ParameterValue';
										column.editorOptions = { decimalPlaces: 1 };
										column.formatterOptions = { decimalPlaces: 1 };

										break;
									case parameterDataTypes.Decimal2:
										domain = 'money';
										column.field = 'ParameterValue';
										column.editorOptions = { decimalPlaces: 2 };
										column.formatterOptions = { decimalPlaces: 2 };

										break;
									case parameterDataTypes.Decimal3:
										domain = 'decimal';
										column.field = 'ParameterValue';
										column.editorOptions = { decimalPlaces: 3 };
										column.formatterOptions = { decimalPlaces: 3 };


										break;
									case parameterDataTypes.Decimal4:
										domain = 'exchangerate';
										column.field = 'ParameterValue';
										column.editorOptions = { decimalPlaces: 4 };
										column.formatterOptions = { decimalPlaces: 4 };

										break;
									case parameterDataTypes.Decimal5:
										domain = 'exchangerate';
										column.field = 'ParameterValue';
										column.editorOptions = { decimalPlaces: 5 };
										column.formatterOptions = { decimalPlaces: 5 };

										break;
									case parameterDataTypes.Decimal6:
										domain = 'factor';
										column.field = 'ParameterValue';
										column.editorOptions = { decimalPlaces: 6 };
										column.formatterOptions = { decimalPlaces: 6 };

										break;
									case 7:
									case 8:
									case 9:
										break;
									case parameterDataTypes.Boolean:
										domain = 'boolean';
										column.field = 'ParameterValue';
										column.editorOptions = null;
										column.formatterOptions = null;
										break;
									case parameterDataTypes.Date:
										domain = 'dateutc';
										column.field = 'ParameterValue';
										column.editorOptions = null;
										column.formatterOptions = null;

										break;
									case parameterDataTypes.Text:
										domain = 'description';
										column.field = 'ParameterValue';
										column.editorOptions = null;
										// column.maxLength= 255;
										column.formatterOptions = null;

										break;
									default:
										domain = 'integer';
										column.field = 'ParameterValue';
										column.editorOptions = null;
										column.formatterOptions = null;
										break;
								}
								return domain;
							},
							'width': 150
						},
						'detail': {
							'type': 'directive',
							'directive': 'construction-system-master-dynamic-type-value-control',
							'options': {
								rid: 'parametervalue',
								useParent: true,
								model: 'ParameterValue',
								rowTypeFields: {
									parameterType: 'CosParameterTypeFk'
								},
								watchFields: ['CosParameterTypeFk']
							}
						}
					}
				}
			};
		}
	]);

	// WIC
	angular.module(moduleName).factory('constructionSystemMasterWicDetailLayout', [
		function () {
			return {
				'fid': 'constructionsystem.master.wic.detail',
				'version': '1.1.0',
				'showGrouping': true,
				'addValidationAutomatically': true,
				'groups': [
					{
						'gid': 'basicData',
						'attributes': ['code', 'commenttext', 'boqitemfk', 'boqwiccatboqfk']
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],
				'translationInfos': {
					'extraModules': [moduleName, cloudCommonModule],
					'extraWords': {
						CommentText: { location: cloudCommonModule, identifier: 'entityCommentText', initial: 'Comment' },
						BoqItemFk: { location: moduleName, identifier: 'entityBoqItemFk', initial: 'BoqItem Reference' },
						BoqWicCatBoqFk: { location: moduleName, identifier: 'entityBoqWicCatBoqFk', initial: 'Boq Wic Cat Boq' }
					}
				},
				'overloads': {
					'boqitemfk': {
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								'lookupDirective': 'construction-system-master-wic-boq-item-lookup',
								'descriptionMember': 'BriefInfo.Translated',
								'lookupOptions': {

								}
							}
						},
						grid: {
							editor: 'lookup',
							editorOptions: {
								lookupDirective: 'construction-system-master-wic-boq-item-lookup'
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'boqitemfk',
								displayMember: 'Reference'
							}
						}
					},
					'boqwiccatboqfk': {
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								'lookupDirective': 'construction-system-master-wic-cat-lookup',
								'descriptionMember': 'WicBoqCat.DescriptionInfo.Translated',
								'lookupOptions': {

								}
							}
						},
						grid: {
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'BoqWicCatBoqFk',
								displayMember: 'WicBoqCat.Code'
							}
						}
					}
				},
				'addition': {
					'grid': [
						{
							'afterId': 'boqitemfk',
							'id': 'boqItemBrief',
							'lookupDisplayColumn': true,
							'field': 'BoqItemFk',
							'name$tr$': 'constructionsystem.master.boqItemBrief',
							'sortable': true,
							'displayMember': 'BriefInfo.Translated',
							'width': 145
						},
						{
							'afterId': 'boqwiccatboqfk',
							'id': 'boqWicCatDescription',
							'lookupDisplayColumn': true,
							'field': 'BoqWicCatBoqFk',
							'name$tr$': 'constructionsystem.master.entityBoqWicCatDescription',
							'sortable': true,
							'displayMember': 'WicBoqCat.DescriptionInfo.Translated',
							'width': 145
						}
					]
				}

			};
		}
	]);

	// Test Input
	angular.module(moduleName).factory('constructionSystemMasterTestInputDetailLayout', [
		'basicsLookupdataConfigGenerator',
		function (basicsLookupdataConfigGenerator) {
			return {
				'fid': 'constructionsystem.master.testinput.detail',
				'version': '1.1.0',
				'showGrouping': true,
				'addValidationAutomatically': true,
				'groups': [
					{
						'gid': 'context',
						'attributes': ['projectfk', 'cosinsheaderfk','modelfk', 'estheaderfk', 'psdschedulefk', 'boqheaderfk']
					}
				],
				'translationInfos': {
					'extraModules': [moduleName, modelMainModule, schedulingScheduleModule, estimateMainModule],
					'extraWords': {
						context: { location: moduleName, identifier: 'context', initial: 'Context' },
						validation: { location: moduleName, identifier: 'validation', initial: 'Validation' },
						ProjectFk: { location: moduleName, identifier: 'entityProjectFk', initial: 'Project' },
						CosInsHeaderFk: {location: moduleName, identifier: 'entityCosInsHeaderFk', initial: 'Cos Instance Header'},
						ModelFk: { location: modelMainModule, identifier: 'entityModel', initial: 'Model' },
						EstHeaderFk: {location: moduleName, identifier: 'entityEstHeaderFk', initial: 'Estimate Header'},
						PsdScheduleFk: {location: schedulingScheduleModule, identifier: 'entitySchedule', initial: 'Schedule'},
						BoqHeaderFk:{ location: estimateMainModule, identifier: 'boqHeaderFk', initial: 'Boq' },
						ValidateScriptData: { location: moduleName, identifier: 'entityValidateScriptData', initial: 'Script' }
					}
				},
				overloads: {
					'projectfk': {
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'basics-lookup-data-project-project-dialog',
								descriptionMember: 'ProjectName',
								lookupOptions: {
									initValueField: 'ProjectNo',
									showClearButton: true
								}
							}
						}
					},
					'cosinsheaderfk': {
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								enableCache:true,
								lookupDirective: 'construction-system-project-instance-header-lookup',
								descriptionMember: 'Description',
								lookupOptions: {
									initValueField: 'Code',
									showClearButton: true,
									filterKey: 'constructionsystem-master-testinput-projectfk-filter'
								}
							}
						}
					},
					'estheaderfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'estimateMainHeaderLookupDataService',
						desMember:'DescriptionInfo.Translated',
						isComposite: true,
						readonly: true,
						filter: function (item) {
							return item.ProjectFk;
						}
					}),
					'modelfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'modelProjectModelLookupDataService',
						desMember:'Description',
						isComposite: true,
						readonly: true,
						filter: function (item) {
							return item.ProjectFk;
						}
					}),
					'psdschedulefk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'schedulingLookupScheduleDataService',
						desMember:'DescriptionInfo.Translated',
						isComposite: true,
						readonly: true,
						filter: function (item) {
							return (item.ProjectFk !== null && item.ProjectFk !== undefined) ? item.ProjectFk : -1;
						}
					}),
					'boqheaderfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'boqProjectLookupDataService',
						desMember:'BoqRootItem.Reference2',
						isComposite: true,
						readonly: true,
						filter: function (item) {
							return item.ProjectFk !== null ? item.ProjectFk : -1;
						}
					})
				},
				addition: {}
			};
		}
	]);

	// Model Object //todo:replace with model.main ui
	angular.module(moduleName).factory('constructionSystemMasterModelObjectDetailLayout', ['basicsLookupdataConfigGenerator','constructionSystemMasterTestDataService',
		function (basicsLookupdataConfigGenerator,constructionSystemMasterTestDataService) {
			function getProjectId() {
				var data = constructionSystemMasterTestDataService.getCurrentEntity();
				var projectId = data && data.ProjectFk ? data.ProjectFk : null;
				return projectId ? projectId.toString() : '-1';
			}

			return {
				fid: 'model.main.modelobjectdetailform1',
				version: '1.0.0',
				addValidationAutomatically: true,
				showGrouping: true,
				groups: [
					{
						'gid': 'baseGroup',
						'attributes': ['objectfk', 'modelfk', 'description', 'meshid', 'cpiid', 'cadidint', 'isnegative', 'iscomposite', 'isdeleted']
					},
					{
						'gid': 'referenceGroup',
						'attributes': ['controllingunitfk']
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],
				overloads: {
					cpiid: {
						readonly: true
					},
					meshid: {
						readonly: true
					},
					cadidint: {
						readonly: true
					},
					isnegative: {
						readonly: true
					},
					isdeleted: {
						readonly: true
					},
					description: {readonly: true},
					iscomposite: {readonly: true},
					containerfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'modelMainContainerLookupDataService',
						enableCache: true,
						filter: function (item) {
							return item.ModelFk;
						},
						readonly: true
					}),
					objectfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'modelMainObjectLookupDataService',
						enableCache: true,
						filter: function (item) {
							return item.ModelFk;
						},
						additionalColumns: true,
						readonly: true
					}),
					modelfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'modelProjectModelLookupDataService',
						enableCache: true,
						filter: function (item) {
							return getProjectId(item);
						},
						readonly: true
					}),
					controllingunitfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'controllingStructureUnitLookupDataService',
						filter: function (item) {
							return getProjectId(item);
						},
						enableCache: true,
						readonly: true
					}),
					locationfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'projectLocationLookupDataService',
						filter: function (item) {
							return getProjectId(item);
						},
						enableCache: true,
						readonly: true
					})
				}
			};
		}
	]);

	// Test Parameter Input Grid
	angular.module(moduleName).factory('constructionSystemMasterTestParameterInputDetailLayout', ['parameterDataTypes',
		function (parameterDataTypes) {
			return {
				'fid': 'constructionsystem.master.test.parameter.input.detail',
				'version': '1.0.0',
				'addValidationAutomatically': true,
				'showGrouping': true,
				'groups': [
					{
						'gid': 'basicData',
						'attributes': ['descriptioninfo', 'variablename', 'value', 'uomfk', 'propertyname', 'quantityqueryinfo', 'basformfieldfk']
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],
				'translationInfos': {
					'extraModules': [moduleName, cloudCommonModule],
					'extraWords': {
						VariableName: { location: moduleName, identifier: 'entityVariableName', initial: 'VariableName' },
						Value: { location: moduleName, identifier: 'entityValue', initial: 'Value' },
						UomFk: { location: moduleName, identifier: 'entityUomFk', initial: 'UoM' },
						PropertyName: { location: moduleName, identifier: 'entityPropertyName', initial: 'PropertyName' },
						QuantityQuery: { location: moduleName, identifier: 'entityQuantityQuery', initial: 'QuantityQuery' },
						QuantityQueryInfo: { location: moduleName, identifier: 'entityQuantityQueryInfoDescription', initial: 'Quantity Query' },
						BasFormFieldFk: { location: moduleName, identifier: 'entityFormFieldFk', initial: 'FormFieldFk' }
					}
				},
				'overloads': {
					'descriptioninfo': {
						'readonly': 'true'
					},
					'propertyname': {
						'readonly': 'true'
					},
					'quantityqueryinfo': {
						'readonly': 'true'
					},
					'uomfk': {
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-uom-lookup'
						},
						'grid': {
							editor: 'lookup',
							editorOptions: {
								lookupDirective: 'basics-lookupdata-uom-lookup',
								lookupOptions: {
									isFastDataRecording: true
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'uom',
								displayMember: 'Unit'
							}
						},
						'readonly': 'true'
					},
					'basformfieldfk': {
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'basics-user-form-field-lookup',
								lookupOptions: {
									filterKey: 'basformfieldfk-for-construction-system-master-filter',
									showClearButton: true
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'userformfield',
								displayMember: 'FieldName'
							},
							'width': 150
						},
						'detail': {
							'type': 'directive',
							'directive': 'basics-user-form-field-lookup',
							'options': {
								'filterKey': 'basformfieldfk-for-construction-system-master-filter',
								'showClearButton': true
							}
						},
						'readonly': 'true'
					},
					'variablename': {
						'grid': {
							'editor': 'directive',
							'editorOptions': {
								'directive': 'basics-common-limit-input',
								validKeys: {
									regular: '^[a-zA-Z_][a-zA-Z0-9_]*$'
								},
								isCodeProperty: false
							},
							formatter: 'description',
							'width': 150
						},
						'detail': {
							'type': 'directive',
							'model': 'VariableName',
							'directive': 'basics-common-limit-input',
							'options': {
								validKeys: {
									regular: '^[a-zA-Z_][a-zA-Z0-9_]*$'
								},
								isCodeProperty: false
							}
						},
						'readonly': 'true'
					},
					'value': {
						'grid': {
							'editor': 'dynamic',
							formatter: 'dynamic',
							domain: function (item, column) {
								var domain;
								if (item.IsLookup === true && item.CosParameterTypeFk !== parameterDataTypes.Boolean) {
									domain = 'lookup';
									column.field = 'Value';
									column.editorOptions = {
										lookupDirective: 'construction-system-master-test-input-parameter-value-combobox',

										lookupType: 'ParameterValue',

										valueMember: 'Id',
										displayMember: 'DescriptionInfo.Translated',
										showClearButton: true
									};

									column.formatterOptions = {
										lookupType: 'ParameterValue',
										displayMember: 'DescriptionInfo.Translated',
										'valueMember': 'Id'
									};
								}
								else {
									switch (item.CosParameterTypeFk) {
										case parameterDataTypes.Integer:
											domain = 'integer';
											column.DefaultValue = 0;
											column.field = 'Value';
											column.editorOptions = null;
											column.formatterOptions = null;

											break;
										case parameterDataTypes.Decimal1:
											domain = 'decimal';
											column.DefaultValue = null;
											column.field = 'Value';
											column.editorOptions = { decimalPlaces: 1 };
											column.formatterOptions = { decimalPlaces: 1 };

											break;
										case parameterDataTypes.Decimal2:
											domain = 'decimal';
											column.DefaultValue = null;
											column.field = 'Value';
											column.editorOptions = { decimalPlaces: 2 };
											column.formatterOptions = { decimalPlaces: 2 };

											break;
										case parameterDataTypes.Decimal3:
											domain = 'decimal';
											column.DefaultValue = null;
											column.field = 'Value';
											column.editorOptions = { decimalPlaces: 3 };
											column.formatterOptions = { decimalPlaces: 3 };

											break;
										case parameterDataTypes.Decimal4:
											domain = 'decimal';
											column.DefaultValue = null;
											column.field = 'Value';
											column.editorOptions = { decimalPlaces: 4 };
											column.formatterOptions = { decimalPlaces: 4 };

											break;
										case parameterDataTypes.Decimal5:
											domain = 'decimal';
											column.DefaultValue = null;
											column.field = 'Value';
											column.editorOptions = { decimalPlaces: 5 };
											column.formatterOptions = { decimalPlaces: 5 };

											break;
										case parameterDataTypes.Decimal6:
											domain = 'decimal';
											column.DefaultValue = null;
											column.field = 'Value';
											column.editorOptions = { decimalPlaces: 6 };
											column.formatterOptions = { decimalPlaces: 6 };

											break;
										case 7:
										case 8:
										case 9:
											break;
										case parameterDataTypes.Boolean:
											domain = 'boolean';
											column.DefaultValue = null;
											column.field = 'Value';
											column.editorOptions = null;
											column.formatterOptions = null;
											break;
										case parameterDataTypes.Date:
											domain = 'dateutc';
											column.DefaultValue = null;
											column.field = 'Value';
											column.editorOptions = null;
											column.formatterOptions = null;

											break;
										case parameterDataTypes.Text:
											domain = 'description';
											column.DefaultValue = null;
											column.field = 'Value';
											column.editorOptions = null;
											column.maxLength= 255;
											column.formatterOptions = null;

											break;
										default:
											domain = 'description';
											column.DefaultValue = null;
											column.field = 'Value';
											column.editorOptions = null;
											column.formatterOptions = null;
											break;
									}
								}
								return domain;
							},
							'width': 150
						}
					}
				},
				'addition': {
					'grid': [

					]
				}
			};
		}
	]);

	// Template
	angular.module(moduleName).factory('constructionSystemMasterTemplateDetailLayout', [
		function () {
			return {
				'fid': 'constructionsystem.master.template.detail',
				'version': '1.1.0',
				'showGrouping': true,
				'addValidationAutomatically': true,
				'groups': [
					{
						'gid': 'basicData',
						'attributes': ['descriptioninfo', 'isdefault', 'sorting']
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],
				'translationInfos': {
					'extraModules': [moduleName],
					'extraWords': {
						Sorting: { location: cloudCommonModule, identifier: 'entitySorting', initial: 'Sorting' },
						IsDefault: { location: cloudCommonModule, identifier: 'entityIsDefault', initial: 'Is Default' }
					}
				}
			};
		}
	]);

	// Parameter to Template
	angular.module(moduleName).factory('constructionSystemMasterParameter2TemplateDetailLayout', ['parameterDataTypes',
		function (parameterDataTypes) {
			return {
				'fid': 'constructionsystem.master.parameter2template.detail',
				'version': '1.1.0',
				'showGrouping': true,
				'addValidationAutomatically': true,
				'groups': [
					{
						'gid': 'basicData',
						'attributes': ['cosparameterfk', /* 'costemplatefk', 'cosparametertypefk', */ 'cosdefaulttypefk', 'propertyname', 'defaultvalue']
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],
				'translationInfos': {
					'extraModules': [moduleName],
					'extraWords': {
						CosParameterFk:{location:cloudCommonModule,identifier:'entityDescription',initial: 'Description'},
						CosTemplateFk: { location: moduleName, identifier: 'entityTemplateFk', initial: 'Template' },
						CosParameterTypeFk: { location: moduleName, identifier: 'entityParameterTypeFk', initial: 'ParameterType' },
						CosDefaultTypeFk: { location: moduleName, identifier: 'entityDefaultTypeFk', initial: 'DefaultType' },
						PropertyName: { location: moduleName, identifier: 'entityPropertyName', initial: 'PropertyName' },
						DefaultValue: { location: moduleName, identifier: 'entityValue', initial: 'Value' }
					}
				},
				'overloads': {
					'cosparameterfk': {
						'readonly': true,
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'construction-system-master-parameter-lookup',
								lookupOptions: {
									// 'filterKey': 'parameterfk-for-construction-systemmain-instanceparameter-filter',
									// 'showClearButton': true
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'CosParameter',
								displayMember: 'DescriptionInfo.Translated'
							}
						},
						'detail': {
							'type': 'directive',
							'directive': 'construction-system-master-parameter-lookup',
							'options': {
								'readOnly': true
								// 'filterKey': 'parameterfk-for-construction-systemmain-instanceparameter-filter'
							}
						}
					},
					'cosdefaulttypefk': {
						'grid': {
							'formatter': 'lookup',
							'formatterOptions': {
								'lookupType': 'CosMasterDefaultType',
								'displayMember': 'Description'
							},
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'construction-system-master-default-type-lookup'
							}
						},
						'detail': {
							'type': 'directive',
							'directive': 'construction-system-master-default-type-lookup'
						}
					},
					'propertyname': {
						'detail': {
							'type': 'directive',
							'directive': 'construction-system-common-model-object-property-combobox',
							'options': {
								showClearButton: true,
								isTextEditable: true
							}
						},
						'grid': {
							editor: 'lookup',
							editorOptions: {
								lookupOptions: {
									showClearButton: true,
									isTextEditable: true
								},
								directive: 'construction-system-common-model-object-property-combobox'
							}
						}
					},
					'defaultvalue': {
						'grid': {
							'editor': 'dynamic',
							formatter: 'dynamic',
							domain: function (item, column) {
								var domain;
								if (item.IsLookup === true) {
									domain = 'lookup';
									column.field = 'DefaultValue';
									column.editorOptions = {
										// lookupDirective: 'construction-system-master-parameter-value-lookup',

										lookupDirective: 'construction-system-master-parameter2template-parameter-value-lookup',
										lookupType: 'CosMasterParameter2TemplateParameterValueLookup',

										// dataServiceName: 'cosParameterValueLookupService',
										valueMember: 'Id',
										displayMember: 'Description'
										// showClearButton: true,
										// 'lookupOptions': {
										// 'filterKey': 'parameter2template-parameter-value-filter',
										// showClearButton: true//,
										// 'lookupType': 'CosMasterParameter2TemplateParameterValueLookup'
										// }
									};

									column.formatterOptions = {
										lookupType: 'CosMasterParameter2TemplateParameterValueLookup',
										// dataServiceName: 'cosParameterValueLookupService',
										displayMember: 'Description',
										'valueMember': 'Id'
									};
								}
								else {
									column.DefaultValue = null;
									column.field = 'DefaultValue';
									column.editorOptions = null;
									column.formatterOptions = null;

									switch (item.CosParameterTypeFk) {
										case parameterDataTypes.Integer:
											domain = 'integer';
											break;
										case parameterDataTypes.Decimal1:
											domain = 'decimal';
											column.editorOptions = { decimalPlaces: 1 };
											column.formatterOptions = { decimalPlaces: 1 };
											break;
										case parameterDataTypes.Decimal2:
											domain = 'decimal';
											column.editorOptions = { decimalPlaces: 2 };
											column.formatterOptions = { decimalPlaces: 2 };
											break;
										case parameterDataTypes.Decimal3:
											domain = 'decimal';
											column.editorOptions = { decimalPlaces: 3 };
											column.formatterOptions = { decimalPlaces: 3 };
											break;
										case parameterDataTypes.Decimal4:
											domain = 'decimal';
											column.editorOptions = { decimalPlaces: 4 };
											column.formatterOptions = { decimalPlaces: 4 };
											break;
										case parameterDataTypes.Decimal5:
											domain = 'decimal';
											column.editorOptions = { decimalPlaces: 5 };
											column.formatterOptions = { decimalPlaces: 5 };
											break;
										case parameterDataTypes.Decimal6:
											domain = 'decimal';
											column.editorOptions = { decimalPlaces: 6 };
											column.formatterOptions = { decimalPlaces: 6 };
											break;
										case 7:
										case 8:
										case 9:
											break;
										case parameterDataTypes.Boolean:
											domain = 'boolean';
											break;
										case parameterDataTypes.Date:
											domain = 'dateutc';
											break;
										case parameterDataTypes.Text:
											domain = 'description';
											break;
										default:
											domain = 'description';
											break;
									}
								}
								return domain;
							},
							'width': 150
						},
						'detail': {
							'type': 'directive',
							'directive': 'construction-system-master-dynamic-type-value-control',
							'options': {
								rid: 'defaultvalue',
								model: 'DefaultValue',
								rowTypeFields: {
									isLookup: 'IsLookup',
									parameterType: 'CosParameterTypeFk'
								},
								watchFields: ['CosParameterTypeFk'],
								lookupDirective: 'construction-system-master-parameter2template-parameter-value-lookup'
							}
						}
					}
				},
				'addition': {
					'grid': extendGrouping([
						{
							afterId: 'cosparameterfk',
							lookupDisplayColumn: true,
							id: 'parametergroup',
							field: 'CosParameterFk',
							name: 'Parameter Group',
							name$tr$: 'cloud.common.entityGroup',
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'CosParameter',
								displayMember: 'ParameterGroupDescription'
							}
						},
						{
							afterId: 'cosparameterfk',
							lookupDisplayColumn: true,
							id: 'variablename',
							field: 'CosParameterFk',
							name: 'Variable Name',
							name$tr$: 'constructionsystem.master.entityVariableName',
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'CosParameter',
								displayMember: 'VariableName'
							}
						},
						{
							afterId: 'cosparameterfk',
							lookupDisplayColumn: true,
							id: 'uom',
							field: 'CosParameterFk',
							name: 'UoM',
							name$tr$: 'cloud.common.entityUoM',
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'CosParameter',
								displayMember: 'UoM'
							}
						},
						{
							'afterId': 'cosparameterfk',
							'lookupDisplayColumn': true,
							'id': 'parametertype',
							'field': 'CosParameterFk',
							'name': 'Parameter Type',
							'name$tr$': 'constructionsystem.master.entityParameterTypeFk',
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'CosParameter',
								displayMember: 'ParameterTypeDescription'
							}
						}
					]),
					'detail': [
						{
							'afterId': 'cosparameterfk',
							'lookupDisplayColumn': true,
							'gid': 'basicData',
							'rid': 'parametergroup',
							'model': 'CosParameterFk',
							'label': 'Parameter Group',
							'label$tr$': 'cloud.common.entityGroup',
							'type': 'directive',
							'directive': 'construction-system-master-parameter-lookup',
							'options': {
								displayMember: 'ParameterGroupDescription',
								readOnly: true
							}
						},
						{
							'afterId': 'cosparameterfk',
							'lookupDisplayColumn': true,
							'gid': 'basicData',
							'rid': 'variablename',
							'model': 'CosParameterFk',
							'label': 'Variable Name',
							'label$tr$': 'constructionsystem.master.entityVariableName',
							'type': 'directive',
							'directive': 'construction-system-master-parameter-lookup',
							'options': {
								displayMember: 'VariableName',
								readOnly: true
							}
						},
						{
							'afterId': 'cosparameterfk',
							'lookupDisplayColumn': true,
							'gid': 'basicData',
							'rid': 'uom',
							'model': 'CosParameterFk',
							'label': 'UoM',
							'label$tr$': 'cloud.common.entityUoM',
							'type': 'directive',
							'directive': 'construction-system-master-parameter-lookup',
							'options': {
								displayMember: 'UoM',
								readOnly: true
							}
						},
						{
							'afterId': 'cosparameterfk',
							'lookupDisplayColumn': true,
							'gid': 'basicData',
							'rid': 'parametertype',
							'model': 'CosParameterFk',
							'label': 'Parameter Type',
							'label$tr$': 'constructionsystem.master.entityParameterTypeFk',
							'type': 'directive',
							'directive': 'construction-system-master-parameter-lookup',
							'options': {
								displayMember: 'ParameterTypeDescription',
								readOnly: true
							}
						}
					]
				}
			};
		}
	]);

	// Cos group
	angular.module(moduleName).factory('constructionSystemMasterGroupDetailLayout', [function () {
		var detailLayout = {
			fid: 'constructionsystem.master.groupGrid',
			version: '1.0.0',
			showGrouping: true,
			addValidationAutomatically: true,
			groups: [
				{
					gid: 'basicData',
					attributes: ['code','descriptioninfo', 'isdefault', 'sorting']
				},
				{
					gid: 'entityHistory',
					isHistory: true
				}
			],
			overloads: {
				'filter': {
					id: 'marker',
					formatter: 'marker',
					field: 'IsMarked',
					name: 'Filter',
					name$tr$: 'constructionsystem.master.filterColumn',
					editor: 'marker',
					editorOptions: {
						serviceName: 'constructionSystemMasterGroupService',
						serviceMethod: 'getList',
						multiSelect: false
					}
				},
				'isdefault': {
					change:'setDefault'
				}
			},
			translationInfos: {
				extraModules: [moduleName],
				extraWords: {
					Filter: { location: moduleName, identifier: 'filter', initial: 'Filter' },
					Sorting: { location: moduleName, identifier: 'entitySorting', initial: 'Sorting'}
				}
			}
		};
		return detailLayout;
	}]);

	angular.module(moduleName).factory('constructionSystemMasterObject2ParamDetailLayout', ['parameterDataTypes', 'basicsLookupdataLookupDescriptorService',
		function(parameterDataTypes, basicsLookupdataLookupDescriptorService){ // done by clv

			var lookupGridDisplayColumns = [
				{
					afterId: 'parameterfk',
					lookupDisplayColumn: true,
					id: 'parametergroup',
					field: 'ParameterFk',
					name: 'Parameter Group',
					name$tr$: 'cloud.common.entityGroup',
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'CosParameter',
						displayMember: 'ParameterGroupDescription'
					}
				},
				{
					afterId: 'parameterfk',
					lookupDisplayColumn: true,
					id: 'variablename',
					field: 'ParameterFk',
					name: 'Variable Name',
					name$tr$: 'constructionsystem.master.entityVariableName',
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'CosParameter',
						displayMember: 'VariableName'
					}
				},
				{
					afterId: 'parameterfk',
					lookupDisplayColumn: true,
					id: 'uom',
					field: 'ParameterFk',
					name: 'UoM',
					name$tr$: 'cloud.common.entityUoM',
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'CosParameter',
						displayMember: 'UoM'
					}
				},
				{
					'afterId': 'parameterfk',
					'lookupDisplayColumn': true,
					'id': 'parametertype',
					'field': 'ParameterFk',
					'name': 'Parameter Type',
					'name$tr$': 'constructionsystem.master.entityParameterTypeFk',
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'CosParameter',
						displayMember: 'ParameterTypeDescription'
					}
				}
			];
			// var lookupDetailDisplayColumns = [
			// {
			//  'lookupDisplayColumn': true,
			//  'gid': 'baseGroup',
			//  'rid': 'parametergroup',
			//  'model': 'ParameterFk',
			//  'label': 'Parameter Group',
			//  'label$tr$': 'cloud.common.entityGroup',
			//  'type': 'directive',
			//  'directive': 'construction-system-master-parameter-lookup',
			//  'options': {
			//              displayMember: 'ParameterGroupDescription',
			//              readOnly: true
			// }
			// },
			// {
			//  'lookupDisplayColumn': true,
			//  'gid': 'baseGroup',
			//  'rid': 'variablename',
			//  'model': 'ParameterFk',
			//  'label': 'Variable Name',
			//  'label$tr$': 'constructionsystem.master.entityVariableName',
			//  'type': 'directive',
			//  'directive': 'construction-system-master-parameter-lookup',
			//  'options': {
			//  displayMember: 'VariableName',
			//  readOnly: true
			//  }
			//    },
			//    {
			//     'lookupDisplayColumn': true,
			//     'gid': 'baseGroup',
			//     'rid': 'uom',
			//     'model': 'ParameterFk',
			//     'label': 'UoM',
			//     'label$tr$': 'cloud.common.entityUoM',
			//     'type': 'directive',
			//     'directive': 'construction-system-master-parameter-lookup',
			//     'options': {
			//        displayMember: 'UoM',
			//        readOnly: true
			//     }
			//     },
			//    {
			//     'lookupDisplayColumn': true,
			//     'gid': 'baseGroup',
			//     'rid': 'parametertype',
			//     'model': 'ParameterFk',
			//     'label': 'Parameter Type',
			//     'label$tr$': 'constructionsystem.master.entityParameterTypeFk',
			//     'type': 'directive',
			//     'directive': 'construction-system-master-parameter-lookup',
			//      'options': {
			//       displayMember: 'ParameterTypeDescription',
			//          readOnly: true
			//     }
			//     }
			// ];
			return{

				fid: 'constructionsystem.master.object2parameter.detail',
				version: '1.0.0',
				showGrouping: true,
				addValidationAutomatically: true,
				groups: [
					{
						'gid': 'baseGroup',
						'attributes': ['isinherit', 'parameterfk', 'propertyname', 'parametervaluevirtual','quantityquery', 'lastevaluated', 'valuedetail']
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],
				overloads: {
					lastevaluated: {'readonly': true},
					valuedetail: {'readonly': true},
					parameterfk: {
						'readonly': true,
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'construction-system-master-parameter-lookup'
							},
							'formatter': 'lookup',
							'formatterOptions': {
								'lookupType': 'CosParameter',
								'displayMember': 'DescriptionInfo.Translated'
							}
						},
						'detail': {
							'type': 'directive',
							'directive': 'construction-system-master-parameter-lookup',
							'options': {
								'readOnly': true
							}
						}
					},
					propertyname: {
						'detail': {
							'type': 'directive',
							'directive': 'construction-System-Master-Object2param-Property-Name-Combobox',
							'options': {
								'filterKey': 'cos-master-object2parameter-property-name-filter',
								'showClearButton': true,
								'isTextEditable': true
							}
						},
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								'lookupOptions': {
									'filterKey': 'cos-master-object2parameter-property-name-filter',
									'showClearButton': true,
									'isTextEditable': true
								},
								'directive': 'construction-System-Master-Object2param-Property-Name-Combobox'
							}
						}
					},
					parametervaluevirtual: {
						'grid': {
							'editor': 'dynamic',
							'formatter': 'dynamic',
							/* jshint -W074 */
							'domain': function (item, column) {
								var domain = 'description';
								var parameterItem;
								var items = basicsLookupdataLookupDescriptorService.getData('CosParameter');
								if (items) {
									parameterItem = items[item.ParameterFk];
								}
								if (parameterItem) {
									if (parameterItem.IsLookup === true) {
										domain = 'lookup';
										column.field = 'ParameterValueVirtual';
										column.editorOptions = {
											lookupDirective: 'construction-system-main-instance-parameter-value-lookup',

											showClearButton: true
										};

										column.formatterOptions = {
											lookupType: 'CosMainInstanceParameterValue',
											valueMember: 'Id',
											displayMember: 'Description'
										};
									}
									else {
										switch (parameterItem.ParameterTypeFk) {
											case parameterDataTypes.Integer:
												domain = 'integer';
												column.ParameterValueVirtual = null;
												column.field = 'ParameterValueVirtual';
												column.editorOptions = null;
												column.formatterOptions = null;

												break;
											case parameterDataTypes.Decimal1:
												domain = 'decimal';
												column.ParameterValueVirtual = null;
												column.field = 'ParameterValueVirtual';
												column.editorOptions = { decimalPlaces: 1 };
												column.formatterOptions = { decimalPlaces: 1 };

												break;
											case parameterDataTypes.Decimal2:
												domain = 'decimal';
												column.ParameterValueVirtual = null;
												column.field = 'ParameterValueVirtual';
												column.editorOptions = { decimalPlaces: 2 };
												column.formatterOptions = { decimalPlaces: 2 };

												break;
											case parameterDataTypes.Decimal3:
												domain = 'decimal';
												column.ParameterValueVirtual = null;
												column.field = 'ParameterValueVirtual';
												column.editorOptions = { decimalPlaces: 3 };
												column.formatterOptions = { decimalPlaces: 3 };


												break;
											case parameterDataTypes.Decimal4:
												domain = 'decimal';
												column.ParameterValueVirtual = null;
												column.field = 'ParameterValueVirtual';
												column.editorOptions = { decimalPlaces: 4 };
												column.formatterOptions = { decimalPlaces: 4 };

												break;
											case parameterDataTypes.Decimal5:
												domain = 'decimal';
												column.ParameterValueVirtual = null;
												column.field = 'ParameterValueVirtual';
												column.editorOptions = { decimalPlaces: 5 };
												column.formatterOptions = { decimalPlaces: 5 };

												break;
											case parameterDataTypes.Decimal6:
												domain = 'decimal';
												column.ParameterValueVirtual = null;
												column.field = 'ParameterValueVirtual';
												column.editorOptions = { decimalPlaces: 6 };
												column.formatterOptions = { decimalPlaces: 6 };

												break;
											case 7:
											case 8:
											case 9:
												break;
											case parameterDataTypes.Boolean:
												domain = 'boolean';
												column.ParameterValueVirtual = null;
												column.field = 'ParameterValueVirtual';
												column.editorOptions = null;
												column.formatterOptions = null;
												break;
											case parameterDataTypes.Date:
												domain = 'dateutc';
												column.ParameterValueVirtual = null;
												column.field = 'ParameterValueVirtual';
												column.editorOptions = null;
												column.formatterOptions = null;

												break;
											case parameterDataTypes.Text:
												domain = 'description';
												column.ParameterValueVirtual = null;
												column.field = 'ParameterValueVirtual';
												column.editorOptions = null;
												column.maxLength= 255;
												column.formatterOptions = null;

												break;
											default:
												domain = 'description';
												column.ParameterValueVirtual = null;
												column.field = 'ParameterValueVirtual';
												column.editorOptions = null;
												column.formatterOptions = null;
												break;
										}
									}
								}

								return domain;
							}
						},
						'detail': {
							'type': 'directive',
							'directive': 'construction-system-main-instance-parameter-parameter-value-control'
						}

					}
				},
				addition:{
					'grid': extendGrouping(lookupGridDisplayColumns)
				// 'detail' : lookupDetailDisplayColumns
				}
			};
		}]);

	// Global Parameter
	angular.module(moduleName).factory('constructionSystemMasterGlobalParameterDetailLayout', ['parameterDataTypes',
		function (parameterDataTypes) {
			return {
				'fid': 'constructionsystem.master.globalparameter.detail',
				'version': '1.0.0',
				'addValidationAutomatically': true,
				'showGrouping': true,
				'groups': [
					{
						'gid': 'basicData',
						'attributes': ['descriptioninfo', 'variablename', 'cosparametertypefk', 'uomfk', 'defaultvalue', 'sorting', 'islookup', 'cosglobalparamgroupfk']
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],
				'translationInfos': {
					'extraModules': [moduleName, cloudCommonModule],
					'extraWords': {
						VariableName: { location: moduleName, identifier: 'entityVariableName', initial: 'VariableName' },
						CosParameterTypeFk: { location: moduleName, identifier: 'entityParameterTypeFk', initial: 'ParameterType' },
						UomFk: { location: moduleName, identifier: 'entityUomFk', initial: 'UoM' },
						DefaultValue: { location: moduleName, identifier: 'entityDefaultValue', initial: 'DefaultValue' },
						Sorting: { location: moduleName, identifier: 'entitySorting', initial: 'Sorting' },
						IsLookup: { location: moduleName, identifier: 'entityIsLookup', initial: 'Is Lookup' },
						CosGlobalParamGroupFk: { location: moduleName, identifier: 'entityCosGlobalParamGroupFk', initial: 'Global Parameter Group Code' }
					}
				},
				'overloads': {
					// 'descriptioninfo': {
					// 	detail: {
					// 		maxLength: 255
					// 	},
					// 	grid: {
					// 		maxLength: 255
					// 	}
					// },
					// 'variablename': {
					// 	'grid': {
					// 		'editor': 'directive',
					// 		'editorOptions': {
					// 			'directive': 'basics-common-limit-input',
					// 			validKeys: {
					// 				regular: '^([a-zA-Z_][a-zA-Z0-9_]{0,254})?$'
					// 			},
					// 			isCodeProperty: false
					// 		},
					// 		formatter: 'description',
					// 		'width': 150
					// 	},
					// 	'detail': {
					// 		'type': 'directive',
					// 		'model': 'VariableName',
					// 		'directive': 'basics-common-limit-input',
					// 		'options': {
					// 			validKeys: {
					// 				regular: '^([a-zA-Z_][a-zA-Z0-9_]{0,254})?$'
					// 			},
					// 			isCodeProperty: false
					// 		}
					// 	}
					// },
					'cosparametertypefk': {
						'grid': {
							'formatter': 'lookup',
							'formatterOptions': {
								'lookupType': 'CosMasterParameterType',
								'displayMember': 'Description'
							},
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'construction-system-master-parameter-type-lookup'
							}
						},
						'detail': {
							'type': 'directive',
							'directive': 'construction-system-master-parameter-type-lookup'
						}
					},
					'uomfk': {
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-uom-lookup',
							'options': {
								showClearButton: true
							}
						},
						'grid': {
							editor: 'lookup',
							editorOptions: {
								lookupDirective: 'basics-lookupdata-uom-lookup',
								lookupOptions: {
									showClearButton: true,
									isFastDataRecording: true
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'uom',
								displayMember: 'Unit'
							}
						}
					},
					'defaultvalue': {
						'grid': {
							'editor': 'dynamic',
							formatter: 'dynamic',
							domain: function (item, column) {
								var domain;
								if (item.IsLookup === true) {
									domain = 'lookup';
									column.field = 'DefaultValue';
									column.editorOptions = {
										lookupDirective: 'construction-system-master-global-param-value-lookup',

										lookupType: 'CosGlobalParamValueLookup',

										dataServiceName: 'cosGlobalParamValueLookupService',
										valueMember: 'Id',
										displayMember: 'DescriptionInfo.Translated',
										showClearButton: true
									};

									column.formatterOptions = {
										lookupType: 'CosGlobalParamValueLookup',
										dataServiceName: 'cosGlobalParamValueLookupService',
										displayMember: 'DescriptionInfo.Translated',
										'valueMember': 'Id'
									};
								}
								else {
									switch (item.CosParameterTypeFk) {
										case parameterDataTypes.Integer:
											domain = 'integer';
											column.DefaultValue = null;
											column.field = 'DefaultValue';
											column.editorOptions = null;
											column.formatterOptions = null;

											break;
										case parameterDataTypes.Decimal1:
											domain = 'decimal';
											column.DefaultValue = null;
											column.field = 'DefaultValue';
											column.editorOptions = { decimalPlaces: 1 };
											column.formatterOptions = { decimalPlaces: 1 };

											break;
										case parameterDataTypes.Decimal2:
											domain = 'decimal';
											column.DefaultValue = null;
											column.field = 'DefaultValue';
											column.editorOptions = { decimalPlaces: 2 };
											column.formatterOptions = { decimalPlaces: 2 };

											break;
										case parameterDataTypes.Decimal3:
											domain = 'decimal';
											column.DefaultValue = null;
											column.field = 'DefaultValue';
											column.editorOptions = { decimalPlaces: 3 };
											column.formatterOptions = { decimalPlaces: 3 };


											break;
										case parameterDataTypes.Decimal4:
											domain = 'decimal';
											column.DefaultValue = null;
											column.field = 'DefaultValue';
											column.editorOptions = { decimalPlaces: 4 };
											column.formatterOptions = { decimalPlaces: 4 };

											break;
										case parameterDataTypes.Decimal5:
											domain = 'decimal';
											column.DefaultValue = null;
											column.field = 'DefaultValue';
											column.editorOptions = { decimalPlaces: 5 };
											column.formatterOptions = { decimalPlaces: 5 };

											break;
										case parameterDataTypes.Decimal6:
											domain = 'decimal';
											column.DefaultValue = null;
											column.field = 'DefaultValue';
											column.editorOptions = { decimalPlaces: 6 };
											column.formatterOptions = { decimalPlaces: 6 };

											break;
										case 7:
										case 8:
										case 9:
											break;
										case parameterDataTypes.Boolean:
											domain = 'boolean';
											column.DefaultValue = null;
											column.field = 'DefaultValue';
											column.editorOptions = null;
											column.formatterOptions = null;
											break;
										case parameterDataTypes.Date:
											domain = 'dateutc';
											column.DefaultValue = null;
											column.field = 'DefaultValue';
											column.editorOptions = null;
											column.formatterOptions = null;

											break;
										case parameterDataTypes.Text:
											domain = 'description';
											column.DefaultValue = null;
											column.field = 'DefaultValue';
											column.editorOptions = null;
											// column.maxLength= 255;
											column.formatterOptions = null;

											break;
										default:
											domain = 'description';
											column.DefaultValue = null;
											column.field = 'DefaultValue';
											column.editorOptions = null;
											column.formatterOptions = null;
											break;
									}
								}
								return domain;
							},
							'width': 150
						},
						'detail': {
							'type': 'directive',
							'directive': 'construction-system-master-dynamic-type-value-control',
							'options': {
								rid: 'defaultvalue',
								model: 'DefaultValue',
								rowTypeFields: {
									isLookup: 'IsLookup',
									parameterType: 'CosParameterTypeFk'
								},
								watchFields: ['IsLookup', 'CosParameterTypeFk'],
								lookupDirective: 'construction-system-master-global-param-value-lookup'
							}
						}
					},
					'cosglobalparamgroupfk':{
						'mandatory': true,
						'grid': {
							'formatter': 'lookup',
							'formatterOptions': {
								'lookupType': 'CosMasterGlobalParamGroup',
								'displayMember': 'Code'
							},
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'construction-system-master-global-param-group-lookup'
							}
						},
						'detail': {
							'type': 'directive',
							'directive': 'construction-system-master-global-param-group-lookup'
						}
					}
				},
				'addition': {
					'grid': [
						{
							'afterId': 'cosglobalparamgroupfk',
							'id': 'CosGlobalParamGroupDes',
							'field': 'CosGlobalParamGroupFk',
							'name': 'Global Param Group Description',
							'name$tr$': 'constructionsystem.master.entityCosGlobalParamGroupDes',
							'formatter': 'lookup',
							'formatterOptions': {
								'lookupType': 'CosMasterGlobalParamGroup',
								'displayMember': 'DescriptionInfo.Translated'
							}
						}
					]
				}
			};
		}
	]);

	// Global Parameter value
	angular.module(moduleName).factory('constructionSystemMasterGlobalParameterValueDetailLayout', ['constructionSystemMasterGlobalParameterDataService', 'parameterDataTypes',
		function (parentService, parameterDataTypes) {
			return {
				'fid': 'constructionsystem.master.globalparametervalue.detail',
				'version': '1.1.0',
				'showGrouping': true,
				'addValidationAutomatically': true,
				'groups': [
					{
						'gid': 'basicData',
						'attributes': ['descriptioninfo', 'parametervalue', 'isdefault', 'sorting']
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],
				'translationInfos': {
					'extraModules': [moduleName],
					'extraWords': {
						ParameterValue: { location: cloudCommonModule, identifier: 'entityParameterValue', initial: 'ParameterValue' },
						Sorting: { location: cloudCommonModule, identifier: 'entitySorting', initial: 'Sorting' },
						IsDefault: { location: cloudCommonModule, identifier: 'entityIsDefault', initial: 'Is Default' }
					}
				},
				'overloads': {
					'parametervalue': {
						'grid': {
							'editor': 'dynamic',
							formatter: 'dynamic',
							domain: function (item, column) {
								var domain;
								var ParameterType;
								if (angular.isDefined((parentService.getSelected() || {}).CosParameterTypeFk)) {
									ParameterType = parentService.getSelected().CosParameterTypeFk;
								}
								else {
									ParameterType = null;
								}
								switch (ParameterType) {
									case parameterDataTypes.Integer:
										domain = 'integer';
										column.field = 'ParameterValue';
										column.editorOptions = null;
										column.formatterOptions = null;

										break;
									case parameterDataTypes.Decimal1:
										domain = 'money';
										column.field = 'ParameterValue';
										column.editorOptions = { decimalPlaces: 1 };
										column.formatterOptions = { decimalPlaces: 1 };

										break;
									case parameterDataTypes.Decimal2:
										domain = 'money';
										column.field = 'ParameterValue';
										column.editorOptions = { decimalPlaces: 2 };
										column.formatterOptions = { decimalPlaces: 2 };

										break;
									case parameterDataTypes.Decimal3:
										domain = 'decimal';
										column.field = 'ParameterValue';
										column.editorOptions = { decimalPlaces: 3 };
										column.formatterOptions = { decimalPlaces: 3 };


										break;
									case parameterDataTypes.Decimal4:
										domain = 'exchangerate';
										column.field = 'ParameterValue';
										column.editorOptions = { decimalPlaces: 4 };
										column.formatterOptions = { decimalPlaces: 4 };

										break;
									case parameterDataTypes.Decimal5:
										domain = 'exchangerate';
										column.field = 'ParameterValue';
										column.editorOptions = { decimalPlaces: 5 };
										column.formatterOptions = { decimalPlaces: 5 };

										break;
									case parameterDataTypes.Decimal6:
										domain = 'factor';
										column.field = 'ParameterValue';
										column.editorOptions = { decimalPlaces: 6 };
										column.formatterOptions = { decimalPlaces: 6 };

										break;
									case 7:
									case 8:
									case 9:
										break;
									case parameterDataTypes.Boolean:
										domain = 'boolean';
										column.field = 'ParameterValue';
										column.editorOptions = null;
										column.formatterOptions = null;
										break;
									case parameterDataTypes.Date:
										domain = 'dateutc';
										column.field = 'ParameterValue';
										column.editorOptions = null;
										column.formatterOptions = null;

										break;
									case parameterDataTypes.Text:
										domain = 'description';
										column.field = 'ParameterValue';
										column.editorOptions = null;
										// column.maxLength= 255;
										column.formatterOptions = null;

										break;
									default:
										domain = 'integer';
										column.field = 'ParameterValue';
										column.editorOptions = null;
										column.formatterOptions = null;
										break;
								}
								return domain;
							},
							'width': 150
						},
						'detail': {
							'type': 'directive',
							'directive': 'construction-system-master-dynamic-type-value-control',
							'options': {
								rid: 'parametervalue',
								useParent: false,
								model: 'ParameterValue',
								rowTypeFields: {
									parameterType: 'CosParameterTypeFk'
								},
								watchFields: ['CosParameterTypeFk']
							}
						}
					}
				}
			};
		}
	]);

	// Object Template
	angular.module(moduleName).factory('constructionSystemMasterObjectTemplateDetailLayout', [
		function () {
			return {
				'fid': 'constructionsystem.master.objecttemplate.detail',
				'version': '1.0.0',
				'addValidationAutomatically': true,
				'showGrouping': true,
				'groups': [
					{
						'gid': 'basicData',
						'attributes': ['description', 'iscomposite', 'mdldimensiontypefk', 'height', 'offset', 'multiplier']
					},
					{
						'gid': 'color',
						'attributes': ['positivecolor', 'mdlobjecttextureposfk', 'negativecolor', 'mdlobjecttexturenegfk']
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],
				'translationInfos': {
					'extraModules': [moduleName],
					'extraWords': {
						IsComposite: { location: moduleName, identifier: 'entityIsComposite', initial: 'Is Composite' },
						MdlDimensionTypeFk: { location: moduleName, identifier: 'entityDimensionType', initial: 'Dimension Type' },
						Height: { location: moduleName, identifier: 'entityHeight', initial: 'Height' },
						Offset: { location: moduleName, identifier: 'entityOffset', initial: 'Offset' },
						Multiplier: { location: moduleName, identifier: 'entityMultiplier', initial: 'Multiplier' },
						PositiveColor: { location: moduleName, identifier: 'entityPositiveColor', initial: 'Positive Color' },
						MdlObjectTexturePosFk: { location: moduleName, identifier: 'entityMdlObjectTexturePos', initial: 'Positive Texture' },
						NegativeColor: { location: moduleName, identifier: 'entityNegativeColor', initial: 'Negative Color' },
						MdlObjectTextureNegFk: { location: moduleName, identifier: 'entityMdlObjectTextureNeg', initial: 'Negative Texture' },
						color: { location: moduleName, identifier: 'color', initial: 'Color' },
						costGroup: { location: moduleName, identifier: 'costGroup', initial: 'Cost Group' }
					}
				},
				'overloads': {
					'height': {
						detail: {
							'options': {
								decimalPlaces: 3
							},
							regex: '(^[+-]?\\d{0,13}([,\\.][\\d]{0,3})?$)|(^(?:[+-]?[\\d]{0,1}(?:[,\\.]{0,1}\\d{3}){0,4})([,\\.][\\d]{0,3})$)',
							regexTemplate: '(^[+-]?\\d+$)|(^(?:[+-]?[\\d]*(?:[,\\.]{0,1}\\d+)*)([,\\.][\\d]{0,3})$)'
						},
						grid: {
							editorOptions: {
								decimalPlaces: 3
							},
							formatterOptions: {
								decimalPlaces: 3
							},
							regex: '(^[+-]?\\d{0,13}([,\\.][\\d]{0,3})?$)|(^(?:[+-]?[\\d]{0,1}(?:[,\\.]{0,1}\\d{3}){0,4})([,\\.][\\d]{0,3})$)',
							regexTemplate: '(^[+-]?\\d+$)|(^(?:[+-]?[\\d]*(?:[,\\.]{0,1}\\d+)*)([,\\.][\\d]{0,3})$)'
						}
					},
					'offset': {
						detail: {
							'options': {
								decimalPlaces: 3
							},
							regex: '(^[+-]?\\d{0,13}([,\\.][\\d]{0,3})?$)|(^(?:[+-]?[\\d]{0,1}(?:[,\\.]{0,1}\\d{3}){0,4})([,\\.][\\d]{0,3})$)',
							regexTemplate: '(^[+-]?\\d+$)|(^(?:[+-]?[\\d]*(?:[,\\.]{0,1}\\d+)*)([,\\.][\\d]{0,3})$)'
						},
						grid: {
							editorOptions: {
								decimalPlaces: 3
							},
							formatterOptions: {
								decimalPlaces: 3
							},
							regex: '(^[+-]?\\d{0,13}([,\\.][\\d]{0,3})?$)|(^(?:[+-]?[\\d]{0,1}(?:[,\\.]{0,1}\\d{3}){0,4})([,\\.][\\d]{0,3})$)',
							regexTemplate: '(^[+-]?\\d+$)|(^(?:[+-]?[\\d]*(?:[,\\.]{0,1}\\d+)*)([,\\.][\\d]{0,3})$)'
						}
					},
					'multiplier': {
						detail: {
							'options': {
								decimalPlaces: 6
							},
							regex: '(^[+-]?\\d{0,9}([,\\.][\\d]{0,6})?$)|(^(?:[+-]?[\\d]{0,1}(?:[,\\.]{0,1}\\d{3}){0,2})([,\\.][\\d]{0,6})$)',
							regexTemplate: '(^[+-]?\\d+$)|(^(?:[+-]?[\\d]*(?:[,\\.]{0,1}\\d+)*)([,\\.][\\d]{0,6})$)'
						},
						grid: {
							editorOptions: {
								decimalPlaces: 6
							},
							formatterOptions: {
								decimalPlaces: 6
							},
							regex: '(^[+-]?\\d{0,9}([,\\.][\\d]{0,6})?$)|(^(?:[+-]?[\\d]{0,1}(?:[,\\.]{0,1}\\d{3}){0,2})([,\\.][\\d]{0,6})$)',
							regexTemplate: '(^[+-]?\\d+$)|(^(?:[+-]?[\\d]*(?:[,\\.]{0,1}\\d+)*)([,\\.][\\d]{0,6})$)'
						}
					},
					'mdldimensiontypefk': {
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-dimension-type-combo-box'
						},
						'grid': {
							readonly: true,
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'DimensionTypes',
								displayMember: 'Description',
								dataServiceName: 'basicsLookupdataDimensionTypeDataService'
							},
							editor: 'lookup',
							editorOptions: {
								directive: 'basics-lookupdata-dimension-type-combo-box'
							}
						}
					},
					'mdlobjecttextureposfk': {
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-object-texture-combo-box'
						},
						'grid': {
							readonly: true,
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'Objecttextures',
								displayMember: 'Description',
								dataServiceName: 'basicsLookupdataObjectTextureDataService'
							},
							editor: 'lookup',
							editorOptions: {
								directive: 'basics-lookupdata-object-texture-combo-box'
							}
						}
					},
					'mdlobjecttexturenegfk': {
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-object-texture-combo-box'
						},
						'grid': {
							readonly: true,
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'Objecttextures',
								displayMember: 'Description',
								dataServiceName: 'basicsLookupdataObjectTextureDataService'
							},
							editor: 'lookup',
							editorOptions: {
								directive: 'basics-lookupdata-object-texture-combo-box'
							}
						}
					}
				},
				'addition': {
					'grid': [

					]
				}
			};
		}
	]);

	// Object Template Property
	angular.module(moduleName).factory('constructionSystemMasterObjectTemplatePropertyDetailLayout', [
		function () {
			return {
				'fid': 'constructionsystem.master.objecttemplateproperty.detail',
				'version': '1.0.0',
				'addValidationAutomatically': true,
				'showGrouping': true,
				'groups': [
					{
						'gid': 'basicData',
						'attributes': ['value', 'basuomfk', 'formula', 'mdlpropertykeyfk']
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],
				'translationInfos': {
					'extraModules': [moduleName],
					'extraWords': {
						MdlPropertyKeyFk:{location: moduleName, identifier: 'entityProperty', initial: 'Property'},
						Value: { location: moduleName, identifier: 'entityValue', initial: 'Value' },
						BasUomFk: { location: moduleName, identifier: 'entityUomFk', initial: 'UoM' },
						Formula: { location: moduleName, identifier: 'entityFormula', initial: 'Formula' }
					}
				},
				'overloads': {
					'value': {
						formatter: 'dynamic',
						editor: 'dynamic',
						domain: function (item) {
							var domain;
							if (item) {
								switch (item.ValueType) {
									case 1:
										domain = 'remark';
										item.Value = item.PropertyValueText;
										break;

									case 2:
										domain = 'decimal';
										item.Value = item.PropertyValueNumber;
										break;

									case 3:
										domain = 'integer';
										item.Value = item.PropertyValueLong;
										break;

									case 4:
										domain = 'boolean';
										item.Value = item.PropertyValueBool;
										break;

									case 5:
										domain = 'dateutc';
										item.Value = item.PropertyValueDate;
										break;

									default:
										item.Value = null;
								}
							}
							return domain || 'description';
						}
					},
					'mdlpropertykeyfk':{
						'detail': {
							'type': 'directive',
							'directive': 'model-administration-property-key-lookup-edit-directive'
						},
						'grid': {
							editor: 'lookup',
							editorOptions: {
								lookupDirective: 'model-administration-property-key-lookup-edit-directive'
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'modelAdministrationPropertyKeys',
								displayMember: 'PropertyName'
							}
						}
					},
					'formula': {
						'detail': {
							'type': 'directive',
							'directive': 'construction-system-formula-dialog'
						},
						'grid': {
							editor: 'directive',
							editorOptions: {
								'directive': 'construction-system-formula-dialog'
							},
							formatter: 'description'
						}
					},
					'basuomfk': {
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-uom-lookup',
							'options': {
								showClearButton: true
							}
						},
						'grid': {
							editor: 'lookup',
							editorOptions: {
								lookupDirective: 'basics-lookupdata-uom-lookup',
								lookupOptions: {
									showClearButton: true,
									isFastDataRecording: true
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'uom',
								displayMember: 'Unit'
							}
						}
					},
				},
				'addition': {
					'grid': [
						{
							'afterId': 'basuomfk',
							'id': 'uomText',
							'lookupDisplayColumn': true,
							'field': 'BasUomFk',
							'displayMember': 'DescriptionInfo.Translated',
							'name$tr$': 'constructionsystem.master.entityUomText',
							'width': 150
						}
					]
				}
			};
		}
	]);

	function extendGrouping(gridColumns) {
		angular.forEach(gridColumns, function (column) {
			angular.extend(column, {
				grouping: {
					title: column.name$tr$,
					getter: column.field,
					aggregators: [],
					aggregateCollapsed: true
				}
			});
		});

		return gridColumns;
	}

	angular.module(moduleName).factory('constructionSystemMasterChgOptionDetailLayout', [
		function () {
			return {
				'fid': 'constructionsystem.master.chgoption.detail',
				'version': '1.0.0',
				'addValidationAutomatically': true,
				'showGrouping': true,
				'groups': [
					{
						'gid': 'basicData',
						'attributes': ['iscopylineitems', 'ismergelineitems', 'ischange']
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],
				'translationInfos': {
					'extraModules': [moduleName],
					'extraWords': {
						IsCopyLineItems:{location: moduleName, identifier: 'entityIsCopyLineItems', initial: 'Is Copy Line Items'},
						IsMergeLineItems: { location: moduleName, identifier: 'entityIsMergeLineItems', initial: 'Is Merge Line Items' },
						IsChange: { location: moduleName, identifier: 'entityIsChange', initial: 'Is Change' }
					}
				}
			};
		}
	]);

})(angular);