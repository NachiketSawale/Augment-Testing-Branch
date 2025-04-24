/**
 * Created by waz on 4/11/2018.
 */
(function () {
	'use strict';
	/* global _ */
	var moduleName = 'productionplanning.common';

	angular.module(moduleName).factory('productionplanningCommonDocumentDataProcessor', DataProcessor);

	DataProcessor.$inject = ['platformRuntimeDataService'];

	function DataProcessor(platformRuntimeDataService) {
		function processFieldOrigin(item, isFieldOriginReadonly) {
			// init field Origin
			if (!_.isNil(item.ProductDescriptionFk)) {
				item.Origin = 'PRODUCTTEMPLATE';
			} else if (!_.isNil(item.EngDrawingFk)) {
				item.Origin = 'DRW';
			}
			// set readonly
			platformRuntimeDataService.readonly(item, [{
				field: 'Origin',
				readonly: isFieldOriginReadonly
			}]);
		}

		function processItem(item, config) {
			if(item) {
				platformRuntimeDataService.readonly(item, [{
					field: 'DocumentTypeFk',
					readonly: !_.isNil(item.FileArchiveDocFk)
				}]);
				platformRuntimeDataService.readonly(item, [{
					field: 'PpsDocumentTypeFk',
					readonly: item.Version > 0
				}]);

				let isFieldOriginReadonly = true;

				if(config) {
					var parentService = config.parentService;

					if (parentService && parentService.getServiceName().indexOf('PpsUpstreamItemDataService') > -1) {
						var selectedItem = parentService.getSelected();
						if (selectedItem !== null) {
							item.Belonging = item.ItemFk !== selectedItem.UpstreamResult ? 'parentUnit' : 'currentUnit';
						}
					}

					if(config.getService().foreignKey) {
						platformRuntimeDataService.readonly(item, [{
							field: config.getService().foreignKey,
							readonly: true
						}]);
					}

					if (config.getService().curParent && (config.getService().curParent.getServiceName() === 'productionplanningItemDataService' || config.getService().curParent.getServiceName() === 'productionplanningItemSubItemDataService')) {
						isFieldOriginReadonly = item.Version > 0;
					}
				}

				processFieldOrigin(item, isFieldOriginReadonly);

				platformRuntimeDataService.readonly(item, [{
					field: 'EngDrawingFk',
					readonly: item.Origin !== 'DRW' || item.Version > 0 || !_.isNil(item.EngDrawingFk)
				}, {
					field: 'ProductDescriptionFk',
					readonly: item.Origin === 'DRW'
				}]);
			}
		}

		return {
			processItem: processItem
		};
	}
})();
