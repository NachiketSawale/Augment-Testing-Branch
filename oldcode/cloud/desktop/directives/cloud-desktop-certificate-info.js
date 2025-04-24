((angular => {
	'use strict';

	let modulename = 'cloud.desktop';
	let directiveName = 'cloudDesktopCertificateInfo';

	angular.module(modulename).directive(directiveName, directiveFn);

	directiveFn.$inject = ['_', 'cloudDesktopInfoService', 'platformTranslateService'];

	function directiveFn(_, cloudDesktopInfoService, platformTranslateService) {
		return ({
			restrict: 'A',
			scope: true,
			template: '<i data-ng-if="getCertificateInfo()" title="{{::\'cloud.desktop.header.certificateInfo\' | translate}}" class="block-image control-icons ico-certificate-info">',
			link: function (scope, element, attrs) {

				scope.getCertificateInfo = () => {
					return !cloudDesktopInfoService.CertificateAllValid;
				};

				scope.$on('$destroy', () => {
					// cleanup if required
				});
			}
		});
	}
})(angular));