/**
 * Created by uestuenel on 02.03.2018.
 */
(function () {
	'use strict';

	function cloudDesktopDesktopPager($state, _, cloudDesktopDesktopLayoutSettingsService, $document, keyCodes) {
		return {
			restrict: 'A',
			scope: true,
			templateUrl: globals.appBaseUrl + 'cloud.desktop/templates/desktop-pager.html',
			link: function (scope, elem) {
				scope.pager = {};

				scope.setPage = function (pageIndex) {

					var url = cloudDesktopDesktopLayoutSettingsService.getNexPageForPager(pageIndex, scope.pageInformation);

					scope.$parent.redirectTo(url);
				};

				initPager();

				function initPager() {
					// check if the pages-datas are available
					if (scope.pageInformation) {

						scope.pager.totalPages = scope.pageInformation.length;

						scope.pager.currentPage = getIndexFromJson();
					}
				}

				function getIndexFromJson() {
					return _.findIndex(scope.pageInformation, ['id', getCurrentState().id]);
				}

				function getCurrentState() {
					return $state.current;
				}

				scope.getNextPage = function (current) {
					return current += 1;
				};

				scope.getPrevPage = function (current) {
					return current -= 1;
				};

				function onEvent(event) {
					onArrowKeys(event);
				}

				$document.on('keydown', onEvent);

				function onArrowKeys($event) {
					// right arrow && left arrow, just toggle
					if (angular.element($event.target).is('body') && ($event.keyCode === keyCodes.LEFT || $event.keyCode === keyCodes.RIGHT)) {

						// check go prev or go next Page
						var nextPageIndex = $event.keyCode === keyCodes.LEFT ? scope.pager.currentPage - 1 : scope.pager.currentPage + 1;

						scope.setPage(nextPageIndex);
					}
				}

				var watchPageStructure = scope.$watch(function () {
					return cloudDesktopDesktopLayoutSettingsService.getLastSettingsUpdate();
				}, function (newVal, oldVal) {
					// new old vergleich
					cloudDesktopDesktopLayoutSettingsService.getDesktopPagesStructure().then(function (result) {
						scope.pageInformation = result;
						initPager();
					});
				}, true);

				// un-register on destroy
				scope.$on('$destroy', function () {
					$document.unbind('keydown', onEvent);
					watchPageStructure();
				});

			}
		};
	}

	cloudDesktopDesktopPager.$inject = ['$state', '_', 'cloudDesktopDesktopLayoutSettingsService', '$document', 'keyCodes'];

	angular.module('cloud.desktop').directive('cloudDesktopDesktopPager', cloudDesktopDesktopPager);
})();
