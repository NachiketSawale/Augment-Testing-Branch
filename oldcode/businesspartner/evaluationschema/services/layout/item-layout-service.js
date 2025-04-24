(function (angular) {
	'use strict';
	let modName = 'businesspartner.evaluationschema',
		cloudCommonModule = 'cloud.common';
		// mod = angular.module(modName);
	angular.module(modName).value('businessPartnerEvaluationSchemaItemLayoutService', {
		'fid': 'businesspartner.evaluationschema.item.detail',
		'version': '1.0.0',
		'addValidationAutomatically': true,
		'showGrouping': true,
		'groups': [
			{
				'gid': 'basicData',
				'attributes': ['descriptioninfo', 'sorting', 'points', 'remarkinfo', 'isdefault', 'formfieldfk']
			},
			{
				'gid': 'entityHistory',
				'isHistory': true
			}
		],
		'translationInfos': {
			'extraModules': [modName],
			'extraWords': {
				Sorting: {location: cloudCommonModule, identifier: 'entitySorting', initial: 'Sorting'},
				IsDefault: {location: cloudCommonModule, identifier: 'entityIsDefault', initial: 'Is Default'},
				DescriptionInfo: {location: cloudCommonModule, identifier: 'entityDescription', initial: 'Description'},
				Points: {location: modName, identifier: 'entityPoints', initial: 'Points'},
				RemarkInfo: {location: modName, identifier: 'entityRemark', initial: 'Remark'},
				FormFieldFk: {location: modName, identifier: 'entityFormField', initial: 'Form Field'},
			}
		},
		'overloads': {
			'remarkinfo': {
				'grid': {
					'maxLength': 2000
				},
				'detail': {
					'maxLength': 2000
				}
			},
			formfieldfk: {
				grid: {
					editor: 'lookup',
					editorOptions: {
						directive: 'basics-user-form-field-combobox',
						lookupOptions: {
							filterKey: 'basformfieldfk-for-evaluation-schema-filter',
							showClearButton: true
						}
					},
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'userformfield',
						displayMember: 'FieldName'
					},
					width: 150
				},
				detail: {
					type: 'directive',
					directive: 'basics-user-form-field-combobox',
					options: {
						filterKey: 'basformfieldfk-for-evaluation-schema-filter',
						showClearButton: true
					}
				}
			}
		}
	});
})(angular);