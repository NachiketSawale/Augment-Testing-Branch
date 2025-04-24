/**
 * Created by zwz on 2023/08/18
 */
(function (angular) {
	'use strict';
	const moduleName = 'productionplanning.common';

	angular.module(moduleName).value('ppsCommonGenericDocumentFromValues', [
		{id: 'PRJ', description$tr$: 'project.main.sourceProject'},
		{id: 'JOB', description$tr$: 'logistic.job.entityJob'},
		{id: 'DRW', description$tr$: 'productionplanning.drawing.entityDrawing'},
		{id: 'PPSHEADER', description$tr$: 'productionplanning.common.header.headerTitle'},
		{id: 'PPSITEM', description$tr$: 'productionplanning.item.entityItem'},
		{id: 'ENGTASK', description$tr$: 'productionplanning.engineering.entityEngTask'},
		{id: 'PRODUCTTEMPLATE', description$tr$: 'productionplanning.producttemplate.entityProductDescription'},
		{id: 'PRODUCT_PRJ', description$tr$: 'productionplanning.common.product.entity'},
		{id: 'PRODUCT_CAD', description$tr$: 'productionplanning.common.product.cadProduct'}
	]);

})(angular);

(function (angular) {
	'use strict';
	const moduleName = 'productionplanning.common';

	angular.module(moduleName).service('ppsCommonGenericDocumentFromValuesHelper', Helper);
	Helper.$inject = ['ppsCommonGenericDocumentFromValues', '$translate'];

	function Helper(ppsCommonGenericDocumentFromValues, $translate) {
		return {
			translatedFromValues: ppsCommonGenericDocumentFromValues.map(e => {
				return {id: e.id, description: $translate.instant(e.description$tr$)};
			}),
			isDocumentSavedInPrjDocTable: (fromKey) => fromKey === 'PRJ' || fromKey === 'PPSHEADER' || fromKey === 'PRODUCT_PRJ',
			isDocumentSavedInPpsDocTable: (fromKey) => fromKey === 'DRW' || fromKey === 'PPSITEM' || fromKey === 'ENGTASK' || fromKey === 'PRODUCT_CAD' || fromKey === 'PRODUCTTEMPLATE'
		};
	}
})(angular);

