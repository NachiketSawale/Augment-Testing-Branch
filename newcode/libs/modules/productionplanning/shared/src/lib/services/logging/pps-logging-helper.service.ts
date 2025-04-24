
// export class ProductionplanningSharedLoggingHelperService {

// 	function asyncLoad(url, cacheGetter, cacheSetter) {
// 		var defer = $q.defer();
// 		var cache = cacheGetter();
// 		if (!cache) {
// 			$http.get(url).then(function (response) {
// 				cacheSetter(response.data);
// 				defer.resolve(response.data);
// 			});
// 		} else {
// 			defer.resolve(cache);
// 		}

// 		return defer.promise;
// 	}

// 	function asyncLoadLogConfig() {
// 		return asyncLoad(
// 			globals.webApiBaseUrl + 'productionplanning/configuration/logconfig/list',
// 			function () {
// 				return logConfigCache;
// 			},
// 			function (value) {
// 				logConfigCache = value;
// 			}
// 		);
// 	}

// 	function asyncLoadDto2DbMapping() {
// 		return asyncLoad(
// 			globals.webApiBaseUrl + 'productionplanning/configuration/logconfig/dto2dbmappings',
// 			function () {
// 				return dto2DbMappingCache;
// 			},
// 			function (value) {
// 				dto2DbMappingCache = value;
// 			}
// 		);
// 	}

// 	function asynCreateColumnId2DtoPropNameMapping(logs, translationSrv) {
// 		return loadMappingPromise.then(function (mapping) {
// 			var result = {};
// 			logs.forEach(function (log) {
// 				if (!result[log.PpsEntityFk]) {
// 					result[log.PpsEntityFk] = {};
// 				}
// 				if (result[log.PpsEntityFk][log.ColumnId] === undefined) {
// 					result[log.PpsEntityFk][log.ColumnId] = '';
// 					var m = _.find(mapping, {PpsEntityFk: log.PpsEntityFk});
// 					if (m) {
// 						var dtoPropName = _.findKey(m.DtoProp2TblColumn, {ColumnId: log.ColumnId});
// 						if (dtoPropName === 'DescriptionInfo.Translated') {
// 							dtoPropName = 'DescriptionInfo';
// 						}
// 						var word = _.get(translationSrv, 'data.words.' + dtoPropName, undefined);
// 						if (word) {
// 							var id = word.location + '.' + word.identifier;
// 							result[log.PpsEntityFk][log.ColumnId] = $translate.instant(id, word.param) !== id ? $translate.instant(id, word.param) : word.initial;
// 						}
// 					}
// 				}
// 			});

// 			return result;
// 		});
// 	}
	
// 	public translateLogColumnName (logs, translationService, dataService){
// 		var promises = [
// 			asynCreateColumnId2DtoPropNameMapping(logs, translationService),
// 			// platformTranslateService.registerModule(translationService.data.allUsedModules, true)
// 		];
// 		Promise.all(promises).then(function (responses) {
// 			doTranslateLogColumnName(logs, responses[0]);
// 			if(dataService && angular.isFunction(dataService.gridRefresh)) {
// 				dataService.gridRefresh();
// 			}
// 		});
// 	}
// }