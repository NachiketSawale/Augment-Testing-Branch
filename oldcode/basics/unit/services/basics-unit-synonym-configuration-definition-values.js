(function (angular) {
	'use strict';

	var mod = angular.module('basics.unit');

	// Layout specs
	mod.value('basicsUnitSynonymDetailLayout', {
		fid: 'basics.unit.unitsynonymdetailform',
		version: '1.0.0',
		showGrouping: true,
		addValidationAutomatically: true,
		groups: [
			{
				gid: 'baseGroup',
				attributes: ['synonym', 'quantity', 'roundingprecision', 'commenttext']
			},
			{
				gid: 'entityHistory',
				isHistory: true
			}
		],
		overloads: { }
	});

})(angular);

