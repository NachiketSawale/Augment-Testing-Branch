/**
 * Created by leo on 17.03.2015.
 */
(function () {
	'use strict';
	var moduleName = 'scheduling.template';

	/**
	 * @ngdoc service
	 * @name schedulingTemplateActivityTemplateDetailLayout
	 * @function
	 *
	 * @description
	 * schedulingService is the data service for all scheduling data functions.
	 */
	angular.module(moduleName).factory('schedulingTemplateActivityTemplateUIConfig', ['basicsLookupdataConfigGenerator',

		function (basicsLookupdataConfigGenerator) {

			return {
				getActivityDetailLayout: function () {
					return {
						fid: 'scheduling.main.activitydetailform',
						version: '1.0.0',
						addValidationAutomatically: true,
						showGrouping: true,
						groups: [
							{
								'gid': 'baseGroup',
								'attributes': ['code', 'descriptioninfo', 'activitytemplategroupfk', 'schedulingmethodfk', 'tasktypefk',
									'quantityuomfk', 'specification', 'controllingunittemplate', 'scurvefk', 'prcstructurefk']
							},
							{
								'gid': 'constraintGroup',
								'attributes': ['constrainttypefk', 'activitypresentationfk', 'chartpresentationfk', 'labelplacementfk', 'bas3dvisualizationtypefk','progressreportmethodfk']
							},
							{
								'gid': 'performanceGroup',
								'attributes': ['resourcefactor', 'performancefactor', 'perf1uomfk', 'perf2uomfk']
							},
							{
								'gid': 'userDefTextGroup',
								'isUserDefText': true,
								'attCount': 10
							},
							{
								'gid': 'userDefNumberGroup',
								'isUserDefNumber': true,
								'attCount': 10
							},
							{
								'gid': 'userDefDateGroup',
								'isUserDefDate': true,
								'attCount': 10
							},
							{
								'gid': 'entityHistory',
								'isHistory': true
							}
						],
						overloads: {
							activitytemplategroupfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'schedulingTemplateGroupLookupDataService',
								cacheEnable: true,
								readonly: true
							}),
							activitystatefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.activitystate', 'Description'),
							schedulingmethodfk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.schedulemethod', 'Description'),
							tasktypefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.tasktype', 'Description'),
							scurvefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.scurve', 'Description'),
							quantityuomfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'basicsUnitLookupDataService',
								cacheEnable: true
							}),
							constrainttypefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.constrainttype', 'Description'),
							progressreportmethodfk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.progressreportmethod', 'Description'),
							activitypresentationfk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.activitypresentation', 'Description'),
							chartpresentationfk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.chartpresentation'),
							labelplacementfk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.labelplacement'),
							bas3dvisualizationtypefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.threedvisualizationtype'),
							prcstructurefk: {
								navigator: {
									moduleName: 'basics.procurementstructure'
								},
								'grid': {
									'editor': 'lookup',
									'editorOptions': {
										'directive': 'basics-procurementstructure-structure-dialog',
										'lookupOptions': {
											'showClearButton': true
										}
									},
									'formatter': 'lookup',
									'formatterOptions': {
										'lookupType': 'prcstructure',
										'displayMember': 'Code'
									}
								},
								'detail': {
									'type': 'directive',
									'directive': 'basics-lookupdata-lookup-composite',
									'options': {
										'lookupDirective': 'basics-procurementstructure-structure-dialog',
										'descriptionField': 'StructureDescription',
										'descriptionMember': 'DescriptionInfo.Translated',
										'lookupOptions': {
											'initValueField': 'StructureCode',
											'showClearButton': true
										}
									}
								}
							},
							perf1uomfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({dataServiceName: 'basicsUnitLookupDataService'}),
							perf2uomfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({dataServiceName: 'basicsUnitLookupDataService'})
						}
					};
				},
				getEventDetailLayout: function () {
					return {
						fid: 'scheduling.template.eventtemplatedetailform',
						version: '1.0.0',
						groups: [
							{
								gid: 'baseGroup',
								attributes: ['eventtypefk', 'descriptioninfo', 'placedbefore', 'distanceto', 'isdisplayed','eventtemplatefk']
							},
							{
								gid: 'entityHistory',
								isHistory: true
							}
						],
						overloads: {
							eventtypefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.eventtype'),
							eventtemplatefk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'schedulingTemplateLookupEventDataService',
								filter: function (item) {
									// list contracts from same project
									return item && item.ActivityTemplateFk ? item.ActivityTemplateFk : -1;
								}})
						}
					};
				},
				getTmplGrp2CUGrpDetailLayout: function () {
					return {
						'fid': 'scheduling.template.activitytmplgrp2cugrpdetailform',
						'version': '1.0.0',
						addValidationAutomatically: true,
						'groups': [
							{
								'gid': 'baseGroup',
								'attributes': ['controllinggroupfk', 'controllinggroupdetailfk', 'inherited']
							},
							{
								'gid': 'entityHistory',
								'isHistory': true
							}
						],
						'overloads': {
							'inherited':{
								'readonly':true
							},
							'controllinggroupfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'controllingGroupLookupDataService',
								enableCache: true
							}),
							'controllinggroupdetailfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'controllingGroupDetailLookupDataService',
								filter: function (item) {
									var groupId = null;

									if (item && item.ControllingGroupFk) {
										groupId = item.ControllingGroupFk;
									}
									return groupId;
								},
								enableCache: true
							})
						}
					};
				}
			};
		}
	]);
})(angular);

