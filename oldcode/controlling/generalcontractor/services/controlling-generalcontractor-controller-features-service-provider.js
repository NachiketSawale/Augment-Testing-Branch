

(function () {
	'use strict';
	let moduleName = 'controlling.generalcontractor';

	angular.module(moduleName).factory('controllingGeneralcontractorControllerFeaturesServiceProvider', ['_','$translate', 'cloudDesktopPinningContextService',
		function (_,$translate, cloudDesktopPinningContextService) {

			return {
				extendControllerByIsProjectContextService: function extendProjectContextService(scope) {

					scope.overlayInfo = $translate.instant('controlling.generalcontractor.noPinnedProject');

					function onClearPinningContext() {
						scope.showInfoOverlay = true;
					}

					function onSetPinningContext() {
						let context = cloudDesktopPinningContextService.getContext();
						let item =_.find(context, {'token': 'project.main'});

						scope.showInfoOverlay = !(item && item.id);
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
