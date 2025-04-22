/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { AfterViewInit, Component, Injector, QueryList, StaticProvider, ViewChildren, ViewContainerRef, inject } from '@angular/core';

import { DomainControlBaseComponent } from '../domain-control-base/domain-control-base.component';

import { UiFieldHelperService } from '../../../services/ui-field-helper.service';
import { DomainControlInfoService } from '../../services/domain-control-info.service';

import { PropertyType } from '@libs/platform/common';

import { CompositeControlInfo } from '../../model/composite/classes/composite-control-info.class';
import { CompositeControlContext } from '../../model/composite/classes/composite-control-context.class';
import { CompositeControlContextMap } from '../../model/composite/classes/composite-control-context-map.class';

import { IField } from '../../../model/fields/field.interface';
import { ControlContextInjectionToken } from '../../model/control-context.interface';
import { ICompositeControlContext } from '../../model/composite-control-context.interface';
import { ICompositeControlOwner } from '../../model/composite/interfaces/composite-control-owner.interface';

/**
 * The composite control shows multiple domain controls side by side.
 */
@Component({
	selector: 'ui-common-composite',
	templateUrl: './composite.component.html',
	styleUrls: ['./composite.component.scss'],
})
export class CompositeComponent<T extends object> extends DomainControlBaseComponent<PropertyType, ICompositeControlContext<T>> implements AfterViewInit {
	/**
	 * Stores control context.
	 */
	private readonly compositeContext = new CompositeControlContextMap<T>();

	/**
	 * Provides utility routines for working with fields
	 */
	private readonly uiFieldHelperSvc = inject(UiFieldHelperService);

	/**
	 * Provides information related to domain controls and the underlying types.
	 */
	private readonly domainControlInfoSvc = inject(DomainControlInfoService);

	/**
	 * Injectors are configured with providers that associate dependencies of various types with injection tokens.
	 */
	private readonly injector = inject(Injector);

	/**
	 * A set of links to the form components. Reserved for internal use by the template.
	 */
	@ViewChildren('fieldCtl', { read: ViewContainerRef })
	private inputControls!: QueryList<ViewContainerRef>;

	public constructor() {
		super();
	}

	/**
	 * Inits composite control.
	 */
	public ngAfterViewInit() {
		const ctls = this.inputControls.toArray();
		const controlsData = this.getControlsData();

		for (let i = 0; i < this.controlContext.composite.length; i++) {
			const ctl = ctls[i];
			const controlData = controlsData[i];

			const dcInfo = this.domainControlInfoSvc.getComponentInfoByFieldType(controlData.controlField.type);

			const dcProviders: StaticProvider[] = [
				{
					provide: ControlContextInjectionToken,
					useValue: controlData.context,
				},
			];

			if (dcInfo.providers) {
				dcProviders.push(...dcInfo.providers);
			}

			const newCmp = ctl.createComponent(dcInfo.componentType, {
				injector: Injector.create({
					providers: dcProviders,
					parent: this.injector,
				}),
			});

			newCmp.changeDetectorRef.detectChanges();
		}
	}

	/**
	 * Method creates the control context and returns it.
	 *
	 * @param {IField<T>} control Control data.
	 * @returns {CompositeControlContext<T>} Control context.
	 */
	private getControlContext(control: IField<T>): CompositeControlContext<T> {
		const controlContext = this.controlContext as unknown as {
			[key: string]: unknown;
		};

		const owner = controlContext['owner'];

		const context = new CompositeControlContext(owner as ICompositeControlOwner<T>, control, { totalCount: this.controlContext.composite.length, entity: (owner as ICompositeControlOwner<T>).entity });

		const controlData = control as unknown as {
			[key: string]: unknown;
		};

		for (const additionalField of this.domainControlInfoSvc.getAdditionalConfigFields(control.type)) {
			if (Object.prototype.hasOwnProperty.call(controlData, additionalField)) {
				context[additionalField] = controlData[additionalField];
			}
		}

		return context;
	}

	/**
	 * Method returns control information.
	 *
	 * @param {IField<T>} control Control data.
	 * @returns { CompositeControlInfo<T>} Control information.
	 */
	private getControlData(control: IField<T>): CompositeControlInfo<T> {
		let controlData = this.compositeContext[control.id];

		if (!controlData) {
			controlData = new CompositeControlInfo(control, this.getControlContext(control));
			this.compositeContext[control.id] = controlData;
		}

		return controlData;
	}

	/**
	 * Method returns information of controls provided in composite.
	 *
	 * @returns {CompositeControlInfo<T>[]} Information of controls provided in composite.
	 */
	public getControlsData(): CompositeControlInfo<T>[] {
		if (!this.controlContext.composite.length) {
			return [];
		}

		const controlsData: CompositeControlInfo<T>[] = [];

		const sortedGroupControls = this.uiFieldHelperSvc.sortFields<T, IField<T>>(this.controlContext.composite);

		sortedGroupControls.forEach((control) => {
			const info = this.getControlData(control);
			controlsData.push(info);
		});

		return controlsData;
	}
}
