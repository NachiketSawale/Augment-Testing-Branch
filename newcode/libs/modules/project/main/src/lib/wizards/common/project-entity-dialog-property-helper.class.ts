/*
 * Copyright(c) RIB Software GmbH
 */

import { createLookup, FieldType, FormRow } from '@libs/ui/common';
import { ProjectGroupLookupService } from '@libs/project/shared';

export class ProjectEntityDialogPropertyHelper {
	public static getProjectNumber<TEntity extends object>(sortOrder: number, readonly: boolean | undefined): FormRow<TEntity> {
		return {
			id: 'ProjectNo',
			label: 'project.main.projectNo',
			model: 'ProjectNo',
			type: FieldType.Code,
			sortOrder: sortOrder,
			readonly: readonly
		};
	}

	public static getProjectName<TEntity extends object>(sortOrder: number, readonly: boolean | undefined = undefined): FormRow<TEntity> {
		return {
			id: 'ProjectName',
			label: 'cloud.common.entityName',
			model: 'ProjectName',
			type: FieldType.Description,
			sortOrder: sortOrder,
			readonly: readonly
		};
	}

	public static getProjectName2<TEntity extends object>(sortOrder: number, readonly: boolean | undefined = undefined): FormRow<TEntity> {
		return {
			id: 'ProjectName2',
			label: 'project.main.name2',
			model: 'ProjectName2',
			type: FieldType.Description,
			sortOrder: sortOrder,
			readonly: readonly
		};
	}

	public static getProjectGroup<TEntity extends object>(sortOrder: number, readonly: boolean | undefined = undefined): FormRow<TEntity> {
		return {
			id: 'ProjectGroupFk',
			label: 'project.main.entityProjectGroup',
			model: 'ProjectGroupFk',
			type: FieldType.Lookup,
			sortOrder: sortOrder,
			readonly: readonly,
			lookupOptions: createLookup({
				dataServiceToken: ProjectGroupLookupService,
				showClearButton: false,
				showDescription: true,
				descriptionMember: 'DescriptionInfo.Translated'
			})
		};
	}
}