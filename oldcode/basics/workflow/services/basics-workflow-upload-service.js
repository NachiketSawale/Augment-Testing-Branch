(function () {
	'use strict';

	function uploadService(basicsCommonServiceUploadExtension, $q) {
		var deferred;
		var currentExtension;
		var service = {
			hasInfo: false,
			infoList: [],
			reset: function reset() {
				service.hasInfo = false;
				service.infoList = [];
				service.alertInfo.type = 0;
				service.alertInfo.show = false;
				service.alertInfo.message = null;
			},
			alertInfo: {
				type: 0,
				show: false,
				messageCol: 1,
				iconCol: 1
			},
			callbackFn: angular.noop,
			options: {
				accept: 'application/zip',
				autoUpload: false,
				multiple: false
			},
			uploadOptions: {
				uploadServiceKey: 'basicsWorkflowUploadService',
				uploadConfigs: {SectionType: 'DocumentsProject'},
				getExtension: function () {
					return currentExtension;
				},
				uploadFilesCallBack: function (currItem, data) {
					deferred.resolve({currItem: currItem, data: data});
				}
			}
		};

		basicsCommonServiceUploadExtension.extendForCustom(service, service.uploadOptions);
		service = service.getUploadService();
		service.registerFileSelected(function onFileSelected(files) {
			var data = {
				SectionType: 'DocumentsProject',
				action: 'Upload'
			};
			service.startUploadFiles(files, data);
		});

		service.uploadFile = function (extension) {
			currentExtension = extension;
			deferred = $q.defer();
			service.selectFiles();

			return deferred.promise;
		};
		return service;
	}

	uploadService.$inject = ['basicsCommonServiceUploadExtension', '$q'];

	angular.module('basics.workflow')
		.factory('basicsWorkflowUploadService', uploadService);

})();