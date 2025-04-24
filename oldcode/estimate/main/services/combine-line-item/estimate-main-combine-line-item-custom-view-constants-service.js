/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';

	let moduleName = 'estimate.main';
	angular.module(moduleName).value('estimateMainCombineLineItemCustomViewConstants', {
		baseType: {
			Standard: 1,
			ItemUnitCost: 2
		},
		customViewSaveType: {
			user: 1,
			role: 2,
			system: 3
		},
		eventNames: {
			applyNewCustomView: 'APPLY_NEW_CUSTOM_VIEW',
			changeBaseCombinedView: 'CHANGE_BASE_COMBINED_VIEW'
		}
	});
})(angular);
