import { BasicsCurrencyConversionEntity } from './basics-currency-conversion-entity.class';
import { CompleteIdentification } from '@libs/platform/common';
import { BasicsCurrencyRateEntity } from "./basics-currency-rate-entity.class";

export class BasicsCurrencyConversionComplete implements CompleteIdentification<BasicsCurrencyConversionEntity> {

	public CurrencyConversion: BasicsCurrencyConversionEntity | null = null;

	public CurrencyRateToSave: BasicsCurrencyRateEntity[] | null = [];

	public CurrencyRateToDelete: BasicsCurrencyRateEntity[] | null = [];
}
