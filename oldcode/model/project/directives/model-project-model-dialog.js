/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	angular.module('model.project').directive('modelProjectModelDialog', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				version: 3,
				lookupType: 'Model',
				valueMember: 'Id',
				displayMember: 'Description',
				columns: [
					{
						id: 'desc',
						field: 'Description',
						name: 'Description',
						name$tr$: 'cloud.common.entityDescription',
						width: 200
					},
					{id: 'code', field: 'Code', name: 'Code', name$tr$: 'cloud.common.entityCode', width: 75},
					{id: 'version', field: 'Version', name: 'Version', name$tr$: 'model.project.modelVersion', width: 75},
					{
						id: 'revision',
						field: 'Revision',
						name: 'Revision',
						name$tr$: 'model.project.modelRevision',
						width: 75
					},
					{
						id: 'projectNo',
						field: 'ProjectDto.ProjectNo',
						name: 'Project No',
						name$tr$: 'model.project.projectNo',
						width: 75
					},
					{
						id: 'projectName',
						field: 'ProjectDto.ProjectName',
						name: 'Project Name',
						name$tr$: 'model.project.projectName',
						width: 120
					}
				],
				title: {name: 'Assign Model', name$tr$: 'model.project.assignModel'},
				uuid: '56d61b91f8ec4d948641bf4e7ae938ef',
				pageOptions: {
					enabled: true
				}
			};

			return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', defaults);
		}
	]);
})(angular);
