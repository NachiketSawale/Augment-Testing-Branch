(angular => {
	'use strict';

	angular.module('cloud.desktop').directive('pinnedItem', pinnedItem);
	pinnedItem.$inject = ['$templateCache'];

	function pinnedItem($templateCache) {
		return {
			restrict: 'E',
			scope: {
				options: '<?'
			},
			template: $templateCache.get('pinned-item-container')
		};
	}
})(angular);
