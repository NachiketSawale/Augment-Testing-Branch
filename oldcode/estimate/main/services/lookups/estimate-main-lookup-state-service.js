/**
 * Created by janas on 24.09.2015.
 */

(function () {


	'use strict';
	let moduleName = 'estimate.main';

	/**
	 * @ngdoc service
	 * @name estimateMainLookupStateService
	 * @function
	 *
	 * @description
	 * estimateMainLookupStateService provides state information used by some lookups in estimate module
	 */
	angular.module(moduleName).factory('estimateMainLookupStateService', [function () {

		// lookup state
		let prjBoqItems = [],
			prjActivities = [];

		return {
			getProjectBoqItems: function getProjectBoqItems() {
				return prjBoqItems;
			},
			setProjectBoqItems: function setProjectBoqItems(items) {
				prjBoqItems = items;
			},

			getProjectActivity: function getProjectActivity() {
				return prjActivities;
			},
			setProjectActivity: function setProjectActivity(item) {
				prjActivities = item.Activities;
			},
			setActivityData: function setActivityData(item) {
				prjActivities = item;
			},
			clearData: function clearData() {
				prjBoqItems = [];
				prjActivities = [];
			}
		};

	}]);
})();
