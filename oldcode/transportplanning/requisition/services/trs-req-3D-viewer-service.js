(angular => {
	/* global globals */
	'use strict';
	const moduleName = 'transportplanning.requisition';

	angular.module(moduleName).service('trsReq3DViewerService', Service);

	Service.$inject = [
		'modelViewerCompositeModelObjectSelectionService',
		'modelViewerViewerRegistryService',
		'modelViewerModelIdSetService',
		'$http',
		'PlatformMessenger'
	];

	function Service(
		modelViewerCompositeModelObjectSelectionService,
		modelViewerViewerRegistryService,
		modelViewerModelIdSetService,
		$http,
		PlatformMessenger) {
		const onModelLoaded = new PlatformMessenger();

		let isReady = false;

		this.isReady = () => isReady;

		this.getModelIdToObjectIdsMap = function () {
			return modelViewerCompositeModelObjectSelectionService.getSelectedObjectIds().useGlobalModelIds();
		};

		this.hasSelectedModelObjects = function () {
			return !modelViewerCompositeModelObjectSelectionService.isSelectionEmpty();
		};

		this.registerSelectionChanged = function (fn) {
			modelViewerViewerRegistryService.registerViewerReadinessChanged(isReadyHandler);
			modelViewerCompositeModelObjectSelectionService.registerSelectionChanged(fn);
		};

		this.unregisterSelectionChanged = function (fn) {
			modelViewerViewerRegistryService.unregisterViewerReadinessChanged(isReadyHandler);
			modelViewerCompositeModelObjectSelectionService.unregisterSelectionChanged(fn);
		};

		this.registerModelLoaded = function (fn) {
			onModelLoaded.register(fn);
		};

		this.unregisterModelLoaded = function (fn) {
			onModelLoaded.unregister(fn);
		};

		this.selectModelObjects = function (productIds) {
			if (!isReady || !Array.isArray(productIds) || productIds.length <= 0) {
				return;
			}

			$http.post(globals.webApiBaseUrl + 'productionplanning/common/model/objectids', {ppsProductIds: productIds})
				.then(res => {
					const objectIds = modelViewerModelIdSetService.createFromCompressedStringWithArrays(res.data).useSubModelIds();
					modelViewerCompositeModelObjectSelectionService.integrateSelection(objectIds);
				});
		};

		function isReadyHandler(viewerInfo) {
			isReady = viewerInfo.isReady();
			if (!isReady) {
				modelViewerCompositeModelObjectSelectionService.resetSelection();
			} else {
				onModelLoaded.fire();
			}
		}
	}
})(angular);