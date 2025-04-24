/*
 * Copyright(c) RIB Software GmbH
 */

import { PlatformLazyInjectorService } from '@libs/platform/common';
import { RfqBidders } from '../types/rfq-bidders.type';
import { IContactEntity, RFQ_BPM_PORTAL_USER_MANAGEMENT_SERVICE } from '@libs/businesspartner/interfaces';
import { isArray, isUndefined } from 'lodash';


/**
 * Adds a property that indicates if the passed bidders have a contact who is a portal user.
 * @param entities 
 * @param lazyInjector 
 * @returns void
 */
export async function updateContactHasPortalUserField(entities: RfqBidders[], lazyInjector: PlatformLazyInjectorService) {
    let contacts: IContactEntity[] = [];	

    entities.forEach(entity => {
        if (!entity.ContactFk) {
            entity.ContactHasPortalUser = false;			
            return;
        }
        contacts.push({ Id: entity.ContactFk } as IContactEntity);
    });	

    if(contacts.length === 0) {
        return;
    }

    const userManagementService = await lazyInjector.inject(RFQ_BPM_PORTAL_USER_MANAGEMENT_SERVICE);
    contacts = await userManagementService.getAndMapProviderInfo(contacts);
    if (!isArray(contacts)) {
        contacts = [];
    }

    entities.forEach(item => {
        if (!item.ContactFk) {
            return;
        }

        const found = contacts.find(contact => contact.Id === item.ContactFk);
        if (found) {
            item.ContactHasPortalUser = found.LogonName !== null && !isUndefined(found.LogonName);			
        }
    });
}