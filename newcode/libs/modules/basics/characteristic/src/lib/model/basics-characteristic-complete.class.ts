import { ICharacteristicChainEntity, ICharacteristicEntity, ICharacteristicGroupEntity } from '@libs/basics/interfaces';
import { CompleteIdentification } from '@libs/platform/common';
import { IBasicsCharacteristicAutomaticAssignmentEntity } from './entities/basics-characteristic-automatic-assignment-entity.interface';
import { ICharacteristicValueEntity } from '@libs/basics/interfaces';

export class BasicsCharacteristicComplete implements CompleteIdentification<ICharacteristicEntity> {
	public MainItemId: number = 0;

	public Characteristic: ICharacteristicEntity | null = null;
	public Characteristics: ICharacteristicEntity[] | null = [];
	public CharacteristicToSave: ICharacteristicEntity[] | null = [];
	public CharacteristicToDelete: ICharacteristicEntity[] | null = [];

	public Group: ICharacteristicGroupEntity | null = null;

	public AutomaticAssignmentToSave?: IBasicsCharacteristicAutomaticAssignmentEntity[] | null = null;

	public DiscreteValueToSave: ICharacteristicValueEntity[] | null = null;
	public DiscreteValueToDelete: ICharacteristicValueEntity[] | null = null;

	public CharacteristicChainToSave:ICharacteristicChainEntity[] | null = null;
	public CharacteristicChainToDelete:ICharacteristicChainEntity[] | null = null;
}