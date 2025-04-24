/**
 * @author: chd
 * @date: 5/26/2021 1:46 PM
 * @description:
 */
(function (angular) {
	'use strict';
	let moduleName = 'mtwo.aiconfiguration';

	angular.module(moduleName).directive('mtwoAiConfigurationParameterAliasLookup', ['_', '$q', '$injector', 'basicsImportFormatService', 'BasicsLookupdataLookupDirectiveDefinition', 'mtwoAiConfigurationParameterAliasService',

		function (_, $q, $injector, importFormatService, BasicsLookupdataLookupDirectiveDefinition, mtwoAiConfigurationParameterAliasService) {
			let defaults = {
				lookupType: 'ParameterAlias',
				valueMember: 'Alias',
				displayMember: 'Alias'
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
				dataProvider: {
					getList: function () {
						let deferred = $q.defer();
						let parameterAlias = mtwoAiConfigurationParameterAliasService.getParameterAlias();
						deferred.resolve(parameterAlias);
						return deferred.promise;
					},

					getItemByKey: function (value) {
						let parameterAlias = mtwoAiConfigurationParameterAliasService.getParameterAlias();
						let item = _.find(parameterAlias, {Alias: value});
						let deferred = $q.defer();
						deferred.resolve(item);
						return deferred.promise;
					},

					getItemById: function (value) {
						let parameterAlias = mtwoAiConfigurationParameterAliasService.getParameterAlias();
						return _.find(parameterAlias, {Alias: value});
					},

					getItemByIdAsync: function (value) {
						let parameterAlias = mtwoAiConfigurationParameterAliasService.getParameterAlias();
						let item = _.find(parameterAlias, {Alias: value});
						let deferred = $q.defer();
						deferred.resolve(item);
						return deferred.promise;
					}
				}
			});

		}
	]);

})(angular);
