/*
 * Copyright(c) RIB Software GmbH
 */


import { inject, Injectable } from '@angular/core';
import { ICustomDialogOptions, StandardDialogButtonId, UiCommonDialogService } from '@libs/ui/common';
import { ChartConfigDialogComponent } from '../components/chart-config-dialog/chart-config-dialog.component';
import { IChartConfig } from '../components/chart-config-dialog/chart-config-dialog-entity.interface';

@Injectable({
	providedIn: 'root'
})
export class controllingConfigChartDialogService{
    private readonly modalDialogService = inject(UiCommonDialogService);

    public showDialog(entity: IChartConfig) {
        const effectiveConfig: ICustomDialogOptions<IChartConfig, object> = {
            headerText: { key : 'basics.common.chartConfig.windowTitle'},
            id: 'chart.config.dialog',
            customButtons: undefined,
            width: '1000px',
            height: undefined,
            maxWidth: undefined,
            maxHeight: undefined,
            minWidth: undefined,
            minHeight: undefined,
            topDescription: undefined,
            bottomDescription: undefined,
            bodyComponent: ChartConfigDialogComponent,
            // bodyProviders: [{
            //     provide: getFormDialogDataToken<T>(),
            //     useValue: dlgData
            // }],
            buttons: [],
            value: entity
        };

        effectiveConfig.buttons?.push({
            id: StandardDialogButtonId.Ok,
	        isDisabled: info => {
					return !!(entity && entity.dateItem && entity.dateItem.isReadonly);
	        },
	        autoClose: true
        });
        effectiveConfig.buttons?.push({
            id: StandardDialogButtonId.Cancel
        });

	     return this.modalDialogService.show(effectiveConfig);
    }
}