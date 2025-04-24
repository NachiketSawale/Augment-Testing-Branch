/**
 * Created by chd on 12/16/2021.
 */
(function (angular) {
	'use strict';

	let moduleName='hsqe.checklist';
	/* jshint -W072 */
	angular.module(moduleName).factory('hsqeMeetingReadonlyProcessor',
		['_', 'basicsCommonReadOnlyProcessor', 'platformContextService','platformRuntimeDataService', 'basicsLookupdataLookupDescriptorService','hsqeCheckListDataService',
			function (_, commonReadOnlyProcessor, platformContextService,platformRuntimeDataService, lookupDescriptorService,hsqeCheckListDataService) {

				let service = commonReadOnlyProcessor.createReadOnlyProcessor({
					typeName: 'MtgHeaderDto',
					moduleSubModule: 'Basics.Meeting',
					readOnlyFields: ['Code', 'Recurrence']
				});
				function isMeetingEditable() {
					let selectCheckList = hsqeCheckListDataService.getSelected();
					let loginCompany = platformContextService.clientId;
					return selectCheckList !== null && selectCheckList.BasCompanyFk === loginCompany;

				}
				service.handlerItemReadOnlyStatus = function (item) {
					let statusList = lookupDescriptorService.getData('MeetingStatus');
					let isReadOnly = _.get(_.find(statusList, {Id: item.MtgStatusFk}), 'IsReadonly') || !isMeetingEditable();
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
