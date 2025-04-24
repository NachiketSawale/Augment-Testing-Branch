
(function (angular, globals) {
	'use strict';

	var moduleName = 'procurement.common';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	globals.lookups.findBidderWithColumnOption = function findBidderWithColumnOption($injector) {
		var q = $injector.get('$q');
		var _ = $injector.get('_');
		var translate = $injector.get('$translate');

		return {
			lookupOptions: {
				valueMember: 'id',
				displayMember: 'value',
				lookupType: 'findBidderWithColumnOption',
				uuid: 'B79DD244A4BB4B4F9A4F0F3EED1ADC47',
				columns: [
					{
						id: 'value',
						field: 'value',
						name$tr$: 'cloud.common.entityParameterValue',
						name: 'value',
						width: 200
					}
				],
				showClearButton:true
			},
			dataProvider: {
				getList: function () {
					var deferred = q.defer();
					var columnOption = [
						{id:1,value: translate.instant('businesspartner.main.businessPartnerDialog.name')},
						{id:2,value: translate.instant('businesspartner.main.import.addressStreet')},
						{id:3,value: translate.instant('businesspartner.main.import.addressCity')},
						{id:4,value: translate.instant('businesspartner.main.import.addressCountryFk')},
						{id:5,value: translate.instant('businesspartner.main.import.addressZipCode')},
						{id:6,value: translate.instant('businesspartner.main.telephoneNumber')},
						{id:7,value: translate.instant('businesspartner.main.internet')},
						{id:8,value: translate.instant('businesspartner.main.import.email')},
						{id:9,value: translate.instant('businesspartner.main.creFoNo')},
						{id:10,value: translate.instant('businesspartner.main.import.bedirektNo')},
						{id:11,value: translate.instant('businesspartner.main.import.dunsNo')},
						{id:12,value: translate.instant('businesspartner.main.import.vatNo')},
						{id:13,value: translate.instant('businesspartner.main.taxNo')},
						{id:14,value: translate.instant('businesspartner.main.import.tradeRegister')},
						{id:15,value: translate.instant('businesspartner.main.import.tradeRegisterNo')},
						{id:16,value: translate.instant('businesspartner.main.import.avaid')},
						{id:17,value: translate.instant('businesspartner.main.import.craftCooperative')},
						{id:18,value: translate.instant('businesspartner.main.import.craftCooperativeType')},
						{id:19,value: translate.instant('businesspartner.main.customerAbc')},
						{id:20,value: translate.instant('businesspartner.main.customerSector')},
						{id:21,value: translate.instant('businesspartner.main.customerStatus')},
						{id:22,value: translate.instant('businesspartner.main.customerGroup')},
						{id:23,value: translate.instant('businesspartner.main.import.legalForm')},
						{id:24,value: translate.instant('businesspartner.main.import.creditStanding')},
						{id:25,value: translate.instant('businesspartner.main.import.remarkMarketing')},
						{id:26,value: translate.instant('businesspartner.main.import.remark1')},
						{id:27,value: translate.instant('businesspartner.main.import.remark2')},
						{id:28,value: translate.instant('businesspartner.main.import.entityUserDefined1')},
						{id:29,value: translate.instant('businesspartner.main.import.entityUserDefined2')},
						{id:30,value: translate.instant('businesspartner.main.import.entityUserDefined3')},
						{id:31,value: translate.instant('businesspartner.main.import.entityUserDefined4')},
						{id:32,value: translate.instant('businesspartner.main.import.entityUserDefined5')},
						{id:33,value: translate.instant('businesspartner.main.referenceValue1')},
						{id:34,value: translate.instant('businesspartner.main.referenceValue2')}];
					deferred.resolve(columnOption);
					return deferred.promise;
				},
				getItemByKey: function (identification, options, scope) {
					return this.getList(options, scope).then(function (list) {
						return _.find(list, {Id: identification});
					});

				}
			}
		};
	};

	globals.lookups.findBidderWithModeOption = function findBidderWithModeOption($injector) {
		var q = $injector.get('$q');
		var _ = $injector.get('_');
		var translate = $injector.get('$translate');

		return {
			lookupOptions: {
				valueMember: 'id',
				displayMember: 'value',
				lookupType: 'findBidderWithModeOption',
				uuid: 'E2558C22F4334AF2AFDD7A3009AF431A',
				columns: [
					{
						id: 'value',
						field: 'value',
						name$tr$: 'cloud.common.entityParameterValue',
						name: 'value',
						width: 200
					}
				],
				showClearButton:true
			},
			dataProvider: {
				getList: function () {
					var deferred = q.defer();
					var modeOption = [
						{id: 1,value: translate.instant('businesspartner.main.businessPartnerDialog.includes')},
						{id: 2,value: translate.instant('businesspartner.main.businessPartnerDialog.startsWith')},
						{id: 3,value: translate.instant('businesspartner.main.businessPartnerDialog.endsWith')
						}];
					deferred.resolve(modeOption);
					return deferred.promise;
				},
				getItemByKey: function (identification, options, scope) {
					return this.getList(options, scope).then(function (list) {
						return _.find(list, {Id: identification});
					});
				}
			}
		};
	};

	angular.module(moduleName).directive('findBidderWithColumns',
		['$translate', function ($translate) {
			return {
				restrict: 'AE',
				scope: {
					columns: '='
				},
				templateUrl: function () {
					return globals.appBaseUrl + 'procurement.common/partials/wizard/find-bidder-with-columns.html';
				},
				link: function ($scope) {
					var tPrefix = 'procurement.common.findBidder.';
					$scope.columns.header = $translate.instant(tPrefix + 'columns.title');
					$scope.columns.description = $translate.instant(tPrefix + 'columns.description');
					$scope.columns.selectItem = null;
					$scope.columns.selectedcOp = null;
					$scope.columns.selectedmOp = null;
				}
			};
		}]);

	angular.module(moduleName).directive('findBidderWithColumnOption', ['$injector', 'BasicsLookupdataLookupDirectiveDefinition',
		function ($injector, BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = globals.lookups.findBidderWithColumnOption($injector);
			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults.lookupOptions, {
				dataProvider: defaults.dataProvider
			});
		}]);

	angular.module(moduleName).directive('findBidderWithModeOption', ['$injector', 'BasicsLookupdataLookupDirectiveDefinition',
		function ($injector, BasicsLookupdataLookupDirectiveDefinition) {

			var defaults = globals.lookups.findBidderWithModeOption($injector);

			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults.lookupOptions, {
				dataProvider: defaults.dataProvider
			});
		}]);
})(angular, globals);