/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { BasicsSharedSimpleActionWizardService, ISimpleActionOptions } from '@libs/basics/shared';
import { ConstructionSystemMasterHeaderDataService } from '../construction-system-master-header-data.service';
import { ICosHeaderEntity } from '@libs/constructionsystem/shared';

@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMasterEnableDisableRecordWizardService extends BasicsSharedSimpleActionWizardService<ICosHeaderEntity> {
	/**
	 *  ConstructionSystemMasterHeaderDataService
	 */
	private readonly constructionSystemMasterHeaderDataService = inject(ConstructionSystemMasterHeaderDataService);

	/**
	 * Disable wizard record for construction system master header
	 */
	public onStartDisableWizard(): void {
		const doneMsg = 'constructionsystem.master.disableDone';
		const nothingToDoMsg = 'constructionsystem.master.alreadyDisabled';
		const questionMsg = 'cloud.common.questionDisableSelection';
		const option: ISimpleActionOptions<ICosHeaderEntity> = {
			headerText: 'cloud.common.disableRecord',
			codeField: 'Code',
			doneMsg: doneMsg,
			nothingToDoMsg: nothingToDoMsg,
			questionMsg: questionMsg,
			placeholder: 'code',
		};

		this.startSimpleActionWizard(option);
	}

	/**
	 * Enable wizard record for construction system master header
	 */
	public onStartEnableWizard(): void {
		const doneMsg = 'constructionsystem.master.enableDone';
		const nothingToDoMsg = 'constructionsystem.master.alreadyEnabled';
		const questionMsg = 'cloud.common.questionEnableSelection';
		const option: ISimpleActionOptions<ICosHeaderEntity> = {
			headerText: 'cloud.common.enableRecord',
			codeField: 'Code',
			doneMsg: doneMsg,
			nothingToDoMsg: nothingToDoMsg,
			questionMsg: questionMsg,
			placeholder: 'code',
		};

		this.startSimpleActionWizard(option);
	}

	/**
	 * get Selected items
	 */
	public override getSelection(): ICosHeaderEntity[] {
		return this.constructionSystemMasterHeaderDataService.getSelection();
	}

	protected filterToActionNeeded(selected: ICosHeaderEntity[]): ICosHeaderEntity[] {
		return selected;
	}

	protected performAction(filtered: ICosHeaderEntity[]): void {}

	protected postProcess(): void {}
}
