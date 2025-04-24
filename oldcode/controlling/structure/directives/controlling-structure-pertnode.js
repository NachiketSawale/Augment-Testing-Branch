/**
 * Created by janas on 26.07.2016.
 */
(function () {

	'use strict';
	var moduleName = 'controlling.structure';

	/**
	 * @ngdoc directive
	 * @name controlling-structure-pertnode
	 * @description pert node used by pert chart
	 **/
	angular.module(moduleName).directive('controllingStructurePertnode', ['globals', '_', 'moment',
		function (globals, _, moment) {
			return {
				restrict: 'AE',
				scope: {n: '=nodeData'},
				templateUrl: globals.appBaseUrl + moduleName + '/templates/pert-node.html',
				link: function (scope/* , element */) {

					// set style
					scope.getStyle = function (node) {
						var hasChildren = node.ControllingUnits !== undefined && node.ControllingUnits.length > 0;
						if (hasChildren) {
							return 'fill:rgba(0,103,177,0.2);stroke:black;stroke-width:2';
						}

						return 'fill:white;stroke:rgb(0,103,177);stroke-width:2';
					};

					// style duration and date
					scope.displayDuration = function (duration) {
						return (duration !== undefined && duration !== null) ? duration + ' days' : ''; // TODO: i18n
					};

					scope.displayDate = function (date) {
						return (date !== undefined && date !== null) ? moment(date).format('L') : '';
					};

					scope.overflowText = function (n, text, maxLen) {
						// TODO: use getComputedTextLength() or set textLength and lengthAdjust of text
						maxLen = (maxLen === undefined) ? n.width / 8 : maxLen;
						return (n.overflowTextEnabled && text !== null && text !== undefined && text.length > maxLen) ? text.substr(0, maxLen) + '...' : text;
					};

					scope.disableOverflowText = function (node) {
						node.overflowTextEnabled = false;
					};

					scope.enableOverflowText = function (node) {
						node.overflowTextEnabled = true;
					};

					/* scope.showOptions = function (node, enabled) {
						node.optionsEnabled = enabled;
					};

					scope.isOptions = function (node) {
						return node.optionsEnabled;
					};

					scope.optionsClick = function (node, event) {
						if (event.altKey) {
							console.log('click with alt');
						} else {
							console.log('click');
						}
						console.log(node);
					}; */

				}
			};
		}
	]);

})();
