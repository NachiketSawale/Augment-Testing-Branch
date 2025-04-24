(((angular, globals) => {
	'use strict';

	let modulename = 'cloud.desktop';
	let directiveName = 'cloudDesktopPinningInfo';

	angular.module(modulename).directive(directiveName, cloudDesktopPinningInfoFn);

	cloudDesktopPinningInfoFn.$inject = ['_', 'cloudDesktopPinningContextService', 'basicsLookupdataPopupService', '$timeout', 'platformTranslateService', 'cloudDesktopPinningFilterService'];

	function cloudDesktopPinningInfoFn(_, cloudDesktopPinningContextService, basicsLookupdataPopupService, $timeout, platformTranslateService, cloudDesktopPinningFilterService) {
		return ({
			restrict: 'E',
			scope: {
				options: '<?'
			},
			templateUrl: globals.appBaseUrl + 'cloud.desktop/templates/cloud-desktop-pinning-info.html',
			link: function (scope) {
				let popupInstance;

				cloudDesktopPinningContextService.onSetPinningContext.register(onSetPinningContext);
				cloudDesktopPinningContextService.onClearPinningContext.register(onClearPinningContext);
				cloudDesktopPinningFilterService.onSetPinningFilter.register(onSetFilterPinningContext);
				cloudDesktopPinningFilterService.onClearPinningFilter.register(onClearFilterPinningContext);

				scope.$on('$locationChangeSuccess', () => {
					refresh();
				});

				scope.pinningOptions = {
					onClearFn: function () {
						if (!_.isNil(popupInstance)) {
							popupInstance.close();
						}
					}
				};

				function onClearFilterPinningContext() {
					refresh();
				}

				function onSetFilterPinningContext() {
					refresh();
				}

				function onClearPinningContext() {
					refresh();
				}

				function onSetPinningContext() {
					refresh();
				}

				function refresh() {
					scope.pinningContexts = cloudDesktopPinningContextService.getVisiblePinningContexts();

					cloudDesktopPinningFilterService.getPinnedFilter().then(result => {
						scope.show = scope.pinningContexts.length || (result !== null && result !== undefined);
					});
				}

				scope.openPopup = (event) => {
					const popupOptions = {
						multiPopup: false,
						plainMode: true,
						hasDefaultWidth: false,
						minWidth: 250,
						maxWidth: 350,
						scope: scope,
						cssClass: 'pinning-context-popup',
						focusedElement: angular.element(event.currentTarget),
						template: `<cloud-desktop-pinned-view-filter data-options="pinningOptions"></cloud-desktop-pinned-view-filter>
<cloud-desktop-filter-pinned-context data-options="pinningOptions"></cloud-desktop-filter-pinned-context>`
					};

					popupInstance = basicsLookupdataPopupService.toggleLevelPopup(popupOptions);

					if (!_.isNil(popupInstance)) {
						popupInstance.opened.then(() => {
							$timeout(() => {
								scope.$digest();
							}, 0);
						});
					}
				};

				// unregister on destroy
				scope.$on('$destroy', function () {
					cloudDesktopPinningContextService.onSetPinningContext.unregister(onSetPinningContext);
					cloudDesktopPinningContextService.onClearPinningContext.unregister(onClearPinningContext);
					cloudDesktopPinningFilterService.onSetPinningFilter.unregister(onSetFilterPinningContext);
					cloudDesktopPinningFilterService.onClearPinningFilter.unregister(onClearFilterPinningContext);
					popupInstance = undefined;
				});

				refresh();
			}
		});
	}
})(angular, globals));
