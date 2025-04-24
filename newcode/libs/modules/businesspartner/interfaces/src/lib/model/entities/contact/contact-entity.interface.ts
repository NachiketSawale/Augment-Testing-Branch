/*
 * Copyright(c) RIB Software GmbH
 */


import { ISubsidiaryEntity } from '../main';
import { IContactEntityGenerated } from './contact-entity-generated.interface';
import { InjectionToken } from '@angular/core';

export interface IContactEntity extends IContactEntityGenerated {

    SubsidiaryDescriptor?: ISubsidiaryEntity | null;
}

export const CONTACT_ENTITIY = new InjectionToken<IContactEntity[]>('CONTACT_ENTITIY');
