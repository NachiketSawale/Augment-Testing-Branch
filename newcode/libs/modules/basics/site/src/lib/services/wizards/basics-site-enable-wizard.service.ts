/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { BasicsSharedSimpleActionWizardService, ISimpleActionOptions } from '@libs/basics/shared';
import { BasicsSiteGridDataService } from '../basics-site-grid-data.service';
import { BasicsSiteGridEntity } from '../../model/basics-site-grid-entity.class';

@Injectable({
	providedIn: 'root'
})

export class BasicsSiteEnableWizardService  extends BasicsSharedSimpleActionWizardService <BasicsSiteGridEntity> {

    private readonly basicsSiteGridDataService = inject(BasicsSiteGridDataService);

    public onStartEnableWizard(): void {
        const options: ISimpleActionOptions<BasicsSiteGridEntity> = {
            headerText: 'basics.site.wizard.enableSiteTitle',
            codeField: 'Code',
            doneMsg:'basics.site.wizard.enableWizardDone',
            nothingToDoMsg: 'basics.site.wizard.siteAlreadyEnabled',
            questionMsg: 'cloud.common.questionEnableSelection',
            placeholder: 'item'
        };
       this.startSimpleActionWizard(options);
    }

    public override getSelection(): BasicsSiteGridEntity[] {
       return this.basicsSiteGridDataService.getSelection();
    }

    public override filterToActionNeeded(selected: BasicsSiteGridEntity[]): BasicsSiteGridEntity[] {
        const filteredSelection: BasicsSiteGridEntity[] = [];
		// Filter out the selection needed
        selected.forEach(item => {
			if (!item.IsLive) {
				filteredSelection.push(item);
			}
		});
		return filteredSelection;
    }

    public override performAction(filtered: BasicsSiteGridEntity[]): void {
        filtered.forEach(item=> {
            item.IsLive = false;
            this.basicsSiteGridDataService.setModified(item);
        });
    }

    public override postProcess(): void {
        this.basicsSiteGridDataService.refreshSelected().then();
    }
}