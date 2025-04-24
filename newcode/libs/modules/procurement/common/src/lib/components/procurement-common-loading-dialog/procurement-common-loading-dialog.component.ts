import { Component, inject, InjectionToken, OnDestroy, OnInit } from '@angular/core';
import { ITranslatable } from '@libs/platform/common';
import { getCustomDialogDataToken, UiCommonModule } from '@libs/ui/common';
import { Subject, Subscription } from 'rxjs';

export interface ILoadingDialogOptions {
	info?: ITranslatable;
	cssClass?: string;
	closeEvent$: Subject<void>;
}

/**
 * Injection token of account assignment total data
 */
export const PROCUREMENT_COMMON_LOAD_DIALOG_OPTIONS_TOKEN = new InjectionToken<ILoadingDialogOptions>('procurement-common-loading-dialog-options');

@Component({
	selector: 'procurement-common-loading-dialog',
	standalone: true,
	imports: [UiCommonModule],
	templateUrl: './procurement-common-loading-dialog.component.html',
	styleUrl: './procurement-common-loading-dialog.component.css',
})
export class ProcurementCommonLoadingDialogComponent implements OnInit, OnDestroy {
	public readonly loadingDialogOptions = inject(PROCUREMENT_COMMON_LOAD_DIALOG_OPTIONS_TOKEN);
	private readonly dialogWrapper = inject(getCustomDialogDataToken<void, ProcurementCommonLoadingDialogComponent>());

	private closeEventSubscription?: Subscription;

	public ngOnInit() {
		if (this.loadingDialogOptions.closeEvent$) {
			this.closeEventSubscription = this.loadingDialogOptions.closeEvent$.subscribe(() => {
				this.handleCloseEvent();
			});
		}
	}

	public ngOnDestroy() {
		if (this.closeEventSubscription) {
			this.closeEventSubscription.unsubscribe();
		}
	}

	private handleCloseEvent() {
		this.dialogWrapper.close();
	}
}
