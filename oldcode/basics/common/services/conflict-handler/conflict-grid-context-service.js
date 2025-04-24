/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 * Defines the service to collect the conflict context
	 */
	angular.module('basics.common').factory('conflictGridContextService', [
		function () {
			let currentConflictGridId = null;
			let conflictResolveProcessor = null;
			return {
				getCurrentConflictGridId: function getCurrentConflictGridId() {
					return currentConflictGridId;
				},
				setCurrentConflictGridId: function setCurrentConflictGridId(value) {
					currentConflictGridId = value;
				},
				setConflictResolve: function setConflictResolve(value) {
					conflictResolveProcessor = value;
				},
				updateRelateColumns: function updateRelateColumns(entity, selectedItem) {
					if(conflictResolveProcessor){
						conflictResolveProcessor.updateRelateColumns(entity, selectedItem);
					}
				}
			};
		}]
	);
})(angular);