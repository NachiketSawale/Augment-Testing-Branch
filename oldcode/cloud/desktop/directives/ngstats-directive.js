/**
 * Created by rei on 22.05.2015.
 */

angular.module('cloud.desktop').directive('cloudDesktopNgStats', ['$rootScope', '$parse', '$interval',
	function ($rootScope, $parse, $interval) {
		'use strict';
		var waitTime = 200;
		var knownScopeIds = {};

		// define the timer function to use based upon whether or not 'performance is available'
		var timerNow = window.performance ? function () {
			return window.performance.now();
		} : function () {
			return Date.now();
		};

		return {
			scope: true,
			link: function (scope, el, attrs) {
				var lastRun = {
					watchCount: 0,
					digestLength: 0
				};
				scope.ngStats = {
					watchCount: 0
				};

				if (attrs.hasOwnProperty('watchCount')) {
					setupWatchCount();
				}
				if (attrs.hasOwnProperty('digestLength')) {
					setupDigestLength();
				}

				function setupWatchCount() {
					var watchCountRoot;
					if (attrs.watchCountRoot) {
						if (attrs.watchCountRoot === 'this') {
							watchCountRoot = el;
						} else {
							// In the case this directive is being compiled and it's not in the dom,
							// we're going to do the find from the root of what we have...
							var rootParent = findRootOfElement(el).find('*').andSelf().filter(attrs.watchCountRoot);
							watchCountRoot = angular.element(rootParent);
						}
					} else {
						watchCountRoot = angular.element('html');
					}

					if (!watchCountRoot.length) {
						throw new Error('no element at selector: ' + attrs.watchCountRoot);
					}

					el.on('click', updateWatchCount);

					$interval(function () {
						console.log('check watchers');
						updateWatchCount();
					}, 3000);

					if (attrs.watchCount) {
						scope.$watch(attrs.watchCount, function (val) {
							if (val) {
								setTimeout(function waitForBindonceToFinish() {
									updateWatchCount();
								}, 100);
								$parse(attrs.watchCount).assign(scope, false);
							}
						});
					}

					function updateWatchCount() {
						knownScopeIds = {};
						scope.ngStats.watchCount = getWatcherCount(watchCountRoot, 0);
					}
				}

				function findRootOfElement(el) {
					var parent = el[0];
					while (parent.parentElement) {
						parent = parent.parentElement;
					}
					return angular.element(parent);
				}

				function setupDigestLength() {
					var sum = 0;
					var times = [0, 0, 0, 0];
					var timesIdx = 0;

					// force all $newed up scopes to have the $watches
					var scopePrototype = Object.getPrototypeOf($rootScope);
					var oldDigest = scopePrototype.$digest;
					scopePrototype.$digest = function $digest() {
						var start = timerNow();

						var ret = oldDigest.apply(this, arguments);
						if (start - lastRun.digestLength < waitTime) {
							return ret;
						}
						var end = timerNow();
						var diff = (end - start);
						sum = sum - times[timesIdx] + diff;
						times[timesIdx] = diff;
						timesIdx = (timesIdx + 1) % times.length;
						var avg = sum / times.length;
						scope.ngStats.digestLength = avg.toFixed(2);
						lastRun = end;
						return ret;
					};
				}
			}
		};

		// Utilities
		function getWatcherCount(element, watcherCount) {
			if (!element.length) {
				return watcherCount;
			}
			var isolateWatchers = getWatchersFromScope(element.data().$isolateScope);
			var scopeWatchers = getWatchersFromScope(element.data().$scope);
			var watchers = scopeWatchers.concat(isolateWatchers);
			watcherCount += watchers.length;
			angular.forEach(element.children(), function (childElement) {
				watcherCount += getWatcherCount(angular.element(childElement), 0);
			});
			return watcherCount;
		}

		function getWatchersFromScope(scope) {
			if (!scope || knownScopeIds[scope.$id]) {
				return [];
			}

			knownScopeIds[scope.$id] = true;

			return scope.$$watchers || [];
		}
	}]);
