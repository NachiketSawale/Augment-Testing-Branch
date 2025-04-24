/**
 * Created by wui on 12/15/2017.
 */

/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {
	'use strict';

	let moduleName = 'estimate.main';

	angular.module(moduleName).constant('estimateMainSplitRangeOption', {
		estimate: 1,
		resultSet: 2,
		selectedItems: 3
	});

	angular.module(moduleName).factory('estimateMainSplitLineItemDataService', [
		'estimateMainSplitRangeOption',
		function (estimateMainSplitRangeOption) {
			let service = {
				ranges: [
					{
						id: estimateMainSplitRangeOption.estimate,
						desc: 'Entire Estimate',
						desc$tr$: 'estimate.main.splitLineItemWizard.entireEstimate'
					},
					{
						id: estimateMainSplitRangeOption.resultSet,
						desc: 'Current Result Set',
						desc$tr$: 'estimate.main.splitLineItemWizard.currentResultSet'
					},
					{
						id: estimateMainSplitRangeOption.selectedItems,
						desc: 'Selected Items',
						desc$tr$: 'estimate.main.splitLineItemWizard.selectedItems'
					}
				]
			};

			return service;
		}
	]);

})(angular);
