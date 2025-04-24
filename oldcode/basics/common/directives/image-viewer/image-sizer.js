/**
 * @description: Deal with image size and vertical margin.
 */

(function (angular) {
	'use strict';

	angular.module('basics.common').directive('basicsCommonImageSizer', [function () {

		return {
			restrict: 'A',
			link: link
		};

		function link($scope, $element) {
			$element.bind('load', onLoad);

			$scope.$on('$destroy', function () {
				$element.unbind('load', onLoad);
			});

			function onLoad() {
				const image = $element[0];
				const nw = image.naturalWidth;
				const nh = image.naturalHeight;
				const content = $element.parents('.image-viewer-content:first');
				const splitter = $element.closest('.k-splitter').data('kendoSplitter');
				const viewer = content.parent();
				const resize = function () {
					if (!viewer || !viewer.length) {
						return;
					}

					const aw = viewer.width();
					const ah = viewer.height();
					const nk = nw / nh;
					const ak = aw / ah;
					const setCss = function (width, height) {
						let marginHeight;

						if (height > nh) {
							marginHeight = (ah - nh) / 2;
						} else {
							marginHeight = (ah - height) / 2;
						}

						$element.css({
							width: width + 'px',
							height: height + 'px',
							display: 'block'
						});

						if (marginHeight > 0) {
							$element.css({
								marginTop: marginHeight + 'px',
								marginBottom: marginHeight + 'px'
							});
						} else {
							$element.css({
								marginTop: 'initial',
								marginBottom: 'initial'
							});
						}
					};

					if (ak > nk) { // base on actual height
						setCss(ah * nk, ah);
					} else { // base on actual width
						setCss(aw, aw / nk);
					}
				};

				// set natural image size as max size.
				$element.css({
					maxWidth: nw + 'px',
					maxHeight: nh + 'px'
				});

				if (splitter) {
					splitter.bind('layoutChange', resize);
					$scope.$on('$destroy', function () {
						splitter.unbind('layoutChange', resize);
					});
				}

				resize();
			}
		}
	}]);

})(angular);