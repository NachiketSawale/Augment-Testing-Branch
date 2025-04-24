(function () {
	'use strict';
	const moduleName = 'timekeeping.employee';

	/**
	 * @ngdoc service
	 * @name timekeepingEmployeeUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layots for different containers of timekeeping entities
	 */
	angular.module(moduleName).factory('timekeepingEmployeeUIStandardService',
		['$injector', '$http', 'platformUIStandardConfigService', 'platformLayoutHelperService', 'timekeepingEmployeeTranslationService', 'platformSchemaService', 'basicsLookupdataConfigGenerator',



			function ($injector, $http, platformUIStandardConfigService, platformLayoutHelperService, timekeepingEmployeeTranslationService, platformSchemaService, basicsLookupdataConfigGenerator) {

				function createMainDetailLayout() {
					return {
						fid: 'timekeeping.employee',
						version: '1.0.0',
						addValidationAutomatically: true,
						showGrouping: true,
						groups: [
							{
								'gid': 'baseGroup',
								'attributes': ['code', 'companyoperatingfk', 'descriptioninfo', 'firstname', 'familyname', 'initials', 'countryfk']
							},{
								'gid': 'configuration',
								'attributes': ['iscrewleader', 'iswhitecollar', 'ishiredlabor', 'remark',
									'shiftfk', 'employeegroupfk', 'timekeepinggroupfk', 'professionalcategoryfk', 'paymentgroupfk', 'calendarfk',
									'groupfk', 'costgroupfk','employeeareafk','employeesubareafk', 'employeestatusfk']
							}
						],
						overloads: {
							companyoperatingfk: platformLayoutHelperService.provideCompanyLookupOverload(),
							countryfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({dataServiceName: 'basicsCountryLookupDataService'}),
							shiftfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({dataServiceName: 'timekeepingShiftModelLookupDataService'}),
							employeegroupfk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.timekeepingemployeegroup'),
							timekeepinggroupfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'basicsTimekeepingGroupLookupDataService',
								filter: function (item) {
									if (item && item.CompanyFk) {
										return item.CompanyFk;
									}
								}
							}),
							professionalcategoryfk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.timekeepingprofessionalcategory'),
							paymentgroupfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'timekeepingEmployeePaymentGroupLookupDataService'
							}),
							calendarfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'schedulingLookupCalendarDataService',
								enableCache: true
							}),
							groupfk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.timekeepinggroup'),
							costgroupfk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.timekeepingcostgroup'),
							employeeareafk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.timekeepingemployeearea'),
							employeesubareafk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.timekeepingemployeesubarea'),
							employeestatusfk: basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.timekeepingemployeestatus')
						}
					};
				}

				let employeeDetailLayout = createMainDetailLayout();

				let BaseService = platformUIStandardConfigService;

				let employeeAttributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'EmployeeDto',
					moduleSubModule: 'Timekeeping.Employee'
				});
				employeeAttributeDomains = employeeAttributeDomains.properties;


				function UnitUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				UnitUIStandardService.prototype = Object.create(BaseService.prototype);
				UnitUIStandardService.prototype.constructor = UnitUIStandardService;

				let baseService = new BaseService(employeeDetailLayout, employeeAttributeDomains, timekeepingEmployeeTranslationService);
				baseService.getCreateMainLayout = function getCreateMainLayout() {
					return createMainDetailLayout();
				};
				return baseService;
			}
		]);
})();
