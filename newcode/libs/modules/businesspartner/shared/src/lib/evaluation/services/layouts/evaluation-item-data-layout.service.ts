import { Injectable } from '@angular/core';
import { ColumnDef, createLookup, FieldType } from '@libs/ui/common';
import { IEvaluationItemDataEntity } from '@libs/businesspartner/interfaces';
import { MODULE_INFO } from '../../model/entity-info/module-info.model';
import { BusinesspartnerSharedEvaluationItemLookupService } from '../../../lookup-services/businesspartner-evaluation-item-lookup.service';

@Injectable({
	providedIn: 'root',
})
export class EvaluationItemDataLayoutService {
	public constructor() {}

	public get columns() {
		return [
			{
				id: 'isticked',
				model: 'IsTicked',
				label: {
					key: MODULE_INFO.businesspartnerMainModuleName + '.isChecked',
					text: 'Checked',
				},
				type: FieldType.Boolean,
				readonly: false,
				visible: true,
			},
			{
				id: 'evaluationitemfk',
				model: 'EvaluationItemFk',
				label: {
					key: MODULE_INFO.businesspartnerMainModuleName + '.entityEvaluationItemDescription',
					text: 'Item Description',
				},
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BusinesspartnerSharedEvaluationItemLookupService,
				}),
				readonly: true,
				visible: true,
			},
			{
				id: 'points',
				model: 'Points',
				label: {
					key: MODULE_INFO.businesspartnerMainModuleName + '.entityPoints',
					text: 'Result',
				},
				type: FieldType.Decimal,
				readonly: true,
				visible: true,
			},
			{
				id: 'remark',
				model: 'Remark',
				label: {
					key: MODULE_INFO.cloudCommonModuleName + '.entityRemark',
					text: 'Remarks',
				},
				type: FieldType.Remark ,
				readonly: true,
				visible: true,
			},
		] as ColumnDef<IEvaluationItemDataEntity>[];
	}
}
