/*
 * Copyright(c) RIB Software GmbH
 */

import { Component } from '@angular/core';
import { DomainControlBaseComponent } from '../domain-control-base/domain-control-base.component';
import { IIdentificationData, ReferenceFormat, ReferenceType } from '@libs/platform/common';
import { ILookupControlContext } from '../../model/lookup-control-context.interface';
import {GridControlContext} from '../../../grid/components/grid/grid.component';

/**
 * A domain control that hosts a lookup UI control.
 */
@Component({
	selector: 'ui-common-lookup-host',
	templateUrl: './lookup-host.component.html',
	styleUrls: ['./lookup-host.component.css']
})
export class LookupHostComponent<T extends object> extends DomainControlBaseComponent<ReferenceType, ILookupControlContext<T>> {

	protected usedAsGridEditor = false;

	/**
	 * Initializes a new instance.
	 */
	public constructor() {
		super();

		// TODO - not sure if this approach is a good way to deal with this requirement
		// need to know where the lookup is used, form or grid? they share same options but there will be a little different style and behavior between them
		this.usedAsGridEditor = this.controlContext instanceof GridControlContext;
	}

	/**
	 * Retrieves the current value stored in the lookup.
	 */
	public get value(): ReferenceType | null {
		if (this.controlContext.value === undefined) {
			return null;
		}

		switch (this.effectiveReferenceFormat) {
			case ReferenceFormat.Integer:
				return this.controlContext.value as number;
			case ReferenceFormat.IdentificationData:
				return this.controlContext.value as IIdentificationData;
		}
	}

	/**
	 * Modifies the current value stored in the lookup.
	 * @param value The new value.
	 */
	public set value(value: ReferenceType | null) {
		if (value === null) {
			this.controlContext.value = undefined;
		} else {
			switch (this.effectiveReferenceFormat) {
				case ReferenceFormat.Integer:
					this.controlContext.value = value as number;
					break;
				case ReferenceFormat.IdentificationData:
					this.controlContext.value = value as IIdentificationData;
					break;
			}
		}
	}

	/**
	 * Retrieves the current value stored in the lookup as an integer ID.
	 */
	public get integerValue(): number | null {
		if (!this.usesIntegerReferences) {
			throw new Error('This lookup is not using integer mode.');
		}

		return this.value as number;
	}

	/**
	 * Modifies the current value stored in the lookup as an integer ID.
	 * @param value The new reference ID.
	 */
	public set integerValue(value: number | null) {
		if (!this.usesIntegerReferences) {
			throw new Error('This lookup is not using integer mode.');
		}

		this.value = value;
	}

	/**
	 * Retrieves the current value stored in the lookup as an identification data object.
	 */
	public get compositeValue(): IIdentificationData | null | undefined {
		if (!this.usesIdentificationDataReferences) {
			throw new Error('This lookup is not using identification data mode.');
		}

		return this.value as IIdentificationData | null;
	}

	/**
	 * Modifies the current value stored in the lookup as an identification data object.
	 * @param value The new value.
	 */
	public set compositeValue(value: IIdentificationData | null | undefined) {
		if (!this.usesIdentificationDataReferences) {
			throw new Error('This lookup is not using identification data mode.');
		}

		this.value = value ?? null;
	}

	/**
	 * Returns the effective reference format used by the lookup.
	 * This format determines the value type used to read and store the lookup value.
	 */
	public get effectiveReferenceFormat(): ReferenceFormat {
		return this.controlContext.format ?? ReferenceFormat.Integer;
	}

	/**
	 * Indicates whether the lookup is configured to use integer references.
	 */
	public get usesIntegerReferences(): boolean {
		return this.effectiveReferenceFormat === ReferenceFormat.Integer;
	}

	/**
	 * Indicates whether the lookup is configured to use identification data references.
	 */
	public get usesIdentificationDataReferences(): boolean {
		return this.effectiveReferenceFormat === ReferenceFormat.IdentificationData;
	}
}
