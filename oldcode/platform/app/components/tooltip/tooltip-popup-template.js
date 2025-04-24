(function () {
	'use strict';

	angular.module('platform').directive('tooltipPopupTemplate', tooltipPopupTemplate);
	tooltipPopupTemplate.$inject = ['tooltipService'];

	function tooltipPopupTemplate(tooltipService) {
		return {
			restrict: 'AE',
			templateUrl: globals.appBaseUrl + 'app/components/tooltip/tooltip-popup-template.html',
			link: function (scope, element) {
				/*
					It is possible not to remove the container from the tooltip.
					e.g. if you want to click on a link in the container.
					Container is hidden when the container is exited.
				 */
				if (tooltipService.getExistUrls(scope.tooltipOptions)) {
					element.on('mouseover', function () {
						tooltipService.closePopup = false;
					});

					element.on('mouseleave', function () {
						tooltipService.closePopup = true;
						tooltipService.hidePopup();
					});
				}
			}
		};
	}
})();
