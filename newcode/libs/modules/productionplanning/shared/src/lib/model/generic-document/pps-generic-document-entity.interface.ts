/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IPpsGenericDocumentBaseEntity } from './pps-generic-document-base-entity.interface';

export interface IPpsGenericDocumentEntity extends IPpsGenericDocumentBaseEntity {

	/*
	 * DocumentTypeFk
	 */
	DocumentTypeFk: number | null;

	/*
	 * PpsDocumentTypeFk
	 */
	PpsDocumentTypeFk?: number | null;

}
