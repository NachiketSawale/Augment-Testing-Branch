(function () {

	'use strict';

	const moduleName = 'basics.common';
	const basics = angular.module(moduleName);
	const serviceName = 'basicsCommonBackgroundDataservice';
	basics.factory(serviceName, ['basicsCommonMatrixConfigMainService', 'platformDataServiceFactory', 'platformDataProcessExtensionHistoryCreator', 'globals', '_',

		function (basicsCommonMatrixConfigMainService, platformDataServiceFactory, historyCreator, globals, _) {

			const factoryOptions = {
				flatLeafItem: {
					module: basics,
					serviceName: serviceName,
					entityNameTranslationID: 'basics.common.backgroundEntity',
					httpCreate: {
						route: globals.webApiBaseUrl + 'basics/common/matrix/',
						endCreate: 'createbackground'
					},
					actions: {delete: true, create: 'flat'},
					entityRole: {
						leaf: {
							itemName: 'Background',
							parentService: basicsCommonMatrixConfigMainService,
							parentFilter: 'matrixId'
						}
					},
					modification: true
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

			function getSelectedMatrixbackgroundDtos() {
				const selected = basicsCommonMatrixConfigMainService.getList()[0];
				if (selected && selected.MatrixbackgroundDtos) {
					data.setList(selected.MatrixbackgroundDtos);
				}
			}

			getSelectedMatrixbackgroundDtos();

			basicsCommonMatrixConfigMainService.registerSelectionChanged(getSelectedMatrixbackgroundDtos);

			return serviceContainer.service;

		}]);
})(angular);
