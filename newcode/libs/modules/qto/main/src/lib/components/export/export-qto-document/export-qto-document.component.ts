/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, inject } from '@angular/core';
import { ColumnDef, createLookup, FieldType, getMultiStepDialogDataToken, IFormConfig, IGridConfiguration } from '@libs/ui/common';
import { Translatable } from '@libs/platform/common';
import { QtoMainCrbLanguagesLookupDataService } from '../../../services/lookup-service/qto-main-crb-languages-lookup-data.service';
import { QtoMainCrbDocTypeLookupDataService } from '../../../services/lookup-service/qto-main-crb-doc-type-lookup-data.service';
import { IQtoExportBoqCrbConfig, IQtoExportConfig, IRangesEntity } from '../../../model/interfaces/qto-wizard-export-config.interface';
import { CrbOptionKey } from '../../../model/enums/qto-wizard-export-key.enum';

type optionType = {
	Id: string;
	value: boolean;
	readonly: boolean;
	displayName: Translatable;
};

@Component({
	selector: 'qto-main-export-qto-document',
	templateUrl: './export-qto-document.component.html',
	styleUrls: ['./export-qto-document.component.scss'],
})
export class ExportQtoDocumentComponent {
	private readonly dialogData = inject(getMultiStepDialogDataToken<IQtoExportConfig>());

	public entity = this.dialogData.dataItem.BoqCrb;

	public formConfiguration: IFormConfig<IQtoExportBoqCrbConfig> = {
		formId: 'qto.main.wizard.export.from',
		showGrouping: true,
		addValidationAutomatically: false,
		rows: [
			{
				id: 'CrbFormatId',
				label: {
					text: 'Format',
					key: 'boq.main.crbOutputFormat',
				},
				type: FieldType.Radio,
				model: 'CrbFormatId',
				itemsSource: {
					items: [
						{
							id: 1,
							displayName: 'SIA CRBX17',
						},
					],
				},
			},
			{
				id: 'CrbLanguage',
				label: {
					text: 'Language',
					key: 'basics.customize.language',
				},
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: QtoMainCrbLanguagesLookupDataService,
				}),
				model: 'CrbLanguage',
			},
			{
				id: 'CrbDocumentType',
				label: {
					text: 'Document Type',
					key: 'basics.customize.language',
				},
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: QtoMainCrbDocTypeLookupDataService,
				}),
				model: 'CrbDocumentType',
			},
		],
	};
	public checkBoxItemInfo: optionType[] = [
		{
			Id: CrbOptionKey.Prices,
			value: !!this.entity.QtoExportBoqCrbOption.OptionPrices,
			readonly: false,
			displayName: { text: 'Prices' },
		},
		{
			Id: CrbOptionKey.PriceConditions,
			value: !!this.entity.QtoExportBoqCrbOption.OptionPriceConditions,
			readonly: false,
			displayName: { text: 'Price Conditions' },
		},
		{
			Id: CrbOptionKey.Quantities,
			value: !!this.entity.QtoExportBoqCrbOption.OptionQuantities,
			readonly: false,
			displayName: { text: 'Quantities' },
		},
	];
	private recordDetailColumns: ColumnDef<IRangesEntity>[] = [
		{
			id: 'IsMarked',
			model: 'IsMarked',
			type: FieldType.Boolean,
			width: 200,
			label: {
				text: 'Filter',
			},
			visible: true,
			readonly: false,
		},
		{
			id: 'Name',
			model: 'Name',
			type: FieldType.Description,
			width: 200,
			label: {
				text: 'Description',
			},
			visible: true,
			readonly: true,
		},
	] as Array<ColumnDef<IRangesEntity>>;
	public gridConfiguration: IGridConfiguration<IRangesEntity> = {
		uuid: 'FB01DDD0A01B484F8536D70F747AC104',
		columns: this.recordDetailColumns,
		idProperty: 'Id',
		skipPermissionCheck: true,
		items: this.dialogData.dataItem.BoqCrb.GridData,
		treeConfiguration: {
			parent: (entity: IRangesEntity) => {
				return null;
			},
			children: (entity: IRangesEntity) => entity?.Children ?? [],
		},
	};
}
