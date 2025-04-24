/**
 * Created by waz on 8/1/2018.
 */
(function (angular) {
	'use strict';
	const moduleName = 'transportplanning.bundle';
	const BundleModul = angular.module(moduleName);

	/**
	 * @summary
	 * The core bundle document logic
	 */
	BundleModul.factory('transportplanningBundleDocumentDataProviderFactory', DocumentDataProviderFactory);

	DocumentDataProviderFactory.$inject = ['ppsDocumentDataProviderFactory'];

	function DocumentDataProviderFactory(ppsDocumentDataProviderFactory) {

		const ppsDocumentTypes = {
			StackList: {
				id: 2,
				name: 'StackList',
				model: 'PpsStackListDocument'
			},
			LayoutDrawing: {
				id: 3,
				name: 'LayoutDrawing',
				model: 'PpsLayoutDrawingDocument'
			},
			QTO: {
				id: 4,
				name: 'QTO',
				model: 'PpsQTODocument'
			},
			PositionPlan: {
				id: 5,
				name: 'PositionPlan',
				model: 'PpsPositionPlanDocument'
			}
		};

		function create(service) {
			return ppsDocumentDataProviderFactory.create({
				parentService: service,
				foreignKey: 'TrsProductBundleFk',
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