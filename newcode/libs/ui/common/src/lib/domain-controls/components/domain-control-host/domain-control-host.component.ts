/*
 * Copyright(c) RIB Software GmbH
 */

import {
	AfterViewInit,
	Component,
	EventEmitter,
	inject,
	Injector,
	Input,
	Output,
	StaticProvider,
	ViewChild,
	ViewContainerRef
} from '@angular/core';
import {
	IEntityContext,
	MinimalEntityContext,
	PropertyType
} from '@libs/platform/common';
import { DomainControlInfoService } from '../../services/domain-control-info.service';
import { ControlContextInjectionToken, IControlContext } from '../../model/control-context.interface';
import { ValidationResult } from '@libs/platform/data-access';
import {
	FieldType,
	getAdditionalConfigFieldsForType,
	AdditionalOptions
} from '../../../model/fields';
import { ControlContextBase } from '../../model/control-context-base.class';

class HostedControlContext<T extends PropertyType> extends ControlContextBase {

	public constructor(private readonly owner: DomainControlHostComponent<T>) {
		super();

		const eCtx = new MinimalEntityContext<object>();
		eCtx.entity = {} as object;
		this.entityContext = eCtx;
	}

	protected override get internalValue(): T | undefined {
		return this.owner.value;
	}

	protected override set internalValue(newValue: T | undefined) {
		this.owner.value = newValue;
		this.owner.valueChange.emit(newValue);
	}

	public override get fieldId(): string {
		return 'hosted';
	}

	public override get readonly(): boolean {
		return this.owner.readOnly;
	}

	protected override get internalValidationResults(): ValidationResult[] {
		return [];
	}

	public readonly entityContext: IEntityContext<object>;
}

/**
 * A component that is not a domain control itself, but that can host a domain control.
 */
@Component({
	selector: 'ui-common-domain-control-host',
	templateUrl: './domain-control-host.component.html',
	styleUrls: ['./domain-control-host.component.css']
})
export class DomainControlHostComponent<T extends PropertyType> implements AfterViewInit {

	private readonly domainCtlInfoSvc = inject(DomainControlInfoService);
	private readonly injector = inject(Injector);

	private _fieldType?: FieldType;

	/**
	 * This method is invoked once the view has been initialized.
	 */
	public ngAfterViewInit() {
		this.updateControl();
	}

	/**
	 * Sets the field type for which an appropriate domain control is to be shown.
	 */
	@Input()
	public set fieldType(value: FieldType | undefined) {
		if (this._fieldType !== value) {
			this._fieldType = value;
			this.updateControl();
		}
	}

	/**
	 * Gets the field type for which an appropriate domain control is to be shown.
	 */
	public get fieldType(): FieldType | undefined {
		return this._fieldType;
	}

	/**
	 * Sets the control context for the domain control is to be shown.
	 */
	@Input()
	public set controlContext(value: IControlContext | undefined) {
		this._currentCtlContext = value;
		this.updateControl();
	}

	/**
	 * Gets the control context for the domain control to be shown.
	 */
	public get controlContext(): IControlContext | undefined {
		return this._currentCtlContext;
	}

	private _currentCtlContext?: IControlContext;

	private copyAdditionalOptions() {
		if (this._currentCtlContext && this._options && this._fieldType) {
			const src = this._options as unknown as {
				[key: string]: unknown;
			};

			const dest = this._currentCtlContext as unknown as {
				[key: string]: unknown;
			};

			for (const additionalField of getAdditionalConfigFieldsForType(this._fieldType)) {
				if (Object.prototype.hasOwnProperty.call(src, additionalField)) {
					dest[additionalField] = src[additionalField];
				}
			}
		}
	}

	private updateControl() {
		if (!this.control) {
			return;
		}

		if (!this._fieldType) {
			if (this.control) {
				this.control.clear();
				this._currentCtlContext = undefined;
			}

			return;
		}

		const dcInfo = this.domainCtlInfoSvc.getComponentInfoByFieldType(this._fieldType);

		if (!this._currentCtlContext) {
			this._currentCtlContext = new HostedControlContext(this);
		}

		this.copyAdditionalOptions();

		const dcProviders: StaticProvider[] = [{
			provide: ControlContextInjectionToken,
			useValue: this._currentCtlContext
		}];
		if (dcInfo.providers) {
			dcProviders.push(...dcInfo.providers);
		}

		if(this.control.length > 0) {
			this.control.clear();
		}

		const newCmp = this.control.createComponent(dcInfo.componentType, {
			injector: Injector.create({
				providers: dcProviders,
				parent: this.injector,
			})
		});
		newCmp.changeDetectorRef.detectChanges();
	}

	/**
	 * Gets or sets the current value to display in the control.
	 */
	@Input()
	public value?: T;

	/**
	 * Event emitter for value changes.
	 */
	@Output() public valueChange = new EventEmitter<T>();

	/**
	 * Gets or sets a value that indicates whether the control should be write-protected.
	 */
	@Input()
	public readOnly: boolean = false;

	private _options?: AdditionalOptions<object>;

	/**
	 * Gets an object with additional options stored for the displayed domain control.
	 * Invoking code is responsible for supplying the appropriate options here.
	 */
	public get options(): AdditionalOptions<object> | undefined {
		return this._options;
	}

	/**
	 * Sets an object with additional options stored for the displayed domain control.
	 * Invoking code is responsible for supplying the appropriate options here.
	 */
	@Input()
	public set options(value: AdditionalOptions<object> | undefined) {
		this._options = value;
		this.copyAdditionalOptions();
	}

	/**
	 * Gets or sets the domain control in the template.
	 */
	@ViewChild('domainCtl', {read: ViewContainerRef})
	public control!: ViewContainerRef;
}
