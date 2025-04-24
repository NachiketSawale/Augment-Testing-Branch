(function (angular) {
	'use strict';

	angular.module('cloud.desktop').directive('cloudDesktopTileGroup', ['_', '$window', 'basicsCommonDrawingUtilitiesService', function (_, $window, drawingUtils) {
		return {
			restrict: 'A',
			replace: true,
			scope: {
				groups: '='
			},
			templateUrl: globals.appBaseUrl + 'cloud.desktop/templates/tilegroupdirective.html',
			link: function (scope, element, attr) {
				angular.forEach(scope.groups, function (group) {
					if (group.id === attr.groupName) {
						scope.group = group;
					}
				});

				moveTiles();

				// resize browser window
				angular.element($window).on('resize', moveTiles);

				function moveTiles() {
					// var contentHeight = $('.tiles-wrapper').height() - 55; //h1-tag plus margin
					var contentHeight = $('.desktopViewWrapper').height() - 91; // h1-tag plus pager
					var itemsInColumn = Math.floor(contentHeight / 130); // so many tiles fit in

					// set height for bugfix in firefox.
					$(element).children('.tileGroup').css('height', contentHeight);

					// get items count
					var itemsCount = scope.group.tiles.length;

					var parentContainerWidth = 0;

					/*
					   If the modules appear twice on the pages. Then remove the key 'btngrp' and 'groupInRow' first
					 */
					_.forEach(scope.group.tiles, function (item) {
						if (item.btngrp) {
							item.btngrp = '';
						}
						if (item.groupInRow) {
							item.groupInRow = '';
						}
					});

					for (var x = 0; x < itemsCount; x++) {
						if (scope.group.tiles[x].btngrp !== 'end') {

							scope.group.tiles[x].groupInRow = true;

							/*
								tileSize : 0 -> small
								tileSize: 1 -> long
							 */
							if (scope.group.tiles[x].tileSize === 0 && scope.group.tiles[x].btngrp !== 'end') {
								if (scope.group.tiles[x + 1] && scope.group.tiles[x + 1].tileSize === 0) {
									scope.group.tiles[x].btngrp = 'begin';
									scope.group.tiles[x + 1].btngrp = 'end';
								}
							}
						}
					}

					/*
						widest button -> in one group
						2 small button -> in one group
					 */
					var groupsInTiles = _.filter(scope.group.tiles, 'groupInRow');

					// calculate and set the width of parent container.
					parentContainerWidth = (Math.ceil(groupsInTiles.length / itemsInColumn)) * 260;

					// exist one row in column and exist one small button, then get not 260px rather 130px
					if ((groupsInTiles.length % itemsInColumn === 1) && (_.last(groupsInTiles).tileSize === 0) && (!_.last(groupsInTiles).btngrp)) {
						parentContainerWidth -= 130;
					}

					$(element).css('min-width', (parentContainerWidth + 20));

					/*
						trigger horizontal-scroller with the mouse
					 */
					$(element).parents('.desktopViewWrapper').focus();
					$(element).parents('.desktopViewWrapper').mousewheel(function (event, delta) {
						if (!event.ctrlKey) {
							this.scrollLeft -= (delta * 5);
							event.preventDefault();
						}
					});
				}

				/*
				 parentdirect and redirect is called from child-directive
				 */
				scope.parentdirect = function (route) {
					scope.$parent.redirectTo(route);
				};

				scope.redirect = function (route, event) {
					scope.$parent.redirectTo(route, event);
				};

				scope.$on('$destroy', function () {
					angular.element($window).off('resize', moveTiles);
				});
			}
		};
	}]);
})(angular);
