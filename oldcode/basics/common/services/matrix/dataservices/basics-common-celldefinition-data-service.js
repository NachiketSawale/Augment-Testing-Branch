(function () {

	'use strict';

	const moduleName = 'basics.common';
	const basics = angular.module(moduleName);
	const serviceName = 'basicsCommonCellDefinitionDataService';
	basics.factory(serviceName, ['basicsCommonMatrixConfigMainService', 'platformDataServiceFactory', 'platformDataProcessExtensionHistoryCreator', '_',

		function (basicsCommonMatrixConfigMainService, platformDataServiceFactory, historyCreator, _) {

			const factoryOptions = {
				flatNodeItem: {
					module: basics,
					serviceName: serviceName,
					entityNameTranslationID: 'basics.common.fontEntity',
					// httpCreate: {
					// route: globals.webApiBaseUrl + 'basics/common/matrix/',
					// endCreate: 'createCellDefinition'
					// },
					actions: {delete: false, create: 'flat'},
					entityRole: {
						leaf: {itemName: 'CellDefinition', parentService: basicsCommonMatrixConfigMainService}
					},
					modification: true,
					presenter: {
						list: {
							initCreationData: function initCreationData(creationData) {
								creationData.mainItemId = basicsCommonMatrixConfigMainService.getSelected().MatrixDto.Id;
							}
						}
					}
				}
			};

			const serviceContainer = platformDataServiceFactory.createNewComplete(factoryOptions);
			const service = serviceContainer.service;
			const data = serviceContainer.data;

			service.setList = function setList(items) {
				data.itemList.length = 0;
				_.forEach(items, function (item) {
					historyCreator.processItem(item);
					data.itemList.push(item);
				});

				data.listLoaded.fire();
			};

			function getSelectedCellDefinition() {
				const selected = basicsCommonMatrixConfigMainService.getList()[0];
				if (selected) {
					if (selected.MatrixcelldefinitionDto) {
						service.setList([angular.copy(selected.MatrixcelldefinitionDto)]);
						return service.setSelected(selected.MatrixcelldefinitionDto);
					}
				}
			}

			service.getSelectedCellDefinition = getSelectedCellDefinition;

			basicsCommonMatrixConfigMainService.registerSelectionChanged(getSelectedCellDefinition);

			return service;

		}]);
})(angular);
