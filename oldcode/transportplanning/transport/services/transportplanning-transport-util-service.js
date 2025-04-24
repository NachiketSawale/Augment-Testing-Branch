/**
 * Created by zov on 19/11/2018.
 */
(function () {
	'use strict';
	/* global angular*/

	var moduleName = 'transportplanning.transport';
	var transportModule = angular.module(moduleName);
	transportModule.factory('transportplanningTransportUtilService', ['$injector', function ($injector) {
		return {
			hasShowContainer : hasShowContainer,
			hasShowContainerInFront: hasShowContainerInFront
		};

		function hasShowContainer(containerId, inFront) {
			var show = false;
			var mainViewSrv = $injector.get('mainViewService');
			var subviews = mainViewSrv.getTabs()[mainViewSrv.getActiveTab()].activeView.Config.subviews;
			if (subviews instanceof Array) {
				// find containerId in subviews
				show = subviews.some(function (item) {
					if (item.content instanceof Array) {
						if(!inFront){
							return item.content.some(function (id) {
								return id === containerId;
							});
						} else {
							return item.content.length > 0 && item.content[item.activeTab || 0] === containerId;
						}
					} else {
						return item.content === containerId;
					}
				});
			}

			return show;
		}

		function  hasShowContainerInFront(containerId) {
			return hasShowContainer(containerId, true);
		}
	}]);
})(angular);