(function () {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc directive
	 * @description
	 */
	angular.module('basics.import').directive('boqMainGaebImportFileSelectionControl', ['$timeout',
		function ($timeout) {

			var template =
				'<div class="input-group form-control"> <input type="text" class="input-group-content" ng-model="entity.FileData.name" readonly="true" /> <span class="input-group-btn"> <button id="openGaebImportFileDialog" data-ng-click="onUpload()" class="btn btn-default"><div class="control-icons ico-input-lookup lookup-ico-dialog"></div></button> </span> </div>';

			return {

				restrict: 'A',

				replace: false,

				scope: {
					entity: '=',
					ngModel: '=',
					options: '='
				},

				template: template,

				link: linker

			};

			function linker(scope) {

				scope.path = globals.appBaseUrl;
				var allowedExtensions = ['.d81', '.d82', '.d83', '.d84', '.d85', '.d86', '.d87', '.d88', '.d89', '.x81', '.x82', '.x83', '.x84', '.p81', '.p82', '.p83', '.p84', '.p85', '.p86'];
				var fileFilter = allowedExtensions.join() + '|GAEB files';

				var fileElement = angular.element('<input type="file" />');
				fileElement.attr('accept', fileFilter);

				scope.onUpload = function () {
					fileElement.focus().click();
				};

				// http://shazwazza.com/post/Uploading-files-and-JSON-data-in-the-same-request-with-Angular-JS
				fileElement.bind('change', function (e) {

					var file = e.target.files[0];
					if (file && validateInputFile(file.name)) {
						// scope.$apply(function () { // does not work on IE?
						$timeout(function () {     // need to schedule the changes to the scope in a future call stack (otherwise control will not be updated!)
							scope.entity.FileData = file;
						}, 0);
						// });
					}

				}).bind('destroy', function () {
					fileElement.unbind('change');
				});

				function validateInputFile(f) {

					if (f && f.lastIndexOf('.') > 0) {

						var ext = f.substring(f.lastIndexOf('.'), f.length).toLowerCase();
						return allowedExtensions.indexOf(ext) !== -1;
					}
					return false;
				}

				// var button =  element.find('button');

				var init = function () {
					$timeout(function () {
						// button.click();  // open file dialog (does not work on initial call?)
					}, 0);
				};
				init();

			}
		}]);
})();
