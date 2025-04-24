import { Injectable } from '@angular/core';
import { IEntitySelection } from '@libs/platform/data-access';
import { ISelectStatementEntity } from '../../model/entities/selection-statement/selection-statement-entity.interface';
import { ICosSelectionStatementMainService } from '../../model/enums/selection-statement-main-service.interface';

@Injectable({
	providedIn: 'root',
})
export class SelectionStatementCommonScopeService {
	public onRevertFilter(mainDataService: IEntitySelection<ISelectStatementEntity> & ICosSelectionStatementMainService) {
		const parentSelectedEntity = mainDataService.getSelectedEntity();
		if (parentSelectedEntity?.OriginalSelectionStatement) {
			parentSelectedEntity.SelectStatement = parentSelectedEntity.OriginalSelectionStatement;
		}
	}

	public canRevertFilter(mainDataService: IEntitySelection<ISelectStatementEntity> & ICosSelectionStatementMainService) {
		const parentSelectedEntity = mainDataService.getSelectedEntity();
		if (parentSelectedEntity) {
			return parentSelectedEntity.SelectStatement !== parentSelectedEntity.OriginalSelectionStatement;
		}
		return false;
	}
}
