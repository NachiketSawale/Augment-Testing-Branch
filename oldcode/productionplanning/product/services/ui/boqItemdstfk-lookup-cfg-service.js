/**
 * Created by zwz on 1/6/2021.
 */

(function (angular) {
	'use strict';
	var moduleName = 'productionplanning.product';
	/**
	 * @ngdoc service
	 * @name productionplanningProductEngProdComponentBoqItemDstFkLookupConfigService
	 * @function
	 *
	 * @description
	 * This service provides lookup config for field BoqItemDstFk
	 */
	angular.module(moduleName).service('productionplanningProductEngProdComponentBoqItemDstFkLookupConfigService', BoqItemDstFkLookupConfigService);

	BoqItemDstFkLookupConfigService.$inject = ['$injector'];
	function BoqItemDstFkLookupConfigService($injector) {

		this.provideBoqItemDstFkLookupConfig = function provideBoqItemDstFkLookupConfig() {
			var filterFn = function (entity) {
				var dataService = $injector.get('productionplanningProductEngProdComponentDataService');
				var selectedProduct = dataService.parentService().getSelected();
				return {
					projectId: selectedProduct.ProjectId //,boqHeaderId: entity.BoqHeaderFk
				};
			};

			var lookupOptionsObj = {
				lookupType: 'boqMainProjectBoqItemLookupDataService',
				dataServiceName: 'boqMainProjectBoqItemLookupDataService',
				valueMember: 'Id',
				displayMember: 'Reference',
				filter: filterFn,
				lookupModuleQualifier: 'boqMainProjectBoqItemLookupDataService',
				columns: [
					{
						'id': 'Brief',
						'field': 'BriefInfo.Description',
						'name': 'Brief',
						'formatter': 'description',
						'name$tr$': 'cloud.common.entityBrief'
					},
					{
						'id': 'Reference',
						'field': 'Reference',
						'name': 'Reference',
						'formatter': 'description',
						'name$tr$': 'cloud.common.entityReference'
					},
					{
						'id': 'BasUomFk',
						'field': 'BasUomFk',
						'name': 'Uom',
						'formatter': 'lookup',
						'formatterOptions': {
							lookupType: 'uom',
							displayMember: 'Unit'
						},
						'name$tr$': 'cloud.common.entityUoM'
					}
				],
				treeOptions: {
					'parentProp': 'BoqItemFk', 'childProp': 'BoqItems'
				}
			};

			return {
				detail: {
					type: 'directive',
					directive: 'basics-lookupdata-lookup-composite',
					options: {
						lookupDirective: 'basics-lookup-data-by-custom-data-service',
						descriptionMember: 'BriefInfo.Description',
						lookupOptions: lookupOptionsObj
					}
				},
				grid: {
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'boqMainProjectBoqItemLookupDataService',
						dataServiceName: 'boqMainProjectBoqItemLookupDataService',
						valueMember: 'Id',
						displayMember: 'Reference',
						filter: filterFn,
						lookupModuleQualifier: 'boqMainProjectBoqItemLookupDataService',
					},
					editor: 'lookup',
					editorOptions: {
						lookupDirective: 'basics-lookup-data-by-custom-data-service',
						lookupType: 'boqMainProjectBoqItemLookupDataService',
						lookupOptions: lookupOptionsObj
					}
				}
			};
		};

	}
})(angular);
