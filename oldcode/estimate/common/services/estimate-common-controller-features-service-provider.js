/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	let moduleName = 'estimate.common';
	/**
	 * @ngdoc service
	 * @name estimateCommonControllerFeaturesServiceProvider
	 * @function
	 *
	 * @description
	 * estimateCommonControllerFeaturesServiceProvider provides helper functions to extend a controller.
	 */
	angular.module(moduleName).factory('estimateCommonControllerFeaturesServiceProvider', ['$translate', 'cloudDesktopPinningContextService',
		function ($translate, cloudDesktopPinningContextService) {

			return {
				extendControllerByIsProjectContextService: function extendProjectContextService(scope) {

					scope.overlayInfo = $translate.instant('estimate.common.noPinnedProject');

					function onClearPinningContext() {
						scope.showInfoOverlay = true;
					}

					function onSetPinningContext() {
						let context = cloudDesktopPinningContextService.getPinningItem('project.main');
						scope.showInfoOverlay = !context;
					}

					onSetPinningContext();

					cloudDesktopPinningContextService.onSetPinningContext.register(onSetPinningContext);
					cloudDesktopPinningContextService.onClearPinningContext.register(onClearPinningContext);

					scope.$on('$destroy', function () {
						cloudDesktopPinningContextService.onSetPinningContext.unregister(onSetPinningContext);
						cloudDesktopPinningContextService.onClearPinningContext.unregister(onClearPinningContext);
					});

				}
			};

		}]);
})();
