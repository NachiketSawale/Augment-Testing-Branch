/**
 * Created by chi on 29.08.2024
 */
(function (angular) {
	'use strict';

	let moduleName = 'basics.common';
	angular.module(moduleName).directive('basicsCommonResizeEditorInDialog', basicsCommonResizeEditorInDialog);

	basicsCommonResizeEditorInDialog.$inject = ['$timeout', '$window'];

	function basicsCommonResizeEditorInDialog($timeout, $window) {
		let headerName = '';
		let footerName = '';
		let bodyName = '';
		return {
			restrict: 'A',
			scope: false,
			link: linker
		}

		function linker(scope, element, attrs) {
			if (!attrs.headerName || !attrs.footerName || !attrs.bodyName) {
				return;
			}

			let isEditorBorderDrawn = false;
			const windowElement = angular.element($window);
			headerName = '#' + attrs.headerName;
			footerName = '#' + attrs.footerName;
			bodyName = '#' + attrs.bodyName;

			$timeout(function () {
				setModalBodyHeight();
			});

			$timeout(function () {
				if (!isEditorBorderDrawn) {
					drawEditorBorder(isEditorBorderDrawn);
				}
			}, 200);

			windowElement.on('resize', setModalBodyHeight);
			scope.$on('$destroy', function() {
				windowElement.off('resize', setModalBodyHeight);
			});
		}

		function setModalBodyHeight() {
			const header = angular.element(headerName);
			const body = angular.element(bodyName);
			const footer = angular.element(footerName);
			const resizeDialog = body.closest('.ui-resizable');

			if (resizeDialog && header.length && body.length && footer.length) {
				body.outerHeight(resizeDialog.outerHeight() - header.outerHeight() - footer.outerHeight());
			}
		}

		function drawEditorBorder(isEditorBorderDrawn) {
			const editor = angular.element(bodyName + ' div.ql-editor');
			if (editor && editor.length > 0) {
				editor.css('border', '1px solid #ccc');
				isEditorBorderDrawn = true;
			}
		}
	}
})(angular);