(function () {
	'use strict';

	function basicsWorkflowAccordionDirective(platformTranslateService) {
		return {
			restrict: 'A',
			scope: false,
			transclude: true,
			template: '<button class="group-toggle">' +
				'<div class="group-img"></div>' +
				'<span class="group-title" style="font-weight: bold;"></span>' +
				' <div class="group-toggle-img control-icons""></div> ' +
				'</button>' +
				'<ng-transclude class="transclude-element"></ng-transclude>',
			link: function (scope, elem, attr) {
				var open = true;
				var thisElem = elem[0];
				var content = null;

				platformTranslateService.translationChanged.register(updateTitle);

				toggle({target: {className: 'group-toggle'}});

				function toggle(e) {
					if (e.target.className.indexOf('group-toggle') !== -1) {
						angular.element(thisElem.querySelector('.group-toggle-img')).addClass((open ? 'ico-down' : 'ico-up'));
						angular.element(thisElem.querySelector('.group-toggle-img')).removeClass((open ? 'ico-up' : 'ico-down'));
						open = !open;
						if (!open) {
							content = thisElem.querySelector('.transclude-element');
							thisElem.querySelector('.transclude-element').remove();
						} else {
							thisElem.appendChild(content);
						}
					}
				}

				function updateTitle() {
					angular.element(thisElem.querySelector('.group-title')).text(platformTranslateService.instant(attr.title, null, true));
				}

				updateTitle();

				elem.bind('click', toggle);

				scope.$on('$destroy', function () {
					elem.unbind();
					platformTranslateService.translationChanged.unregister(updateTitle);
				});

			}
		};
	}

	angular.module('basics.workflow').directive('basicsWorkflowAccordionDirective', ['platformTranslateService', basicsWorkflowAccordionDirective]);
})();
