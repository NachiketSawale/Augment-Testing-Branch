(function (angular) {
	'use strict';

	/**
	 * Defines the conflict version types.
	 */
	angular.module('basics.common').value('conflictVersionType', {
		MyLocalEntity: 1,
		OthersEntity: 2,
		ApplyEntity: 3
	});
})(angular);