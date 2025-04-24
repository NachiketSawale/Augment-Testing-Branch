/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { add, endOfMonth, getDate, getDaysInMonth, setDate } from 'date-fns';
import { IPaymentTermEntity } from '../../lookup-services/payment-term-lookup.service';
import { PaymentTermCalculationType } from '../../model/enums/payment-term-calculation-type.enum';

/**
 * Payment term calculate date result interface
 */
export interface IPaymentTermCalculateDate {
	dateDiscount: Date | null,
	dateNetPayable: Date | null
}

/**
 * Payment term calculation service
 */
@Injectable({
	providedIn: 'root'
})
export class PaymentTermCalculationService {

	/**
	 * Calculate Date
	 * @param baseDate
	 * @param paymentTerm
	 */
	public calculateDate(baseDate: Date, paymentTerm: IPaymentTermEntity): IPaymentTermCalculateDate {
		const paymentTermCalTypes = Object.values(PaymentTermCalculationType) as number[];

		if (!baseDate || !paymentTermCalTypes.includes(paymentTerm.CalculationTypeFk)) {
			return {
				dateDiscount: null,
				dateNetPayable: null
			};
		}

		return {
			dateDiscount: this.calculateDiscountDate(baseDate, paymentTerm),
			dateNetPayable: this.calculateNetPayableDate(baseDate, paymentTerm)
		};
	}

	private calculateDiscountDate(baseDate: Date, paymentTerm: IPaymentTermEntity): Date | null {
		return (paymentTerm.DiscountDays === 0 || paymentTerm.DiscountPercent === 0) ?
			null :
			add(baseDate, {days: paymentTerm.DiscountDays});
	}

	private calculateNetPayableDate(baseDate: Date, paymentTerm: IPaymentTermEntity): Date | null {
		let netPayableDate: Date | null = null;
		switch (paymentTerm.CalculationTypeFk) {
			case PaymentTermCalculationType.DayOfMonth:
				netPayableDate = this.calculateNetPayableDateByDayOfMonthType(baseDate, paymentTerm);
				break;
			case PaymentTermCalculationType.DaysBetween:
				netPayableDate = add(baseDate, {days: paymentTerm.NetDays});
				break;
			case PaymentTermCalculationType.DayOfFollowingMonth:
				netPayableDate = endOfMonth((add(baseDate, {months: 1})));
				if (getDate(netPayableDate) > paymentTerm.DayOfMonth) {
					netPayableDate = setDate(netPayableDate, paymentTerm.DayOfMonth);
				}
				break;
			default:
				break;
		}

		return netPayableDate;
	}

	private calculateNetPayableDateByDayOfMonthType(baseDate: Date, paymentTerm: IPaymentTermEntity): Date {
		let netPayableDate = add(baseDate, {days: paymentTerm.NetDays});

		if (paymentTerm.Month > 0) {
			netPayableDate = add(netPayableDate, {months: paymentTerm.Month});
			netPayableDate = getDaysInMonth(netPayableDate) < paymentTerm.DayOfMonth ?
				endOfMonth(netPayableDate) :
				setDate(netPayableDate, paymentTerm.DayOfMonth);
		} else {
			if (getDate(netPayableDate) > paymentTerm.DayOfMonth) {
				netPayableDate = add(netPayableDate, {months: 1});
			}
			netPayableDate = endOfMonth(netPayableDate);
			if (getDate(netPayableDate) > paymentTerm.DayOfMonth) {
				netPayableDate = setDate(netPayableDate, paymentTerm.DayOfMonth);
			}
		}

		return netPayableDate;
	}
}