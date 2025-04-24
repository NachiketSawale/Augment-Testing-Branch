/**
 * Created by joshi on 07.08.2014.
 */

(function () {

	/* global */
	'use strict';

	/**
	 * @ngdoc directive
	 * @name boqMainGAEBImport
	 * @description handle import files from file system
	 */
	angular.module('boq.main').directive('boqMainGaebImport', ['boqMainService', function (boqMainService) {

		return {
			restrict: 'A',
			scope: {},
			templateUrl: window.location.pathname + '/boq.main/templates/boq-gaeb-import.html',
			link: function link(/* scope, element, attrs */) {
				var fileInput = angular.element(document.querySelector('#gaebFileUpload'));
				var filePath = '';

				/* function onFileReadComplete(event) {
					// call webapi to put the files into stream
					boqMainService.importGaebFile(1, event, filePath);
				} */

				fileInput.bind('change', function (/* e */) {
					var file = fileInput[0].files[0];
					// alert('file selected:  '+ file);
					if (file !== undefined) {
						if (validateInputFile(file.name)) {
							filePath = file.name;
							var reader = new FileReader();
							reader.onload = function (res) {
								var content = res.target.result;
								boqMainService.importGaebFile(content, filePath);
							};
							// reader.readAsBinaryString(file);
							reader.readAsText(file);
						}
					}
				});

				function validateInputFile(f) {
					if (f && f === undefined) {
						return false;
					}
					var ext = '';
					if (f.lastIndexOf('.') > 0) {
						ext = f.substring(f.lastIndexOf('.') + 1, f.length).toLowerCase();
					}
					return (ext.substring(0, 2) === 'd8' || ext.substring(0, 2) === 'x8' || ext.substring(0, 2) === 'p8');
				}
			}
		};

	}]);
})();

