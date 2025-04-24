(function (angular) {
	'use strict';
	let modName = 'businesspartner.evaluationschema',
		cloudCommonModule = 'cloud.common';

	angular.module(modName).value('businessPartnerEvaluationSchemaSubgroupLayoutService', {
		'fid': 'businesspartner.evaluationschema.sub.group.detail',
		'version': '1.0.0',
		'addValidationAutomatically': true,
		'showGrouping': true,
		'groups': [
			{
				'gid': 'basicData',
				'attributes': ['descriptioninfo', 'commenttextinfo', 'sorting', 'pointspossible', 'pointsminimum', 'weighting', 'isoptional',
					'iseditable', 'ismultiselect', 'isdefault', 'formula', 'grouporder', 'formfieldfk']
			},
			{
				'gid': 'entityHistory',
				'isHistory': true
			}
		],
		'translationInfos': {
			'extraModules': [modName],
			'extraWords': {
				DescriptionInfo: {
					location: cloudCommonModule,
					identifier: 'entityDescription',
					initial: 'Description'
				},
				Sorting: {location: cloudCommonModule, identifier: 'entitySorting', initial: 'Sorting'},
				PointsPossible: {location: modName, identifier: 'entityPointsPossible', initial: 'Possible Points'},
				PointsMinimum: {location: modName, identifier: 'PointsMinimum', initial: 'Possible Minimum'},
				Weighting: {location: modName, identifier: 'entityWeighting', initial: 'Weighting'},
				IsOptional: {location: modName, identifier: 'entityIsOptional', initial: 'Optional'},
				IsEditable: {location: modName, identifier: 'entityIsEditable', initial: 'Editable'},
				IsMultiSelect: {location: modName, identifier: 'entityIsMultiSelect', initial: 'Multi Select'},
				IsDefault: {location: cloudCommonModule, identifier: 'entityIsDefault', initial: 'Is Default'},
				CommentTextInfo: {location: modName, identifier: 'entityCommentText', initial: 'CommentText'},
				Formula: {location: cloudCommonModule, identifier: 'formula', initial: 'Formula'},
				GroupOrder: {location: modName, identifier: 'groupOrder', initial: 'GroupOrder'},
				FormFieldFk: {location: modName, identifier: 'entityFormField', initial: 'Form Field'},
			}
		},
		'overloads': {
			'grouporder': {
				'readonly': true,
				'width': 60
			},
			'commenttextinfo': {
				'grid': {
					'maxLength': 255
				},
				'detail': {
					'maxLength': 255
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