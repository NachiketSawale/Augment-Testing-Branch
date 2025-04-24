(function (angular) {
	'use strict';

	var mod = angular.module('project.location');

	//Layout specs
	mod.value('projectLocationDetailLayout', {
		fid: 'project.location.detailform',
		version: '0.2.4',
		showGrouping: true,
		addValidationAutomatically: true,
		groups: [
			{
				gid: 'baseGroup',
				attributes: ['code', 'descriptioninfo', 'quantity', 'sorting', 'externalcode']
			},
			{
				gid: 'entityHistory',
				isHistory: true
			}
		],
		overloads: {}
	});

})(angular);

