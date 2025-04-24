/*
 * Copyright(c) RIB Software GmbH
 */

import {inject, Injectable} from '@angular/core';
import {BasicsSharedChangeStatusService, IStatusChangeOptions} from '@libs/basics/shared';
import { ControllingRevenueRecognitionDataService } from '../../revenue-recognition/revenue-recognition-data.service';
import { IPrrHeaderEntity } from '../../model/entities/prr-header-entity.interface';
import { PrrHeaderComplete } from '../../model/complete-class/prr-header-complete.class';

@Injectable({
    providedIn: 'root'
})

export class RevenueRecognitionChangeStatusWizardService extends BasicsSharedChangeStatusService<IPrrHeaderEntity, IPrrHeaderEntity, PrrHeaderComplete> {
    protected readonly dataService = inject(ControllingRevenueRecognitionDataService);

    protected statusConfiguration: IStatusChangeOptions<IPrrHeaderEntity, PrrHeaderComplete> = {
        title: 'controlling.revrecognition.wizard.changeStatus.title',
        guid: '983609bbfe524f37b015995ecf0273de',
        statusName: 'revenuerecognition',
        checkAccessRight: true,
        statusField: 'PrrStatusFk',
        updateUrl: 'controlling/RevenueRecognition/wizard/changestatus'
    };

    public onStartChangeStatusWizard() {
        this.startChangeStatusWizard();
    }

    public override afterStatusChanged() {
        this.dataService.refreshSelected ? this.dataService.refreshSelected() : this.dataService.refreshAll();
    }
}