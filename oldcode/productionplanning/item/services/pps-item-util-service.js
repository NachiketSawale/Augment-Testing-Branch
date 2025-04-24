/**
 * Created by anl on 8/23/2019.
 */

(function () {
	'use strict';
	/* global angular*/

	var moduleName = 'productionplanning.item';
	var itemModule = angular.module(moduleName);
	itemModule.factory('productionplanningItemUtilService', ['$injector', function ($injector) {
		return {
			hasShowContainer: hasShowContainer,
			getExcludedChildServicesForRefreshing:getExcludedChildServicesForRefreshing
		};

		function getExcludedChildServicesForRefreshing(){
			return [
				$injector.get('productionplanningItemEventService'),
				$injector.get('productionplanningItemSubItemDataService')
			];
		}

		function hasShowContainer(containerId, inFront) {
			var show = false;
			var mainViewSrv = $injector.get('mainViewService');
			var subviews = mainViewSrv.getTabs()[mainViewSrv.getActiveTab()].activeView.Config.subviews;
			if (subviews instanceof Array) {
				// find containerId in subviews
				show = subviews.some(function (item) {
					if (item.content instanceof Array) {
						if (!inFront) {
							return item.content.some(function (id) {
								return id === containerId;
							});
						} else {
							return item.content.length > 0 && item.content[item.activeTab] === containerId;
						}
					} else {
						return item.content === containerId;
					}
				});
			}

			return show;
		}

	}]);
})(angular);