import { ICharacteristicGroupEntity } from '@libs/basics/interfaces';
import { CompleteIdentification } from '@libs/platform/common';
import { ICharacteristicSectionEntity } from './entities/characteristic-section-entity.interface';
import { ICompanyEntity } from './entities/company-entity.interface';

export class BasicsCharacteristicGroupComplete extends CompleteIdentification<ICharacteristicGroupEntity> {
	public MainItemId:number = 0;

	public Group : ICharacteristicGroupEntity | null = null;

	public SectionToSave?: Array<ICharacteristicSectionEntity>;

	public UsedInCompanyToSave?: Array<ICompanyEntity>;
}