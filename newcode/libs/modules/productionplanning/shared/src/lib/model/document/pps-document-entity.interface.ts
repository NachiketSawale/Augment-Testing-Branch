/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
// import { IDocumentBaseEntity } from '@libs/documents/interfaces';
import { IPpsDocumentEntityGenerated } from './pps-document-entity-generated.interface';

export interface IPpsDocumentEntity extends IPpsDocumentEntityGenerated {

    //Named property 'DocumentTypeFk' of types 'IDocumentBaseEntity'

    Origin?: string | null;
    Belonging?: string | null;

}
