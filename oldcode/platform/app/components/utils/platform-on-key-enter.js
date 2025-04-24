(function () {
	'use strict';
	const modulename = 'platform';

	/**
	 * Filter Enter Key directive
	 */
	angular.module(modulename).directive('cloudDesktopOnKeyEnter', ['$document', function ($document) {
		return {
			restrict: 'A',
			scope: false,
			link: function (scope, element, attrs) {
				const target = attrs.global ? $document : element;

				target.on('keydown', function (evt) {
						const keyFn = scope.$eval(attrs.cloudDesktopOnKeyEnter);

						if (keyFn) {
							if (evt.key === 'Enter' && !evt.shiftKey /* no shift key */ && !evt.ctrlKey /* no ctrl key */) {
								evt.preventDefault();
								evt.stopImmediatePropagation();

								const blurOnEnter = scope.$eval(attrs.blurOnEnter);
								if(blurOnEnter){
									evt.target.blur();
								}

								const onKeyEnterDisabled = scope.$eval(attrs.onKeyEnterDisabled);
								if (onKeyEnterDisabled) {
									return;
								}

								/*
							  Scenario: user enters a value in the input field and press the enter key directly. This means that the content in the input field may not be valid(validation after blur-event). It has to. otherwise it may be that the search is not correct.
							  One global solution: If exist a css-class 'jsSetFocus' in this target-DOM, then set focus on this element. This ensures, that all input-fields triggered the blur-event.
							 */
								if (target.find('.jsSetFocus').length) {
									target.find('.jsSetFocus').focus();
								}

								keyFn();
								scope.$digest();
							}
						}
					}
				);

				scope.$on('$destroy', function () {
					target.off('keydown');
				});
			}
		};
	}]);
})();
