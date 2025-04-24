/**
 * Created by chi on 10/30/2017.
 */
(function(){
	'use strict';

	var moduleName = 'basics.material';

	angular.module(moduleName).factory('basicsMaterialImportMaterialRecordsService', basicsMaterialImportMaterialRecordsService);

	basicsMaterialImportMaterialRecordsService.$inject = ['_', '$translate', 'basicsCommonServiceUploadExtension'];

	function basicsMaterialImportMaterialRecordsService(_, $translate, basicsCommonServiceUploadExtension) {
		var service = {
			hasInfo: false,
			infoList: [],
			reset: reset,
			alertInfo: {
				type: 0,
				show: false,
				messageCol: 1,
				iconCol: 1
			},
			fileArchiveDocId: null,
			fileName: null,
			importDataCallBack: uploadFilesCallBack
		};
		var uploadOptions = {
			uploadServiceKey: 'basics-material-material',
			uploadConfigs: {action: 'Import', SectionType: 'Material'},
			getExtension: getExtension,
			uploadFilesCallBack: uploadFilesCallBack
		};

		function getExtension() {
			return '.d90, .d93, .d94';
		}

		basicsCommonServiceUploadExtension.extendForCustom(service, uploadOptions);
		return service;

		///////////////
		function uploadFilesCallBack(entity, data) {
			if (data) {
				var infoList = data.InfoList || [];
				_.forEach(infoList, function(value, key) {
					var info = {Id: key + 1, Info: value};
					service.infoList.push(info);
				});
				service.hasInfo = angular.isDefined(data.StatusCode) && data.StatusCode !== 1;
				service.fileArchiveDocId = data.FileArchiveDocId;
				service.fileName = data.fileName;

				switch (data.StatusCode) {
					case 1:
						{
							service.alertInfo.type = 0;
							service.alertInfo.show = true;
							service.alertInfo.message = $translate.instant('basics.material.import.success');
						}
						break;
					case 0:
						{
							service.alertInfo.type = 0;
							service.alertInfo.show = true;
							service.alertInfo.message = $translate.instant('basics.material.import.successButHasWarning');
						}
						break;
					case -1:
						{
							service.alertInfo.type = 0;
							service.alertInfo.show = true;
							service.alertInfo.message = $translate.instant('basics.material.import.partialSuccess');
						}
						break;
					case -2:
						{
							service.alertInfo.type = 3;
							service.alertInfo.show = true;
							service.alertInfo.message = $translate.instant('basics.material.import.fail');
						}
						break;
					default:
						break;
				}
			}
		}

		function reset() {
			service.hasInfo = false;
			service.infoList = [];
			service.alertInfo.type = 0;
			service.alertInfo.show = false;
			service.alertInfo.message = null;
			service.fileArchiveDocId = null;
			service.fileName = null;
		}
	}
})();