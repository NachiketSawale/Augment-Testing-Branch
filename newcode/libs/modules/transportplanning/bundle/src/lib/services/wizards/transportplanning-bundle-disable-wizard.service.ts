/*
 * Copyright(c) RIB Software GmbH
 */
import { BasicsSharedSimpleActionWizardService, ISimpleActionOptions } from '@libs/basics/shared';

import { inject, Injectable } from '@angular/core';
import { IBundleEntity } from '../../model/models';
import { TransportplanningBundleGridDataService } from '../transportplanning-bundle-grid-data.service';

@Injectable({
	providedIn: 'root',
})
export class TransportPlanningBundleDisableWizardService extends BasicsSharedSimpleActionWizardService<IBundleEntity> {
	private readonly transportPlanningBundleGridDataService = inject(TransportplanningBundleGridDataService);

	public onStartDisableWizard(): void {
		const options: ISimpleActionOptions<IBundleEntity> = {
			headerText: 'transportplanning.bundle.wizard.disableBundle',
			codeField: 'Code',
			doneMsg: 'transportplanning.bundle.wizard.disableBundleDone',
			nothingToDoMsg: 'transportplanning.bundle.wizard.disableBundleDone',
			questionMsg: 'transportplanning.bundle.wizard.bundleAlreadyDisabled',
			placeholder: 'item',
		};
		this.startSimpleActionWizard(options);
	}

	public override getSelection(): IBundleEntity[] {
		return this.transportPlanningBundleGridDataService.getSelection();
	}
	public override filterToActionNeeded(selected: IBundleEntity[]): IBundleEntity[] {
		const filteredSelection: IBundleEntity[] = [];
		// Filter out the selection needed
		selected.forEach((item) => {
			if (!item.IsLive) {
				filteredSelection.push(item);
			}
		});
		return filteredSelection;
	}
	public override performAction(filtered: IBundleEntity[]): void {
		filtered.forEach((item) => {
			item.IsLive = false;
			this.transportPlanningBundleGridDataService.setModified(item);
		});
	}
	public override postProcess(): void {
		this.transportPlanningBundleGridDataService.refreshSelected().then();
	}
}
