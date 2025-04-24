/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {
	'use strict';
	let moduleName = 'estimate.main';

	angular.module(moduleName).directive('estimateMainActivitySchedule', ['BasicsLookupdataLookupDirectiveDefinition', function (BasicsLookupdataLookupDirectiveDefinition) {
		let defaults = {
			lookupType: 'estlineitemschedule',
			valueMember: 'Id',
			displayMember: 'Code',
			uuid: '856fbf790a5b4e2bb7e4269ce43e24cb'
		};

		return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', defaults, {
			dataProvider: 'estimateMainActivityScheduleLookupService'
		});
	}]);
})(angular);
