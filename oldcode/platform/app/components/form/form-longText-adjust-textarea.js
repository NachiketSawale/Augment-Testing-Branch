(function (angular) {
	'use strict';

	angular.module('platform').directive('platformFormLongtextAdjust', platformFormLongtextAdjust);

	platformFormLongtextAdjust.$inject = ['_'];

	function platformFormLongtextAdjust(_) {
		return {
			restrict: 'A',
			scope: false,
			link: function (scope, element) {
				var getMaxTextAreaHeight = function getMaxTextAreaHeight() {
					var subviewHeight = angular.element(element).parents('.subview-content').height();
					var titleHeaderHeight = angular.element(element).parents('.container-title').height();
					return (subviewHeight - titleHeaderHeight) - 20; // minus padding and margin
				};

				var adjustTextAreaHeight = function adjustTextAreaHeight() {
					var textAreaHeight = getMaxTextAreaHeight();
					element.find('.domain-type-remark').css('min-height', textAreaHeight + 'px');
					// no label needed in this form
					var labels = element.find('.platform-form-label');
					if (labels) {
						_.each(labels, function (label) {
							label.remove();
						});
					}
				};

				var unregister = [];

				unregister.push(scope.$on('form-config-updated-rendered', function () {
					adjustTextAreaHeight();
				}));

				unregister.push(scope.$on('form-rendered', function () {
					adjustTextAreaHeight();
				}));

				var splitter = angular.element(element).parents('.k-splitter').data('kendoSplitter');

				splitter.bind('resize', adjustTextAreaHeight);

				unregister.push(scope.$on('$destroy', function () {
					splitter.unbind('resize', adjustTextAreaHeight);

					_.over(unregister)();
					unregister = null;
				}));
			}
		};
	}
})(angular);