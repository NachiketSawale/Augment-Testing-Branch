/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { IMessageBoxOptions, IYesNoDialogOptions, StandardDialogButtonId, UiCommonFormDialogService, UiCommonMessageBoxService} from '@libs/ui/common';
import { PlatformConfigurationService, PlatformHttpService } from '@libs/platform/common';
import { ModelProjectModelDataService } from '../model-data.service';
import { isUndefined } from 'lodash';
import { IModelEntity } from '../../model/entities/model-entity.interface';

@Injectable({
    providedIn: 'root'
})

/**
 *  ModelChangeSetRepeatComparisonWizardService
 *  This services for provides functionality for Repeat Comparison
 */
export class DeleteCompleteModel {
    private readonly http = inject(PlatformHttpService);
    private readonly msgBoxService = inject(UiCommonMessageBoxService);
    private readonly modelProjectDataService = inject(ModelProjectModelDataService);
    public formDialogService: UiCommonFormDialogService = inject(UiCommonFormDialogService);
    private readonly configService = inject(PlatformConfigurationService);
    private config = inject(PlatformConfigurationService);

    /**
     *  recompareModels
     */
    public async deleteCompleteModel() {
        const entity = this.modelProjectDataService.getSelectedEntity();
        console.log('....else',entity);
        if(entity?.Id){
        
            //TODO Showing error :  Argument of type 'IModelEntity | null' is not assignable to parameter of type 'IModelEntity'. if we use 'find' function used in AngularJS
            const item = entity && this.modelProjectDataService.getEntityReadOnlyFields(entity);
            if (item === null || isUndefined(item)) {
                this.msgBoxService.showErrorDialog('model.project.alreadyDelete');
            }else{  
                const options: IYesNoDialogOptions = {
                    defaultButtonId: StandardDialogButtonId.No,
                    id: 'YesNoModal',
                    dontShowAgain: true,
                    headerText: 'model.project.deleteModelTitle',
                    bodyText: 'model.project.deleteQuestion',
                };
                const result = await this.msgBoxService.showYesNoDialog(options);
                if (result && result.closingButtonId === StandardDialogButtonId.Yes) {
                    this.http.post$<IModelEntity>('model/project/model/deletecompletemodel', {
                        mainItemId: entity.Id
                    }).subscribe({                       
                        error: () => {
                            this.msgBoxService.showErrorDialog('model.project.deleteFailed');                           
                        },
                        complete: () => {
                            //TODO
                            /*  serviceContainer.service.setSelected(null);
                            serviceContainer.data.itemList = _.filter(serviceContainer.data.itemList, function (item) {
                                return item.Id !== entity.Id;
                            });
                            serviceContainer.data.listLoaded.fire(); */
                            this.showSuccessDialog();
                        },
                    });
                }
            }
        }else{
            this.msgBoxService.showInfoBox('cloud.common.noCurrentSelection', 'info', true);
        }
    }

    private showSuccessDialog() {
		const notifyDialogConfig: IMessageBoxOptions = {
			headerText: 'cloud.common.infoBoxHeader',
			bodyText: {key: 'cloud.common.doneSuccessfully'},
			buttons: [{id: StandardDialogButtonId.Ok}],
			iconClass: 'ico-info'
		};
		this.msgBoxService.showMsgBox(notifyDialogConfig);
	}
}