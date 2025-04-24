import { IEstPriceAdjustmentItemData } from '@libs/estimate/interfaces';

export type ResetFieldValueType = (e: IEstPriceAdjustmentItemData) => void;

export type ResetFieldType = {
	field: string;
	value: ResetFieldValueType | null | undefined;
};
