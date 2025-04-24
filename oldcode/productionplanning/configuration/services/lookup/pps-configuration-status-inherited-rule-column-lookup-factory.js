(angular => {
	'use strict';
	const moduleName = 'productionplanning.configuration';

	angular.module(moduleName).service('ppsConfigurationStatusInheritedRuleColumnLookupFactory', factory);

	factory.$inject = ['basicsLookupdataConfigGenerator', 'basicsLookupdataLookupDescriptorService', 'ppsStatusTriggerRuleValidationService'];

	function factory(basicsLookupdataConfigGenerator, basicsLookupdataLookupDescriptorService, ppsStatusTriggerRuleValidationService) {
		const service = {};

		const statusMap = {
			12: 'basics.customize.ppsitemstatus',
			13: 'basics.customize.ppsproductstatus',
			15: 'basics.customize.ppsproductionsetstatus',
		};

		const lookupDataServiceMap = {
			12: 'ppsItemStatusLookupDataService',
			13: 'ppsProductStatusLookupDataService',
			15: 'ppsProductionSetStatusLookupDataService',
		};

		const lookupColumns = [
			{
				id: 'Code',
				field: 'Code',
				name: 'Code',
				formatter: 'code',
				name$tr$: 'cloud.common.entityCode'
			},
			{
				id: 'Description',
				field: 'DescriptionInfo',
				name: 'Description',
				formatter: 'translation',
				name$tr$: 'cloud.common.entityDescription'
			},
			{
				id: 'sorting',
				field: 'Sorting',
				name: 'Sorting',
				formatter: 'integer',
				name$tr$: 'cloud.common.entitySorting',
			}
		];

		const onEditValueChangedHandler = {
			name: 'onEditValueChanged',
			handler: function (e, args) {
				const entity = this.entity;
				const value = getLastSelectedItem(args.selectedItems);

				// update the field when user click the delete button inside the multiple input element,
				// so that the validation can be triggered correctly, like deleting the last item.
				const field = getField(this);
				if (field) {
					entity[field] = this.keys.concat();
				}

				ppsStatusTriggerRuleValidationService.validatePossibleSourceStatus(entity, value);
				ppsStatusTriggerRuleValidationService.validateRequiredSourceStatus(entity, value);

				function getLastSelectedItem(items) {
					if (!Array.isArray(items) || items.length === 0) {
						return null;
					}
					return items[items.length - 1];
				}

				function getField(scope) {
					if (!scope) {
						return null;
					}

					// select in the validation wizard
					if (scope.config && scope.config.model) {
						return scope.config.model;
					}

					// select in grid
					if (scope.$parent.$parent.config) {
						return scope.$parent.$parent.config.field;
					}

					return null;
				}
			}
		};

		service.getTargetStatusColumnLookupConfig = (entityId) => {
			return basicsLookupdataConfigGenerator.provideGenericLookupConfig(statusMap[entityId], null, {
				showIcon: true,
				imageSelectorService: 'platformStatusSvgIconService',
				svgBackgroundColor: 'BackgroundColor',
				backgroundColorType: 'dec',
				backgroundColorLayer: [1, 2, 3, 4, 5, 6]
			});
		};

		service.getSourceStatusColumnLookupConfig = (entityId) => {
			if (!lookupDataServiceMap[entityId]) {
				throw new Error('no lookup service mapping the entityId: ' + entityId);
			}

			const config = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
				dataServiceName: lookupDataServiceMap[entityId],
				enableCache: true,
				filterKey: 'source-status-filter',
			});

			setLookupOptions(config.grid.editorOptions.lookupOptions);
			setLookupOptions(config.detail.options.lookupOptions);

			return config;
		};

		service.getStatus = (entityId) => {
			return basicsLookupdataLookupDescriptorService.getData(statusMap[entityId]) || {};
		};

		function setLookupOptions(options) {
			options.disableDataCaching = false;
			options.multipleSelection = true;
			options.displayMember = 'DescriptionInfo.Translated';
			options.columns = lookupColumns;
			options.events = [onEditValueChangedHandler];
		}

		return service;
	}
})(angular);