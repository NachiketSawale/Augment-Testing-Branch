(angular => {
	'use strict';
	const moduleName = 'productionplanning.common';
	const module = angular.module(moduleName);

	module.factory('productionplanningProductDocumentDataProviderFactory', DocumentDataProviderFactory);

	DocumentDataProviderFactory.$inject = ['ppsDocumentDataProviderFactory'];

	function DocumentDataProviderFactory(ppsDocumentDataProviderFactory) {

		const ppsDocumentTypes = {
			StackList: {
				id: 2,
				name: 'StackList',
				model: 'PpsStackListDocument',
			},
			LayoutDrawing: {
				id: 3,
				name: 'LayoutDrawing',
				model: 'PpsLayoutDrawingDocument',
			},
			QTO: {
				id: 4,
				name: 'QTO',
				model: 'PpsQTODocument',
			},
			PositionPlan: {
				id: 5,
				name: 'PositionPlan',
				model: 'PpsPositionPlanDocument',
			},
			EPA: {
				id: 6,
				name: 'EPA',
				model: 'PpsEPADocument',
			}
		};

		function create(service, readonly) {
			service.isDocumentReadOnly = !!readonly;
			return ppsDocumentDataProviderFactory.create({
				parentService: service,
			}, ppsDocumentTypes);
		}

		function createPreviewProvider(options) {
			return ppsDocumentDataProviderFactory.createPreviewProvider(options);
		}

		return {
			ppsDocumentTypes: ppsDocumentTypes,
			create: create,
			createPreviewProvider: createPreviewProvider
		};
	}

})(angular);