(function () {
	'use strict';
	/* global _ */

	var moduleName='sales.contract';
	angular.module(moduleName).directive('salesContractReductionRuleLookup', [
		'$q',
		'BasicsLookupdataLookupDirectiveDefinition',
		function (
			$q,
			BasicsLookupdataLookupDirectiveDefinition
		) {
			var defaults = {
				lookupType: 'reductionrule',
				valueMember: 'Id',
				displayMember: 'Description'
			};

			var reductionRules = [
				{Id: 1, Description: 'Percentage of Total Work'},
				{Id: 2, Description: 'Percentage of Increase'},
				{Id: 3, Description: 'Percentage of Advance Payment Amount'},
				{Id: 4, Description: 'Absolute Amount'}
			];

			function getParam(item, param) {
				var value = null;
				if (!param) {
					return value;
				}
				var paramArray = param.split('.');
				if (paramArray === 1) {
					return item[param].toLowerCase();
				}
				else {
					var obj = item;
					paramArray.every(function(i) {
						if (_.isObject(obj[i])) {
							obj = obj[i];
							return true;
						}
						else {
							value = obj[i];
							return false;
						}
					});
					return value.toLowerCase();
				}

			}

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
				dataProvider: {
					getList: function () {
						var deferred = $q.defer();
						deferred.resolve(reductionRules);
						return deferred.promise;
					},
					getItemByKey: function (key) {
						var deferred = $q.defer();
						var entity = _.find(reductionRules, {Id: key});
						deferred.resolve(entity);
						return deferred.promise;
					},
					getSearchList: function (value, param, scope, searchSettings) {
						var list = [];
						var deferred = $q.defer();
						_.forEach(reductionRules, function (i) {
							var val = getParam(i, param);
							var searchStr = searchSettings.searchString ? searchSettings.searchString.toLowerCase() : null;
							if (val && searchStr && val.search(searchStr) !== -1) {
								list.push(i);
							}
						});
						deferred.resolve(list);
						return deferred.promise;
					}
				}
			});
		}]);
})();