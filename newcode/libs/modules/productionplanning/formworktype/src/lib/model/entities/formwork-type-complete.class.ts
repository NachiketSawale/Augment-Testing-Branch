import { CompleteIdentification } from '@libs/platform/common';
import { FormworkTypeEntity } from './formwork-type-entity.class';

/**
 * Business Partner complete which holds modification to save
 */
export class FormworkTypeEntityComplete implements CompleteIdentification<FormworkTypeEntity> {
	public MainItemId: number = 0;
	public FormworkType: FormworkTypeEntity[] | null = [];
}