
/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {
	'use strict';
	let moduleName = 'estimate.main';

	angular.module(moduleName).directive('estimateMainWicRootItemLookup', ['BasicsLookupdataLookupDirectiveDefinition', function (BasicsLookupdataLookupDirectiveDefinition) {
		let defaults = {
			lookupType: 'wicboqheaderitems',
			valueMember: 'Id',
			displayMember: 'Reference',
			uuid: '7307E6A897164B4192B24E1EDD6CC521'
		};

		return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', defaults, {
			dataProvider: 'estimateMainWicBoqRootItemLookupService'
		});
	}]);
})(angular);
