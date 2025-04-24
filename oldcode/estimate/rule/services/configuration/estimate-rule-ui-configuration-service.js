(function () {
	'use strict';
	/* global _ */
	let moduleName = 'estimate.rule';

	/**
	 * @ngdoc service
	 * @name estimateRuleUIConfigurationService
	 * @function
	 *
	 * @description
	 * estimateRuleUIConfigurationService is the config service for all estimate rule views.
	 */
	angular.module(moduleName).factory('estimateRuleUIConfigurationService', ['$translate', '$injector', 'basicsLookupdataConfigGenerator', 'platformModuleNavigationService', '$timeout','estimateRuleParameterConstant',

		function ($translate, $injector, basicsLookupdataConfigGenerator, naviService, $timeout,estimateRuleParameterConstant) {

			return {
				getEstimateRuleDetailLayout: function () {
					return {
						'fid': 'estimate.rule.detailform',
						'version': '1.0.0',
						'showGrouping': true,
						'addValidationAutomatically': true,
						'groups': [
							{
								'gid': 'baseGroup',
								'attributes': ['icon', 'code', 'descriptioninfo', 'basrubriccategoryfk', 'estruleexecutiontypefk', 'estevaluationsequencefk', 'operand', 'isforestimate', 'isforboq', 'comment', 'remark', 'islive', 'sorting', 'formfk']
							},
							{
								'gid': 'entityHistory',
								'isHistory': true
							}
						],

						'overloads': {
							'icon': {
								'detail': {
									'type': 'imageselect',
									// 'directive': 'platform-image-select-handler',
									directive: 'basics-lookupdata-lookup-composite',
									'options': {
										lookupDirective: 'platform-image-select-handler',
										'serviceName': 'basicsCustomizeRuleIconService'
										// 'eagerLoad': true
									}
								},
								'grid': {
									editor: 'imageselect',
									editorOptions: {serviceName: 'basicsCustomizeRuleIconService'},
									formatter: 'imageselect',
									formatterOptions: {
										serviceName: 'basicsCustomizeRuleIconService'
									}
								}
							},
							'operand':{
								detail:{
									'type': 'decimal'
								},
								grid:{
									'type': 'decimal'
								}
							},
							'isforestimate':{
								detail:{
									'type': 'boolean'
								},
								grid:{
									'type': 'boolean'
								}
							},
							'isforboq':{
								detail:{
									'type': 'boolean'
								},
								grid:{
									'type': 'boolean'
								}
							},
							'descriptioninfo': {
								detail: {
									maxLength: 255
								},
								grid: {
									maxLength: 255
								}
							},
							'basrubriccategoryfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'basicsMasterDataRubricCategoryLookupDataService',
								enableCache: true,
								filter: function () {
									return 70;
								}
							}),
							'estevaluationsequencefk': {
								detail: {
									type: 'imageselect',
									// directive: 'platform-image-select-handler',
									directive: 'basics-lookupdata-lookup-composite',
									options: {
										lookupDirective: 'platform-image-select-handler',
										serviceName: 'estimateRuleSequenceIconService',
										eagerLoad: true
									}
								},
								grid: {
									editor: 'lookup',
									editorOptions: {
										lookupDirective: 'estimate-Rule-Sequence-Lookup',
										lookupOptions: {
											lookupType: 'estsequences',
											valueMember: 'Id',
											displayMember: 'DescriptionInfo.Translated',
											imageSelector: 'estimateSequenceLookupProcessService',
											showIcon: true
										}
									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'estsequences',
										displayMember: 'DescriptionInfo.Translated',
										valueMember: 'Id',
										imageSelector: 'estimateSequenceLookupProcessService'
									}
								}
							},
							'estruleexecutiontypefk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('estimate.lookup.estRuleExecutionType', 'Description'),
							'formfk':basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'estimateRuleUserformLookupService',
								enableCache: true,
								filter: function () {
									return 70; // Rubric 'Estimate' from [BAS_RUBRIC]
								}
							})
						}
					};
				},
				getEstimateRuleComboDetailLayout: function (forEstimate) {
					let attrs = ['icon', 'code', 'descriptioninfo', 'estruleexecutiontypefk', 'estevaluationsequencefk', 'basrubriccategoryfk', 'comment', 'remark', 'sorting', 'formfk'];
					if(!forEstimate){
						attrs.push('operand');
						attrs.push('isforestimate');
						attrs.push('isforboq');
					}
					return {
						'fid': 'estimate.rule.prj.est.rule.detailform',
						'version': '1.0.0',
						'showGrouping': true,
						'groups': [
							{
								'gid': 'baseGroup',
								'attributes': attrs
							},
							{
								'gid': 'entityHistory',
								'isHistory': true
							}
						],

						'overloads': {
							'icon': {
								'grid': {
									editor: null,
									formatter: 'imageselect',
									formatterOptions: {
										serviceName: 'basicsCustomizeRuleIconService'
									}
								}
							},
							'code': {
								editor: null,
								navigator: {
									moduleName: $translate.instant('estimate.main' + '.ruleExecutionOutput.ruleScript'),
									navFunc: function (item, triggerField) {
										let navigator = naviService.getNavigator('project.main-estimate-rule-script');

										if (triggerField.IsPrjRule) {
											let projectMainService = $injector.get('projectMainService');

											if (_.isEmpty(projectMainService.getList())) {
												loadProjectMainService(projectMainService, item, triggerField, navigator);
											} else {
												if (projectMainService.getSelected() && projectMainService.getSelected().Id === $injector.get('estimateMainService').getSelectedProjectId()) {
													naviService.navigate(navigator, item, triggerField);
												} else {
													$injector.get('estimateProjectEstRuleScriptService').clear();
													projectMainService.clearCache();
													loadProjectMainService(projectMainService, item, triggerField, navigator);
												}
											}
										} else {
											navigator = naviService.getNavigator('estimate.rule-script');
											naviService.navigate(navigator, item, triggerField);
										}
									}
								}
							},
							'operand':{
								detail:{
									'type': 'decimal',
									'editor': null
								},
								grid:{
									'type': 'decimal',
									'editor': null
								}
							},
							'isforestimate':{
								detail:{
									'type': 'boolean',
									'editor': null
								},
								grid:{
									'type': 'boolean',
									'editor': null
								}
							},
							'isforboq':{
								detail:{
									'type': 'boolean',
									'editor': null
								},
								grid:{
									'type': 'boolean',
									'editor': null
								}
							},
							'descriptioninfo': {
								editor: null
							},
							'comment': {
								editor: null
							},
							'remark': {
								editor: null
							},
							'sorting': {
								editor: null
							},
							/* 'estevaluationsequencefk': basicsLookupdataConfigGenerator.provideReadOnlyConfig(
							 'estimate.lookup.evaluationSequence',
							 'Description',
							 {
							 imageSelectorService: 'estimateRuleComplexLookupProcessService',
							 showIcon : true
							 }
							 ), */
							'estevaluationsequencefk': {
								readonly: true,
								detail: {
									type: 'directive',
									directive: 'estimate-Rule-Sequence-Lookup',
									option: {
										lookupType: 'estsequences',
										eagerLoad: true,
										valueMember: 'Id',
										displayMember: 'DescriptionInfo.Translated',
										imageSelector: 'estimateSequenceLookupProcessService',
										showIcon: true
									}
								},
								grid: {
									editor: 'lookup',
									editorOptions: {
										lookupDirective: 'estimate-Rule-Sequence-Lookup',
										lookupOptions: {
											lookupType: 'estsequences',
											eagerLoad: true,
											valueMember: 'Id',
											displayMember: 'DescriptionInfo.Translated',
											imageSelector: 'estimateSequenceLookupProcessService',
											showIcon: true
										}
									},
									formatter: 'lookup',
									formatterOptions: {
										dataServiceName: 'estimateRuleSequenceLookupService',
										lookupType: 'estsequences',
										displayMember: 'DescriptionInfo.Translated',
										valueMember: 'Id',
										imageSelector: 'estimateSequenceLookupProcessService'
									},
								}
							},
							'estruleexecutiontypefk': basicsLookupdataConfigGenerator.provideReadOnlyConfig('estimate.lookup.estRuleExecutionType', 'Description'),
							'basrubriccategoryfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'basicsMasterDataRubricCategoryLookupDataService',
								enableCache: true,
								readonly: true,
								filter: function () {
									return 70; // Rubric 'Estimate' from [BAS_RUBRIC]
								}
							}),
							'formfk':basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'estimateRuleUserformLookupService',
								enableCache: true,
								readonly: true,
								filter: function () {
									return 70; // Rubric 'Estimate' from [BAS_RUBRIC]
								}
							})
						}
					};
				},

				getProjectMainEstRuleLayout: function () {
					return {
						'fid': 'project.main.est.rule.detailform',
						'addValidationAutomatically': true,
						'overloads': {
							'icon': {
								'grid': {
									editor: 'imageselect',
									editorOptions: {
										serviceName: 'basicsCustomizeRuleIconService'
									},
									formatter: 'imageselect',
									formatterOptions: {
										serviceName: 'basicsCustomizeRuleIconService'
									}
								}
							},
							'code': {
								grid: {
									editor: 'directive',
									formatter: 'code',
									required: true,
									editorOptions: {
										showClearButton: true,
										directive: 'project-main-rule-code-lookup',
										lookupField: 'Code',
										gridOptions: {
											multiSelect: false
										},
										isTextEditable: true
									}
								}
							},
							'operand':{
								detail:{
									'type': 'decimal'
								},
								grid:{
									'type': 'decimal'
								}
							},
							'isforestimate':{
								detail:{
									'type': 'boolean'
								},
								grid:{
									'type': 'boolean'
								}
							},
							'isforboq':{
								detail:{
									'type': 'boolean'
								},
								grid:{
									'type': 'boolean'
								}
							},
							'descriptioninfo': {
								detail: {
									maxLength: 255
								},
								grid: {
									maxLength: 255
								}
							},
							/* 'estevaluationsequencefk': basicsLookupdataConfigGenerator.provideGenericLookupConfig(
							 'estimate.lookup.evaluationSequence',
							 'Description',
							 {
							 imageSelectorService: 'estimateRuleComplexLookupProcessService',
							 showIcon : true
							 }
							 ), */
							'estevaluationsequencefk': {
								detail: {
									type: 'directive',
									directive: 'estimate-Rule-Sequence-Lookup',
									option: {
										lookupType: 'estsequences',
										eagerLoad: true,
										valueMember: 'Id',
										displayMember: 'DescriptionInfo.Translated',
										imageSelector: 'estimateSequenceLookupProcessService',
										showIcon: true
									}
								},
								grid: {
									editor: 'lookup',
									editorOptions: {
										lookupDirective: 'estimate-Rule-Sequence-Lookup',
										lookupOptions: {
											lookupType: 'estsequences',
											eagerLoad: true,
											valueMember: 'Id',
											displayMember: 'DescriptionInfo.Translated',
											imageSelector: 'estimateSequenceLookupProcessService',
											showIcon: true
										}
									},
									formatter: 'lookup',
									formatterOptions: {
										dataServiceName: 'estimateRuleSequenceLookupService',
										lookupType: 'estsequences',
										displayMember: 'DescriptionInfo.Translated',
										valueMember: 'Id',
										imageSelector: 'estimateSequenceLookupProcessService'
									},
								}
							},
							'estruleexecutiontypefk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('estimate.lookup.estRuleExecutionType', 'Description'),
							'basrubriccategoryfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'basicsMasterDataRubricCategoryLookupDataService',
								enableCache: true,
								filter: function () {
									return 70; // Rubric 'Estimate' from [BAS_RUBRIC]
								}
							}),
							'formfk':basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'estimateRuleUserformLookupService',
								enableCache: true,
								filter: function () {
									return 70; // Rubric 'Estimate' from [BAS_RUBRIC]
								}
							})
						}
					};
				},

				getEstimateRuleParameterLayout: function () {
					return {
						'fid': 'estimate.rule.parameter.detailform',
						'version': '1.0.0',
						'showGrouping': true,
						'addValidationAutomatically': true,
						'groups': [
							{
								'gid': 'baseGroup',
								'attributes': ['info','estparametergroupfk', 'descriptioninfo', 'code', 'sorting', 'valuedetail', 'uomfk', 'defaultvalue', 'valuetype', 'islookup']

							},
							{
								'gid': 'entityHistory',
								'isHistory': true
							}
						],

						'overloads': {
							'info': {
								'grid': {

									isTransient: false,
									editor: 'lookup',
									editorOptions: {
										'directive': 'estimate-rule-parameter-complex-lookup',
										lookupOptions: {
											showClearButton: false,
											showEditButton: false,
											showIcon: false
										}

									},
									field: 'image',
									formatter: 'image',
									formatterOptions: {
										imageSelector: 'estimateRuleParameterProcessor',
										dataServiceMethod: 'getListAsync',
										itemName: 'EstRuleParams',
									}
								}
							},
							'code': {
								'detail': {
									'type': 'directive',
									'model': 'Code',
									'directive': 'basics-common-limit-input',
									'options': {
										validKeys: {
											regular: '^([a-zA-Z_][a-zA-Z0-9_]{0,15})?$'
										}
									}
								},
								'grid': {
									editor: 'directive',
									editorOptions: {
										directive: 'basics-common-limit-input',
										validKeys: {
											regular: '^([a-zA-Z_][a-zA-Z0-9_]{0,15})?$'
										}
									}
								}
							},
							'descriptioninfo': {
								detail: {
									maxLength: 255
								},
								grid: {
									maxLength: 255
								}
							},
							'estparametergroupfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'estParamGroupLookupDataService',
								cacheEnable: true
							}),
							'uomfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'basicsUnitLookupDataService',
								cacheEnable: true
							}),
							'valuetype': {
								'grid': {
									editor: 'lookup',
									editorOptions: {
										directive: 'estimate-rule-parameter-type-lookup'
									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'ParameterValueType',
										dataServiceName: 'estimateRuleParameterTypeDataService',
										displayMember: 'Description'
									},
									width: 100
								},
								detail: {
									type: 'directive',
									directive: 'estimate-rule-parameter-type-lookup',
									// 'model': 'ActivityTypeFk',
									options: {
										descriptionMember: 'Description'
									},
									change: 'change'
								}
							},
							'defaultvalue': {
								'grid': {
									editor: 'dynamic',
									formatter: 'dynamic',
									domain: function (item, column) {
										let domain;

										if (item.IsLookup === true) {
											if(item.ValueType === estimateRuleParameterConstant.TextFormula){
												domain = 'directive';
												column.field = 'ValueText';
												// column.ValueText = null;
												column.editorOptions = {
													lookupDirective: 'estimate-rule-parameter-value-lookup',
													lookupType: 'RuleParameterValueLookup',
													dataServiceName: 'estimateRuleParameterValueLookupService',
													displayMember: 'DescriptionInfo.Translated',
													isTextEditable: true,
													multiSelect: true,
													showClearButton: true
												};

												column.formatterOptions = {
													lookupType: 'RuleParameterValueLookup',
													dataServiceName: 'estimateRuleParameterValueLookupService',
													displayMember: 'DescriptionInfo.Translated',
													// displayMember: 'Value',
													field: 'ValueText',
													isTextEditable: true,
													multiSelect: true,
													showClearButton: true
												};
											}else{
												domain = 'lookup';
												column.field = 'DefaultValue';
												column.regex = null;
												column.ValueText = null;
												column.editorOptions = {
													lookupDirective: 'estimate-rule-parameter-value-lookup',
													lookupType: 'RuleParameterValueLookup',
													dataServiceName: 'estimateRuleParameterValueLookupService',
													valueMember: 'Id',
													displayMember: 'DescriptionInfo.Translated',
													showClearButton: true
												};

												column.formatterOptions = {
													lookupType: 'RuleParameterValueLookup',
													dataServiceName: 'estimateRuleParameterValueLookupService',
													displayMember: 'DescriptionInfo.Translated',
													'valueMember': 'Id'
												};
											}

										}
										else {

											if(item.ValueType === estimateRuleParameterConstant.Boolean ){

												domain = 'boolean';
												column.DefaultValue = null;
												column.ValueText = null;
												column.field = 'DefaultValue';
												column.editorOptions = null;
												column.formatterOptions = null;

											}else if(item.ValueType === estimateRuleParameterConstant.Text || item.ValueType === estimateRuleParameterConstant.TextFormula){

												domain = 'description';
												column.DefaultValue = 0;
												column.field = 'ValueText';
												column.editorOptions = null;
												column.formatterOptions = null;
												column.maxLength= 255;
												column.regex = null;

											}else{   // means the valueType is Decimal2 or the valueType is Undefined

												domain = 'quantity';
												column.field = 'DefaultValue';
												column.ValueText = null;
												column.editorOptions = { decimalPlaces: 3 };
												column.formatterOptions = { decimalPlaces: 3 };
											}
										}
										return domain;
									},
									width: 100
								}
							}
						}
					};
				},

				getProjectMainEstRuleParamLayout: function (options) {
					return {
						'fid': 'estimate.rule.prj.est.param.detailform',
						'version': '1.0.0',
						'showGrouping': true,
						'addValidationAutomatically': true,
						'groups': [
							{
								'gid': 'baseGroup',
								'attributes': ['info', 'estparametergroupfk', 'descriptioninfo', 'code', 'sorting', 'valuedetail', 'uomfk', 'defaultvalue','valuetype', 'islookup']
							},
							{
								'gid': 'entityHistory',
								'isHistory': true
							}
						],

						'overloads': {
							'info': {
								'grid': {
									isTransient: true,
									editor: 'lookup',
									editorOptions: {
										'directive': 'estimate-rule-parameter-complex-lookup',
										lookupOptions: {
											'showClearButton': false,
											'showEditButton': false
										}
									},
									field: 'image',
									formatter: 'image',
									formatterOptions: {
										imageSelector: 'estimateProjectEstimateRuleParameterProcessor',
										dataServiceMethod: 'getListAsync',
										itemName: 'ProjectRuleParams',
									}
								}
							},
							'code': {
								'detail': {
									'type': 'directive',
									'directive': 'basics-common-limit-input',
									'options': {
										validKeys: {
											regular: '^([a-zA-Z_][a-zA-Z0-9_]{0,15})?$'
										}
									}
								},
								'grid': {
									editor: 'directive',
									formatter: 'code',
									editorOptions: {
										directive: 'basics-common-limit-input',
										validKeys: {
											regular: '^([a-zA-Z_][a-zA-Z0-9_]{0,15})?$'
										}
									}
								}
							},
							'descriptioninfo': {
								detail: {
									maxLength: 255
								},
								grid: {
									maxLength: 255
								}
							},
							'estparametergroupfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'estParamGroupLookupDataService',
								cacheEnable: true
							}),
							'uomfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'basicsUnitLookupDataService',
								cacheEnable: true
							}),
							'valuetype': {
								'grid': {
									editor: 'lookup',
									editorOptions: {
										directive: 'estimate-rule-parameter-type-lookup'
									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'ParameterValueType',
										dataServiceName: 'estimateRuleParameterTypeDataService',
										displayMember: 'Description'
									},
									width: 100
								},
								detail: {
									type: 'directive',
									directive: 'estimate-rule-parameter-type-lookup',
									// 'model': 'ActivityTypeFk',
									options: {
										descriptionMember: 'Description'
									},
									change: 'change'
								}
							},
							'defaultvalue': {
								'grid': {
									editor: 'dynamic',
									formatter: 'dynamic',
									domain: function (item, column) {
										let domain;
										if (item.IsLookup === true) {
											if(item.ValueType === estimateRuleParameterConstant.TextFormula) {

												domain = 'directive';
												column.field = 'ValueText';
												// column.ValueText = null;
												column.editorOptions = {
													lookupDirective: 'project-estimate-rule-parameter-value-lookup',
													lookupType: 'PrjRuleParameterValueLookup',
													dataServiceName: 'projectEstimateRuleParameterValueLookupService',
													displayMember: 'DescriptionInfo.Translated',
													isTextEditable: true,
													multiSelect: true,
													showClearButton: true
												};

												column.formatterOptions = {
													lookupType: 'PrjRuleParameterValueLookup',
													dataServiceName: 'projectEstimateRuleParameterValueLookupService',
													displayMember: 'DescriptionInfo.Translated',
													// displayMember: 'Value',
													field: 'ValueText',
													isTextEditable: true,
													multiSelect: true,
													showClearButton: true
												};
											}else{
												domain = 'lookup';
												column.field = 'DefaultValue';
												column.regex = null;
												column.ValueText = null;
												column.editorOptions = {
													lookupDirective: 'project-estimate-rule-parameter-value-lookup',
													lookupType: 'PrjRuleParameterValueLookup',
													dataServiceName: 'projectEstimateRuleParameterValueLookupService',
													valueMember: 'Id',
													displayMember: 'DescriptionInfo.Translated',
													showClearButton: true
												};
												column.formatterOptions = {
													lookupType: 'PrjRuleParameterValueLookup',
													dataServiceName: 'projectEstimateRuleParameterValueLookupService',
													displayMember: 'DescriptionInfo.Translated',
													valueMember: 'Id'
												};
											}

											if(options && options.paramValueDataServiceName){
												column.editorOptions.paramValueDataServiceName = options ? options.paramValueDataServiceName : null;
												column.editorOptions.lookupOptions = {
													paramValueDataServiceName: options.paramValueDataServiceName
												};
											}
										}
										else {

											if(item.ValueType === estimateRuleParameterConstant.Boolean ){
												domain = 'boolean';
												column.DefaultValue = 0;
												column.ValueText = null;
												column.field = 'DefaultValue';
												column.editorOptions = null;
												column.formatterOptions = null;
												column.regex = null;

											}else if(item.ValueType === estimateRuleParameterConstant.Text || item.ValueType === estimateRuleParameterConstant.TextFormula ){

												domain = 'description';
												column.DefaultValue = 0;
												column.field = 'ValueText';
												column.editorOptions = null;
												column.formatterOptions = null;
												column.maxLength= 255;
												column.regex = null;

											}else{   // means the valueType is Decimal2 or the valueType is Undefined

												domain = 'quantity';
												column.ValueText = null;
												column.field = 'DefaultValue';
												column.editorOptions = { decimalPlaces: 3 };
												column.formatterOptions = { decimalPlaces: 3 };
											}
										}
										return domain;
									},
									width: 100
								}
							}
						}
					};
				},

				getAssembliesRuleDetailLayout: function () {
					return {
						'fid': 'estimate.rule.prj.est.rule.detailform',
						'version': '1.0.0',
						'showGrouping': true,
						'groups': [
							{
								'gid': 'baseGroup',
								'attributes': ['icon', 'code', 'descriptioninfo', 'estruleexecutiontypefk', 'estevaluationsequencefk', 'basrubriccategoryfk', 'comment', 'remark',  'sorting']
							},
							{
								'gid': 'entityHistory',
								'isHistory': true
							}
						],

						'overloads': {
							'icon': {
								'grid': {
									editor: null,
									formatter: 'imageselect',
									formatterOptions: {
										serviceName: 'basicsCustomizeRuleIconService'
									}
								}
							},
							'code': {
								editor: null,
								navigator: {
									moduleName: $translate.instant('estimate.main' + '.ruleExecutionOutput.ruleScript'),
									navFunc: function (item, triggerField) {
										let navigator = naviService.getNavigator('estimate.rule-script');
										naviService.navigate(navigator, item, triggerField);
									}
								}
							},
							'descriptioninfo': {
								editor: null
							},
							'comment': {
								editor: null
							},
							'remark': {
								editor: null
							},
							// 'islive': {
							// editor: null
							//  },
							'sorting': {
								editor: null
							},
							'estevaluationsequencefk':{
								readonly : true,
								detail:{
									type : 'directive',
									directive : 'estimate-Rule-Sequence-Lookup',
									option : {
										lookupType: 'estsequences',
										eagerLoad: true,
										valueMember: 'Id',
										displayMember: 'DescriptionInfo.Translated',
										imageSelector: 'estimateSequenceLookupProcessService',
										showIcon : true
									}
								},
								grid:{
									editor : 'lookup',
									editorOptions : {
										lookupDirective: 'estimate-Rule-Sequence-Lookup',
										lookupOptions: {
											lookupType: 'estsequences',
											eagerLoad: true,
											valueMember: 'Id',
											displayMember: 'DescriptionInfo.Translated',
											imageSelector: 'estimateSequenceLookupProcessService',
											showIcon : true
										}
									},
									formatter : 'lookup',
									formatterOptions : {
										dataServiceName : 'estimateRuleSequenceLookupService',
										lookupType: 'estsequences',
										displayMember: 'DescriptionInfo.Translated',
										valueMember: 'Id',
										imageSelector: 'estimateSequenceLookupProcessService'
									},
								}
							},
							'estruleexecutiontypefk': basicsLookupdataConfigGenerator.provideReadOnlyConfig('estimate.lookup.estRuleExecutionType', 'Description'),
							'basrubriccategoryfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'basicsMasterDataRubricCategoryLookupDataService',
								enableCache: true,
								readonly: true,
								filter: function () {
									return 70; // Rubric 'Estimate' from [BAS_RUBRIC]
								}
							})
						}
					};
				}

			};

			function loadProjectMainService(projectMainService, item, triggerField, navigator) {
				projectMainService.deselect();
				projectMainService.load().then(function () {
					let projectToSelect = projectMainService.getItemById($injector.get('estimateMainService').getSelectedProjectId());
					projectMainService.setSelected(projectToSelect);
					$timeout(function () {
						naviService.navigate(navigator, item, triggerField);
					}, 251);
				});
			}
		}
	]);
})(angular);

