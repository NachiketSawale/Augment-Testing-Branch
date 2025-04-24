import { IEntityBase } from '@libs/platform/common';
/// todo this entity may transfer to model module in the future
export interface IModelObject2LocationEntity extends IEntityBase {
	/**
	 * Id
	 */
	Id: number;
	ModelFk: number;
	ObjectFk: number;
	LocationFk: number;
}
