(function () {

	'use strict';

	/**
	 * @ngdoc directive
	 * @description
	 */
	angular.module('basics.import').directive('basicsImportFileSelection', ['$translate',
		function ($translate) {

			var template =
				`<div class='input-group form-control'>
			<input
			  type='text'
			  class='input-group-content'
			  ng-model='placeholder'
			  readonly
			  style='cursor: default; pointer-events: none;'
			/>
			<input
			  type='file'
			  class='input-group-content'
			  ng-model='ngModel'
			  accept='.xlsx'
			  style='display: block; opacity: 0; position: absolute; top: 0; left: 0; cursor: pointer; width: 100%;'
			  ng-click='onUpload()'
			/>

			<span class='input-group-btn'>
			  <button
				 id='open'
				 data-ng-click='onUpload()'
				 class='btn btn-default'
			  >
				 <div class='control-icons ico-input-lookup lookup-ico-dialog'></div>
			  </button>
			</span>
		 </div>`
			;
			
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

			function linker(scope, element, attrs) {
				scope.placeholder = scope.entity.File2Import ? scope.entity.File2Import : scope.entity.placeholder || $translate.instant('basics.import.selectExcelFile');
				scope.path = globals.appBaseUrl;
				scope.fileFilter = scope.entity.fileFilter || '.xlsx';

				var fileElement = angular.element('<input type="file" />');
				fileElement.attr('accept', scope.fileFilter);

				scope.onUpload = function () {
					fileElement.focus().click();
				};

				// http://shazwazza.com/post/Uploading-files-and-JSON-data-in-the-same-request-with-Angular-JS
				fileElement.bind('change', function (e) {

					var file = e.target.files[0];
					if (file) {
						scope.$emit('fileSelected', {file: file});
						scope.ngModel = file.name;
						scope.placeholder = file.name;
						scope.entity.ExcelSheetName = '';
					}

				}).bind('destroy', function () {
					fileElement.unbind('change');
				});
			}
		}]);
})();
