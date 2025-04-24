/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BasicsSharedChangeStatusService, IStatusChangeOptions } from '@libs/basics/shared';
import { PlatformTranslateService } from '@libs/platform/common';
import { IModelAnnotationEntity } from '../model/entities/model-annotation-entity.interface';
import { ModelAnnotationDataService } from '../services/model-annotation-data.service';
import { IModelAnnotationCompleteEntity } from '../model/entities/model-annotation-complete-entity.interface';

@Injectable({
    providedIn: 'root'
})
export class ModelAnnotationStatusWizardService extends BasicsSharedChangeStatusService<IModelAnnotationEntity, IModelAnnotationEntity, IModelAnnotationCompleteEntity> {
    protected readonly dataService = inject(ModelAnnotationDataService);
    private readonly translateService = inject(PlatformTranslateService);

    protected statusConfiguration: IStatusChangeOptions<IModelAnnotationEntity, IModelAnnotationCompleteEntity> = {
        title: this.translateService.instant('model.annotation.changeAnnotationStatus').text,
        guid: 'a8c2353fca6b48a88c9b25901b0a7528',
        isSimpleStatus: false,
        statusName: 'modelAnnotation',
        checkAccessRight: true,
        statusField: 'StatusFk',
        updateUrl: 'model/annotation/changestatus',
	     rootDataService: this.dataService
    };

    public onStartChangeStatusWizard() {
        this.startChangeStatusWizard();
    }

    public override afterStatusChanged() {
        // this.dataService.refreshSelected ? this.dataService.refreshSelected() : this.dataService.refreshAll();
    }
}
