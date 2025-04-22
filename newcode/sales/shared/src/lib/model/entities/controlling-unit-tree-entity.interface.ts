import { IEntityBase, IEntityIdentification } from '@libs/platform/common';
import { ControllingUnitEntityInterface } from './controlling-unit-entity.interface';

export interface ControllingUnitTreeEntityInterface extends IEntityBase, IEntityIdentification {
	RecordsFound: number;
	RecordsRetrieved: number;
	SearchList: ControllingUnitEntityInterface;
}