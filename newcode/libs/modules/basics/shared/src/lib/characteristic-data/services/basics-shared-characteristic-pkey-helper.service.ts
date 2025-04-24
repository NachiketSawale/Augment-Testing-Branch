import {
    ICharacteristicDataGroupServiceInitializeOptions
} from '../model/interfaces/characteristic-data-entity-info-options.interface';
import {get} from 'lodash';
import {Injectable} from '@angular/core';
import {IEntityIdentification, IIdentificationDataMutable} from '@libs/platform/common';

/**
 * Service to handle pkey1, pkey2,pkey3
 */
@Injectable({
    providedIn: 'root'
})
export class BasicsSharedCharacteristicPkeyHelperService<PT extends IEntityIdentification> {
    /**
     * prepare common parameter when request characteristic related data
     * @param initOptions
     * @param contextId
     * @param sectionId
     */
    public prepareParameter(initOptions: ICharacteristicDataGroupServiceInitializeOptions<PT>,contextId?: number, sectionId?: number) {
        return {
            sectionId: !sectionId ? initOptions.sectionId : sectionId,
            ident: this.prepareIdentification(initOptions,contextId)
        };

    }

    /**
     * Prepare Identification according options
     * @param initOptions
     * @param id
     */
    public prepareIdentification(initOptions: ICharacteristicDataGroupServiceInitializeOptions<PT>, id?: number) {
        const selections = initOptions.parentService.getSelection();
        if (selections.length > 0) {
            const select = selections[selections.length-1];
            const ident: IIdentificationDataMutable = {
                id: id ? id : select.Id,
                pKey1: this.getPKey1OfItem(select, initOptions.pKey1Field),
                pKey2: this.getPKey2OfItem(select, initOptions.pKey2Field),
                pKey3: this.getPKey3OfItem(select, initOptions.pKey3Field)
            };
            return ident;
        } else {
            throw new Error('Please first select a parent entity!');
        }
    }

    private getPKey1OfItem(item: PT, pKey1Field: keyof PT | undefined) {
        return pKey1Field ? get(item, pKey1Field) as number : undefined;
    }

    private getPKey2OfItem(item: PT, pKey2Field: keyof PT | undefined) {
        return pKey2Field ? get(item, pKey2Field) as number : undefined;
    }

    private getPKey3OfItem(item: PT, pKey3Field: keyof PT | undefined) {
        return pKey3Field ? get(item, pKey3Field) as number : undefined;
    }
}