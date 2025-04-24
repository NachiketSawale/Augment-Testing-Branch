/**
 * Created by ong on 28.09.2024.
 */
(function (angular) {
	/* global angular */
	'use strict';

	/**
	 * @ngdoc directive
	 * @name platform.directive:platformHelpInfo
	 * @restrict A
	 * @priority default value
	 * @scope isolate scope
	 * @description
	 * Standardized info button which will display the provided html page to the documentation in a popup
	 *
	 * @example
	 * <div data-platform-help-info data-doculink="link"></div>
	 */
	angular.module('platform').directive('platformHelpInfo', ['_', '$http', 'basicsLookupdataPopupService', function (_, $http, basicsLookupdataPopupService) {

		return {
			restrict: 'A',
			template: '<div class="help-info"><svg>' +
				'<use href="cloud.style/content/images/tlb-icons.svg#ico-info2"></use>' +
				'</svg></div>',
			scope: {
				link: '@link',
				section: '@section',
			},
			link: function (scope, elem) {
				let instance;
				let focusedElement;
				let time;

				function resetTimer(event) {
					clearTimeout(time);
					let idleTime = 500;
					time = setTimeout(function() {
						displayPopup(event)
					}, idleTime)
				}

				function displayPopup(event) {
					basicsLookupdataPopupService.hidePopup(0);
					elem.off('mouseenter', resetTimer);
					$http.get(globals.webApiBaseUrl + 'basics/common/resource/uri?id=documentation:system:' + scope.link + '&returnHtml=true')
						.then(function (response) {

							focusedElement = $(document.elementFromPoint(event.pageX, event.pageY));

							let html = response.data.replaceAll('../../image', globals.serverUrl + 'documentation/system/image');

							let elements = $(html);

							const div = document.createElement('div');
							div.className = 'main-content';

							if (scope.sectionId !== '') {
								let found = $('.' + scope.section, elements);

								if (found.length > 0) {
									found[0].style.fontSize = '80%'
									div.appendChild(found[0])
								}
							}

							const link = document.createElement('link');

							link.type = 'text/css';
							link.rel = 'stylesheet';
							link.href = globals.serverUrl + 'documentation/layout.css';

							div.prepend(link);

							instance = basicsLookupdataPopupService.toggleLevelPopup({
								multiPopup: false,
								plainMode: true,
								hasDefaultWidth: false,
								scope: scope,
								focusedElement: $(event.currentTarget),
								template: '<iframe class="help-content-frame" scrolling="no" id="html-frame"></iframe>'
							});

							if (!(_.isNull(instance) || _.isUndefined(instance))) {
								instance.opened.then(function () {
									$('#html-frame')[0].srcdoc = '<html><body>' + div.innerHTML + '</body></html>';
									$('#html-frame').on('load', function () {
										$('#html-frame').height($('#html-frame')[0].contentWindow.document.body.scrollHeight);
									});
								})
								instance.closed.then(() => {
									elem.on('mouseenter', resetTimer);
								});
							}
						});
				}

				elem.on('mouseenter', resetTimer);
				elem.on('mouseleave', function(){
					clearTimeout(time);
				})
			}
		};
	}]);
})(angular);







