/**
 * Created by xsi on 2016-03-11.
 */
(function (angular, $) {
	'use strict';
	// eslint-disable-next-line no-redeclare,no-unused-vars
	/* global angular,jQuery */

	var moduleName = 'constructionsystem.main';
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).service('constructionSystemMainUIConfigurationService', [
		'basicsLookupdataConfigGenerator', 'parameterDataTypes', 'basicsLookupdataLookupDescriptorService', '$filter',
		'constructionSystemMainInstanceProgressService', 'constructionSystemMainInstanceService', 'basicsCommonCodeDescriptionSettingsService',
		function (basicsLookupdataConfigGenerator, parameterDataTypes, basicsLookupdataLookupDescriptorService,
			$filter, constructionSystemMainInstanceProgressService, constructionSystemMainInstanceService, basicsCommonCodeDescriptionSettingsService) {

			function getProjectId() {
				return constructionSystemMainInstanceService.getCurrentSelectedProjectId();
			}

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

			this.getConstructionSystemMainInstanceDetailLayout = function getConstructionSystemMainInstanceDetailLayout() {
				var headerSetting = basicsCommonCodeDescriptionSettingsService.getSettings([{
					typeName: 'CosHeaderEntity',
					module: 'ConstructionSystem.Master'
				}]);
				var codeLength = (headerSetting && headerSetting[0] && headerSetting[0].codeLength ? headerSetting[0].codeLength : 16) + 5;
				return {
					'fid': 'constructionsystem.main.instance.detail',
					'version': '1.1.0',
					'showGrouping': true,
					'addValidationAutomatically': true,
					'groups': [
						{
							'gid': 'baseGroup',
							'attributes': ['code', 'isdistinctinstances', 'descriptioninfo', 'commenttext', 'costemplatefk', 'controllingunitfk',
								'locationfk', 'ischecked', 'status', 'boqitemfk', 'masterheadercode', 'masterheaderdescription',
								'projectsortcode01fk', 'projectsortcode02fk', 'projectsortcode03fk', 'projectsortcode04fk', 'projectsortcode05fk',
								'projectsortcode06fk', 'projectsortcode07fk', 'projectsortcode08fk', 'projectsortcode09fk', 'projectsortcode10fk','isusermodified']
						},
						{
							'gid': 'userDefTextGroup',
							'attributes': ['userdefined1', 'userdefined2', 'userdefined3', 'userdefined4', 'userdefined5']
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

					'overloads': {
						code: {
							detail: {
								maxLength: codeLength
							},
							grid: {
								maxLength: codeLength
							}
						},
						'descriptioninfo': {
							'grid': {
								'maxLength': 255
							},
							'detail': {
								'maxLength': 255
							}
						},
						isdistinctinstances: {readonly: true},

						masterheadercode: {
							navigator: {
								moduleName: 'constructionsystem.master',
								registerService: 'constructionSystemMasterHeaderService'
							},
							readonly: true
						},
						masterheaderdescription: {readonly: true},
						status: {
							readonly: true,
							'grid': {
								'formatter': constructionSystemMainInstanceProgressService.formatter
							},
							'detail': {
								'type': 'directive',
								'directive': 'construction-system-main-instance-status'
							}
						},
						ischecked: {
							'grid': {
								headerChkbox: true
							}
						},
						isusermodified:{
							readonly: false,
							'grid':{
								headerChkbox: false
							}
						},
						costemplatefk: {
							'grid': {
								'formatter': 'lookup',
								'formatterOptions': {
									'lookupType': 'CosTemplate',
									'displayMember': 'DescriptionInfo.Translated'
								},
								'editor': 'lookup',
								'editorOptions': {
									'directive': 'construction-system-master-template-combobox',
									'lookupOptions': {
										'filterKey': 'construction-system-main-instance-template-filter',
										'showClearButton': true
									}
								}
							},
							'detail': {
								'type': 'directive',
								'directive': 'construction-system-master-template-combobox',
								'options': {
									'filterKey': 'construction-system-main-instance-template-filter',
									'showClearButton': true
								}
							}
						},
						controllingunitfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'controllingStructureUnitLookupDataService',
							showClearButton: true,
							filter: function () {
								return getProjectId();
							}
						}),
						'locationfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'projectLocationLookupDataService',
							showClearButton: true,
							filter: function () {
								return getProjectId();
							}
						}),
						'projectsortcode01fk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'projectSortCode01LookupDataService',
							showClearButton: true,
							filter: function () {
								return getProjectId();
							}
						}),
						'projectsortcode02fk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'projectSortCode02LookupDataService',
							showClearButton: true,
							filter: function () {
								return getProjectId();
							}
						}),
						'projectsortcode03fk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'projectSortCode03LookupDataService',
							showClearButton: true,
							filter: function () {
								return getProjectId();
							}
						}),
						'projectsortcode04fk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'projectSortCode04LookupDataService',
							showClearButton: true,
							filter: function () {
								return getProjectId();
							}
						}),
						'projectsortcode05fk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'projectSortCode05LookupDataService',
							showClearButton: true,
							filter: function () {
								return getProjectId();
							}
						}),
						'projectsortcode06fk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'projectSortCode06LookupDataService',
							showClearButton: true,
							filter: function () {
								return getProjectId();
							}
						}),
						'projectsortcode07fk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'projectSortCode07LookupDataService',
							showClearButton: true,
							filter: function () {
								return getProjectId();
							}
						}),
						'projectsortcode08fk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'projectSortCode08LookupDataService',
							showClearButton: true,
							filter: function () {
								return getProjectId();
							}
						}),
						'projectsortcode09fk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'projectSortCode09LookupDataService',
							showClearButton: true,
							filter: function () {
								return getProjectId();
							}
						}),
						'projectsortcode10fk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'projectSortCode10LookupDataService',
							showClearButton: true,
							filter: function () {
								return getProjectId();
							}
						}),
						'boqitemfk': {
							'grid': {
								'formatter': 'lookup',
								'formatterOptions': {
									'lookupType': 'BoqItem',
									// 'dataServiceName':'constructionSystemMainBoqLookupService',
									'displayMember': 'Reference'
								},
								'editor': 'lookup',
								'editorOptions': {
									'directive': 'construction-system-main-boq-lookup',
									'lookupOptions': {
										// 'dataServiceName':'constructionSystemMainBoqLookupService',
										'showClearButton': true
									}
								}
							},
							'detail': {
								'type': 'directive',
								'directive': 'construction-system-main-boq-lookup',
								'options': {
									'descriptionMember': 'Reference',
									'lookupOptions': {
										'showClearButton': true
									},
									'showClearButton': true
								}
							}
						}
					},
					'addition': {}
				};
			};

			this.getConstructionSystemMainInstanceHeaderParameterDetailLayout = function getConstructionSystemMainInstanceHeaderParameterDetailLayout() {
				return {
					'fid': 'constructionsystem.main.instanceheader.parameter.detail',
					'version': '1.1.0',
					'showGrouping': true,
					'addValidationAutomatically': true,
					'groups': [
						{
							'gid': 'baseGroup',
							'attributes': ['parametervaluevirtual', 'uomvalue', 'cosmasterparametertype']
						},
						{
							'gid': 'entityHistory',
							'isHistory': true
						}
					],
					'overloads':{
						'parametervaluevirtual': {
							'grid': {
								'editor': 'dynamic',
								'formatter': 'dynamic',
								domain: function (item, column) {
									var domain = 'description';
									var parameterItem;
									var items = basicsLookupdataLookupDescriptorService.getData('cosglobalparam');
									if (items) {
										parameterItem = items[item.CosGlobalParamFk];
									}
									if (parameterItem) {
										if (parameterItem.IsLookup === true) {
											domain = 'lookup';
											column.field = 'ParameterValueVirtual';
											column.editorOptions = {
												lookupDirective: 'construction-system-main-instance-header-parameter-value-lookup',
												showClearButton: true
											};
											column.formatterOptions = {
												lookupType: 'cosglobalparamvalue',
												valueMember: 'Id',
												displayMember: 'Description'
											};
										}
										else {
											switch (parameterItem.CosParameterTypeFk) {
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
													column.editorOptions = {decimalPlaces: 1};
													column.formatterOptions = {decimalPlaces: 1};

													break;
												case parameterDataTypes.Decimal2:
													domain = 'decimal';
													column.ParameterValueVirtual = null;
													column.field = 'ParameterValueVirtual';
													column.editorOptions = {decimalPlaces: 2};
													column.formatterOptions = {decimalPlaces: 2};

													break;
												case parameterDataTypes.Decimal3:
													domain = 'decimal';
													column.ParameterValueVirtual = null;
													column.field = 'ParameterValueVirtual';
													column.editorOptions = {decimalPlaces: 3};
													column.formatterOptions = {decimalPlaces: 3};


													break;
												case parameterDataTypes.Decimal4:
													domain = 'decimal';
													column.ParameterValueVirtual = null;
													column.field = 'ParameterValueVirtual';
													column.editorOptions = {decimalPlaces: 4};
													column.formatterOptions = {decimalPlaces: 4};

													break;
												case parameterDataTypes.Decimal5:
													domain = 'decimal';
													column.ParameterValueVirtual = null;
													column.field = 'ParameterValueVirtual';
													column.editorOptions = {decimalPlaces: 5};
													column.formatterOptions = {decimalPlaces: 5};

													break;
												case parameterDataTypes.Decimal6:
													domain = 'decimal';
													column.ParameterValueVirtual = null;
													column.field = 'ParameterValueVirtual';
													column.editorOptions = {decimalPlaces: 6};
													column.formatterOptions = {decimalPlaces: 6};

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
													//column.maxLength= 255;
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
								'directive': 'constructionsystem-main-dynamic-type-value-control',
								'options': {
									rid: 'parametervaluevirtual',
									model: 'ParameterValueVirtual',
									rowTypeFields: {
										isLookup: 'IsLookup',
										parameterType: 'CosParameterTypeFk'
									},
									watchFields: ['IsLookup', 'CosParameterTypeFk'],
									lookupDirective: 'construction-system-main-instance-header-parameter-value-lookup'
								}
							}
						},
						'uomvalue': {
							'grid': {
								'maxLength': 255
							},
							'readonly': true
						},
						'cosmasterparametertype': {
							'grid': {
								'maxLength': 255
							},
							'readonly': true
						}
					},
					'addition': {
						'grid': extendGrouping([
							{
								'afterId': 'cosglobalparamfk',
								'id': 'variablename',
								'field': 'CosGlobalParamFk',
								'name': 'Variable Name',
								'name$tr$': 'constructionsystem.master.entityVariableName',
								'formatter': 'lookup',
								'formatterOptions': {
									lookupType: 'cosglobalparam',
									displayMember: 'VariableName'
								},
								'width': 140,
								'sortable': true
							},{
								'afterId': 'cosglobalparamfk',
								'id': 'descriptioninfotranslated',
								'field': 'CosGlobalParamFk',
								'name': 'Description',
								'name$tr$': 'constructionsystem.executionScriptOutput.description',
								'formatter': 'lookup',
								'formatterOptions': {
									lookupType: 'cosglobalparam',
									displayMember: 'DescriptionInfo.Translated'
								},
								'width': 140,
								'sortable': true
							}
						]),
						'detail': extendGrouping([
							{
								'type': 'directive',
								'directive': 'construction-system-main-header-parameter-lookup',
								'gid': 'baseGroup',
								'rid': 'variablename',
								'model': 'CosGlobalParamFk',
								'label': 'Variable Name',
								'label$tr$': 'constructionsystem.master.entityVariableName',
								'options': {
									lookupType: 'cosglobalparam',
									displayMember: 'VariableName',
									readOnly: true
								}
							},
							{
								'type': 'directive',
								'directive': 'construction-system-main-header-parameter-lookup',
								'gid': 'baseGroup',
								'rid': 'description',
								'model': 'CosGlobalParamFk',
								'label': 'Description',
								'label$tr$': 'constructionsystem.executionScriptOutput.description',
								'options': {
									lookupType: 'cosglobalparam',
									displayMember: 'DescriptionInfo.Translated',
									readOnly: true
								}
							}
						])
					}
				};
			};

			this.getConstructionSystemMainInstanceParameterDetailLayout = function getConstructionSystemMainInstanceParameterDetailLayout() {
				var layoutExtendConfig = {
					lookupGridColumnsToAdd: [{
						'afterId': 'parameterfk',
						'lookupDisplayColumn': true,
						'id': 'aggregatetype',
						'field': 'ParameterFk',
						'name': 'Aggregate Type',
						'name$tr$': 'constructionsystem.master.entityAggregateType',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'CosParameter',
							displayMember: 'AggregateTypeDescription'
						}
					},
					{
						'afterId': 'cosglobalparamfk',
						'id': 'variablename',
						'field': 'CosGlobalParamFk',
						'name': 'Variable Name',
						'name$tr$': 'constructionsystem.master.entityVariableName',
						'formatter': 'lookup',
						'formatterOptions': {
							lookupType: 'cosglobalparam',
							displayMember: 'VariableName'
						},
						'width': 140,
						'sortable': true
					}],
					lookupDetailColumnsToAdd: [
						{
							'lookupDisplayColumn': true,
							'gid': 'baseGroup',
							'rid': 'aggregatetype',
							'model': 'ParameterFk',
							'label': 'Aggregate Type',
							'label$tr$': 'constructionsystem.master.entityAggregateType',
							'type': 'directive',
							'directive': 'construction-system-master-parameter-lookup',
							'options': {
								displayMember: 'AggregateTypeDescription',
								readOnly: true
							}
						},{
							'afterId': 'cosglobalparamfk',
							'id': 'variablename',
							'field': 'CosGlobalParamFk',
							'name': 'Variable Name',
							'name$tr$': 'constructionsystem.master.entityVariableName',
							'formatter': 'lookup',
							'formatterOptions': {
								lookupType: 'cosglobalparam',
								displayMember: 'VariableName'
							},
							'width': 140,
							'sortable': true
						}]
				};
				return this.getConstructionSystemMainParameterCommonDetailLayout(layoutExtendConfig);
			};

			this.getConstructionSystemMainObject2ParamDetailLayout = function getConstructionSystemMainInstanceParameterDetailLayout() {
				var layoutExtendConfig = {
					fid: 'constructionsystem.main.instance2objectparam.detail',
					version: '1.0.0',
					attributes: ['isinherit']
				};

				return this.getConstructionSystemMainParameterCommonDetailLayout(layoutExtendConfig);
			};

			this.getConstructionSystemMainParameterCommonDetailLayout = function getConstructionSystemMainInstanceParameterDetailLayout(confObj) {
				confObj = confObj || {};

				var basConfig = {};

				basConfig.fid = 'constructionsystem.main.instanceparameter.detail';
				basConfig.version = '1.1.0';
				basConfig.attributes = ['parameterfk', /* 'modelpropertyfk', */'propertyname', 'parametervaluevirtual', 'quantityquery', 'lastevaluated', 'valuedetail'];
				basConfig.overloads = {
					'lastevaluated': {'readonly': true},
					'valuedetail': {'readonly': true},
					'parameterfk': {
						'readonly': true,
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'construction-system-master-parameter-lookup',
								lookupOptions: {}
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
							}
						}
					},
					// 'modelpropertyfk': {
					//    'grid': {
					//             editor': 'lookup',
					//             'editorOptions': {
					//             'directive': 'construction-system-main-instance-parameter-property-name-combobox',
					//             lookupOptions: {
					//              filterKey: 'instanceparameter-property-name-filter'
					//         }
					//       },
					//       formatter: 'lookup',
					//       formatterOptions: {
					//          lookupType: 'CosMainInstanceParameterPropertyName',
					//          displayMember: 'PropertyName'
					//       }
					//    },
					//    'detail': {
					//        'type': 'directive',
					//        'directive': 'construction-system-main-instance-parameter-property-name-combobox',
					//        'options': {
					//           filterKey: 'instanceparameter-property-name-filter'
					//       }
					//   }
					// },
					'propertyname': {
						'detail': {
							'type': 'directive',
							'directive': 'construction-system-main-instance-parameter-property-name-combobox',
							'options': {
								filterKey: 'instanceparameter-property-name-filter',
								showClearButton: true,
								isTextEditable: true
							}
						},
						'grid': {
							editor: 'lookup',
							editorOptions: {
								lookupOptions: {
									filterKey: 'instanceparameter-property-name-filter',
									showClearButton: true,
									isTextEditable: true
								},
								directive: 'construction-system-main-instance-parameter-property-name-combobox'
							}
						}
					},
					'parametervaluevirtual': {
						'grid': {
							'editor': 'dynamic',
							'formatter': 'dynamic',
							/* jshint -W074 */
							domain: function (item, column) {
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
												column.editorOptions = {decimalPlaces: 1};
												column.formatterOptions = {decimalPlaces: 1};

												break;
											case parameterDataTypes.Decimal2:
												domain = 'decimal';
												column.ParameterValueVirtual = null;
												column.field = 'ParameterValueVirtual';
												column.editorOptions = {decimalPlaces: 2};
												column.formatterOptions = {decimalPlaces: 2};

												break;
											case parameterDataTypes.Decimal3:
												domain = 'decimal';
												column.ParameterValueVirtual = null;
												column.field = 'ParameterValueVirtual';
												column.editorOptions = {decimalPlaces: 3};
												column.formatterOptions = {decimalPlaces: 3};


												break;
											case parameterDataTypes.Decimal4:
												domain = 'decimal';
												column.ParameterValueVirtual = null;
												column.field = 'ParameterValueVirtual';
												column.editorOptions = {decimalPlaces: 4};
												column.formatterOptions = {decimalPlaces: 4};

												break;
											case parameterDataTypes.Decimal5:
												domain = 'decimal';
												column.ParameterValueVirtual = null;
												column.field = 'ParameterValueVirtual';
												column.editorOptions = {decimalPlaces: 5};
												column.formatterOptions = {decimalPlaces: 5};

												break;
											case parameterDataTypes.Decimal6:
												domain = 'decimal';
												column.ParameterValueVirtual = null;
												column.field = 'ParameterValueVirtual';
												column.editorOptions = {decimalPlaces: 6};
												column.formatterOptions = {decimalPlaces: 6};

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
				};
				basConfig.lookupGridDisplayColumns = [
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
				basConfig.lookupDetailDisplayColumns = [
					{
						'lookupDisplayColumn': true,
						'gid': 'baseGroup',
						'rid': 'parametergroup',
						'model': 'ParameterFk',
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
						'lookupDisplayColumn': true,
						'gid': 'baseGroup',
						'rid': 'variablename',
						'model': 'ParameterFk',
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
						'lookupDisplayColumn': true,
						'gid': 'baseGroup',
						'rid': 'uom',
						'model': 'ParameterFk',
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
						'lookupDisplayColumn': true,
						'gid': 'baseGroup',
						'rid': 'parametertype',
						'model': 'ParameterFk',
						'label': 'Parameter Type',
						'label$tr$': 'constructionsystem.master.entityParameterTypeFk',
						'type': 'directive',
						'directive': 'construction-system-master-parameter-lookup',
						'options': {
							displayMember: 'ParameterTypeDescription',
							readOnly: true
						}
					}
				];

				basConfig.lookupGridDisplayColumns = confObj.lookupGridColumnsToAdd ? basConfig.lookupGridDisplayColumns.concat(confObj.lookupGridColumnsToAdd) : basConfig.lookupGridDisplayColumns;
				basConfig.lookupDetailDisplayColumns = confObj.lookupDetailColumnsToAdd ? basConfig.lookupDetailDisplayColumns.concat(confObj.lookupDetailColumnsToAdd) : basConfig.lookupDetailDisplayColumns;

				basConfig.addition = {
					'grid': extendGrouping(basConfig.lookupGridDisplayColumns),
					'detail': basConfig.lookupDetailDisplayColumns
				};

				basConfig.fid = confObj.fid ? confObj.fid : basConfig.fid;
				basConfig.version = confObj.version ? confObj.version : basConfig.version;
				if (angular.isArray(confObj.attributes)) {
					angular.forEach(confObj.attributes, function (item) {
						basConfig.attributes.push(item);
					});
				}
				basConfig.overloads = confObj.overloads ? $.extend(true, basConfig.overloads, confObj.overloads) : basConfig.overloads;
				basConfig.addition = confObj.addition ? $.extend(true, basConfig.addition, confObj.addition) : basConfig.addition;

				return {
					'fid': confObj.fid ? confObj.fid : basConfig.fid,
					'version': basConfig.version,
					'showGrouping': true,
					'addValidationAutomatically': true,
					'groups': [
						{
							'gid': 'baseGroup',
							'attributes': basConfig.attributes
						},
						{
							'gid': 'entityHistory',
							'isHistory': true
						}
					],
					'overloads': basConfig.overloads,
					'addition': basConfig.addition
				};
			};

			this.getConstructionSystemMainJobDetailLayout = function getConstructionSystemMainJobDetailLayout() {
				return {
					'fid': 'constructionsystem.master.job.detail',
					'version': '1.1.0',
					'showGrouping': true,
					'addValidationAutomatically': true,
					'groups': [
						{
							'gid': 'baseGroup',
							'attributes': ['jobstate', 'starttime', 'endtime', 'progressmessage', 'description']
						},
						{
							'gid': 'entityHistory',
							'isHistory': true
						}
					],
					'overloads': {
						'jobstate': {
							readonly: true,
							'grid': {
								'formatter': function (row, cell, value) {
									return $filter('constructionsystemMainJobStateFilter')(value);
								}
							}
						},
						'mdlmodelfk': {readonly: true},
						'starttime': {readonly: true},
						'endtime': {readonly: true},
						'progressmessage': {
							readonly: true,
							'grid': {
								'formatter': function (row, cell, value) {
									return $filter('constructionsystemMainJobProgressFilter')(value);
								}
							}
						},
						'description': {readonly: true}
					}
				};
			};

			this.getConstructionSystemMainObjectTemplateDetailLayout = function getConstructionSystemMainObjectTemplateDetailLayout() {
				return {
					'fid': 'constructionsystem.main.objecttemplate.detail',
					'version': '1.0.0',
					'addValidationAutomatically': true,
					'showGrouping': true,
					'groups': [
						{
							'gid': 'baseGroup',
							'attributes': ['description', 'iscomposite', 'mdldimensiontypefk', 'height', 'offset', 'multiplier', 'prjlocationfk', 'mdccontrollingunitfk']
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
						'description': {
							'maxLength': 252
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
						},
						'mdccontrollingunitfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'controllingStructureUnitLookupDataService',
							showClearButton: true,
							filter: function () {
								return getProjectId();
							}
						}),
						'prjlocationfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'projectLocationLookupDataService',
							showClearButton: true,
							filter: function () {
								return getProjectId();
							}
						})
					},
					'addition': {
						'grid': [

						]
					}
				};
			};

			this.getConstructionSystemMainObjectTemplatePropertyDetailLayout = function getConstructionSystemMainObjectTemplatePropertyDetailLayout() {

				return {
					'fid': 'constructionsystem.main.objecttemplateproperty.detail',
					'version': '1.0.0',
					'addValidationAutomatically': true,
					'showGrouping': true,
					'groups': [
						{
							'gid': 'baseGroup',
							'attributes': ['value', 'basuomfk', 'formula', 'mdlpropertykeyfk']
						},
						{
							'gid': 'entityHistory',
							'isHistory': true
						}
					],
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
						}

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
			};

			this.getModelObject2LocationDetailLayout = function getModelObject2LocationDetailLayout() {
				return {
					fid: 'constructionsystem.main.modelobject2locationdetailform',
					version: '1.0.0',
					showGrouping: true,
					groups: [
						{
							'gid': 'baseGroup',
							'attributes': ['locationfk']
						},
						{
							'gid': 'entityHistory',
							'isHistory': true
						}
					],
					overloads: {
						locationfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'projectLocationLookupDataService',
							filter: function () {
								return getProjectId();
							},
							enableCache: true
						})
					}
				};
			};
		}
	]);
})(angular, jQuery);
