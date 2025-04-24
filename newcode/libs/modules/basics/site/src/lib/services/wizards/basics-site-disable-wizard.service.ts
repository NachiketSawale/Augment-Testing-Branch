/*
 * Copyright(c) RIB Software GmbH
 */
import { BasicsSharedSimpleActionWizardService, ISimpleActionOptions } from '@libs/basics/shared';
import { BasicsSiteGridEntity } from '../../model/basics-site-grid-entity.class';
import { BasicsSiteGridDataService } from '../basics-site-grid-data.service';
import { inject, Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class BasicsSiteDisableWizardService  extends BasicsSharedSimpleActionWizardService<BasicsSiteGridEntity> {

     private readonly basicsSiteGridDataService = inject(BasicsSiteGridDataService);

     public onStartDisableWizard(): void {
        const options: ISimpleActionOptions<BasicsSiteGridEntity> =  {
            headerText: 'basics.site.wizard.disableSiteTitle',
            codeField: 'Code',
            doneMsg:'basics.site.wizard.enableDisableSiteDone',
            nothingToDoMsg: 'basics.site.wizard.enableDisableSiteDone',
            questionMsg: 'cloud.common.questionDisableSelection',
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