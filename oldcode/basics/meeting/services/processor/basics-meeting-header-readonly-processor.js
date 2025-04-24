/**
 * Created by chd on 12/16/2021.
 */
(function (angular) {
	'use strict';

	let moduleName='basics.meeting';
	/* jshint -W072 */
	angular.module(moduleName).factory('basicsMeetingHeaderReadonlyProcessor',
		['_', 'basicsCommonReadOnlyProcessor', 'platformRuntimeDataService', 'basicsLookupdataLookupDescriptorService',
			function (_, commonReadOnlyProcessor, platformRuntimeDataService, lookupDescriptorService) {

				let service = commonReadOnlyProcessor.createReadOnlyProcessor({
					typeName: 'MtgHeaderDto',
					moduleSubModule: 'Basics.Meeting',
					readOnlyFields: ['Code', 'Recurrence']
				});

				service.handlerItemReadOnlyStatus = function (item) {
					let statusList = lookupDescriptorService.getData('MeetingStatus');
					let isReadOnly = _.get(_.find(statusList, {Id: item.MtgStatusFk}), 'IsReadonly');
					item.IsReadonlyStatus = isReadOnly;
					service.setRowReadOnly(item, isReadOnly);
					platformRuntimeDataService.readonly(item, isReadOnly);
				};

				service.updateReadOnlyFiled = function setFieldsReadOnly(item, readOnyStatus) {
					service.setRowReadOnly(item, readOnyStatus);
				};

				service.setFieldReadonlyOrNot = function (entity, propertyName, readOnlyOrNot) {
					let fields = [];
					fields.push({
						field: propertyName,
						readonly: readOnlyOrNot
					});

					platformRuntimeDataService.readonly(entity, fields);
				};

				service.getCellEditable = function getCellEditable(item, model) {
					if (item.IsReadonlyStatus) {
						return false;
					}
					switch (model) {
						case 'Recurrence':
							return false;
						case 'Code':
							return false;
						default :
							return true;
					}
				};

				return service;
			}]);
})(angular);
