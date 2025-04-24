/**
 * Created by joshi on 24.06.2020.
 */
(function(angular){
	'use strict';
	var moduleName = 'basics.lookupdata';

	angular.module(moduleName).factory('basicsBoqSplitQuantityLookupDataService', ['$http','platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',
		function($http,platformLookupDataServiceFactory,basicsLookupdataConfigGenerator){
			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('basicsBoqSplitQuantityLookupDataService', {
				valMember: 'Id',
				dispMember: 'SplitNo',
				columns: [
					{
						id: 'splitNo',
						field: 'SplitNo',
						name: 'SplitNo',
						toolTip: 'Split No',
						formatter: 'integer',
						name$tr$: 'boq.main.splitNo',
						width: 60
					},
					{
						id: 'quantity',
						field: 'Quantity',
						name: 'Quantity',
						toolTip: 'Quantity',
						formatter: 'quantity',
						name$tr$: 'cloud.common.entityQuantity',
						width: 120
					},
					{
						id: 'quantityAdj',
						field: 'QuantityAdj',
						name: 'AQ Quantity',
						toolTip: 'Quantity',
						formatter: 'quantity',
						name$tr$: 'boq.main.QuantityAdj',
						width: 120
					},
					{
						id: 'price',
						field: 'Price',
						name: 'Price',
						toolTip: 'Unit Rate',
						formatter: 'money',
						name$tr$: 'boq.main.Price',
						width: 100
					},
					{
						id: 'priceoc',
						field: 'PriceOc',
						name: 'PriceOc',
						toolTip: 'Unit Rate(Oc)',
						formatter: 'money',
						name$tr$: 'boq.main.PriceOc',
						width: 100
					},
					{
						id: 'commentText',
						field: 'CommentText',
						name: 'CommentText',
						toolTip: 'Comment',
						formatter: 'comment',
						name$tr$: 'boq.main.CommentText',
						width: 100
					}
				],
				uuid: 'd2c6ffb1595a466cb6b51788f40e7e87'
			});

			var basicsBoqSplitQuantityLookupDataServiceConfig = {
				httpRead: {route: globals.webApiBaseUrl + 'boq/main/splitquantity/', endPointRead: 'getboqsplitquantities'},
				filterParam: 'currentBoqItemAndBoqHeader',
				prepareFilter: function (item) {
					return '?boqItemId=' + (item && item.BoqItemFk ? item.BoqItemFk : -1) + '&boqHeaderId=' + (item && item.BoqHeaderFk ? item.BoqHeaderFk : -1);
				}
			};

			return platformLookupDataServiceFactory.createInstance(basicsBoqSplitQuantityLookupDataServiceConfig).service;
		}
	]);
})(angular);