(function (angular) {
	'use strict';
	let modName = 'businesspartner.evaluationschema',
		cloudCommonModule = 'cloud.common';
		// mod = angular.module(modName);
	angular.module(modName).value('businessPartnerEvaluationSchemaGroupLayoutService', {
		'fid': 'businesspartner.evaluationschema.group.detail',
		'version': '1.0.0',
		'addValidationAutomatically': true,
		'showGrouping': true,
		'groups': [
			{
				'gid': 'basicData',
				'attributes': ['descriptioninfo','commenttextinfo','sorting', 'weighting', 'isdefault', 'isoptional']
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
				IsOptional: {location: modName, identifier: 'entityIsOptional', initial: 'Optional'},
				CommentTextInfo: { location: modName, identifier: 'entityCommentText', initial: 'Comment Text' }
			}
		},
		'overloads': {
			'commenttextinfo': {
				'grid': {
					'maxLength': 255
				},
				'detail': {
					'maxLength': 255
				}
			}
		}
	});
})(angular);