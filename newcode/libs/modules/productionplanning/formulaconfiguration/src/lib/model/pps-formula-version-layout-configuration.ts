import { FieldType } from '@libs/ui/common';
import { IPpsFormulaVersionEntity } from './entities/pps-formula-version-entity.interface';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { ContainerLayoutConfiguration } from '@libs/ui/business-base';

export const PpsFormulaVersionLayoutConfiguration: ContainerLayoutConfiguration<IPpsFormulaVersionEntity> = {
	groups: [{
		gid: 'baseGroup',
		attributes: ['FormulaVersion', 'Status', 'IsLive', 'CommentText']
	}],
	labels: {
		...prefixAllTranslationKeys('productionplanning.formulaconfiguration.', {
			FormulaVersion: 'FormulaVersion',
			CommentText: 'CommentText',
		}),
		...prefixAllTranslationKeys('cloud.common.', {
			Status: 'entityStatus',
			IsLive: 'entityIsLive',
		}),
	},
	overloads: {
		Status: {
			readonly: true,
			type: FieldType.ImageSelect,
			itemsSource: {
				items: [{
					id: 0,
					displayName: '',
					iconCSS: 'control-icons ico-design',
				}, {
					id: 1,
					displayName: '',
					iconCSS: 'control-icons ico-active',
				}, {
					id: 2,
					displayName: '',
					iconCSS: 'control-icons ico-inactive',
				}]
				// remark: in the related original angularjs code, we also only show image instead of text in the column
			},
		},
		FormulaVersion: {
			readonly: true
		}
	},
};
