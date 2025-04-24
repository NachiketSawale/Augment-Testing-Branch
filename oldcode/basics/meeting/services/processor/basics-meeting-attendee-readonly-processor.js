/**
 * Created by chd on 12/16/2021.
 */
(function (angular) {
	'use strict';

	let moduleName='basics.meeting';
	/* jshint -W072 */
	angular.module(moduleName).factory('basicsMeetingAttendeeReadonlyProcessor',
		['basicsCommonReadOnlyProcessor', 'cloudDesktopPinningContextService', 'platformRuntimeDataService', 'basicsMeetingMainService',
			function (commonReadOnlyProcessor, cloudDesktopPinningContextService, platformRuntimeDataService, parentService) {
				let service = commonReadOnlyProcessor.createReadOnlyProcessor({
					typeName: 'MtgAttendeeDto',
					moduleSubModule: 'Basics.Meeting',
					readOnlyFields: ['AttendeeStatusFk', 'ClerkFk', 'BusinessPartnerFk', 'SubsidiaryFk', 'ContactFk', 'IsOptional', 'Title', 'Role', 'FirstName', 'FamilyName', 'Department', 'Email', 'TelephoneNumber', 'TelephoneMobil',
						'Userdefined1', 'Userdefined2', 'Userdefined3', 'Userdefined4', 'Userdefined5', 'Detail']
				});

				service.handlerItemReadOnlyStatus = function (item) {
					let readOnlyStatus = !parentService.getHeaderEditAble();
					service.setRowReadOnly(item, readOnlyStatus);
					platformRuntimeDataService.readonly(item, [{field: 'TelephoneNumber', readonly: true}, {field: 'TelephoneMobil', readonly: true}]);
					return readOnlyStatus;
				};

				service.getCellEditable = function getCellEditable(item, model) {
					if (!parentService.getHeaderEditAble()) {
						return false;
					}

					switch (model) {
						case 'BusinessPartnerFk':
							return !item.ClerkFk;
						case 'SubsidiaryFk':
							return !item.ClerkFk;
						case 'ContactFk':
							return !item.ClerkFk;
						case 'ClerkFk':
							return !item.BusinessPartnerFk;
						case 'Title':
							return false;
						case 'Role':
							return false;
						case 'FirstName':
							return false;
						case 'FamilyName':
							return false;
						case 'Department':
							return false;
						case 'Email':
							return false;
						case 'TelephoneNumber':
							return false;
						case 'TelephoneMobil':
							return false;
						default :
							return true;
					}
				};

				return service;
			}]);
})(angular);
