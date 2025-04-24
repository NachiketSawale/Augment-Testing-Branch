(function (angular) {
	'use strict';
	let modName = 'businesspartner.evaluationschema';
	// mod = angular.module(modName);
	angular.module(modName).value('businessPartnerEvaluationSchemaGroupIconLayoutService', {
		'fid': 'businesspartner.evaluationschema.group.icon.detail',
		'version': '1.0.0',
		'addValidationAutomatically': true,
		'showGrouping': true,
		'groups': [
			{
				'gid': 'basicData',
				'attributes': ['pointsfrom', 'pointsto', 'icon','commenttext']
			},
			{
				'gid': 'entityHistory',
				'isHistory': true
			}
		],
		'translationInfos': {
			'extraModules': [modName],
			'extraWords': {
				PointsFrom: {location: modName, identifier: 'entityPointsFrom', initial: 'From Points'},
				PointsTo: {location: modName, identifier: 'entityPointsTo', initial: 'To Points'},
				Icon: {location: modName, identifier: 'entityIcon', initial: 'Icon'},
				CommentText: {location: modName, identifier: 'entityIconCommentText', initial: 'Comment Text'},
			}
		},
		'overloads': {
			'icon': {
				'detail': {
					'type': 'directive',
					'directive': 'business-partner-evaluation-schema-icon-combobox'
				},
				'grid': {
					lookupField: 'Icon',
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'businessPartnerEvaluationSchemaIcon',
						displayMember: 'Description',
						imageSelector: 'businessPartnerEvaluationSchemaIconProcessor'
					},
					editor: 'lookup',
					editorOptions: {
						lookupField: 'Icon',
						directive: 'business-partner-evaluation-schema-icon-combobox'
					},
					width: 80
				}
			}
		}
	});
})(angular);