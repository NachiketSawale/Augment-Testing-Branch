/*
 * Copyright(c) RIB Software GmbH
 */

import { AfterViewInit, Component, ElementRef, InjectionToken, Injector, Renderer2, StaticProvider, ViewEncapsulation, inject } from '@angular/core';
import { ICompositeBaseEntity } from '../../../model/entities/composite-base-entity.interface';
import { getCustomDialogDataToken, StandardDialogButtonId } from '@libs/ui/common';
import {
	ICompareSettingEditorDialog,
	ICompareSettingSection
} from '../../../model/entities/compare-setting-dialog-options.inteface';
import { IComparePrintDialogContext, IComparePrintEditorDialog } from '../../../model/entities/print/compare-print-dialog-options.interface';
import { IComparePrintBase } from '../../../model/entities/print/compare-print-base.interface';
import { IComparePrintProfileEntity } from '../../../model/entities/print/compare-print-profile-entity.interface';

export const COMPARE_PRINT_DLG_CONTEXT_TOKEN = new InjectionToken('compare-print-dlg-context-token');
export const COMPARE_PRINT_DATA_TOKEN = new InjectionToken('compare-print-data-token');

@Component({
	selector: 'procurement-pricecomparison-compare-print-dialog-body',
	templateUrl: './compare-print-dialog-body.component.html',
	styleUrls: ['./compare-print-dialog-body.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class ProcurementPricecomparisonComparePrintDialogBodyComponent<
	T extends ICompositeBaseEntity<T>,
	PT extends IComparePrintBase<T>
> implements AfterViewInit {
	private readonly injector = inject(Injector);
	private readonly dlgWrapper = inject(getCustomDialogDataToken<PT, ProcurementPricecomparisonComparePrintDialogBodyComponent<T, PT>>());
	public readonly dialogContext = inject<IComparePrintDialogContext<T, PT>>(COMPARE_PRINT_DLG_CONTEXT_TOKEN);
	public initialized: boolean = false;
	public loading: boolean = false;
	public settings!: PT;
	public dialogInfo: ICompareSettingEditorDialog<T, PT>;
	public pages: Array<{
		section: ICompareSettingSection,
		injector: Injector
	}> = [];

	public constructor(
		private elementRef: ElementRef,
		private render: Renderer2
	) {
		this.dialogInfo = (function createDialogInfoFn(owner: ProcurementPricecomparisonComparePrintDialogBodyComponent<T, PT>): IComparePrintEditorDialog<T, PT> {
			return {
				get value(): PT {
					return owner.dlgWrapper.value as PT;
				},
				set value(v: PT) {
					owner.dlgWrapper.value = v;
				},
				get loading(): boolean {
					return owner.loading;
				},
				set loading(v: boolean) {
					owner.loading = v;
				},
				close(closingButtonId?: StandardDialogButtonId | string) {
					owner.dlgWrapper.close(closingButtonId);
				}
			};
		})(this);

		this.loading = true;
		this.dialogContext.settings().then(settings => {
			this.dialogInfo.value = this.settings = settings;
			this.initialized = true;
			this.loading = false;
			this.buildSections();
		});
	}

	private buildSections() {
		this.pages = this.dialogContext.sections.map(s => {
			const providers: StaticProvider[] = [{
				provide: COMPARE_PRINT_DATA_TOKEN,
				useValue: this.dialogInfo.value
			}];
			if (s.providers) {
				providers.push(...s.providers);
			}
			return {
				section: s,
				injector: Injector.create({
					parent: this.injector,
					providers: providers
				})
			};
		});
	}

	public ngAfterViewInit() {
		this.render.addClass(this.elementRef.nativeElement, 'compare-print-body');
		this.render.addClass(this.elementRef.nativeElement, 'flex-element');
		this.render.addClass(this.elementRef.nativeElement, 'flex-box');
		this.render.addClass(this.elementRef.nativeElement, 'flex-column');
		this.render.addClass(this.elementRef.nativeElement, 'overflow-hidden');
	}

	public onLoadOptionChanged(value: string) {
		this.dialogContext.events?.loadModeChanged(value, this.settings);
	}

	public onGenericProfileChanged(value: IComparePrintProfileEntity) {
		this.dialogContext.events?.genericProfileChanged(value, this.settings);
	}

	public onRfqProfileChanged(value: IComparePrintProfileEntity) {
		this.dialogContext.events?.rfqProfileChanged(value, this.settings);
	}
}
