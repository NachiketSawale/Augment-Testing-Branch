(function () {
	'use strict';

	var cloudCommonModule = 'cloud.common';
	var procurementPesModuleName = 'procurement.pes';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	angular.module(procurementPesModuleName).factory('procurementPesProgressReportDetailLayout',['basicsLookupdataConfigGenerator',
		function(basicsLookupdataConfigGenerator){
			return{
				'fid': 'procurement.pes.progressreport.detailform',
				'version': '1.0.0',
				'showGrouping': true,
				'addValidationAutomatically': false,
				'groups': [
					{
						gid: 'baseGroup',
						attributes: ['schedulefk', 'activityfk', 'plannedquantity', 'quantity', 'remainingquantity', 'pco']
					},
					{
						gid: 'entityHistory',
						isHistory: true
					}
				],
				'translationInfos': {
					'extraModules': [procurementPesModuleName, cloudCommonModule],
					'extraWords': {
						ScheduleFk: {location: procurementPesModuleName, identifier: 'schedule', initial: 'Schedule'},
						ActivityFk: { location: procurementPesModuleName, identifier: 'activity', initial: 'Activity' },
						baseGroup: { location: cloudCommonModule, identifier: 'entityProperties', initial: 'Basic Data' },
						PlannedQuantity: {location: procurementPesModuleName, identifier: 'plannedQuantity', initial: 'Planned Quantity'},
						Quantity: { location: cloudCommonModule, identifier: 'entityQuantity', initial: 'Quantity' },
						RemainingQuantity: { location: procurementPesModuleName, identifier: 'remainingQuantity', initial: 'Remaining Quantity' },
						PCo: { location: procurementPesModuleName, identifier: 'pco', initial: 'PCo' },
						entityHistory: { location: cloudCommonModule, identifier: 'entityHistory', initial: 'History' },
						InsertedAt: { location: cloudCommonModule, identifier: 'entityInsertedAt', initial: 'Inserted At' },
						InsertedBy: { location: cloudCommonModule, identifier: 'entityInsertedBy', initial: 'Inserted By' },
						UpdatedAt: { location: cloudCommonModule, identifier: 'entityUpdatedAt', initial: 'Updated At' },
						UpdatedBy: { location: cloudCommonModule, identifier: 'entityUpdatedBy', initial: 'Updated By' },
						Version: { location: cloudCommonModule, identifier: 'entityVersion', initial: 'Version' }
					}

				},
				'overloads': {
					'schedulefk' :  basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'schedulingLookupScheduleDataService',
						desMember:'DescriptionInfo.Translated',
						isComposite: true,
						readonly: true,
						filter: function (item) {
							return item.ProjectFk || -1;
						}
					}),
					'activityfk' :  basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'schedulingLookupActivityDataService',
						filterKey: 'self-reference-activity',
						filter: function (item) {
							if(item) {
								return item.ScheduleFk;
							}
						},
						additionalColumns: true,
						readonly: true
					}),
					'plannedquantity' : {readonly : true},
					'quantity' : {readonly : true},
					'remainingquantity' : {readonly : true},
					'pco' : {readonly : true}
				}
			};
		}
	]);


	/**
	 * @ngdoc service
	 * @name procurementPesProgressReportUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for different containers
	 */
	angular.module(procurementPesModuleName).factory('procurementPesProgressReportUIStandardService',
		['platformUIStandardConfigService', 'procurementPesProgressReportDetailLayout','procurementPesTranslationService', 'platformSchemaService',
			function (BaseService,procurementPesProgressReportDetailLayout, procurementPesTranslationService, platformSchemaService) {

				var progressReportAttributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'ActivityProgressReportDto',
					moduleSubModule: 'Scheduling.Main'
				}).properties;

				progressReportAttributeDomains.ScheduleFk ={ domain : 'integer'};

				return new BaseService(procurementPesProgressReportDetailLayout, progressReportAttributeDomains, procurementPesTranslationService);

			}
		]);

})(angular);
