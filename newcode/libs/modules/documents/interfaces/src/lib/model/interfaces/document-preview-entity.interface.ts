/*
 * Copyright(c) RIB Software GmbH
 */
import { IDocumentBaseEntity } from './document-base-entity.interface';

export interface IDocumentPreviewEntity extends IDocumentBaseEntity {
	Url?: string | null;
}