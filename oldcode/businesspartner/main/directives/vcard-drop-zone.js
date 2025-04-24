(function () {

	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,$ */

	/**
	 * @ngdoc directive
	 * @description
	 */
	angular.module('businesspartner.main').directive('businesspartnerMainVcardDropZone', [
		function () {

			return {

				restrict: 'A',

				replace: false,

				scope: false,
				// we can't use an isolated scope - parent scope must have a vCardDropped function!
				// scope: {
				// vcardDropped:'&'
				// },

				link: linker

			};

			function linker(scope, element) {

				let dropZone = element[0]; // element.children()[0];

				// Setup the dnd listeners.
				dropZone.addEventListener('dragover', handleDragOver, false);
				dropZone.addEventListener('drop', handleFileSelect, false);
				dropZone.addEventListener('dragleave', handleDragLeave, false);

				scope.$on('$destroy', function () {
					if (dropZone) {
						dropZone.removeEventListener('dragover', handleDragOver, false);
						dropZone.removeEventListener('drop', handleFileSelect, false);
						dropZone.removeEventListener('dragleave', handleDragLeave, false);
					}
					removeAllIndicators();
				});

				function handleFileSelect(evt) {

					evt.stopPropagation();
					evt.preventDefault();
					removeAllIndicators();

					/** @namespace evt.dataTransfer */
					let files = evt.dataTransfer.files; // FileList object.
					if (files.length === 1) {
						let file = files[0];
						// only process vcards
						if (file.type === 'text/x-vcard') {

							let reader = new FileReader();
							reader.onload = function () {

								// convert utf-8 (without bom) coded byte-array to a javascript string
								let s = String.fromCharCode.apply(null, new Uint8Array(reader.result));
								// callback function must exist in the parent controller!
								scope.vCardDropped(s);
							};
							reader.readAsArrayBuffer(file);
						}
					}
				}

				function handleDragOver(evt) {

					evt.stopPropagation();
					evt.preventDefault();
					removeAllIndicators();

					let canDrop = false;

					if (evt.dataTransfer.items.length > 0 && evt.dataTransfer.items[0].kind === 'file' && isSupportedFileType(evt.dataTransfer.items[0].type)) {
						canDrop = true;
					}

					// noinspection JSUnresolvedFunction
					if (canDrop && scope.canDropVcard()) { // canDropVcard function must exist in the parent controller!
						addCanDropIndicator();
						evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
					} else {
						addDenyDropIndicator();
					}
				}

				function handleDragLeave() {
					// if ( event.target.className == "dropzone" ) {
					removeAllIndicators();
				}

				function isSupportedFileType(fileType) {
					return fileType === 'text/x-vcard';
				}

				function addCanDropIndicator() {
					element.addClass('vcard-can-drop-indicator');
					// todo: temporary solution for detail forms
					$('.vcard-can-drop-indicator .panel').css('background-color', 'transparent');
				}

				function addDenyDropIndicator() {
					element.addClass('vcard-deny-drop-indicator');
					// todo: temporary solution for detail forms
					$('.vcard-deny-drop-indicator .panel').css('background-color', 'transparent');
				}

				function removeAllIndicators() {
					element.removeClass('vcard-can-drop-indicator');
					element.removeClass('vcard-deny-drop-indicator');
				}

			}

		}]);
})();
