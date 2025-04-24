/**
 * Created by leo on 16.01.2017.
 */
(function (angular) {
	'use strict';
	const moduleName = angular.module('scheduling.main');

	/**
	 * @ngdoc service
	 * @name schedulingMainSourceFilterService
	 * @function
	 *
	 * @description
	 *
	 */
	moduleName.factory('schedulingMainSourceFilterService', SchedulingMainSourceFilterService);
	SchedulingMainSourceFilterService.$inject = ['_', 'PlatformMessenger', 'platformTranslateService', 'basicsLookupdataConfigGenerator',
		'basicsLookupdataLookupDescriptorService', 'schedulingTemplateGroupLookupDataService',
		'basicsLookupdataSimpleLookupService', 'schedulingMainService'];

	function SchedulingMainSourceFilterService(_, PlatformMessenger, platformTranslateService, basicsLookupdataConfigGenerator,
		basicsLookupdataLookupDescriptorService, schedulingTemplateGroupLookupDataService,
		basicsLookupdataSimpleLookupService, schedulingMainService) {
		let service = {};
		let attributes = [];
		let instances = {};

		setRelations();
		let projectRow = {
			gid: 'selectionfilter',
			rid: 'project',
			label$tr$: 'scheduling.main.printing.project',
			type: 'directive',
			directive: 'basics-lookup-data-project-project-dialog',
			model: 'projectFk',
			sortOrder: 1
		};
		let scheduleRow = basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
			dataServiceName: 'schedulingLookupScheduleDataService',
			desMember: 'DescriptionInfo.Translated',
			isComposite: true,
			filter: function (item) {
				return item.projectFk !== null ? item.projectFk : -1;
			}
		},
		{
			gid: 'selectionfilter',
			rid: 'schedule',
			label: 'Schedule',
			label$tr$: 'scheduling.schedule.entitySchedule',
			type: 'integer',
			model: 'scheduleFk',
			sortOrder: 2
		});

		let templateGroupRow = basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
			dataServiceName: 'schedulingTemplateGroupLookupDataService',
			desMember: 'DescriptionInfo.Translated',
			isComposite: true,
			lookupType: 'activitytemplategroupfk'
		},
		{
			gid: 'selectionfilter',
			rid: 'templategroup',
			label: 'ActivityTemplateGroup',
			label$tr$: 'scheduling.template.activityTemplateGroup',
			type: 'integer',
			model: 'templateGroupFk',
			sortOrder: 1
		});

		let relationRow = basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm('basics.customize.relationkind', 'Description',
			{
				gid: 'selectionfilter',
				rid: 'relation',
				label$tr$: 'scheduling.main.entityRelationship',
				type: 'select',
				options: {items: attributes, displayMember: 'Description', valueMember: 'Id'},
				model: 'relationFk',
				sortOrder: 2
			});

		let baselineRow = basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
			dataServiceName: 'schedulingLookupBaselineDataServiceBySchedule',
			desMember: 'Description',
			filter: function () {
				let schedule = schedulingMainService.getSelectedSchedule();
				let filterObj = [];
				if (schedule !== null) {
					filterObj = [schedule.Id];
				} else {
					let act = schedulingMainService.getSelected();
					if (act !== null && act.ScheduleFk){
						filterObj = [act.ScheduleFk];
					}
				}
				return filterObj;
			}
		},
		{
			gid: 'selectionfilter',
			rid: 'baseline',
			label: 'Baseline',
			label$tr$: 'scheduling.main.baseline',
			type: 'lookup',
			model: 'baselineFk',
			sortOrder: 1
		});

		function setTemplateGroups() {
			schedulingTemplateGroupLookupDataService.getList({lookupType: 'schedulingTemplateGroupLookupDataService'}).then(function (response) {
				basicsLookupdataLookupDescriptorService.updateData('activitytemplategroupfk', response);
			});
		}

		function setRelations() {
			attributes = [];
			basicsLookupdataSimpleLookupService.getList({
				lookupModuleQualifier: 'basics.customize.relationkind', displayMember: 'Description', valueMember: 'Id'
			}).then(function (list) {
				attributes = list;
				let exist = _.find(attributes, {Id: '0'});
				if (!exist) {
					attributes.push({Id: '0', Description: 'No relation'});
				}
			});
		}

		service.createFilterParams = function createDataService(filter, uuid) {

			let params = instances[uuid];
			if (_.isNull(params) || _.isUndefined(params)) {
				params = doCreateFilterParams(filter, uuid);
				instances[uuid] = params;
			}

			return params;
		};

		function doCreateFilterParams(filter, uuid) {
			const formConfig = {
				fid: 'scheduling.main.selectionfilter',
				version: '1.0.0',
				showGrouping: false,
				groups: [
					{
						gid: 'selectionfilter',
						isOpen: true,
						visible: true,
						sortOrder: 1
					}
				],
				rows: []
			};

			let entity = {};
			if (angular.isArray(filter)) {
				for (let i = 0; i < filter.length; i++) {
					switch (filter[i]) {
						case 'projectFk':
							formConfig.rows.push(projectRow);
							entity.projectFk = null;
							break;
						case'scheduleFk':
							formConfig.rows.push(scheduleRow);
							entity.scheduleFk = null;
							break;
						case 'templateGroupFk':
							formConfig.rows.push(templateGroupRow);
							entity.templateGroupFk = null;
							setTemplateGroups();
							break;
						case 'relationFk':
							formConfig.rows.push(relationRow);
							entity.relationFk = 0;
							break;
						case 'baselineFk':
							formConfig.rows.push(baselineRow);
							entity.relationFk = null;
							break;
					}
				}
			} else {
				switch (filter) {
					case 'projectFk':
						formConfig.rows.push(projectRow);
						entity.projectFk = null;
						break;
					case'scheduleFk':
						formConfig.rows.push(scheduleRow);
						entity.scheduleFk = null;
						break;
					case'templateGroupFk':
						formConfig.rows.push(templateGroupRow);
						entity.templateGroupFk = null;
						setTemplateGroups();
						break;
					case'relationFk':
						formConfig.rows.push(relationRow);
						entity.relationFk = 0;
						break;
				}
			}
			entity.uuid = uuid;
			return {entity: entity, config: platformTranslateService.translateFormConfig(formConfig)};
		}

		return service;
	}
})(angular);
