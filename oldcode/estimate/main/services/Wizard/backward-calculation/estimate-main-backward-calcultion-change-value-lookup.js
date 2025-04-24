(function (angular) {
	'use strict';
	let moduleName = 'estimate.main';
	angular.module(moduleName).directive('estimateMainBackwardChangeValueLookup',
		['$q', '_', '$injector', 'platformGridAPI', 'BasicsLookupdataLookupDirectiveDefinition', 'estimateMainBackwardChangeValueDataService',
			function ($q, _, $injector, platformGridAPI, BasicsLookupdataLookupDirectiveDefinition, estimateMainBackwardChangeValueDataService) {

				let defaults = {
					lookupType: 'BackwardChangeValue',
					valueMember: 'Id',
					displayMember: 'Code'
				};

				return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
					dataProvider: estimateMainBackwardChangeValueDataService
				});
			}]);

	angular.module(moduleName).service('estimateMainBackwardChangeValueDataService', ['$q', '_', 'estimateMainBackwardCalculationGridDataService',function ($q, _,estimateMainBackwardCalculationGridDataService) {
		let service = {};
		let dataList = [{
			Id: 1,
			Code: 'Cost Factor1'
		}, {
			Id: 2,
			Code: 'Quantity Factor1'
		}, {
			Id: 3,
			Code: 'Quantity'
		}, {
			Id: 4,
			Code: 'Cost/Unit'
		}];
		angular.extend(service, {
			getData: function () {
				return getDataList();
			},
			getList: function () {
				return $q.when(getDataList());
			},
			getItemByKey: function (value) {
				return _.find(getDataList(), {Id: value});
			},
			getItemById: function (value) {
				return _.find(getDataList(), {Id: value});
			},
			getLookupData:function(){
				return getDataList();
			}
		});

		function getDataList() {
			let selectEntitys = estimateMainBackwardCalculationGridDataService.getSelectedEntities();
			if (selectEntitys && selectEntitys[0] && selectEntitys[0].Id < 0) {
				let copyList = angular.copy(dataList);
				_.remove(copyList, {Id: 4});
				return copyList;
			}
			return angular.copy(dataList);
		}

		return service;
	}]);
})(angular);
