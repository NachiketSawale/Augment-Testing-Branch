/**
 * Created by lav on 2018-4-13.
 * Remark: At the moment, because wizard “Import Product Description” is discarded, code of this file will not be used any more. 
 * But here we will still keep the code, in case we will reuse it in the future(e.g. reuse to patch CAD data in DB without accounting).(by zwz 2019/11/12)
 */
(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.engineering';

	angular.module(moduleName).directive('productDescriptionDocumentFileUploadLookup',
		['$injector',
			function ($injector) {
				return {
					restrict: 'EA',
					scope: {
						options: '='
					},
					templateUrl: globals.appBaseUrl + moduleName + '/partials/file-upload.html',
					link: function (scope, element) {
						var options = scope.options.upload;
						var fileUploadDataService = $injector.get(options.serviceName);
						fileUploadDataService.initialize();
						function filesHaveBeenUploadedReaction(e, args) {
							//add the uploaded file to textbox
							if (args.data.fileName) {
								var data = args.data;
								scope.allFileName.push(args.data);
								var allFileNames = _.map(scope.allFileName, function (item) {
									return item.fileName;
								});
								allFileNames = allFileNames.reverse();
								var fileNamesInputElement = element.find('#fileName');
								fileNamesInputElement.val('"' + allFileNames.join('" "') + '"');
								scope.$emit('fileChosen', data);
							}
						}

						fileUploadDataService.filesHaveBeenUploaded.register(filesHaveBeenUploadedReaction);

						scope.allFileName = [];

						scope.disabledClearFile = function () {
							return scope.allFileName.length === 0;
						};

						scope.clearFile = function () {
							scope.allFileName = [];
							var fileNamesInputElement = element.find('#fileName');
							fileNamesInputElement.val('');
							scope.$emit('fileChosen', null, true);
						};

						scope.chooseFile = function () {
							var uploadService = fileUploadDataService.getUploadService();
							var fileOption = {
								multiple: !_.isNil(options.multiple) ? options.multiple : true,
								autoUpload: false,
								accept: uploadService.getExtension(fileUploadDataService.fileExtensionArray)
							};
							uploadService.selectFiles(fileOption);
						};

						scope.$on('$destroy', function () {
							scope.allFileName = [];
						});
					}
				};
			}]);

})(angular);