import { BasicsCountryEntity } from './basics-country-entity.class';
import { CompleteIdentification } from '@libs/platform/common';

export class BasicsCountryComplete implements CompleteIdentification<BasicsCountryEntity> {
	public MainItemId: number = 0;

	public Country: BasicsCountryEntity | null = null;
}
