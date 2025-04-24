(angular => {
	'use strict';
	/* global _ */
	const moduleName = 'productionplanning.item';
	angular.module(moduleName).factory('ppsActTimeRecordingFormConfiguration', Service);

	Service.$inject = [];

	function Service() {

		function getFormConfig(changeFn, isReadOnly = false) {
			const changeCallback = _.isFunction(changeFn) ? changeFn : angular.noop;

			// date and site form
			return {
				fid: 'pps.actual.time.recording.form',
				showGrouping: false,
				addValidationAutomatically: false,
				skipPermissionCheck: true,
				change: () => changeCallback(),
				groups: [
					{
						gid: 'baseGroup',
						attributes: ['date', 'sitefk'],
					},
				],
				rows: [
					{
						gid: 'baseGroup',
						rid: 'date',
						model: 'date',
						label: '*Date',
						label$tr$: 'cloud.common.entityDate',
						formatter: 'dateutc',
						sortOrder: 1,
						required: true,
						visible: true,
						type: 'dateutc',
						readonly: isReadOnly
					},
					{
						gid: 'baseGroup',
						rid: 'siteid',
						model: 'siteId',
						label: '*Site',
						label$tr$: 'basics.site.entitySite',
						sortOrder: 2,
						required: true,
						visible: true,
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupOptions: {
								version: 3,
							},
							lookupDirective: 'basics-site-site-lookup',
							descriptionMember: 'DescriptionInfo.Description',
						},
						readonly: isReadOnly
					}
				],
			};
		}

		return {
			getFormConfig,
		};
	}

})(angular);