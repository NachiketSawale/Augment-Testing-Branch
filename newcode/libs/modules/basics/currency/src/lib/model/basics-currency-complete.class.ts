import { BasicsCurrencyEntity } from './basics-currency-entity.class';
import { CompleteIdentification } from '@libs/platform/common';
import { BasicsCurrencyConversionComplete } from './basics-currency-conversion-complete.class';
import { BasicsCurrencyConversionEntity } from './basics-currency-conversion-entity.class';

export class BasicsCurrencyComplete implements CompleteIdentification<BasicsCurrencyEntity> {
	public MainItemId: number = 0;

	public EntitiesCount: number = 0;

	public Currency: BasicsCurrencyEntity | null = null;

	public CurrencyConversionToSave: BasicsCurrencyConversionComplete[] | null = [];

	public CurrencyConversionToDelete: BasicsCurrencyConversionEntity[] | null = [];
}
