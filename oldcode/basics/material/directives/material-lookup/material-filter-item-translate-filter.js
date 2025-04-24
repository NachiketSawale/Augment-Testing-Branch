(function () {
	'use strict';

	angular.module('basics.material').filter('materialFilterItemTranslate', [
		'$translate',
		'basicsMaterialRecordLayout',
		'basicsMaterialFilterSource',
		'basicsMaterialFilterId',
		'basicsMaterialSearchGridId',
		'platformGridAPI',
		function (
			$translate,
			basicsMaterialRecordLayout,
			basicsMaterialFilterSource,
			basicsMaterialFilterId,
			basicsMaterialSearchGridId,
			platformGridAPI) {
			function getGridColumns(uuid) {
				const gridColumns = platformGridAPI.columns.configuration(uuid);
				return gridColumns?.current ?? [];
			}

			return function (definition) {
				let description = definition.Id;

				if (definition.Source === basicsMaterialFilterSource.attribute) {
					return description;
				}

				if (definition.Source === basicsMaterialFilterSource.materialEntity) {
					const gridColumns = getGridColumns(basicsMaterialSearchGridId);
					const column = gridColumns.find(e => e.field.toLowerCase() === definition.PropertyName.toLowerCase());

					if (column?.displayName) {
						description = column.displayName;
					} else {
						const trObject = basicsMaterialRecordLayout.translationInfos.extraWords[definition.PropertyName];
						if (trObject) {
							const trKey = trObject.location + '.' + trObject.identifier;
							description = $translate.instant(trKey, trObject.param);
						}
					}
				} else {
					switch (definition.Id) {
						case basicsMaterialFilterId.catalogAndGroup:
							description = $translate.instant('basics.material.record.materialCatalog');
							break;
						case basicsMaterialFilterId.prcStructure:
							description = $translate.instant('basics.material.lookup.filter.prcStructure');
							break;
						case basicsMaterialFilterId.catalogType:
							description = $translate.instant('basics.material.lookup.filter.catalogType');
							break;
						case basicsMaterialFilterId.materialType:
							description = $translate.instant('basics.material.record.materialType');
							break;
						case basicsMaterialFilterId.uom:
							description = $translate.instant('cloud.common.entityUoM');
							break;
						case basicsMaterialFilterId.priceList:
							description = $translate.instant('basics.material.lookup.filter.priceList');
							break;
						default:
							description = definition.Id;
					}
				}

				return description;
			};
		}
	]);

})();