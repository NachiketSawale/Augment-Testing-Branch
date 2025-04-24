/*
 * Copyright(c) RIB Software GmbH
 */
import { Component, inject } from '@angular/core';
import { PlatformCommonModule } from '@libs/platform/common';
import { CREATE_CHECKLIST_TOKEN } from '../../model/entities/hsqe-checklist-option.interface';
import { HsqeChecklistCreationType } from '../../model/enums/hsqe-checklist-creation-type';
import { ProjectSharedLookupService } from '@libs/project/shared';
import { FormsModule } from '@angular/forms';
import { ILookupOptions, UiCommonModule } from '@libs/ui/common';
import { IProjectEntity } from '@libs/project/interfaces';

@Component({
	selector: 'hsqe-checklist-create-checklist-wizard-dialog',
	templateUrl: './create-checklist-wizard-dialog.component.html',
	styleUrls: ['./create-checklist-wizard-dialog.component.scss'],
	imports: [PlatformCommonModule, FormsModule, UiCommonModule],
	standalone: true,
})
export class CreateChecklistWizardDialogComponent {
	public createChecklistOption = inject(CREATE_CHECKLIST_TOKEN);
	protected readonly projectSharedLookupService = inject(ProjectSharedLookupService);
	protected readonly hsqeChecklistCreateType = HsqeChecklistCreationType;
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
