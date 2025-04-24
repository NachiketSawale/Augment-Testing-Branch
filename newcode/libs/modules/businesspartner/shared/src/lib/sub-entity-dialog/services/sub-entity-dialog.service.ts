import {inject, Injectable, StaticProvider} from '@angular/core';
import {
	IDialogResult,
	IEditorDialogResult,
	UiCommonDialogService
} from '@libs/ui/common';
import {IEntityBase, IEntityIdentification} from '@libs/platform/common';
import {
	BusinesspartnerSharedSubEntityGridDialogComponent, GRID_DIALOG_OPTIONS_TOKEN,
} from '../components/sub-entity-grid-dialog.component';
import { ISubEntityGridDialog, ISubEntityGridDialogOptions } from '../model/sub-entity-dialog.interface';

@Injectable({
	providedIn: 'root'
})
export class BusinesspartnerSharedSubEntityDialogService {
	/**
	 * Opens/Closes dialog.
	 */
	private readonly modalDialogService = inject(UiCommonDialogService);

	public show<TItem extends IEntityBase & IEntityIdentification>(options: ISubEntityGridDialogOptions<TItem>, bodyProviders: StaticProvider[]): Promise<IEditorDialogResult<IDialogResult>> | undefined {

		const modalConfig = this.modalDialogService.createOptionsForCustom<ISubEntityGridDialog, ISubEntityGridDialogOptions<TItem>, IDialogResult, BusinesspartnerSharedSubEntityGridDialogComponent<TItem>>(
			options,
			info => info.body.dialogInfo,
			BusinesspartnerSharedSubEntityGridDialogComponent,
			[
				{
					provide: GRID_DIALOG_OPTIONS_TOKEN,
					useValue: options
				},
				...bodyProviders
			]
		);

		return this.modalDialogService.show(modalConfig);
	}
}