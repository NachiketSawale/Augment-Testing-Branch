import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { getCustomDialogDataToken, GridComponent, IGridConfiguration, UiCommonModule } from '@libs/ui/common';
import { IBasicsSharedImportDataEntity } from '../../models/basics-import-data-entity.interface';

@Component({
	selector: 'basics-shared-import-simple-file-result',
	standalone: true,
	imports: [CommonModule, UiCommonModule, GridComponent],
	templateUrl: './basics-shared-import-simple-file-result.component.html',
	styleUrl: './basics-shared-import-simple-file-result.component.scss',
})
export class BasicsSharedImportSimpleFileResultComponent<TEntity extends { entity: IBasicsSharedImportDataEntity, items:IBasicsSharedImportDataEntity[], gridConfig: IGridConfiguration<IBasicsSharedImportDataEntity> }> {
	private readonly dialogWrapper = inject(getCustomDialogDataToken<TEntity, BasicsSharedImportSimpleFileResultComponent<TEntity>>());

	public get model() {
		return this.dialogWrapper.value!;
	}

	public get gridConfig() {
		this.dialogWrapper.value!.gridConfig.items = this.dialogWrapper.value!.items;
		return this.dialogWrapper.value!.gridConfig;
	}
}
