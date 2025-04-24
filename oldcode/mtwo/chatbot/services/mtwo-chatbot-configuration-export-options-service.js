(function () {

	'use strict';

	var moduleName = 'mtwo.chatbot';

	/**
	 * @ngdoc service
	 * @name
	 * @function
	 *
	 * @description
	 *
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('mtwoChatbotConfigurationExportOptionsService', [
		function () {

			var service = {};
			var _mainService;

			var exportOptions = {
				ModuleName: 'mtwo.chatbot',
				MainContainer: {
					uuid: 'A906C9A8D9BE43F39F9928EB969A2737'
				},
				SubContainers: [],
				FilterCallback: function () {
					var selectItem = _mainService.getSelected();
					if (selectItem) {
						if (selectItem.PrcHeaderEntity) {
							return [selectItem.PrcHeaderEntity.Id];
						} else {
							return [selectItem.Id];
						}
					} else {
						return null;
					}
				},
				SupportedFileFormats: [
					'.CSV',
					'.XML',
					'.XLSX',
					'.XLSX_RibMat'
				]
			};

			service.getExportOptions = function (mainService, param) {
				_mainService = mainService;
				if (param) {
					angular.extend(exportOptions, param);
				}

				return exportOptions;
			};

			return service;

		}
	]);
})(angular);
