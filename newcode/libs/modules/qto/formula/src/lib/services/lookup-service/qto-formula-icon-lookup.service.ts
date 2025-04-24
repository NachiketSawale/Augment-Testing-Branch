import { UiCommonLookupItemsDataService} from '@libs/ui/common';
import {Injectable} from '@angular/core';
import {ServiceLocator} from '@libs/platform/common';
import {QtoFormulaIconProcessorService} from './qto-formula-icon-processor.service';

export class IconData {
    public Id!: number;
    public res!: string;
    public text!: string;
    public type?: string;
}


@Injectable({
    providedIn: 'root'
})
export class QtoFormulaIconLookupService <TEntity extends object> extends UiCommonLookupItemsDataService<IconData, TEntity> {
    /**
     * constructor
     */
    public constructor() {
        const iconDatas: IconData[] = ServiceLocator.injector.get(QtoFormulaIconProcessorService).QtoFormulaIconProcessor();
        super(iconDatas, {
            uuid: '1f4cee74e4f44b189d841B4f0501968e',
            idProperty: 'Id',
            valueMember: 'Id',
            displayMember: 'text',
        });
    }
}