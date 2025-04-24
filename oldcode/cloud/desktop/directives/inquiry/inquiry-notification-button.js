(function () {
	'use strict';

	angular.module('basics.workflow').directive('cloudDesktopInquiryNotifyButton', cloudDesktopInquiryNotifyButton);

	cloudDesktopInquiryNotifyButton.$inject = ['cloudDesktopSidebarInquiryService', '$compile'];

	function cloudDesktopInquiryNotifyButton(inquiryService, $compile) {
		return {
			restrict: 'A',
			link: function (scope, elem) {
				var removeWatch = scope.$watch(function () {
					return inquiryService.getInquiryItemsCount();
				},
				function (newValue) {
					var svgImage = (newValue === 0) ? 'ico-inquiry' : 'ico-inquiry_items';
					var content = '<svg data-cloud-desktop-svg-image data-sprite="sidebar-icons" data-image="' + svgImage + '"></svg>';

					elem.children('svg').replaceWith($compile(content)(scope));
				});

				elem.addClass('highlight');

				scope.$on('$destroy', function () {
					removeWatch();
				});
			}
		};
	}

})();
