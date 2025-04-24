import { BasicsBankEntity } from './basics-bank-entity.class';
import { CompleteIdentification } from '@libs/platform/common';

export class BasicsBankComplete implements CompleteIdentification<BasicsBankEntity> {
	public MainItemId: number = 0;

	public Bank: BasicsBankEntity | null = null;
}
