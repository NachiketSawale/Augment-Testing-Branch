(() => {
	'use strict';

	angular.module('platform').directive('platformDialogHeaderResizeButton', platformDialogHeaderResizeButton);
	platformDialogHeaderResizeButton.$inject = ['$translate', '$compile', 'platformComponentUtilService'];

	function platformDialogHeaderResizeButton($translate, $compile, platformComponentUtilService) {
		return {
			restrict: 'AE',
			scope: false,
			link: function(scope, element){
				let actualWidth = null;
				let actualHeight = null;
				let actualTop = null;
				let actualLeft = null;
				let maxHeightBody = null;
				let modalDialog = element.parents('.modal-dialog');
				let modalBody = modalDialog.find('.modal-body');
				let maximumSizes = {
					maxHeight: '100',
					maxWidth: '100'
				};

				function setStyles(modalDialog) {
					let maxHeightViaPrecent = Math.round((window.innerHeight * maximumSizes.maxHeight) * (0.01));
					let maxWidthViaPrecent = Math.round((window.innerWidth * maximumSizes.maxWidth) * (0.01));
					//get common size
					let commonHeight = modalDialog.height();
					let commonWidth = modalDialog.width();

					actualWidth = (scope.options.width !== undefined) ? scope.options.width : commonWidth;
					scope.options.width = maxWidthViaPrecent;

					actualHeight = (scope.options.height !== undefined) ? scope.options.height : commonHeight;
					scope.options.height = maxHeightViaPrecent;

					actualTop = (scope.options.top !== undefined) ? scope.options.top : modalDialog.offset().top;
					scope.options.top = 0;

					actualLeft = (scope.options.left !== undefined) ? scope.options.left : modalDialog.offset().left;
					scope.options.left = 0;
				}

				function maximize($event) {
					scope.dialog.isMaximized = false;
					modalDialog.addClass('margin-none');

					//set max and min Size
					setStyles(modalDialog);

					platformComponentUtilService.processComponentsByWindowResize('.modal-content');
				}

				function minimize($event) {
					scope.dialog.isMaximized = true;
					modalDialog.removeClass('margin-none');

					scope.options.width = actualWidth;
					scope.options.height = actualHeight;
					scope.options.top = actualTop;
					scope.options.left = actualLeft;

					platformComponentUtilService.processComponentsByWindowResize('.modal-content');
				}

				function createHTMLMarkup() {
					let template = `<button class="close ${scope.buttonCss}" style="background: none;" data-ng-click="click($event)" title="${scope.buttonTranslate}">
							<svg data-cloud-desktop-svg-image data-sprite="control-wh-icons" data-image="${scope.buttonIco}" class="block-image"></svg>
							</button>`;

					element.empty().append($compile(template)(scope));
				}

				function initButtonMarkup() {
					scope.buttonTranslate = scope.dialog.isMaximized ? $translate.instant('cloud.common.maximize') : $translate.instant('cloud.common.minimize');
					scope.buttonIco = scope.dialog.isMaximized ? 'ico-dialogue-maximized' : 'ico-dialogue-minimized';
					scope.buttonCss = scope.dialog.isMaximized ? 'maximized' : 'minimized';

					modalDialog.removeClass('maximized minimized');
					modalDialog.addClass((scope.dialog.isMaximized) ? 'minimized' : 'maximized');

					createHTMLMarkup();
				}

				initButtonMarkup();

				scope.click = function($event){
					if(scope.dialog.isMaximized) {
						maximize($event);
					} else {
						minimize($event);
					}

					initButtonMarkup();
				};
			}
		}
	}
})();