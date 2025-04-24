/**
 * Created by pel on 9/20/2018.
 */

(function () {

	'use strict';

	/**
	 * @ngdoc directive
	 * @description
	 */
	angular.module('basics.common').directive('fileDropZone', ['_',
		function (_) {

			return {

				restrict: 'A',

				replace: false,

				scope: false,

				compile: compile

			};

			function compile(ele) {
				var $overlay = ele.find('.container-overlay');
				return function (scope, ele, attr, ctrl) {

					function allowedFile(items) {
						for (var i = 0; i < scope.$$childTail.allowedFiles.length; i++) {
							var fileExt = scope.$$childTail.allowedFiles[i];
							if (_.includes(items[0].type, fileExt)) {
								return true;
							}
						}
						return false;
					}

					var dragging = false;
					var timeoutId;

					function handleDragEnter(evt) {
						dragging = true;
						timeoutId = setTimeout(function () {
							dragging = false;
						}, 0);
						if (scope.$$childTail.allowedFiles || scope.$$childTail.canDrop) {
							// noinspection JSUnresolvedVariable
							if (scope.$$childTail.canDrop() && allowedFile(evt.dataTransfer.items)) {
								$overlay.addClass('file-allowed');
							} else {
								$overlay.addClass('file-denied');
							}
						} else {
							$overlay.addClass('file-denied');
						}
						evt.stopPropagation();
						evt.preventDefault();
						return false;
					}

					function handleDragOver(evt) {
						if (!evt) {
							return;
						}
						if (scope.$$childTail.allowedFiles || scope.$$childTail.canDrop) {
							// noinspection JSUnresolvedVariable
							if (scope.$$childTail.canDrop() && allowedFile(evt.dataTransfer.items)) {
								// noinspection JSUnresolvedVariable
								evt.dataTransfer.dropEffect = 'copy';
								$overlay.addClass('file-allowed');
							} else {
								// noinspection JSUnresolvedVariable
								evt.dataTransfer.dropEffect = 'none';
								$overlay.addClass('file-denied');
							}
						} else {
							// noinspection JSUnresolvedVariable
							evt.dataTransfer.dropEffect = 'none';
						}
						evt.stopPropagation();
						evt.preventDefault();
						return false;
					}

					function handleDragLeave(evt) {
						if (!dragging) {
							if (scope.$$childTail.allowedFiles || scope.$$childTail.canDrop) {
								// noinspection JSUnresolvedVariable
								if (scope.$$childTail.canDrop() && allowedFile(evt.dataTransfer.items)) {
									$overlay.removeClass('file-allowed');
								} else {
									$overlay.removeClass('file-denied');
								}
							} else {
								$overlay.removeClass('file-denied');
							}
						}
						dragging = false;
						evt.stopPropagation();
						evt.preventDefault();
						return false;
					}

					function handleFileSelect(evt) {
						evt.stopPropagation();
						evt.preventDefault();
						// noinspection JSUnresolvedVariable
						var files = evt.dataTransfer.files;
						if (scope.$$childTail.fileDropped) {
							scope.$$childTail.fileDropped(files);
						}
						$overlay.removeClass('file-allowed');
						$overlay.removeClass('file-denied');
						dragging = false;
					}

					ele[0].addEventListener('dragover', handleDragOver);
					ele[0].addEventListener('dragleave', handleDragLeave);
					ele[0].addEventListener('dragenter', handleDragEnter);
					ele[0].addEventListener('drop', handleFileSelect);

					scope.$on('$destroy', function () {
						clearTimeout(timeoutId);

						ele[0].removeEventListener('dragenter', handleDragEnter);
						ele[0].removeEventListener('dragleave', handleDragLeave);
						ele[0].removeEventListener('drop', handleFileSelect);
						ele[0].removeEventListener('dragover', handleDragOver());

					});

				};

			}

		}]);
})();

