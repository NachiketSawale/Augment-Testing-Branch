/*
 * Copyright(c) RIB Software GmbH
 */

import { IPaymentScheduleBaseEntity } from '@libs/basics/interfaces';
import { prefixAllTranslationKeys, Translatable } from '@libs/platform/common';
import { BasicsSharedPaymentTermLookupService } from '../../lookup-services/payment-term-lookup.service';
import { createLookup, FieldOverloadSpec, FieldType, ILayoutConfiguration, ILayoutGroup } from '@libs/ui/common';

/**
 * Payment schedule basics layout service
 */
export abstract class BasicsSharedPaymentScheduleLayoutService<T extends IPaymentScheduleBaseEntity> {
	/**
	 * The constructor
	 * @param customLayout
	 * @protected
	 */
	protected constructor(protected customLayout?: ILayoutConfiguration<T>) {
	}

	/**
	 * Generate layout
	 */
	public generateLayout(): ILayoutConfiguration<T> {
		this.mergeCustomToLayout();
		return this.layout;
	}

	private readonly layout = {
		groups: [{
			gid: 'basicData',
			title: {text: 'Basic Data', key: 'cloud.common.entityProperties'},
			attributes: [
				'Code',
				'DatePayment',
				'DateRequest',
				'PercentOfContract',
				'AmountNet',
				'AmountNetOc',
				'AmountGross',
				'AmountGrossOc',
				'CommentText',/*
				'PsdActivityFk',
				'PsdScheduleFk',*/
				'BasPaymentTermFk',
				'PaymentVersion',
				'MeasuredPerformance',
				'IsDone',
				'Sorting',
			]
		}],
		labels: {
			...prefixAllTranslationKeys('cloud.common.', {
				'Sorting': {text: 'Sorting', key: 'entitySorting'}
			}),
			...prefixAllTranslationKeys('procurement.common.', {
				'Code': {text: 'Code', key: 'paymentCode'},
				'DatePayment': {text: 'Payment Date', key: 'paymentDatePayment'},
				'DateRequest': {text: 'Request Date', key: 'paymentDateRequest'},
				'PercentOfContract': {text: 'Percent', key: 'paymentPercentOfContract'},
				'AmountNet': {text: 'Net Amount', key: 'paymentAmountNet'},
				'AmountNetOc': {text: 'Net Amount Oc', key: 'paymentAmountNetOc'},
				'AmountGross': {text: 'Gross Amount', key: 'paymentAmountGross'},
				'AmountGrossOc': {text: 'Gross Amount Oc', key: 'paymentAmountGrossOc'},
				'CommentText': {text: 'Comment Text', key: 'paymentCommentText'},
				'PsdActivityFk': {text: 'Activity', key: 'paymentPsdActivityFk'},
				'PsdScheduleFk': {text: 'Schedule', key: 'paymentPsdScheduleFk'},
				'BasPaymentTermFk': {text: 'Payment Term', key: 'paymentTerm'},
				'MeasuredPerformance': {text: 'Measured Performance %', key: 'paymentmeasuredperformance'},
				'IsDone': {text: 'Is Done', key: 'paymentIsDone'}
			})
		},
		overloads: {
			BasPaymentTermFk: {
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedPaymentTermLookupService,
					showClearButton: true,
					showDescription: true,
					descriptionMember: 'Description'
				})
			}
		}
	} as ILayoutConfiguration<T>;

	private mergeCustomToLayout() {
		if (this.customLayout) {
			this.mergeGroup(this.customLayout.groups);
			this.mergeLabel(this.customLayout.labels);
			this.mergeOverLoads(this.customLayout.overloads);
		}
	}

	private mergeGroup(customGroups?: ILayoutGroup<T>[]) {
		customGroups?.forEach(customGrp => {
			const group = this.layout.groups?.find(g => g.gid === customGrp.gid);
			if (group) {
				group.attributes = [...group.attributes, ...customGrp.attributes];
			} else {
				this.layout.groups?.push(customGrp);
			}
		});
	}

	private mergeLabel(customLabels?: { [key: string]: Translatable }) {
		if (customLabels) {
			for (const customKey in customLabels) {
				if (this.layout.labels) {
					this.layout.labels[customKey] = customLabels[customKey];
				}
			}
		}
	}

	private mergeOverLoads(customOverloads?: { [key in keyof Partial<T>]: FieldOverloadSpec<T> }) {
		if (customOverloads) {
			for (const customKey in customOverloads) {
				if (this.layout.overloads) {
					this.layout.overloads[customKey] = customOverloads[customKey];
				}
			}
		}
	}
}