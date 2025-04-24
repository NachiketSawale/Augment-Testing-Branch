/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { IEntityIdentification, PropertyType, Translatable } from '@libs/platform/common';
import { BasicsSharedEntityFilterBase } from '../entity-filter-base/entity-filter-base';
import { ENTITY_FILTER_DOMAIN, IEntityFilterDomain } from '../../model';
import { Subscription } from 'rxjs';

/**
 * Component representing the entity filter domain.
 */
@Component({
	selector: 'basics-shared-entity-filter-domain',
	templateUrl: './entity-filter-domain.component.html',
	styleUrl: './entity-filter-domain.component.scss',
})
export class BasicsSharedEntityFilterDomainComponent<TFactor extends PropertyType, TEntity extends IEntityIdentification> extends BasicsSharedEntityFilterBase<TFactor, TEntity> implements OnInit, OnDestroy {
	private readonly subscriptions: Subscription[] = [];
	/**
	 * The injected entity filter domain.
	 * @protected
	 */
	protected readonly domain = inject(ENTITY_FILTER_DOMAIN) as IEntityFilterDomain<TFactor>;

	/**
	 * Initializes the component and sets up the popup closing event handler.
	 */
	public ngOnInit() {
		this.initialize();

		this.subscriptions.push(
			this.popup.closing.subscribe((e) => {
				if (e.reason instanceof MouseEvent) {
					// Prevent closing the popup if the date picker is open
					e.canClose = !document.querySelector('ui-common-datepicker');
				}
			}),
		);
	}

	/**
	 * Cleans up the component and unsubscribes from all subscriptions.
	 */
	public ngOnDestroy() {
		this.subscriptions.forEach((s) => s.unsubscribe());
	}

	/**
	 * Validates the range between the start and end values.
	 * @template T - The type of the start and end values.
	 * @param {T} start - The start value of the range.
	 * @param {T} end - The end value of the range.
	 * @param {number} index - The index of the factor being validated.
	 * @returns {string | null | undefined} The validation error message, or null/undefined if no error.
	 * @protected
	 * @override
	 */
	protected override validateRange(start: TFactor, end: TFactor, index: number): Translatable | null | undefined {
		if (!this.domain.comparer) {
			throw new Error('Comparer is not defined');
		}

		if (!this.domain.rangeErrors) {
			throw new Error('rangeErrors is not defined');
		}

		if (start == null || end == null) {
			return;
		}

		const result = this.domain.comparer(start, end);

		if (result > 0) {
			return index === 0 ? this.domain.rangeErrors.min : this.domain.rangeErrors.max;
		}

		if (result === 0) {
			return this.domain.rangeErrors.identical;
		}

		return;
	}
}
