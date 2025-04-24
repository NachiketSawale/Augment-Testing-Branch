/**
 * Created by wui on 5/23/2017.
 */

(function (angular) {
	'use strict';

	var moduleName = 'basics.lookupdata';

	angular.module(moduleName).factory('basicsLookupdataLookupKeyService', [
		'_',
		'platformObjectHelper',
		function (_,
			platformObjectHelper) {

			function hasPKey(options) {
				return options.pKeyMaps && options.pKeyMaps.length;
			}

			function isPKeyChange(dataItem, entity, options) {
				if (!hasPKey(options)) {
					return false;
				}

				return !_.isEqual(getIdentification(null, dataItem, options, true), getIdentification(null, entity, options));
			}

			function applyPKey(dataItem, entity, options) {
				if (!isPKeyChange(dataItem, entity, options)) {
					return;
				}

				entity = entity || {};
				options.pKeyMaps.forEach(function (pKeyMap) {
					platformObjectHelper.setValue(
						entity,
						pKeyMap.fkMember,
						platformObjectHelper.getValue(dataItem, pKeyMap.pkMember));
				});
			}

			function getIdentification(id, entity, options, primary) {
				if (!hasPKey(options)) {
					return id;
				}

				var result = {Id: id};
				var member = primary ? 'pkMember' : 'fkMember';

				options.pKeyMaps.forEach(function (pKeyMap) {
					result[pKeyMap.pkMember] = platformObjectHelper.getValue(entity, pKeyMap[member]);
				});

				return result;
			}

			function getIdentificationData(id, entity, options, primary) {
				if (_.isNil(id) || _.isNil(entity)) {
					return id;
				}

				var result = {Id: id};
				if (hasPKey(options)) {
					var member = primary ? 'pkMember' : 'fkMember';
					options.pKeyMaps.forEach(function (pKeyMap, index) {
						result['PKey' + (index + 1)] = platformObjectHelper.getValue(entity, pKeyMap[member]);
					});
				}

				return result;
			}

			function getIdentificationValue(id, entity, options, primary) {
				if (_.isNil(id) || _.isNil(entity) || _.isNil(options) || !hasPKey(options)) {
					return id;
				}

				var member = primary ? 'pkMember' : 'fkMember';
				return options.pKeyMaps.map(function (pKeyMap) {
					return platformObjectHelper.getValue(entity, pKeyMap[member]);
				}).reduce(function (sum, value) {
					return sum + '-' + value;
				}, id);
			}

			function equal(entity1, entity2, options, primary) {
				var id1 = angular.isObject(entity1) ? getIdentificationValue(entity1.Id, entity1, options, primary) : entity1;
				var id2 = angular.isObject(entity2) ? getIdentificationValue(entity2.Id, entity2, options, primary) : entity2;
				return id1 === id2;
			}

			return {
				equal: equal,
				hasPKey: hasPKey,
				applyPKey: applyPKey,
				isPKeyChange: isPKeyChange,
				getIdentification: getIdentification,
				getIdentificationData: getIdentificationData,
				getIdentificationValue: getIdentificationValue
			};
		}
	]);

})(angular);