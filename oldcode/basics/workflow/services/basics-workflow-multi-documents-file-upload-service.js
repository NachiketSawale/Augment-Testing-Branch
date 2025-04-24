(function (angular) {
	'use strict';

	function basicsWorkflowMultiDocumentsFileUploadService(_, PlatformMessenger, platformModalService, basicsCommonServiceUploadExtension) {
		var service = {};
		var selectedFiles = [];
		service.filesHaveBeenUploaded = new PlatformMessenger();

		service.onFileSelected = function (fileArr) {
			var uploadService = service.getUploadService();
			_.forEach(fileArr, function (item) {
				uploadService.uploadFiles(item, item);
			});
		};

		service.getSelectedFile = function (id) {
			if (!id) {
				return selectedFiles;
			}

			var files = _.find(selectedFiles, {id: id});
			if (!files) {
				files = {
					id: id,
					fileArr: []
				};
				selectedFiles.push(files);
			}
			return files.fileArr;
		};

		service.setSelectedFile = function (id, files) {
			var savedfiles = _.find(selectedFiles, {id: id});
			if (savedfiles) {
				savedfiles.fileArr = files;
			} else {
				selectedFiles.push({id: id, fileArr: files});
			}
		};

		function uploadFilesCallBack(currItem, data) {
			var args = {
				currItem: currItem,
				data: data
			};
			service.filesHaveBeenUploaded.fire(null, args);
		}

		function init() {
			var uploadOptions = {
				uploadFilesCallBack: uploadFilesCallBack,
				uploadServiceKey: 'basics-workflow-multi-documents-file-upload',
				uploadConfigs: {SectionType: 'Temp'}
			};
			basicsCommonServiceUploadExtension.extendForCustom(service, uploadOptions);
		}

		init();

		return service;
	}

	basicsWorkflowMultiDocumentsFileUploadService.$inject = ['_', 'PlatformMessenger', 'platformModalService', 'basicsCommonServiceUploadExtension'];

	angular.module('basics.workflow')
		.factory('basicsWorkflowMultiDocumentsFileUploadService', basicsWorkflowMultiDocumentsFileUploadService);

})(angular);