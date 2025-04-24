/*
 * Copyright(c) RIB Software GmbH
 */

import { AfterViewInit, Component, ElementRef, EventEmitter, inject, ViewChild } from '@angular/core';
import { ActivePopup, ControlContextInjectionToken, ILookupViewResult, PopupService } from '@libs/ui/common';
import { EstimateMainDetailVariablesPopupComponent, KeyFilterEventToken } from '../detail-column-popup/estimate-main-detail-variables-popup.component';
import { Subscription } from 'rxjs';
import { IVariablesEntity } from '../detail-column-popup/estimate-main-detail-variables-entity.interface';
import { StringHandleHelperService } from '@libs/basics/shared';


@Component({
	templateUrl: 'estimate-main-detail-column.component.html',
	styleUrl: 'estimate-main-detail-column.component.scss',
})
export class EstimateMainDetailColumnComponent implements AfterViewInit{

	protected readonly controlContext = inject(ControlContextInjectionToken);
	private readonly popupService = inject(PopupService);
	protected activePopup?: ActivePopup;
	private subscriptionMap = new Map<string, Subscription>();
	private keyFilterEvent = new EventEmitter<string>();
	private readonly stringHelper = inject(StringHandleHelperService);

	@ViewChild('variables_input') public inputWidRef!: ElementRef;

	public ngAfterViewInit(): void {
		const inputBox = this.inputWidRef.nativeElement;
		inputBox.onkeyup = (ev: KeyboardEvent) => {
			let val = inputBox.value ? inputBox.value as string : '';
			val = this.stringHelper.getSelectionVariables(val, inputBox.selectionStart, inputBox.selectionEnd);
			this.keyFilterEvent.emit(val);
		};
	}


	protected openVariablesPopup(e: Event): void {
		e.stopPropagation();

		if(this.activePopup){
			this.destroy();
			return;
		}

		const popupOptions = {
			providers: [
				{provide: ControlContextInjectionToken, useValue: this.controlContext},
				{provide: KeyFilterEventToken, useValue: this.keyFilterEvent}
			],
			width: 500,
			height: 300,
			resizable: true
		};
		this.activePopup = this.popupService.toggle(this.inputWidRef, EstimateMainDetailVariablesPopupComponent, popupOptions) as ActivePopup;


		this.subscriptionMap.set('variableWidClose', this.activePopup.closed.subscribe(res=>{
			const result = res as ILookupViewResult<IVariablesEntity>;

			if(result && result.apply && result.result){
				const inputBox = this.inputWidRef.nativeElement;
				inputBox.value = this.stringHelper.appendVariables(inputBox.value, result.result.Code, inputBox.selectionStart, inputBox.selectionEnd);
				this.controlContext.value= inputBox.value;
			}

			if(this.activePopup){
				this.destroy();
			}
		}));
	}

	public destroy() {
		if (this.activePopup) {
			this.activePopup.destroy();
			this.activePopup = undefined;
		}

		this.subscriptionMap.forEach(e => {
			if (!e.closed) {
				e.unsubscribe();
			}
		});
		this.subscriptionMap.clear();
	}
}