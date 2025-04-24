/**
 * Created by leo on 17.11.2014.
 */
(function (angular) {
	'use strict';

	var mod = angular.module('scheduling.template');

	// Layout specs
	mod.value('schedulingTemplateActivityTemplateGroupDetailLayout', {
		'fid': 'scheduling.template.activitytemplategroupdetailform',
		'version': '1.0.0',
		'groups': [
			{
				'gid': 'baseGroup',
				'attributes': [ 'code', 'descriptioninfo' ]
			},
			{
				'gid': 'entityHistory',
				'isHistory': true
			}
		],
		'overloads': {
			'code':{
				'readonly': true
			},
			'descriptioninfo':{
				'readonly': true
			}
		}
	} );
})(angular);
