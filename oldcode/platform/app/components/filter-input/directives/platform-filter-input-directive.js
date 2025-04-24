/* global globals, moment */

(function () {
	'use strict';

	angular.module('platform').directive('platformFilterInputDirective', ['$timeout', '$templateCache', '$sanitize',
		function ($timeout, $templateCache, $sanitize) {

			function linkFn($scope, $elem) {
				const uuid = $scope.$parent.getContainerUUID ? $scope.$parent.getContainerUUID() : '';
				const scopeRef = $scope;
				const elemRef = $elem;

				//const filterInputElem = document.getElementsByClassName(uuid)[0].getElementsByClassName('filterinput')[0];
				const filterInputElem = elemRef[0].getElementsByClassName('filterinput')[0];
				//const filterPanelElemNg = document.getElementsByClassName(uuid)[0].getElementsByClassName('filterPanel')[0];
				//const filterInputElem = $('.' + uuid).find(elemRef).find('.filterinput')[0];
				const filterPanelElem = $('.' + uuid).find(elemRef).find('.filterPanel')[0];

				const searchBothFilterKeyupEvent = new CustomEvent('searchBothFilterKeyup');

				setFilterKeyUp(elemRef);

				const showFilterEventListener = scopeRef.$on('showFilterPanel', handleShowFilterPanel);

				function setFilterKeyUp(ele) {
					var delay = (function () {
						var timer = 0;
						return function (callback, ms) {
							$timeout.cancel(timer);
							timer = $timeout(callback, ms, true);
						};
					})();

					ele.keyup(function (e) {
						delay(function () {
							// clear on Esc
							if (e.which === 27) {
								filterInputElem.value = '';
							}

							filterInputElem.value = $sanitize(filterInputElem.value);
							scopeRef.$emit('searchBothFilterKeyup', filterInputElem);
							filterInputElem.dispatchEvent(searchBothFilterKeyupEvent);

						}, 250);
					});
				}

				function handleShowFilterPanel(event, show) {
					filterPanelElem.style.display = show ? 'block' : 'none';
				}

				// un-register on destroy
				$scope.$on('$destroy', function () {
					showFilterEventListener(); // un-register the listener
				});
			}


			const controller = ['$scope', function ($scope) {
			}];

			return {
				restrict: 'EA',
				scope: {
					ngModel: '=',
					options: '='
				},
				templateUrl:  globals.appBaseUrl + 'app/components/filter-input/templates/platform-filter-input-template.html',
				controller: controller,
				link: linkFn
			};
		}
	]
	);
})();