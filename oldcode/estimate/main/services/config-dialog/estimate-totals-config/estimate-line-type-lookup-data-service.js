
(function(angular){
	'use strict';

	angular.module('estimate.main').factory('estimateMainLineTypeLookupDataService', ['_', '$q', '$translate',
		function(_, $q, $translate){
			let dataList = [
				{Id: 0, Code: '',RemarkText:$translate.instant('estimate.main.blankStr')},
				{Id: 1, Code: $translate.instant('estimate.main.gc'),RemarkText:$translate.instant('estimate.main.gcDes')},
				{Id: 2, Code: $translate.instant('estimate.main.ga'),RemarkText:$translate.instant('estimate.main.gaDes')},
				{Id: 3, Code: $translate.instant('estimate.main.am'),RemarkText:$translate.instant('estimate.main.amDes')},
				{Id: 4, Code: $translate.instant('estimate.main.rp'),RemarkText:$translate.instant('estimate.main.rpDes')},
				{Id: 5, Code: $translate.instant('estimate.main.fm'),RemarkText:$translate.instant('estimate.main.fmDes')},
				{Id: 6, Code: $translate.instant('estimate.main.allowance'),RemarkText:$translate.instant('estimate.main.allowanceDes')},
				{Id: 7, Code: $translate.instant('estimate.main.aa'),RemarkText:$translate.instant('estimate.main.aaDes')},
				{Id: 8, Code: $translate.instant('estimate.main.mm'),RemarkText:$translate.instant('estimate.main.mmDes')},
				{Id: 9, Code: $translate.instant('estimate.main.itemTotal'),RemarkText:$translate.instant('estimate.main.itemTotalDes')},
				{Id: 10, Code: $translate.instant('estimate.main.costPrice'),RemarkText:$translate.instant('estimate.main.costPriceDes')},
				{Id: 11, Code: $translate.instant('estimate.main.costTotalDJC'),RemarkText:$translate.instant('estimate.main.costTotalDJCDes')},
				{Id: 12, Code: $translate.instant('estimate.main.costTotal'),RemarkText:$translate.instant('estimate.main.costTotalDes')},
				{Id: 13, Code: $translate.instant('estimate.main.costTotalWithoutGC'),RemarkText:$translate.instant('estimate.main.costTotalWithoutGCDes')}
			];

			let service = {
				getList: getList,
				getItemById: getItemById,
				getItemByIdAsync:getItemByIdAsync,
				getItemByKey:getItemByKey,
				getSearchList: getSearchList,
			};

			function getList() {
				return $q.when(dataList);
			}

			function getItemByKey(value) {
				return getItemByIdAsync(value);
			}

			function getItemById (value) {
				return _.find(dataList, {Id: value});
			}

			function getItemByIdAsync(value) {
				let deferred = $q.defer();
				let item = _.find(dataList,{'Id':value});
				if(item){
					deferred.resolve(item);
				}
				return deferred.promise;
			}

			function getSearchList() {
				return dataList;
			}

			return service;
		}
	]);

})(angular);