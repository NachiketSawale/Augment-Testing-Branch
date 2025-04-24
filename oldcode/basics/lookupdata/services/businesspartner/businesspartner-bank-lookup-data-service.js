/**
 * Created by clv on 8/16/2017.
 */
(function(angular){

	'use strict';
	var moduleName = 'basics.lookupdata';
	angular.module(moduleName).factory('businessPartnerMainBankLookupDataService',businessPartnerMainSupplierBankLookupDataService);
	businessPartnerMainSupplierBankLookupDataService.$inject = ['$q','$injector','platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator'];
	function businessPartnerMainSupplierBankLookupDataService($q, $injector, platformLookupDataServiceFactory, basicsLookupdataConfigGenerator){

		basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('businessPartnerMainBankLookupDataService',{

			valMember: 'Id',
			dispMember: 'BankIbanWithName',
			columns: [
				{
					id: 'BankFk',
					field: 'BankFk',
					name: 'Bank',
					name$tr$: 'cloud.commom.entityBankName',
					formatter: 'lookup',
					formatterOptions:{
						lookupType: 'Bank',
						displayMember: 'BankName'
					},
					width: 200
				},
				{
					id: 'Iban',
					field: 'Iban',
					name: 'IBAN',
					formatter: function(row, col, value){
						var regExp = /(.{4})(?!$)/g;
						if(value){
							return value.replace(regExp, '$1  ');
						}

						return value;
					},
					name$tr$: 'cloud.commom.entityBankIBan',
					width: 300
				},
				{
					id: 'AccountNo',
					field: 'AccountNo' ,
					name: 'Account No.',
					formatter: function(row, col, value){

						return value;
					},
					name$tr$: 'cloud.commom.entityBankAccountNo',
					width: 200
				}
			]
		});

		var lookupDataServiceConfig = {
			httpRead: {route: globals.webApiBaseUrl + 'businesspartner/main/bank/', endPointRead: 'lookup'},
			filterParam: 'businessPartnerFk'
		};
		var container = platformLookupDataServiceFactory.createInstance(lookupDataServiceConfig);
		var service = container.service;

		container.data.getByFilterAsync = function getByFilterAsync(filterFn,options){
			var defer = $q.defer();
			service.getLookupData(options).then(function (itemlIst){
				var item = _.find(itemlIst, function (item) {
					return filterFn(item);
				});
				defer.resolve(item);
			});

			return defer.promise;
		};

		service.getLookupData = function getLookupData(options){
			var cusSupplierService = $injector.get('businesspartnerMainBankDataService');
			if(cusSupplierService && !_.isEmpty(cusSupplierService.getList())){
				var items = cusSupplierService.getList();
				container.data.dataCache.update(determineKey(options), items);
				return $q.when(items);
			}else {
				return service.getList(options);
			}
		};

		function determineKey(options){

			var filter = container.data.filter;
			var key = null;

			if( angular.isDefined(filter) && filter !== null && filter !== ''){

				if(angular.isObject(filter)){

					key = angular.toJson(filter);
				}else {
					key = filter;
				}
			}else {
				key = options.lookupType;
			}
			return key;
		}
		return service;
	}
})(angular);