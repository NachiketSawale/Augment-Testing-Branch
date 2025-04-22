/*
 * Copyright(c) RIB Software GmbH
 */

import {inject, Injectable} from '@angular/core';
import {BasicsSharedChangeStatusService, IStatusChangeOptions} from '@libs/basics/shared';
import {PlatformTranslateService} from '@libs/platform/common';
import { IModelEntity } from '../../model/entities/model-entity.interface';
import { ModelProjectModelDataService } from '../model-data.service';
import { IProjectComplete, IProjectEntity } from '@libs/project/interfaces';
import { ProjectMainDataService } from '@libs/project/shared';

@Injectable({
    providedIn: 'root'
})
export class ChangeModelStatusWizardService extends BasicsSharedChangeStatusService<IModelEntity, IProjectEntity, IProjectComplete> {
    protected readonly dataService = inject(ModelProjectModelDataService);
    private readonly translateService = inject(PlatformTranslateService);
	 private readonly rootDataService = inject(ProjectMainDataService);

    protected statusConfiguration: IStatusChangeOptions<IProjectEntity, IProjectComplete> = {
        title: this.translateService.instant('model.project.changeModelStatus').text,
        guid: 'a8c2353fca6b48a88c9b25901b0a7528',
        isSimpleStatus: false,
        statusName: 'model',
        checkAccessRight: true,
        statusField: 'StatusFk',
        updateUrl: 'model/project/model/changestatus',
	     rootDataService: this.rootDataService
    };

    public onStartChangeStatusWizard() {
        this.startChangeStatusWizard();
    }

    public override afterStatusChanged() {
       // this.dataService.refreshSelected ? this.dataService.refreshSelected() : this.dataService.refreshAll();
    }
}