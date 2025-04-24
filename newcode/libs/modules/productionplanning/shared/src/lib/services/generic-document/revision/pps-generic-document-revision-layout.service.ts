/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { ILayoutConfiguration } from '@libs/ui/common';
import { IPpsGenericDocumentRevisionEntity } from '../../../model/generic-document/pps-generic-document-revision-entity.interface';

/**
 * Shared PPS generic document revision layout service
 */
@Injectable({
	providedIn: 'root'
})
export class ProductionplanningSharedGenericDocumentRevisionLayoutService {

	public async generateLayout<T extends IPpsGenericDocumentRevisionEntity>(): Promise<ILayoutConfiguration<T>> {
		return <ILayoutConfiguration<T>>{
			groups: [
				{
					gid: 'baseGroup',
					attributes: ['Description', 'Barcode', 'CommentText', 'OriginFileName']
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