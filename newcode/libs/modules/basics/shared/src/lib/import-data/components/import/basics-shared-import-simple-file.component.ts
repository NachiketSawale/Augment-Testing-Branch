import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { getCustomDialogDataToken, IFormConfig, UiCommonModule } from '@libs/ui/common';
import { IBasicsSharedImportDataEntity } from '../../models/basics-import-data-entity.interface';

@Component({
	selector: 'basics-shared-import-simple-file',
	standalone: true,
	imports: [CommonModule, UiCommonModule],
	templateUrl: './basics-shared-import-simple-file.component.html',
	styleUrl: './basics-shared-import-simple-file.component.scss'
})
export class BasicsSharedImportSimpleFileComponent<TEntity extends {entity:IBasicsSharedImportDataEntity, formConfig:IFormConfig<IBasicsSharedImportDataEntity>}> {

	private readonly dialogWrapper = inject(getCustomDialogDataToken<TEntity, BasicsSharedImportSimpleFileComponent<TEntity>>());

	public get model() {
		return this.dialogWrapper.value;
	}
}
