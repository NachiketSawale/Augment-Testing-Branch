/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals, _ */
	'use strict';

	let moduleName = 'estimate.main';

	angular.module(moduleName).factory('estimateMainEstColumnConfigColumnIdsComboboxService',[
		'$injector','platformLookupDataServiceFactory', 'basicsLookupdataLookupDescriptorService',
		function ($injector, platformLookupDataServiceFactory, basicsLookupdataLookupDescriptorService) {

			let options = {
				lookupType: 'DynamicColumns',
				httpRead: { route: globals.webApiBaseUrl +'estimate/main/columnconfigdetail/', endPointRead: 'columnIdLookup' }
			};
			let service = platformLookupDataServiceFactory.createInstance(options).service;

			angular.extend(service, {
				getItemByKey: getItemByKey
			});

			function getItemByKey(key) {
				return service.getItemById(key, options);
			}

			function init(){
				service.getList(options).then(function(data){
					var resourceGrid = $injector.get('platformGridAPI').grids.element('id', 'bedd392f0e2a44c8a294df34b1f9ce44');
					if(!!data && !!resourceGrid){
						_.forEach(data, function (item){
							item.originalDesc = item.Description;
							var resourceColumn = _.find(resourceGrid.columns.visible ,{'id': item.ColumnKey});
							if(resourceColumn){
								item.Description = resourceColumn.userLabelName || item.Description;
							}
						});
					}
					basicsLookupdataLookupDescriptorService.attachData({ 'dynamiccolumns' : data});
				});
			}

			init();

			service.initColumnUserLabelName = function (){
				var data = basicsLookupdataLookupDescriptorService.getData('dynamiccolumns');
				var resourceGrid = $injector.get('platformGridAPI').grids.element('id', 'bedd392f0e2a44c8a294df34b1f9ce44');
				if(!!data && !!resourceGrid){
					_.forEach(data, function (item){
						var resourceColumn = _.find(resourceGrid.columns.visible ,{'id': item.ColumnKey});
						if(resourceColumn){
							item.Description = resourceColumn.userLabelName || item.originalDesc;
						}
					});
				}
			};

			return service;
		}
	]);
})(angular);
