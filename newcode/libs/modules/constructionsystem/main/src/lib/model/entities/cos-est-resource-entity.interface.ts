import { IEstResourceEntity } from '@libs/estimate/interfaces';

export interface ICosEstResourceEntity extends IEstResourceEntity {
	/**
	 * Compare Flag
	 */
	CompareFlag?: number | null;
}
