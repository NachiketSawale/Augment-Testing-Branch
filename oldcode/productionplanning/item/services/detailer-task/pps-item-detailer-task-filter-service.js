(function () {
	'use strict';

	var moduleName = 'productionplanning.item';
	angular.module(moduleName).service('ppsItemDetailerTaskFilterService', [
		'basicsLookupdataConfigGenerator',
		'platformTranslateService',
		function (basicsLookupdataConfigGenerator,
				  platformTranslateService) {
			var self = this;
			var instances = {};
			self.entity = {};

			self.createFilterParams = function createFilterParams(filter, uuid) {
				var params = instances[uuid];
				if (_.isNull(params) || _.isUndefined(params)) {
					params = provideFilterParams(filter, uuid);
					instances[uuid] = params;
				}
				return params;
			};

			function provideFilterParams(filter, uuid) {
				var formConfig = {
					fid: 'productionplanning.item.detailertaskfilter' + uuid,
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

				self.entity.uuid = uuid;
				if (angular.isArray(filter)) {
					for (var i = 0; i < filter.length; i++) {
						handleFilter(formConfig, self.entity, filter[i]);
					}
				} else {
					handleFilter(formConfig, self.entity, filter);
				}
				return {entity: self.entity, config: platformTranslateService.translateFormConfig(formConfig)};
			}

			function handleFilter(formConfig, entity, filter) {
				switch (filter) {
					case 'startingDate':
						formConfig.rows.push(provideStartingDateConfig());
						break;
				}
			}

			function provideStartingDateConfig() {
				return {
					gid: 'selectionfilter',
					rid: 'startingDate',
					type: 'dateutc',
					model: 'startingDate',
					label: '*Starting Date',
					label$tr$: 'productionplanning.item.startingDate',
					sortOrder: 1,
					required: true
				};
			}
		}
	]);
})();