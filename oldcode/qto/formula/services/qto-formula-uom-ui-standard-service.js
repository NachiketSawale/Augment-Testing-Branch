(function () {
	'use strict';
	var modName = 'qto.formula',
		mod = angular.module(modName);

	mod.value('qtoFormulaUomLayout', {
		'fid': 'qto.formula.Uom.detail',
		'version': '1.0.0',
		'addValidationAutomatically': true,
		'showGrouping': false,
		'groups': [
			{
				'gid': 'basicData',
				'attributes': ['uomfk', 'value1isactive', 'operator1', 'value2isactive', 'operator2',
					'value3isactive', 'operator3', 'value4isactive', 'operator4', 'value5isactive', 'operator5'
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
				UomFk: {location: modName, identifier: 'uom', initial: 'uom'}
			}
		},
		'overloads': {
			'uomfk': {
				'detail': {
					'type': 'directive',
					'directive': 'basics-lookupdata-uom-lookup'
				},
				'grid': {
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'uom',
						displayMember: 'Unit'
					},
					editor: 'lookup',
					editorOptions: {
						directive: 'basics-lookupdata-uom-lookup'
					},
					width: 80
				}
			},
			'value1isactive': {
				'mandatory': true,
				'label$tr$param$': {'p_0': '1'},
				'width': 70
			},
			'operator1': {
				'mandatory': true,
				'label$tr$param$': {'p_0': '1'},
				'width': 80
			},
			'value2isactive': {
				'mandatory': true,
				'label$tr$param$': {'p_0': '2'},
				'width': 70
			},
			'operator2': {
				'mandatory': true,
				'label$tr$param$': {'p_0': '2'},
				'width': 80
			},
			'value3isactive': {
				'mandatory': true,
				'label$tr$param$': {'p_0': '3'},
				'width': 70
			},
			'operator3': {
				'mandatory': true,
				'label$tr$param$': {'p_0': '3'},
				'width': 70
			},
			'value4isactive': {
				'mandatory': true,
				'label$tr$param$': {'p_0': '4'},
				'width': 70
			},
			'operator4': {
				'mandatory': true,
				'label$tr$param$': {'p_0': '4'},
				'width': 70
			},
			'value5isactive': {
				'mandatory': true,
				'label$tr$param$': {'p_0': '5'},
				'width': 70
			},
			'operator5': {
				'mandatory': true,
				'label$tr$param$': {'p_0': '5'},
				'width': 70
			}
		}
	});

	mod.factory('qtoFormulaUomUIStandardService',
		['platformUIStandardConfigService', 'qtoFormulaTranslationService',
			'qtoFormulaUomLayout', 'platformSchemaService',

			function (platformUIStandardConfigService, translationService, layout, platformSchemaService) {

				var BaseService = platformUIStandardConfigService;

				var domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'QtoFormulaUomDto',
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
})();
