/**
 * Created by reimer on 28.10.2015.
 */

(function (angular) {
	'use strict';

	var moduleName = 'basics.userform';

	angular.module(moduleName).factory('basicsUserformFiledropExtension', [

		function () {

			var service = {};

			service.addFiledropSupport = function addFiledropSupport($scope, dataService) {

				$scope.fileDropped = function (file) {

					if ($scope.canDrop() && file.length === 1) {
						var reader = new FileReader();
						reader.onload = function () {
							// convert utf-8 (without bom) coded byte-array to a javascript string
							// var s = String.fromCharCode.apply(null, new Uint8Array(reader.result));
							// update entity
							var entity = dataService.getSelected();
							if (entity) {
								entity.HtmlTemplateContent = reader.result;
								entity.HtmlTemplateFileName = file[0].name;
								$scope.$apply();  // force update of upload directive
							}
						};
						reader.readAsText(file[0]);
					}
				};

				$scope.canDrop = function () {
					return dataService.canCreate();
				};

				// only process vcards
				$scope.allowedFiles = ['html'];

				// un-register on destroy
				$scope.$on('$destroy', function () {
					// dataService.unregisterEntityCreated(onEntityCreated);
				});

			};

			return service;

		}]);
})(angular);

