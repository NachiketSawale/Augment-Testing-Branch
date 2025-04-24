/*
 * Copyright(c) RIB Software GmbH
 */

import {inject, Injectable} from '@angular/core';
import {PlatformLazyInjectorService} from '@libs/platform/common';
import { HttpClient } from '@angular/common/http';
import { UiCommonFormDialogService} from '@libs/ui/common';
import { IModelFileEntity } from '../../model/entities/model-file-entity.interface';
import { MODEL_LOOKUP_PROVIDER_TOKEN } from '@libs/model/interfaces';

@Injectable({
    providedIn: 'root'
})
export class ResetModelFileStateWizardService {

    public formDialogService: UiCommonFormDialogService = inject(UiCommonFormDialogService);
    private readonly lazyInjector = inject(PlatformLazyInjectorService);
    private http = inject(HttpClient);
    
    public async resetModelFileState(){
        const modelLookupProvider = await this.lazyInjector.inject(MODEL_LOOKUP_PROVIDER_TOKEN);
        
		const result = await this.formDialogService
			.showDialog<IModelFileEntity>({
				width: '800',
				id: 'model.project.resetModelFileStateTitle',
				headerText: { key: 'model.project.resetModelFileStateTitle' },
				formConfiguration: {
                    formId: 'model.project.resetModelFileModal',            
                    showGrouping: true,
                    rows: [
                        {
                            id: 'modelfk',
                            label: {
                                key: 'model.project.translationDescModel',
                            }, 
                            model: 'ModelFk',
                            ...modelLookupProvider.generateModelLookup()
                        }
                    ],
                },
				entity: this.modelFileEntity,
				runtime: undefined,
				customButtons: [],
				topDescription: '',
			})
			?.then((result) => {
                //TODO after all other functions of data services are available
				/* if (result.ModelFk && canResetFile(result, result.ModelFk)) {
                    let newItem = cloneDeep(modelFile);
                    newItem.State = -1;
                    this.http.post('model/project/modelfile/resetstate', newItem).subscribe(response => {
                        if (isArray(response.data)) {
                            newItem = response.data[0];
                        } else {
                            newItem = response.data;
                        }
                        
                        newItem.Status = {
                            Status: 'Status',
                            actionList: []
                        };

                        newItem.Action = {
                            Action: newItem.FileArchiveDocFk ? 'Conversion' : '',
                            actionList: []
                        };
                        if (newItem.JobFk) {
                            servicesSchedulerUIStatusNotificationService.registerHandler([item.JobFk], serviceContainer.service.updateModelFileState);
                        }
                        service.updateItemList(modelFile, newItem);
                        serviceContainer.data.listLoaded.fire();
                    });
                }  */
			});

		return result;
	}

    private modelFileEntity: IModelFileEntity = {
        Id: 0,
        ModelFk: 0,
        State: 0,
        Trace: false
    };
}