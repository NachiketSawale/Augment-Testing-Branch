/**
 * Created by lav on 4/29/2019.
 */
(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.cadimport';

	angular.module(moduleName).factory('ppsCadimportDrawingProcessor', processor);

	processor.$inject = ['platformRuntimeDataService', 'ppsCadImportHelperService'];

	function processor(platformRuntimeDataService, ppsCadImportHelperService) {
		var service = {};

		service.processItem = function (item) {
			if (item) {
				service.setColumnsReadOnly(item, Object.getOwnPropertyNames(item), true);
				if (!item.isImporting) {
					service.setColumnsReadOnly(item, ['PUForCreateProducts'], !item.CreateProductsInPU);
					service.setColumnsReadOnly(item, ['ImportModel'], false);
				}

				// set value of InTransport
				item.InTransport = isInTransport(item);

				ppsCadImportHelperService.updateSelection(item.ImportModel, item.PersistObject.Previews);
			}
		};

		service.setColumnsReadOnly = function setColumnsReadOnly(item, columns, flag) {
			var fields = [];
			_.each(columns, function (column) {
				fields.push({field: column, readonly: flag});
			});
			platformRuntimeDataService.readonly(item, fields);
		};

		function isIntransportIncludingChildren(previewItem) {
			if(_.isNil(previewItem)) {
				return false;
			}

			var inTrs = previewItem.InTransport;
			if(!inTrs && angular.isArray(previewItem.ChildItems)) {
				for (var i = 0; i < previewItem.ChildItems.length; i++) {
					inTrs = isIntransportIncludingChildren(previewItem.ChildItems[i]);
					if(inTrs) {
						break;
					}
				}
			}
			return inTrs;
		}

		function isInTransport(importEntity) {
			var result = false;
			var treeRoots = importEntity.PersistObject.Previews;
			for (var j = 0; j < treeRoots.length; j++) {
				result = isIntransportIncludingChildren(treeRoots[j]);
				if(result) {
					break;
				}
			}
			return result;
		}

		return service;
	}
})(angular);
