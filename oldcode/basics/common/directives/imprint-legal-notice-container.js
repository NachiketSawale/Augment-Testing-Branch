/**
 * Created by uestuenel on 27.03.2018.
 */

(function () {
	'use strict';

	function imprintLegalNoticeContainer($compile, $rootScope, globals) {
		return {
			restrict: 'A',
			scope: true,
			link: function (scope, elem /* , attr */) {

				function rebuild() {
					if (globals.portal) {
						scope.pathTermOfUse = globals.baseUrl + 'cdn/custom/termsofuseforportal/index.html';
						scope.pathLegalNotice = globals.baseUrl + 'cdn/custom/dataprotectionforportal/index.html';
					} else {
						scope.pathTermOfUse = globals.baseUrl + 'cdn/custom/termsofuse/index.html';
						scope.pathLegalNotice = globals.baseUrl + 'cdn/custom/dataprotection/index.html';
					}

					// console.log ('logon rebuild: ',globals.showImpressumLink);
					const template = buildTemplate();

					const newContent = $compile(template)(scope);
					// empty content
					elem.html('');
					// then fill content
					elem.append(newContent);
				}

				function buildTemplate() {
					const parentContainer = angular.element('<div>');
					elem.addClass('term-container');

					if (globals.showImpressumLink) {
						const termOfUse = angular.element('<a href="{{pathTermOfUse}}" target="_blank">{{\'basics.common.termsOfUse\' | translate}}</a>');
						termOfUse.appendTo(parentContainer);
					}

					if (globals.showImpressumLink && globals.showDataprotectionLink) {
						parentContainer.append(' | ');
					}

					if (globals.showDataprotectionLink) {
						const legalNotice = angular.element('<a href="{{pathLegalNotice}}" target="_blank">{{\'basics.common.legalNotice\' | translate}}</a>');
						legalNotice.appendTo(parentContainer);
					}
					return parentContainer;
				}

				rebuild();

				// wait for signal from service if something changed
				$rootScope.$on('LegalInfo-read-done', function () {
					// console.log('LegalInfo-read-done fired :',globals.showImpressumLink);
					rebuild();
				});
			}
		};
	}

	imprintLegalNoticeContainer.$inject = ['$compile', '$rootScope', 'globals'];

	angular.module('basics.common').directive('imprintLegalNoticeContainer', imprintLegalNoticeContainer);
})();
