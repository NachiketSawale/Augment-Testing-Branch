/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	angular.module('model.measurements').directive('modelMeasurementsGroupCombobox',
		modelMeasurementsGroupCombobox);

	modelMeasurementsGroupCombobox.$inject = ['BasicsLookupdataLookupDirectiveDefinition', 'projectMainPinnableEntityService'];

	function modelMeasurementsGroupCombobox(BasicsLookupdataLookupDirectiveDefinition, projectMainPinnableEntityService) {

		const defaults = {
			lookupType: 'ModelMeasurementsGroup',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo.Translated',
			uuid: 'c27acf04b823453b9ccb81e5603b101b',
			columns: [
				{
					id: 'desc',
					field: 'DescriptionInfo.Translated',
					name: 'Description',
					width: 120,
					name$tr$:'cloud.common.entityDescription'
				}],
			treeOptions: {
				parentProp: 'MeasurementGroupFk',
				childProp: 'MdlMeasurementEntities',
				initialState: 'expanded',
				inlineFilter: true,
				hierarchyEnabled:true
			}
		};

		return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults,{
			processData: function (dataList) {
				const pinnedProject = projectMainPinnableEntityService.getPinned();

				if (pinnedProject) {
					dataList = dataList.filter(obj => obj.ProjectFk === pinnedProject);
				}
				return dataList;
			}
		});
	}
})(angular);
