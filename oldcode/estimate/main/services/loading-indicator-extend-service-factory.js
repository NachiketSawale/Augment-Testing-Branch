/**
 * Created by janas on 17.04.2015.
 */

(function () {

	'use strict';

	let moduleName = 'estimate.main';

	// TODO: use better way to extend controller's scope, e.g.
	// http://stackoverflow.com/questions/21483555/angular-js-best-practice-extending-controllers-overriding-controller-defaults
	// TODO: move refactored service to base/platform

	angular.module(moduleName).factory('loadingIndicatorExtendServiceFactory', ['$timeout',
		function ($timeout) {

			function createService(scope, delayInMs, isLoadingProperty, startLoadingEvent, endLoadingEvent) {
				let service = {};
				let timerOverlayDelayMap = {};
				delayInMs = (delayInMs > 0) ? delayInMs : 0;
				isLoadingProperty = (isLoadingProperty) ? isLoadingProperty : 'isLoading';

				service.showLoadingIndicator = function showLoadingIndicator() {
					if (!timerOverlayDelayMap[scope.$id]) {
						timerOverlayDelayMap[scope.$id] = $timeout(function () {
							scope[isLoadingProperty] = true;
						}, delayInMs);
					}
				};

				service.hideLoadingIndicator = function hideLoadingIndicator() {
					if (timerOverlayDelayMap[scope.$id]) {
						$timeout.cancel(timerOverlayDelayMap[scope.$id]);
						delete timerOverlayDelayMap[scope.$id];
					}
					scope[isLoadingProperty] = false;
				};

				if(angular.isDefined(startLoadingEvent) && startLoadingEvent !== null && angular.isDefined(endLoadingEvent) && endLoadingEvent !== null) {
					startLoadingEvent.register(service.showLoadingIndicator);
					endLoadingEvent.register(service.hideLoadingIndicator);
				}

				// un-register on destroy
				scope.$on('$destroy', function () {
					if(angular.isDefined(startLoadingEvent) && startLoadingEvent !== null && angular.isDefined(endLoadingEvent) && endLoadingEvent !== null) {
						startLoadingEvent.unregister(service.showLoadingIndicator);
						endLoadingEvent.unregister(service.hideLoadingIndicator);
					}
				});

				return service;
			}

			function createServiceForDataServiceFactory(scope, delayInMs, dataService, isLoadingProperty) {
				let loadingIndicator = createService(scope, delayInMs, isLoadingProperty);

				dataService.registerListLoadStarted(loadingIndicator.showLoadingIndicator);
				dataService.registerListLoaded(loadingIndicator.hideLoadingIndicator);

				// un-register on destroy
				scope.$on('$destroy', function () {
					dataService.unregisterListLoadStarted(loadingIndicator.showLoadingIndicator);
					dataService.unregisterListLoaded(loadingIndicator.hideLoadingIndicator);
				});
			}

			return {
				createService: createService,
				createServiceForDataServiceFactory: createServiceForDataServiceFactory
			};

		}]);
})();
