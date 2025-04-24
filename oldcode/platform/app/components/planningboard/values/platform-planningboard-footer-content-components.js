/* global d3: false */
(function () {
	'use strict';
	angular.module('platform').factory('platformPlanningBoardFooterComponents', ['moment',
		function (moment) {
			// monkey patching
			if (!d3.selection.prototype.parent) {
				d3.selection.prototype.parent = function selectParent() {
					return this.select(function () {
						return this.parentNode;
					});
				};
			}

			return {
				footerBackground: function footerBackground() {
					var panelWidth, footerHeight;

					var _footerBackground = function (selection) {
						var background = selection.select('rect.footer-background')
							.attr('width', panelWidth)
							.attr('height', footerHeight)
							.attr('transform', 'translate(0, -' + (footerHeight + 17) + ')') // 17 = statusbar
							.attr('fill', '#e9e9e9');
					};

					// public properties and functions
					_footerBackground.panelWidth = function (pw) {
						if (!arguments.length) {
							return panelWidth;
						}
						panelWidth = pw;
						return this;
					};

					_footerBackground.footerHeight = function (height) {
						if (!arguments.length) {
							return footerHeight;
						}
						footerHeight = height;
						return this;
					};

					return _footerBackground;
				}
			};
		}]
	);
})();