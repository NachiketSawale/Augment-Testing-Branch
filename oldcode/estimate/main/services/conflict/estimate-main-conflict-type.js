(function (angular) {
	'use strict';

	/**
	 * Defines the conflict types for estimates.
	 */
	angular.module('estimate.main').value('estimateMainConflictType', {
		LineItem: 'EstLineItemEntity',
		Resource: 'EstResourceEntity',
	});
})(angular);