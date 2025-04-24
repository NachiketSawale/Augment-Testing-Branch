(angular => {
	'use strict';

	angular.module('cloud.desktop').directive('cloudDesktopPinnedViewFilter', cloudDesktopPinnedViewFilter);
	cloudDesktopPinnedViewFilter.$inject = ['$compile', 'cloudDesktopPinningFilterService'];

	function cloudDesktopPinnedViewFilter($compile, cloudDesktopPinningFilterService) {
		return {
			restrict: 'E',
			scope: {
				options: '<?'
			},
			link: link
		};

		function link(scope, elem) {
			scope.pinnedOptions = {
				icon: 'control-icons ico-filter',
				deleteTitle: 'Remove filter item from Context',
				fn: function () {
					scope.clearPinnedFilter();
				}
			};

			// if something changed in filter
			cloudDesktopPinningFilterService.onSetPinningFilter.register(onSetPinningFilter);

			function onSetPinningFilter(filter) {
				processPinnedFilter(filter.filter);
			}

			function init() {
				cloudDesktopPinningFilterService.getPinnedFilter().then(filter => {
					processPinnedFilter(filter);
				});
			}

			function processPinnedFilter(filter) {
				elem.empty();
				if (filter) {
					scope.pinnedOptions.title = filter.displayName;
					scope.pinnedOptions.info = filter.displayName;

					elem.append($compile('<pinned-item data-options="pinnedOptions"></pinned-item>')(scope));
				}
			}

			scope.clearPinnedFilter = function () {
				cloudDesktopPinningFilterService.clearPinnedFilter();

				let onClearFn = _.get(scope, 'options.onClearFn');
				if (_.isFunction(onClearFn)) {
					onClearFn();
				}
			};

			// unregister on destroy
			scope.$on('$destroy', function () {
				cloudDesktopPinningFilterService.onSetPinningFilter.unregister(onSetPinningFilter);
			});

			init();
		}
	}
})(angular);
