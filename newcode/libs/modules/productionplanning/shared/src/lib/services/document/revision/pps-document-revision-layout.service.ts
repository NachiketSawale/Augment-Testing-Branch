/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { ILayoutConfiguration } from '@libs/ui/common';
import { IPpsDocumentRevisionEntity } from '../../../model/document/pps-document-revision-entity.interface';

/**
 * Shared PPS document revision layout service
 */
@Injectable({
	providedIn: 'root'
})
export class ProductionplanningSharedDocumentRevisionLayoutService {

	public async generateLayout<T extends IPpsDocumentRevisionEntity>(): Promise<ILayoutConfiguration<T>> {
		return <ILayoutConfiguration<T>>{
			groups: [
				{
					gid: 'baseGroup',
					attributes: ['Description', 'OriginFileName', 'Barcode', 'CommentText']
				},
				{
					gid: 'version',
					attributes: ['Revision']
				},
			],
			labels: {
				...prefixAllTranslationKeys('cloud.common.', {
					baseGroup: { key: 'entityProperties', text: '*Basic Data' },
					Description: { text: '*Description', key: 'entityDescription' },
					OriginFileName: { text: '*Origin File Name', key: 'documentOriginFileName' },
					CommentText: { text: '*Comments', key: 'entityComment' },
				}),
				...prefixAllTranslationKeys('productionplanning.common.', {
					Barcode: { key: 'document.revision.barcode', text: '*Barcode' },
					Revision: { key: 'document.revision.revision', text: '*Revision' },
				}),
			},
			overloads: {
				OriginFileName: {
					readonly: true
				},
				Revision: {
					readonly: true
				},
			}
		};
	}
}