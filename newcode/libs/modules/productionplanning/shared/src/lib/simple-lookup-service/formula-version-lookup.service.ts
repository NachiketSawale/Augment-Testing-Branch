import { Injectable } from '@angular/core';
import { UiCommonLookupTypeDataService } from '@libs/ui/common';
import { IPpsFormulaVersionLookupEntity } from '../model/formula-configuration/pps-formula-version-look-up-entity.interface';

@Injectable({
    providedIn: 'root'
})
export class PpsSharedFormulaVersionLookupService<TEntity extends object> extends UiCommonLookupTypeDataService<IPpsFormulaVersionLookupEntity, TEntity> {
    public constructor() {
        super('PpsFormulaVersion', {
            valueMember: 'Id',
            displayMember: 'FormulaVersion',
            uuid: 'c6889d4cc9b643bca5cd326e30ada52f'
        });
    }
}