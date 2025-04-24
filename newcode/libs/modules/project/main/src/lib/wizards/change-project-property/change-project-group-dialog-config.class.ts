/*
 * Copyright(c) RIB Software GmbH
 */

import { createLookup, FieldType, IFormConfig, IFormDialogConfig } from '@libs/ui/common';
import { ProjectEntityDialogPropertyHelper } from '../common/project-entity-dialog-property-helper.class';
import { ChangeProjectGroup } from './change-project-group.class';
import { ProjectGroupLookupService } from '@libs/project/shared';

export class ChangeProjectGroupDialogConfig {
	public createFormConfiguration(project: ChangeProjectGroup):IFormDialogConfig<ChangeProjectGroup>{
		return <IFormDialogConfig<ChangeProjectGroup>> {
			headerText: 'project.main.entityChangeProjectGroup',
			id: 'project.main.ChangeProjectGroup',
			entity: project,
			formConfiguration: <IFormConfig<ChangeProjectGroup>> {
				showGrouping: false,
				groups: [
					{
						groupId: 'baseGroup',
						header: {text: ''},
					},
				],
				rows: [
					ProjectEntityDialogPropertyHelper.getProjectNumber(1, true),
					ProjectEntityDialogPropertyHelper.getProjectName(2, true),
					ProjectEntityDialogPropertyHelper.getProjectName2(3, true),
					ProjectEntityDialogPropertyHelper.getProjectGroup<ChangeProjectGroup>(4, true),
					{
						id: 'NewProjectGroupFk',
						label: 'project.main.entityNewProjectGroup',
						model: 'NewProjectGroupFk',
						type: FieldType.Lookup,
						sortOrder: 5,
						lookupOptions: createLookup({
							dataServiceToken: ProjectGroupLookupService,
							showClearButton: false,
							showDescription: true,
							descriptionMember: 'DescriptionInfo.Translated'
						})
					}
				]
			}
		};
	}
}