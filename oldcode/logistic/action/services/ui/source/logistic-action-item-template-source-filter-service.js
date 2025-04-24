/**
 * Created by chlai on 2025/01/30
 */
(function (angular) {
	/* global $ */
	'use strict';
	var moduleName = angular.module('logistic.action');

	/**
	 * @ngdoc service
	 * @name logisticActionItemTemplateFilterService
	 * @function
	 *
	 * @description
	 *
	 */
	moduleName.service('logisticActionItemTemplateFilterService', LogisticActionItemTemplateFilterService);

	LogisticActionItemTemplateFilterService.$inject = ['_', 'platformTranslateService', 'basicsLookupdataConfigGenerator'];

	function LogisticActionItemTemplateFilterService(
		_, platformTranslateService, basicsLookupdataConfigGenerator) {
		var self = this;
		var instances = {};

		this.provideActionItemTeomplateConfig = function provideActionItemTeomplateConfig() {
			return  basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm(
				{
					moduleQualifier: 'basics.customize.logisticsactionitemtype',
					dataServiceName: 'basicsCustomLogisticActionItemTypeLookupDataService'
				},
				{
					gid: 'selectionfilter',
					rid: 'actionItemType',
					label: 'Action Item Type',
					label$tr$: 'logistic.action.entityActionItemType',
					type: 'integer',
					model: 'actionItemTypeFk',
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
				case 'actionItemTypeFk':
					formConfig.rows.push(self.provideActionItemTeomplateConfig());
					break;
			}
		};

		var entity = {};

		this.provideFilterParams = function provideFilterParams(filter, uuid) {
			var formConfig = {
				fid: 'logistic.action.selectionfilter' + uuid,
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