/**
 * Created by lav on 4/2/2019.
 */
(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.common';

	angular.module(moduleName).factory('productionplanningDrawingImportPartListDialogService',
		['$q',
			/* jshint -W072 */
			function ($q) {

				function readFile(jsZip, file) {
					var defer = $q.defer();
					var reader = new FileReader();
					var pathStructure = file.webkitRelativePath.split('/');
					var zipObj = jsZip;
					for (var i = 0; i < pathStructure.length - 1; i++) {
						zipObj = zipObj.folder(pathStructure[i]);
					}
					reader.onload = function (e) {
						zipObj.file(file.name, e.target.result);
						defer.resolve();
					};
					reader.readAsArrayBuffer(file);
					return defer.promise;
				}

				function matchPattern(files, pattern) {
					var regExp = new RegExp('^' + pattern + '\\..*$');
					return _.filter(files, function (file) {
						return regExp.test(file.name);
					});
				}

				return {
					readFile: readFile,
					matchPattern: matchPattern
				};
			}]);
})(angular);