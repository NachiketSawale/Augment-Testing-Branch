/**
 * Created by wui on 6/25/2019.
 */

(function (angular) {
	'use strict';

	var moduleName = 'basics.costgroups';

	angular.module(moduleName).constant('basicsCostGroupType', {
		licCostGroup: 0,
		projectCostGroup: 1
	});

	angular.module(moduleName).factory('basicsCostGroupConfigOptions', ['basicsCostGroupType',
		function (basicsCostGroupType) {
			return {
				costGroupType: basicsCostGroupType.licCostGroup,
				isComposite: true,
				displayMember: 'Code',
				descriptionMember: 'DescriptionInfo.Translated',
				lookupOptions: {
					showClearButton: true,
					isFastDataRecording: true,
				},
				filterCallback: null,
				projectIdGetter: null,
				catalogIdGetter: null,
				catalogIdsGetter: null
			};
		}
	]);

	angular.module(moduleName).factory('basicsCostGroupLookupConfigService', ['basicsCostGroupType', 'basicsCostGroupConfigOptions',
		function (basicsCostGroupType, basicsCostGroupConfigOptions) {
			var service = {};

			service.provideGridConfig = function provideGridConfig(options) {
				var settings = mergeOptions(options);
				var lookupConfig = makeLookupConfig(settings);
				return makeGridConfig(settings, lookupConfig);
			};

			service.provideFromConfig = function (options) {
				var settings = mergeOptions(options);
				var lookupConfig = makeLookupConfig(settings);
				return makeFromConfig(settings, lookupConfig);
			};

			service.provideGridAndFormConfig = function (options) {
				var settings = mergeOptions(options);
				var lookupConfig = makeLookupConfig(settings);
				return {
					grid: makeGridConfig(settings, lookupConfig),
					detail: makeFromConfig(settings, lookupConfig)
				};
			};

			service.provideLicConfig = function (options) {
				options = options || {};
				options.costGroupType = basicsCostGroupType.licCostGroup;
				return service.provideGridAndFormConfig(options);
			};

			service.provideProjectConfig = function (options) {
				options = options || {};
				options.costGroupType = basicsCostGroupType.projectCostGroup;
				return service.provideGridAndFormConfig(options);
			};

			function mergeOptions(options) {
				return _.merge({}, basicsCostGroupConfigOptions, options);
			}

			function makeGridConfig(options, lookupOptions) {
				var formatterOptions = {
						version: 3,
						lookupType: 'CostGroup',
						displayMember: options.displayMember,
						useNewLookupType: true,
						childProp:'ChildItems'
					},
					editorOptions = {
						directive: 'basics-cost-group-dialog',
						lookupOptions: lookupOptions
					};

				return {
					formatter: 'lookup',
					formatterOptions: formatterOptions,
					editor: 'lookup',
					editorOptions: editorOptions
				};
			}

			function makeFromConfig(options, lookupOptions) {
				var config;

				if (options.isComposite) {
					config = {
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupDirective: 'basics-cost-group-dialog',
							descriptionMember: options.descriptionMember,
							lookupOptions: lookupOptions
						}
					};
				}
				else {
					config = {
						type: 'directive',
						directive: 'basics-cost-group-dialog',
						options: lookupOptions
					};
				}

				return config;
			}

			function makeLookupConfig(options) {
				var config = options.lookupOptions;

				config.filterOptions = {
					serverSide: true,
					fn: function (entity) {
						var filterArgs = {
							costGroupType: options.costGroupTypeGetter ? options.costGroupTypeGetter(entity) : options.costGroupType
						};

						if (_.isFunction(options.catalogIdsGetter)) {
							filterArgs.catalogIds = options.catalogIdsGetter.call(options, entity);
						}

						if(_.isFunction(options.catalogIdGetter)) {
							var catalogId = options.catalogIdGetter.call(options, entity);
							if (_.isArray(filterArgs.catalogIds)) {
								filterArgs.catalogIds.push(catalogId);
							}
							else {
								filterArgs.catalogIds = [catalogId];
							}
						}

						if (_.isFunction(options.projectIdGetter)) {
							filterArgs.projectId = options.projectIdGetter.call(options, entity);
						}

						if (_.isFunction(options.filterCallback)) {
							options.filterCallback.call(options, entity, filterArgs);
						}

						return filterArgs;
					}
				};

				return config;
			}

			return service;
		}
	]);

})(angular);