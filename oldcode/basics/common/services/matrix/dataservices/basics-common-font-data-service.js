(function () {

	'use strict';

	const moduleName = 'basics.common';
	const basics = angular.module(moduleName);
	const serviceName = 'basicsCommonFontDataservice';
	basics.factory(serviceName, ['basicsCommonMatrixConfigMainService', 'platformDataServiceFactory', 'platformDataProcessExtensionHistoryCreator', 'globals', '_',

		function (basicsCommonMatrixConfigMainService, platformDataServiceFactory, historyCreator, globals, _) {

			const factoryOptions = {
				flatLeafItem: {
					module: basics,
					serviceName: serviceName,
					entityNameTranslationID: 'basics.common.fontEntity',
					httpCreate: {
						route: globals.webApiBaseUrl + 'basics/common/matrix/',
						endCreate: 'createfont'
					},
					actions: {delete: true, create: 'flat'},
					entityRole: {
						leaf: {itemName: 'Fonts', parentService: basicsCommonMatrixConfigMainService}
					},
					modification: true,
				}
			};

			const serviceContainer = platformDataServiceFactory.createNewComplete(factoryOptions);
			const data = serviceContainer.data;
			// override the existing setList because of too much concurrency
			data.setList = function setList(items) {
				data.itemList.length = 0;
				_.forEach(items, function (item) {
					historyCreator.processItem(item);
					data.itemList.push(item);
				});

				data.listLoaded.fire();
			};

			function getFonts() {
				const selected = basicsCommonMatrixConfigMainService.getList()[0];
				if (selected && selected.MatrixfontDtos) {
					data.setList(selected.MatrixfontDtos);
				}
			}

			basicsCommonMatrixConfigMainService.registerSelectionChanged(getFonts);

			getFonts();

			return serviceContainer.service;

		}]);
})(angular);
