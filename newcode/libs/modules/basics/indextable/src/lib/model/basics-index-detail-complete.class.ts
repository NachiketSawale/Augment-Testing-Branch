import { BasicsIndexDetailEntity } from './basics-index-detail-entity.class';
import { CompleteIdentification } from '@libs/platform/common';

export class BasicsIndexDetailComplete implements CompleteIdentification<BasicsIndexDetailEntity> {
	public MainItemId: number = 0;
	public EntitiesCoun: number = 0;
	public IndexDetail: BasicsIndexDetailEntity | null = null;
	public IndexDetailToSave: BasicsIndexDetailEntity | null = null;
}
