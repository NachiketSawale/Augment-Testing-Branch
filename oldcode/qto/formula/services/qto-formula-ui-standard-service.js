(function (angular) {
	'use strict';
	var modName = 'qto.formula',
		cloudCommonModule = 'cloud.common',
		mod = angular.module(modName);

	mod.service('qtoFormulaDataLayout', ['basicsLookupdataConfigGenerator', function (basicsLookupdataConfigGenerator) {
		return {
			'fid': 'qto.formula.detail',
			'version': '1.0.0',
			'addValidationAutomatically': true,
			'showGrouping': false,
			'groups': [
				{
					'gid': 'basicData',
					'attributes': ['code', 'descriptioninfo', 'icon', 'value1isactive', 'operator1', 'value2isactive', 'operator2',
						'value3isactive', 'operator3', 'value4isactive', 'operator4', 'value5isactive', 'operator5',
						'qtoformulatypefk',  'isdefault', 'ismultiline', 'maxlinenumber', 'isdialog', 'islive', 'basformfk'
					]
				},
				{
					'gid': 'entityHistory',
					'isHistory': true
				}
			],
			'translationInfos': {
				'extraModules': [modName],
				'extraWords': {
					Code: {location: cloudCommonModule, identifier: 'entityCode', initial: 'Code'},
					Icon: {location: modName, identifier: 'icon', initial: 'icon'},
					Value1IsActive: {location: modName, identifier: 'value', initial: 'value', param: {'p_0': '1'}},
					Operator1: {location: modName, identifier: 'operator', initial: 'operator', param: {'p_0': '1'}},
					Value2IsActive: {location: modName, identifier: 'value', initial: 'value', param: {'p_0': '2'}},
					Operator2: {location: modName, identifier: 'operator', initial: 'operator', param: {'p_0': '2'}},
					Value3IsActive: {location: modName, identifier: 'value', initial: 'value', param: {'p_0': '3'}},
					Operator3: {location: modName, identifier: 'operator', initial: 'operator', param: {'p_0': '3'}},
					Value4IsActive: {location: modName, identifier: 'value', initial: 'value', param: {'p_0': '4'}},
					Operator4: {location: modName, identifier: 'operator', initial: 'operator', param: {'p_0': '4'}},
					Value5IsActive: {location: modName, identifier: 'value', initial: 'value', param: {'p_0': '5'}},
					Operator5: {location: modName, identifier: 'operator', initial: 'operator', param: {'p_0': '5'}},
					QtoFormulaTypeFk: {location: modName, identifier: 'formulaType', initial: 'formulaType'},
					IsDefault: {location: modName, identifier: 'isdefault', initial: 'isdefault'},
					IsMultiline: {location: modName, identifier: 'ismultiline', initial: 'ismultiline'},
					MaxLinenumber: {location: modName, identifier: 'maxlinenumber', initial: 'maxlinenumber'},
					IsDialog: {location: modName, identifier: 'isdialog', initial: 'isdialog'},
					BasFormFk: {location: modName, identifier: 'basformfk', initial: 'basformfk'},
					IsLive: {location: modName, identifier: 'islive', initial: 'islive'}
				}
			},
			'overloads': {
				'code': {mandatory: true, required: true,regex: '^[0-9]{0,3}$'},
				'icon': {
					'detail': {
						'type': 'directive',
						'directive': 'qto-formula-icon-combobox'
					},
					'grid': {
						lookupField: 'Icon',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'qtoFormulaIcon',
							displayMember: 'Description',
							imageSelector: 'qtoFormulaIconProcessor',
						},
						editor: 'lookup',
						editorOptions: {
							lookupField: 'Icon',
							directive: 'qto-formula-icon-combobox',
							'lookupOptions': {
								'lookupType': 'qtoFormulaIcon'
							}
						},
						width: 80
					}
				},
				'value1isactive': {
					'mandatory': true,
					'width': 70
				},
				'operator1': {
					'mandatory': true,
					'width': 80
				},
				'value2isactive': {
					'width': 70
				},
				'operator2': {
					'mandatory': true,
					'width': 80
				},
				'value3isactive': {
					'mandatory': true,
					'width': 70
				},
				'operator3': {
					'mandatory': true,
					'width': 70
				},
				'value4isactive': {
					'mandatory': true,
					'width': 70
				},
				'operator4': {
					'mandatory': true,
					'width': 70
				},
				'value5isactive': {
					'mandatory': true,
					'width': 70
				},
				'operator5': {
					'mandatory': true,
					'width': 70
				},
				'qtoformulatypefk': {
					'detail': {
						'type': 'directive',
						'directive': 'qto-formula-type-combobox'
					},
					'grid': {
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'QtoFormulaType',
							valueMember: 'Id',
							displayMember: 'Description'
						},
						editor: 'lookup',
						editorOptions: {
							directive: 'qto-formula-type-combobox'
						},
						width: 120
					}
				},
				'isdefault': {
					'mandatory': true
				},
				'ismultiline': {
					'mandatory': true
				},
				'maxlinenumber': {
					'mandatory': true,
					'regex': '^[0-9]{0,3}$'
				},
				'islive': {
					'mandatory': true
				},
				'basformfk':basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'qtoFormulaUserformLookupService',
					enableCache: true,
					filter: function () {
						return 87; // Rubric 'Qto Formula' from [BAS_RUBRIC]
					}
				})
			}
		};
	}]);

	mod.factory('qtoFormulaDataUIStandardService',
		['platformUIStandardConfigService', 'qtoFormulaTranslationService',
			'qtoFormulaDataLayout', 'platformSchemaService',

			function (platformUIStandardConfigService, translationService, layout, platformSchemaService) {

				var BaseService = platformUIStandardConfigService;

				var domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'QtoFormulaDto',
					moduleSubModule: 'Qto.Formula'
				});
				if (domainSchema) {
					domainSchema = domainSchema.properties;
				}
				function UIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				UIStandardService.prototype = Object.create(BaseService.prototype);
				UIStandardService.prototype.constructor = UIStandardService;

				return new BaseService(layout, domainSchema, translationService);
			}
		]);
})(angular);
