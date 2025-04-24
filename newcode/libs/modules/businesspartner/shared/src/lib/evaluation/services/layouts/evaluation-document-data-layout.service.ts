import { inject, Injectable } from '@angular/core';
import { MODULE_INFO } from '../../model/entity-info/module-info.model';
import { ColumnDef, createLookup, FieldType } from '@libs/ui/common';
import { IEvaluationDocumentEntity } from '@libs/businesspartner/interfaces';
import { EvaluationCommonService } from '../evaluation-common.service';
import { BasicsSharedDocumentTypeLookupService } from '@libs/basics/shared';

@Injectable({
	providedIn: 'root',
})
export class EvaluationDocumentDataLayoutService {
	private readonly evaluationCommonService: EvaluationCommonService = inject(EvaluationCommonService);
	public constructor() {}

	public get columns() {
		return [
			{
				id: 'documenttypefk',
				model: 'DocumentTypeFk',
				label: {
					key: MODULE_INFO.businesspartnerMainModuleName + '.documentType',
					text: 'Document Type',
				},
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedDocumentTypeLookupService,
					displayMember: 'DescriptionInfo.Translated',
					showClearButton: true,
				}),
				visible: true,
			},{
				id: 'extention',
				model: 'DocumentTypeFk',
				label: {
					text: this.evaluationCommonService.getTranslateText(MODULE_INFO.basicsCustomizeModuleName + '.extention'),
				},
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedDocumentTypeLookupService,
					displayMember: 'Extention',
				}),
				readonly: true,
				visible: true,
			},
			{
				id: 'description',
				model: 'Description',
				label: {
					text: this.evaluationCommonService.getTranslateText(MODULE_INFO.prcCommonNameModuleName + '.documentDescription'),
				},
				visible: true,
			},
			{
				id: 'documentdate',
				model: 'DocumentDate',
				label: {
					key: MODULE_INFO.businesspartnerMainModuleName + '.documentDate',
					text: 'Document Date',
				},
				type: FieldType.Date,
				visible: true,
			},
			{
				id: 'originfilename',
				model: 'OriginFileName',
				label: {
					text: this.evaluationCommonService.getTranslateText(MODULE_INFO.prcCommonNameModuleName + '.documentOriginFileName'),
				},
				type: FieldType.Text,
				readonly: true,
				visible: true,
			},
			{
				id: 'modelState',
				model: 'ModelState',
				label: {
					text: this.evaluationCommonService.getTranslateText(MODULE_INFO.basicsCommonModuleName + '.modelJobState'),
				},
				readonly: true,
				visible: true,
			},
		] as ColumnDef<IEvaluationDocumentEntity>[];
	}
}
