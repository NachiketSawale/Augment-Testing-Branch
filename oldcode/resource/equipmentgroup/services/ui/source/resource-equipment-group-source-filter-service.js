/**
 * Created by nitsche on 22.02.2023.
 */
(function (angular) {
	/* global $ */
	'use strict';
	var moduleName = angular.module('resource.equipmentgroup');

	/**
	 * @ngdoc service
	 * @name resourceEquipmentGroupSourceFilterService
	 * @function
	 *
	 * @description
	 *
	 */
	moduleName.service('resourceEquipmentGroupSourceFilterService', ResourceEquipmentGroupSourceFilterService);

	ResourceEquipmentGroupSourceFilterService.$inject = ['_', 'platformTranslateService', 'basicsLookupdataConfigGenerator',
		'logisticDispatchingHeaderDataService', 'platformLayoutHelperService', 'platformRuntimeDataService'];

	function ResourceEquipmentGroupSourceFilterService(_, platformTranslateService, basicsLookupdataConfigGenerator,
		logisticDispatchingHeaderDataService, platformLayoutHelperService, platformRuntimeDataService) {
		var self = this;
		var instances = {};

		this.provideResourceCatalogConfig = function provideResourceCatalogConfig() {
			return  basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm(
				{
					dataServiceName: 'resourceCatalogLookupDataService'
				},
				{
					gid: 'selectionfilter',
					rid: 'catalog',
					label: 'Plant Catalog',
					label$tr$: 'resource.catalog.entityResourceCatalog',
					type: 'integer',
					model: 'catalogFk',
					sortOrder: 1
				});
		};

		this.createFilterParams = function createFilterParams(filter, uuid) {
			var params = instances[uuid];
			if(_.isNull(params) || _.isUndefined(params)) {
				params = self.provideFilterParams(filter, uuid);
				instances[uuid] = params;
			}

			return params;
		};

		this.handleFilter = function handleFilter(formConfig, entity, filter) {
			switch (filter) {
				case 'catalogFk':
					formConfig.rows.push(self.provideResourceCatalogConfig());
					entity.stockFk = null;
					break;
			}
		};

		var entity = {};

		this.provideFilterParams = function provideFilterParams(filter, uuid) {
			var formConfig = {
				fid: 'resource.equipmentgroup.selectionfilter' + uuid,
				version: '1.0.0',
				showGrouping: false,
				groups: [
					{
						gid: 'selectionfilter',
						isOpen: true,
						visible: true,
						sortOrder: 1
					}
				],
				rows: []
			};

			if (angular.isArray(filter)) {
				for (var i = 0; i < filter.length; i++) {
					self.handleFilter(formConfig, entity, filter[i]);
				}
			} else {
				self.handleFilter(formConfig, entity, filter);
			}
			entity.uuid = uuid;
			return {entity: entity, config: platformTranslateService.translateFormConfig(formConfig)};
		};
	}
})(angular);