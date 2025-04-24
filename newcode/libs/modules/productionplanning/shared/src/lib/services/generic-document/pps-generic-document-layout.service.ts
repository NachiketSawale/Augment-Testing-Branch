/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable, Injector } from '@angular/core';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { createLookup, FieldType, ILayoutConfiguration, UiCommonLookupDataFactoryService } from '@libs/ui/common';
import {
	BasicsSharedCustomizeLookupOverloadProvider,
	BasicsSharedDocumentTypeLookupService,
} from '@libs/basics/shared';
import { IPpsGenericDocumentEntity } from '../../model/generic-document/pps-generic-document-entity.interface';
import { PpsGenericDocumentFromsHelper } from './pps-generic-document-froms-helper.service';

/**
 * Shared PPS document layout service
 */
@Injectable({
	providedIn: 'root'
})
export class ProductionplanningSharedGenericDocumentLayoutService {
	private readonly injector = inject(Injector);
	private lookupServiceFactory = inject(UiCommonLookupDataFactoryService);
	private fromsHelper = inject(PpsGenericDocumentFromsHelper);

	public async generateLayout<T extends IPpsGenericDocumentEntity>(): Promise<ILayoutConfiguration<T>> {
		return <ILayoutConfiguration<T>>{
			groups: [
				{
					gid: 'baseGroup',
					attributes: ['From', 'DocumentTypeFk', 'PpsDocumentTypeFk', 'Description', 'BarCode', 'Revision']
				},
			],
			labels: {
				...prefixAllTranslationKeys('cloud.common.', {
					baseGroup: { key: 'entityProperties', text: '*Basic Data' },
					Description: { text: '*Description', key: 'entityDescription' },
					Revision: { text: '*Revision', key: 'documentsRevision' },
				}),
				...prefixAllTranslationKeys('productionplanning.common.', {
					DocumentTypeFk: { text: '*Document Type', key: 'document.documentTypeFk' },
					PpsDocumentTypeFk: { text: '*PPS Document Type', key: 'document.ppsDocumentTypeFk' },
					From: { text: '*From', key: 'from' },
					Barcode: { text: '*Barcode', key: 'document.revision.barcode' },
				}),

			},
			overloads: {
				From: {
					type: FieldType.Lookup,
					readonly: true,
					lookupOptions: createLookup({
						dataService: this.lookupServiceFactory.fromItems(this.fromsHelper.getFroms(), {
							uuid: '',
							idProperty: 'id',
							valueMember: 'id',
							displayMember: 'description'
						})
					})
				},
				Revision: {
					readonly: true
				},
				DocumentTypeFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedDocumentTypeLookupService
					})
				},
				PpsDocumentTypeFk: BasicsSharedCustomizeLookupOverloadProvider.providePpsDocumentTypeLookupOverload(false),
			}
		};
	}
}