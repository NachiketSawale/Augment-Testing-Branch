(function (angular) {
	/* global globals */
	'use strict';
	var moduleName = 'logistic.dispatching';

	/**
	 * @ngdoc service
	 * @name logisticDispatchingCommonLookupDataService
	 * @function
	 *
	 * @description
	 * logisticDispatchingCommonLookupDataService provides some lookup data for dispatching record
	 */
	angular.module(moduleName).service('logisticDispatchingCommonLookupDataService', LogisticDispatchingCommonLookupDataService);

	LogisticDispatchingCommonLookupDataService.$inject = ['_', '$http', '$injector'];

	function LogisticDispatchingCommonLookupDataService(_, $http, $injector) {
		this.getArticleInformation = function getArticleInformation(artId, artType) {
			return $http.post(globals.webApiBaseUrl + 'logistic/dispatching/record/articleinformation', {
				Id: artId,
				PKey3: artType
			});
		};

		var packageTypeIdsWithIsFreeCapacity = [];
		var packageTypeIdsWithIsMandatoryCapacity = [];

		var lookup = $injector.get('basicsLookupdataSimpleLookupService');

		function getPackageTypeIdsWithIsMandatoryCapacity(){
			lookup.refreshCachedData({
				valueMember: 'Id',
				displayMember: 'Description',
				lookupModuleQualifier: 'basics.customize.packagingtypes',
				filter: {
					customBoolProperty: 'ISMANDATORYCAPACITY'
				}
			}).then(function (response) {
				if(response) {
					packageTypeIdsWithIsMandatoryCapacity = _.map(_.filter(response, {Ismandatorycapacity: true}), function (item) {
						return item.Id;
					});
				}
			});
		}

		function getPackageTypeIdsWithIsFreeCapacity(){
			lookup.getList({
				valueMember: 'Id',
				displayMember: 'Description',
				lookupModuleQualifier: 'basics.customize.packagingtypes',
				filter: {
					customBoolProperty: 'ISFREECAPACITY'
				}
			}).then(function (response) {
				if(response) {
					packageTypeIdsWithIsFreeCapacity = _.map(_.filter(response, {Isfreecapacity: true}), function (item) {
						return item.Id;
					});
				}
				getPackageTypeIdsWithIsMandatoryCapacity();
			});
		}

		getPackageTypeIdsWithIsFreeCapacity();

		this.getPackageTypeIdsWithIsFreeCapacity = function getPackageTypeIdsWithIsFreeCapacity(){
			return packageTypeIdsWithIsFreeCapacity;
		};
		this.getPackageTypeIdsWithIsMandatoryCapacity = function getPackageTypeIdsWithIsMandatoryCapacity(){
			return packageTypeIdsWithIsMandatoryCapacity;
		};


	}
})(angular);

