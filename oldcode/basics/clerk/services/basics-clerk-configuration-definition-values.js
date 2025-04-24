(function (angular) {
	'use strict';

	var mod = angular.module('basics.clerk');


	mod.value('basicsClerkRoleDetailLayout', {
		'fid': 'basics.clerk.roledetailform',
		'version': '1.0.0',
		'showGrouping': true,
		'groups': [
			{
				'gid': 'baseGroup',
				'attributes': ['description']
			},
			{
				'gid': 'entityHistory',
				'isHistory': true
			}
		],
		'overloads': {}
	});
})(angular);

