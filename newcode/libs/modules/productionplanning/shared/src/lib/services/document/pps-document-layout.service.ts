/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable, Injector } from '@angular/core';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { createLookup, FieldType, ILayoutConfiguration } from '@libs/ui/common';
import { BasicsSharedCustomizeLookupOverloadProvider, BasicsSharedDocumentTypeLookupService } from '@libs/basics/shared';
import { IPpsDocumentEntity } from '../../model/document/pps-document-entity.interface';
import { IPpsProductTemplateEntityGenerated } from '../../model/product-template/pps-product-template-entity-generated.interface';
import { IPpsProductTemplateSimpleLookupEntity } from '../../model/product-template/pps-product-template-simple-lookup-entity';
import { ProductTemplateSharedSimpleLookupService } from '../../simple-lookup-service/product-template-lookup.service';
import { PpsSharedDrawingDialogLookupService } from '../drawing/pps-shared-drawing-dialog-lookup.service';

/**
 * Shared PPS document layout service
 */
@Injectable({
	providedIn: 'root',
})
export class ProductionplanningSharedDocumentLayoutService {
	private readonly injector = inject(Injector);

	public async generateLayout<T extends IPpsDocumentEntity>(): Promise<ILayoutConfiguration<T>> {
		return <ILayoutConfiguration<T>>{
			groups: [
				{
					gid: 'baseGroup',
					attributes: ['DocumentTypeFk', 'Description', 'OriginFileName', 'CommentText', 'PpsDocumentTypeFk', 'Origin', 'Belonging'],
				},
				{
					gid: 'Assignment',
					attributes: ['PpsItemFk', 'ProductDescriptionFk', 'EngDrawingFk', 'MntActivityFk', 'MntReportFk'],
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
					DocumentTypeFk: { text: '*Document Type', key: 'document.documentTypeFk' },
					PpsDocumentTypeFk: { text: '*PPS Document Type', key: 'document.ppsDocumentTypeFk' },
					Assignment: { text: '*Assignment', key: 'assignment' },
					PpsItemFk: { text: '*Planning Unit', key: 'event.itemFk' },
					ProductDescriptionFk: { text: '*Product Template', key: 'product.productDescriptionFk' },
					EngDrawingFk: { text: '*Drawing', key: 'product.drawing' },
					MntActivityFk: { text: '*Mounting Activity', key: 'document.mntActivityFk' },
					MntReportFk: { text: '*Mounting Report', key: 'document.mntReportFk' },
					Origin: { key: 'document.origin', text: '*Origin' },
					Belonging: { key: 'document.belonging', text: '*Belonging' },
				}),
			},
			overloads: {
				DocumentTypeFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedDocumentTypeLookupService,
					}),
				},
				OriginFileName: {
					readonly: true,
				},
				PpsDocumentTypeFk: BasicsSharedCustomizeLookupOverloadProvider.providePpsDocumentTypeLookupOverload(false),
				ProductDescriptionFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup<IPpsProductTemplateEntityGenerated, IPpsProductTemplateSimpleLookupEntity>({
						dataServiceToken: ProductTemplateSharedSimpleLookupService,
						descriptionMember: 'Code',
					}),
				},
				EngDrawingFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: PpsSharedDrawingDialogLookupService,
						showClearButton: false,
					}),
				},
				// wait for provider of correpsonding available lookup
				PpsItemFk: {},
				MntActivityFk: {},
				MntReportFk: {},
			},
		};
	}
}
