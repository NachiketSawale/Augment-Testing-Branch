/**
 * @author: chd
 * @date: 10/23/2020 3:27 PM
 * @description:
 */

(function (angular) {
	'use strict';

	var moduleName = 'basics.costgroups';

	angular.module(moduleName).factory('basicsAICostGroupConfigOptions', ['_', 'basicsCostGroupType',
		function (_, basicsCostGroupType) {
			return {
				costGroupType: basicsCostGroupType.licCostGroup,
				isComposite: true,
				displayMember: 'Code',
				descriptionMember: 'DescriptionInfo.Translated',
				lookupOptions: {
					showClearButton: true
				},
				filterCallback: null,
				projectIdGetter: null,
				catalogIdGetter: null,
				catalogIdsGetter: null
			};
		}
	]);

	angular.module(moduleName).factory('basicsAICostGroupLookupConfigService', ['basicsCostGroupType', 'basicsAICostGroupConfigOptions',
		function (basicsCostGroupType, basicsAICostGroupConfigOptions) {
			var service = {};

			service.provideAIGridConfig = function provideGridConfig(options) {
				var settings = mergeOptions(options);
				var lookupConfig = makeAILookupConfig(settings);
				return {
					grid: makeAIGridConfig(settings, lookupConfig)
				};
			};

			service.provideAILicConfig = function (options) {
				options = options || {};
				options.costGroupType = basicsCostGroupType.licCostGroup;
				return service.provideAIGridConfig(options);
			};

			service.provideAIProjectConfig = function (options) {
				options = options || {};
				options.costGroupType = basicsCostGroupType.projectCostGroup;
				return service.provideAIGridConfig(options);
			};

			function mergeOptions(options) {
				return _.merge({}, basicsAICostGroupConfigOptions, options);
			}

			function makeAIGridConfig(options) {
				var formatterOptions = {
						version: 3,
						lookupType: 'CostGroup',
						displayMember: options.displayMember
					},
					editorOptions = {
						directive: 'basics-Ai-Cost-Group-Lookup-Service',
						lookupOptions: {
							showClearButton: true
						}
					};

				return {
					formatter: 'lookup',
					formatterOptions: formatterOptions,
					editor: 'lookup',
					editorOptions: editorOptions
				};
			}

			function makeAILookupConfig(options) {
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
