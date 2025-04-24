/**
 * Created by wwa on 9/1/2015.
 */
(function (angular) {
	'use strict';


	// eslint-disable-next-line no-redeclare
	/* global angular,_ */
	/* jshint -W072 */
	angular.module('procurement.package').factory('procurementPackageReadonlyProcessor',
		['basicsCommonReadOnlyProcessor', 'procurementContextService', 'basicsLookupdataLookupDescriptorService',
			function (commonReadOnlyProcessor, moduleContext, basicsLookupdataLookupDescriptorService) {

				var service = commonReadOnlyProcessor.createReadOnlyProcessor({
					uiStandardService: 'procurementPackageUIStandardExtendedService',
					readOnlyFields: ['ProjectFk']
				});

				service.getModuleState = function getModuleState(item) {
					var state, status, parentItem = item || service.getSelected();
					status = basicsLookupdataLookupDescriptorService.getData('PackageStatus');

					if (parentItem&&status) {
						state = _.find(status, {Id: parentItem.PackageStatusFk});
					} else {
						state = {IsReadonly: false};
					}

					return state;
				};

				service.handlerItemReadOnlyStatus = function (item) {
					var readOnyStatus = true, loginCompany = moduleContext.loginCompany;

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