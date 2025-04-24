/*
 * $Id$
 * Copyright (c) RIB Software GmbH
 */

(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @name platform:platformDataServiceRowReadonlyExtension
	 * @function
	 * @description
	 * platformDataServiceRowReadonlyExtension adds selection behaviour to data services created from the data service factory
	 */
	angular.module('platform').service('platformDataServiceOriginalStateExtension', PlatformDataServiceOriginalStateExtension);

	PlatformDataServiceOriginalStateExtension.$inject = ['_'];

	function PlatformDataServiceOriginalStateExtension(_) {
		/**
		 * @ngdoc function
		 * @name state
		 * @function
		 * @methodOf platform.platformDataServiceOriginalStateExtension
		 * @description saves the internal state of a data item when it is selected
		 * @param entity {object} the entity which original state is to be saved.
		 * @returns state
		 */
		this.saveOriginalState = function saveOriginalState(entity) {
			if (entity && !entity.ConcurrencyExceptionMergeInfo) {
				var shallowCopy = _.clone(entity);

				entity.ConcurrencyExceptionMergeInfo = shallowCopy;
			}
		};
	}
})();