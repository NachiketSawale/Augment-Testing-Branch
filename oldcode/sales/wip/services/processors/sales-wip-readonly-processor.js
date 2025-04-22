/**
 * $Id$
 * Copyright (c) RIB Software SE
 */
(function (angular) {
	'use strict';

	/* jshint -W072 */
	angular.module('sales.wip').factory('salesWipReadonlyProcessor',
		['_', 'basicsCommonReadOnlyProcessor', 'salesCommonContextService', 'basicsLookupdataLookupDescriptorService',
			function (_, commonReadOnlyProcessor, moduleContext, basicsLookupdataLookupDescriptorService) {

				var service = commonReadOnlyProcessor.createReadOnlyProcessor({
					uiStandardService: 'salesWipConfigurationService'
				});

				service.getModuleState = function getModuleState(item) {
					var state, status, parentItem = item || service.getSelected();
					status = basicsLookupdataLookupDescriptorService.getData('WipStatus');

					if (parentItem&&status) {
						state = _.find(status, {Id: parentItem.WipStatusFk});
					} else {
						state = {IsReadonly: false};
					}

					return state;
				};

				service.handlerItemReadOnlyStatus = function (item) {
					var readOnyStatus = true, loginCompany = moduleContext.getCompany();

					/** @namespace item.MainEventsDto */
					_.forEach(item.MainEventsDto,function(item1){// use to flat MainEventsDto
						_.set(item,'MainEvent'+item1.PrcEventTypeFk,item1);
					});

					if(item.CompanyFk === loginCompany){
						readOnyStatus = service.getModuleState(item).IsReadonly;
					}

					service.setRowReadonlyFromLayout(item, readOnyStatus);
					return readOnyStatus;
				};

				return service;
			}]);
})(angular);
