(function () {
	'use strict';

	angular.module('platform').directive('platformRefreshOn', platformRefreshOn);

	platformRefreshOn.$inject = ['$timeout', '_'];

	function platformRefreshOn($timeout, _) {
		// Stop watchers and events from firing on a scope without destroying it,
		// by disconnecting it from its parent and its siblings' linked lists.
		function disconnectScope(scope) {
			if (!scope.$$disconnected) {
				// we can't destroy the root scope or a scope that has been already destroyed
				if (!scope || scope.$root === scope || scope.$$destroyed) {
					return;
				}

				var parent = scope.$parent;
				scope.$$disconnected = true;

				// See Scope.$destroy
				if (parent.$$childHead === scope) {
					parent.$$childHead = scope.$$nextSibling;
				}

				if (parent.$$childTail === scope) {
					parent.$$childTail = scope.$$prevSibling;
				}

				if (scope.$$prevSibling) {
					scope.$$prevSibling.$$nextSibling = scope.$$nextSibling;
				}

				if (scope.$$nextSibling) {
					scope.$$nextSibling.$$prevSibling = scope.$$prevSibling;
				}

				scope.$$nextSibling = scope.$$prevSibling = null;
			}
		}

		return {
			restrict: 'A',
			scope: true,
			priority: -1000,
			link: function (scope, elem, attr) {
				var unregister = [];

				unregister.push(scope.$parent.$on('$destroy', function () {
					scope.$destroy();

					_.over(unregister)();
					unregister = null;
				}));

				unregister.push(scope.$parent.$watchCollection(attr.platformRefreshOn, function () {
					disconnectScope(scope);

					$timeout(function () {
						scope.$digest();
					}, 150, false);
				}));
			}
		};
	}
})();