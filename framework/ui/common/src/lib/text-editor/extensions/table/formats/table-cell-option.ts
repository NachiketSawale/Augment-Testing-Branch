/*
 * Copyright(c) RIB Software GmbH
 */
import { IFormConfig } from '../../../../form';
import { FieldType } from '../../../../model/fields';
import { ICellDialogOptions } from '../model/text-editor-table.interface';

/**
 * Table Cell Option Form Configuration
 */
export const CellOptionFormConfig: IFormConfig<ICellDialogOptions> = {
	formId: 'CellEditor',
	showGrouping: true,
	groups: [
		{
			groupId: 'dimension',
			header: { key: 'platform.richTextEditor.tableProperties.dimensions' },
		},
		{
			groupId: 'style',
			header: { key: 'platform.richTextEditor.tableProperties.style' },
		},
		{
			groupId: 'cellAlignment',
			header: { key: 'platform.richTextEditor.tableProperties.cellAlignment' },
		},
	],
	rows: [
		{
			groupId: 'dimension',
			id: 'cellWidth',
			label: {
				key: 'platform.richTextEditor.tableProperties.cellWidth',
			},
			type: FieldType.Decimal,
			model: 'cellWidth',
			sortOrder: 2,
		},
		{
			groupId: 'style',
			id: 'borderWidth',
			label: {
				key: 'platform.richTextEditor.tableProperties.borderWidth',
			},
			type: FieldType.Integer,
			model: 'borderWidth',
			sortOrder: 5,
		},
		{
			groupId: 'style',
			id: 'borderColor',
			label: {
				key: 'platform.richTextEditor.tableProperties.borderColor',
			},
			type: FieldType.Color,

			model: 'borderColor',
			sortOrder: 7,
		},
		{
			groupId: 'cellAlignment',
			id: 'horizontal',
			label: {
				key: 'platform.richTextEditor.tableProperties.cellAlignmentHorizontal',
			},
			type: FieldType.Select,
			itemsSource: {
				items: [
					{
						id: 'left',
						displayName: 'Left',
					},
					{
						id: 'right',
						displayName: 'Right',
					},
					{
						id: 'center',
						displayName: 'Middle',
					},
				],
			},
			model: 'horizontal',
			sortOrder: 8,
		},
	],
};
