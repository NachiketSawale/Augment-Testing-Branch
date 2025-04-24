/**
 * Created by lvy on 8/15/2019.
 */
(function (angular) {
	'use strict';

	// eslint-disable-next-line no-redeclare
	/* global angular,_,globals */
	var moduleName = 'procurement.common';

	angular.module(moduleName).factory('prcCommonGetVatPercent', [
		'$http',
		'basicsLookupdataLookupDescriptorService',
		function (
			$http,
			basicsLookupdataLookupDescriptorService
		) {
			basicsLookupdataLookupDescriptorService.loadData(['MdcTaxCode']);
			$http.get(globals.webApiBaseUrl + 'basics/taxcode/taxcodeMatrix/gettaxcodematrixes').then(function (response) {
				basicsLookupdataLookupDescriptorService.addData('TaxCodeMatrixs', response.data);
			});

			function getVatPercent(taxCodeFk, vatGroupFk, dateContext) {
				const today = getFormatMomentDate(moment());
				dateContext = !dateContext ?
					today :
					(moment.isDate(dateContext) || moment.isMoment(dateContext) ?
						getFormatMomentDate(dateContext) :
						today
					);

				const taxCodeMatrixes = basicsLookupdataLookupDescriptorService.getData('TaxCodeMatrixs');
				if (!!taxCodeFk && !!vatGroupFk) {
					const matchItems = _.filter(taxCodeMatrixes, function (matrix) {
							if (matrix.MdcTaxCodeFk !== taxCodeFk || matrix.BpdVatgroupFk !== vatGroupFk) {
								return false;
							}

							return !!(
								(!matrix.ValidFrom && !matrix.ValidTo) ||
								(!matrix.ValidFrom && matrix.ValidTo && getFormatMomentDate(matrix.ValidTo).isSameOrAfter(dateContext)) ||
								(matrix.ValidFrom && !matrix.ValidTo && getFormatMomentDate(matrix.ValidFrom).isSameOrBefore(dateContext)) ||
								(getFormatMomentDate(matrix.ValidFrom).isSameOrBefore(dateContext) && getFormatMomentDate(matrix.ValidTo).isSameOrAfter(dateContext))
							)
						});

					if (matchItems?.length) {
						const matchItem = _.sortBy(matchItems, 'Id')[0];
						return matchItem.VatPercent * 1.0;
					}
				}
				var taxCodes = basicsLookupdataLookupDescriptorService.getData('MdcTaxCode');
				var taxCode = _.find(taxCodes, {Id: taxCodeFk});
				var vatPercent = taxCode ? taxCode.VatPercent : 0;
				return vatPercent * 1.0;
			}

			// TODO The function is used for the sales contract payment schedule, since Sales has not yet implemented the valid date logic. it will be removed once the valid date logic is implemented.
			function getVatPercentIgnoreDate(taxCodeFk, vatGroupFk) {
				if (!!taxCodeFk && !!vatGroupFk) {
					const taxCodeMatrices = basicsLookupdataLookupDescriptorService.getData('TaxCodeMatrixs');
					const matrixItem = _.find(taxCodeMatrices, {MdcTaxCodeFk: taxCodeFk, BpdVatgroupFk: vatGroupFk});
					if (matrixItem) {
						return matrixItem.VatPercent * 1.0;
					}
				}

				const taxCode = _.find(basicsLookupdataLookupDescriptorService.getData('MdcTaxCode'), {Id: taxCodeFk});
				const vatPercent = taxCode?.VatPercent ?? 0;
				return vatPercent * 1.0;
			}

			function getFormatMomentDate(date) {
				return moment(moment(date).format('YYYY-MM-DD'));
			}

			return {
				getVatPercent: getVatPercent,
				getVatPercentIgnoreDate: getVatPercentIgnoreDate
			};
		}
	]);

})(angular);