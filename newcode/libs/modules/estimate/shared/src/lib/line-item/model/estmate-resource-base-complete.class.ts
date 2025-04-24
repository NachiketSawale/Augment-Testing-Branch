import { CompleteIdentification } from '@libs/platform/common';
import { IEstResourceEntity } from '@libs/estimate/interfaces';

/**
 * Complete identification for ResourceBaseEntity with additional fields.
 */
export class ResourceBaseComplete extends CompleteIdentification<IEstResourceEntity> {

	/**
	 * Main item ID.
	 */
	public MainItemId?: number;

	/**
	 * Reference to a ResourceBaseEntity.
	 */
	public EstResource?: IEstResourceEntity;

	/**
	 * Initializes the object with a ResourceBaseEntity.
	 *
	 * @param entity ResourceBaseEntity to initialize from, or null.
	 */
	public constructor(entity: IEstResourceEntity | null) {
		super();
		if (entity && entity.Id) {
			this.MainItemId = entity.Id;
			this.EstResource = entity;
		}
	}
}