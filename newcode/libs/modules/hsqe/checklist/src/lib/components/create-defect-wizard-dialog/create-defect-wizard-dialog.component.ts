/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, inject } from '@angular/core';
import { ProjectSharedLookupService } from '@libs/project/shared';
import { ILookupOptions, UiCommonModule } from '@libs/ui/common';
import { IProjectEntity } from '@libs/project/interfaces';
import { CREATE_DEFECT_TOKEN } from '../../model/entities/hsqe-defect-creation-option.interface';
import { PlatformCommonModule } from '@libs/platform/common';
import { FormsModule } from '@angular/forms';

@Component({
	selector: 'hsqe-checklist-create-defect-wizard-dialog',
	templateUrl: './create-defect-wizard-dialog.component.html',
	styleUrls: ['./create-defect-wizard-dialog.component.scss'],
	imports: [PlatformCommonModule, FormsModule, UiCommonModule],
	standalone: true,
})
export class CreateDefectWizardDialogComponent {
	public createDefectOption = inject(CREATE_DEFECT_TOKEN);
	protected readonly projectSharedLookupService = inject(ProjectSharedLookupService);
	protected readonly projectLookupOptions: ILookupOptions<IProjectEntity, object> = {
		showDescription: true,
		descriptionMember: 'ProjectName',
		dialogOptions: {
			headerText: {
				text: 'Assign Project',
				key: 'cloud.common.dialogTitleProject',
			},
		},
	};
}
