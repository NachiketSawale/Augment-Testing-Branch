(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.common';

	angular.module(moduleName).factory('ppsCommonGenericDocumentProcessor', DocumentProcessor);

	DocumentProcessor.$inject = ['$translate', '_',
		'ppsCommonGenericDocumentFromValuesHelper',
		'platformRuntimeDataService'];

	function DocumentProcessor($translate, _,
		ppsCommonGenericDocumentFromValuesHelper,
		platformRuntimeDataService) {
		var service = {};
		service.processItem = function processItem(item) {
			if (!_.isNil(item.From)) {
				const isEditable = item.From === 'PRODUCT_PRJ' || item.From === 'PRODUCT_CAD';
				const fields = ['Description', 'Barcode', 'DocumentTypeFk', 'CommentText']
					.map(f => {
						return {field: f, readonly: !isEditable};
					});
				platformRuntimeDataService.readonly(item, fields);
			}

			service.processPpsDocumentTypeFkField(item);
		};

		service.processPpsDocumentTypeFkField = (item) =>{
			platformRuntimeDataService.readonly(item, [{
				field: 'PpsDocumentTypeFk',
				readonly: item.Version > 0 || !ppsCommonGenericDocumentFromValuesHelper.isDocumentSavedInPpsDocTable(item.From)
			}]);
		};

		return service;
	}
})(angular);
