import { CompleteIdentification } from '@libs/platform/common';
import { IClerkRoleSlotEntity } from './entities/clerk-role-slot-entity.interface';

export class ClerkRoleSlotComplete implements CompleteIdentification<IClerkRoleSlotEntity> {

	public ClerkRoleSlot!: IClerkRoleSlotEntity | null;
}
