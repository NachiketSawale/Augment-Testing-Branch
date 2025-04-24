(function () {
	'use strict';

	angular.module('platform').directive('uiTabsButtonTriggerDirective', uiTabsButtonTriggerDirective);

	function uiTabsButtonTriggerDirective() {
		return {
			restrict: 'A',
			scope: false,
			link: function (scope, elem) {
				// get all buttons with attribute data-toggle.
				var tabButtons = elem.find('[data-toggle="tab"]');
				angular.forEach(tabButtons, function (buttonElem) {
					// every element with this data-toggle=tab get a click event. Element have to one function: open the correct tab-content
					// correct form: <a data-toggle="tab" href="#tabContentId">
					angular.element(buttonElem).bind('click', function () {
						// trigger tab. important: href-content
						angular.element('a[href="' + angular.element(this).attr('href') + '"]').tab('show');
					});
				});
			}
		};
	}
})();