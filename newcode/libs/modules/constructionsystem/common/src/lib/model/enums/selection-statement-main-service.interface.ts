import { ISelectStatementEntity } from '../entities/selection-statement/selection-statement-entity.interface';

export interface ICosSelectionStatementMainService {
	/**
	 * Sets entities modified
	 * @param entities to be set modified
	 */
	setModified(entities: ISelectStatementEntity[] | ISelectStatementEntity): void;
}
