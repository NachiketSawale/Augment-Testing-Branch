(function () {

	'use strict';

	/**
	 * @ngdoc directive
	 * @description
	 */
	angular.module('basics.userform').directive('basicsUserformUploadInput', [
		'globals',
		'basicsUserformFileReaderService',
		function (
			globals,
			basicsUserformFileReaderService) {

			var template =
				'<div class="input-group form-control"> \
					<input type="text" class="input-group-content" ng-model="ngModel" readonly="readonly"/> \
					<span class="input-group-btn"> \
						<button id="open" data-ng-click="onUpload()" class="btn btn-default control-icons ico-input-lookup"></button> \
						<progress class="hide" value="{{progress}}"></progress> \
					</span> \
				</div>';

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

			function linker(scope, element) {

				scope.path = globals.appBaseUrl;
				scope.fileFilter = '.html';

				var contentFieldName = scope.options.contentFieldName;

				var fileElement = angular.element('<input type="file" />');
				fileElement.attr('accept', scope.fileFilter);

				scope.onUpload = function () {
					fileElement.focus().click();
				};

				fileElement.bind('change', function (e) {
					if (e.target.files[0]) {
						getFile(e.target.files[0]);
					}
				});

				var getFile = function (fileInfo) {
					scope.progress = 0;

					if (fileIsValid(fileInfo)) {
						basicsUserformFileReaderService.readAsText(fileInfo, scope).then(function (result) {
							scope.entity[contentFieldName] = result;
							scope.ngModel = fileInfo.name;
						});
					}
				};

				function fileIsValid(fileInfo) {
					return fileInfo.type === 'text/html';
				}

				scope.$on('fileProgress', function (e, progress) {
					scope.progress = progress.loaded / progress.total;
				});

				element.on('$destroy', function () {
					fileElement.unbind('change');
				});

			}
		}]);
})();
