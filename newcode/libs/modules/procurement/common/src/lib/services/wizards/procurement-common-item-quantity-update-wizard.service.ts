/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { IEntityIdentification, PlatformHttpService, PlatformTranslateService } from '@libs/platform/common';
import { IEntitySelection } from '@libs/platform/data-access';
import { FieldType, IEditorDialogResult, IFormConfig, StandardDialogButtonId, UiCommonFormDialogService, UiCommonMessageBoxService } from '@libs/ui/common';

export interface IUpdateItemQuantityEntity {
	selectedItem?: string;
}

export interface IUpdateItemQuantityConfig {
    dataService: IEntitySelection<IEntityIdentification>;
    validateUrl: string;
    defaultSelectedItemId: string;
    itemsSource: { id: string; displayName: string }[];
}

@Injectable({ providedIn: 'root' })
export class ProcurementCommonItemQuantityUpdateWizardService {
    protected readonly formDialogService = inject(UiCommonFormDialogService);
	protected readonly messageBoxService = inject(UiCommonMessageBoxService);
	protected readonly http = inject(PlatformHttpService);
    private readonly translateService = inject(PlatformTranslateService);

    public async showDialog(config: IUpdateItemQuantityConfig){
        if (!config.dataService?.hasSelection()) {
            this.messageBoxService.showMsgBox('cloud.common.noCurrentSelection', 'procurement.common.wizard.noItemSelectedTitle', 'ico-info');
            return;
        }

        const validateUpdateQtyFormConfig: IFormConfig<IUpdateItemQuantityEntity> = {
            formId: 'reset-service-catalog-no',
            showGrouping: false,
            rows: [
                {
                    id: 'radio',
                    type: FieldType.Radio,
                    model: 'selectedItem',
                    itemsSource: {
                        items: config.itemsSource,
                    },
                },
            ],
        };

        await this.formDialogService.showDialog<object>({
            id: 'resetServiceCatalogNoDialog',
            headerText: { key: 'procurement.common.wizard.validateAndUpdateItemQuantity' },
            formConfiguration: validateUpdateQtyFormConfig,
            entity: { selectedItem: config.defaultSelectedItemId },
        })?.then(result => {
            if (result?.closingButtonId === StandardDialogButtonId.Ok) {
                this.onOkBtnClicked(config, result);
            }
        });
    }

    private async onOkBtnClicked<T extends IEntityIdentification>(
        config: {
            dataService: IEntitySelection<T>,
            validateUrl: string,
        },
        result: IEditorDialogResult<IUpdateItemQuantityEntity>
    ): Promise<void> {
        if (config.dataService?.hasSelection() && result.value?.selectedItem != null) {
            const request = {
                Id: config.dataService?.getSelectedEntity()?.Id ?? 0,
                ValidateAndUpdateScope: result.value.selectedItem,
            };
    
            const res = await this.http.post(config.validateUrl, request);
            if (res !== null) {
                const NoOfUpdated = res as number;
                const msg = this.translateService.instant('cloud.common.hasBeenUpdatedSuccessfully', { itemCount: NoOfUpdated }).text;
                await this.messageBoxService.showMsgBox(msg, 'Info', 'ico-info');
                //TODO: Reload all prc items data , currently refreshAll method not available in ProcurementCommonItemDataService
            }
        }
    }
    
}