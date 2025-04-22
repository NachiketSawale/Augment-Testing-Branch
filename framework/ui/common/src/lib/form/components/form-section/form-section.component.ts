/*
 * Copyright(c) RIB Software GmbH
 */

import {
	AfterViewInit,
	Component,
	Injector,
	QueryList,
	StaticProvider,
	ViewChildren,
	ViewContainerRef,
	ViewEncapsulation
} from '@angular/core';
import { FormGroupInfo } from '../../model/internal/form-group-info.class';
import { FormRowInfo } from '../../model/internal/form-row-info.class';
import { DomainControlInfoService } from '../../../domain-controls/services/domain-control-info.service';
import { ControlContextInjectionToken } from '../../../domain-controls/model/control-context.interface';
import { FormDisplayMode } from '../../model/form-display-mode.enum';

/**
 * Displays a set of input controls based on an {@link IFormConfig} object.
 * This component is exclusively used internally by the {@link FormComponent}.
 */
@Component({
	selector: 'ui-common-form-section',
	templateUrl: './form-section.component.html',
	styleUrls: ['./form-section.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class FormSectionComponent<T extends object> implements AfterViewInit {

	public displayMode: FormDisplayMode = FormDisplayMode.TwoColumns;

	public constructor(
		private readonly formGroupInfo: FormGroupInfo<T>,
		private readonly injector: Injector,
		private readonly domainControlInfoSvc: DomainControlInfoService
	) {
	}

	public ngAfterViewInit() {
		this.contextInfo.entity = this.formGroupInfo.owner.entity;
		this.displayMode = this.formGroupInfo.owner.displayMode;

		const rows = this.getFormRows();
		const ctls = this.inputControls.toArray();
		for (let i = 0; i < rows.length && i < ctls.length; i++) {
			const ctl = ctls[i];
			const rowInfo = rows[i];

			const dcInfo = this.domainControlInfoSvc.getComponentInfoByFieldType(rowInfo.row.type);

			const dcProviders: StaticProvider[] = [{
				provide: ControlContextInjectionToken,
				useValue: rowInfo.context
			}];
			if (dcInfo.providers) {
				dcProviders.push(...dcInfo.providers);
			}

			const newCmp = ctl.createComponent(dcInfo.componentType, {
				injector: Injector.create({
					providers: dcProviders,
					parent: this.injector,
				})
			});
			newCmp.changeDetectorRef.detectChanges(); //.hostView.detectChanges();
		}
	}

	private readonly contextInfo: {
		entity: unknown
	} = {
			entity: null
		};

	/**
	 * A set of links to the form components.
	 * Reserved for internal use by the template.
	 */
	@ViewChildren('formCtl', {read: ViewContainerRef})
	public inputControls!: QueryList<ViewContainerRef>;

	public getFormRows(): FormRowInfo<T>[] {
		return this.formGroupInfo.getFormRows();
	}

	/**
	 * Establishes identity of a row in the form.
	 * @param index The index of the row.
	 * @param rowInfo The row info object.
	 */
	public trackByRow(index: number, rowInfo: FormRowInfo<T>): string {
		return rowInfo.row.id;
	}

	protected readonly FormDisplayMode = FormDisplayMode;
}