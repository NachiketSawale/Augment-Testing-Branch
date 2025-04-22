/*
 * Copyright(c) RIB Software GmbH
 */

export const Constants = {
	maxValueIncludeTarget: 'MaximumValue',                     // max value in bidders and BaseBoq and Target
	minValueIncludeTarget: 'MinimumValue',                     // min value in bidders and BaseBoq and Target
	averageValueIncludeTarget: 'AverageValue',                 // average value in bidders and BaseBoq and Target
	maxValueExcludeTarget: 'MaxValueExcludeTarget',            // max value only in bidders (exclude BaseBoq and Target)
	minValueExcludeTarget: 'MinValueExcludeTarget',            // min value only in bidders (exclude BaseBoq and Target)
	averageValueExcludeTarget: 'AverageValueExcludeTarget',    // average value only in bidders (exclude BaseBoq and Target)
	compareDescription: 'CompareDescription',   // filed value of 'Compare Description' column
	rowType: 'rowType',                         // type for compare filed row (item.rowType = 'Price/ UnitRateFrom')
	tagForNoQuote: '-',                         // just show this tag if the bidder has no quote value for prcItem/BoqItem's properties
	tagForValueSeparator: '/',                  // tag for column 'Compare Description' values' separator.
	prefix2: 'QuoteCol',                        // used to difine dynamic boq quote columns
	columnFieldSeparator: '_',                  // column definition field separator
	newCustomColumnVale: -3,                    // related to baseBoqValue. less then baseBoqValue.
	rfqCharacteristicGroup: 'RfqCharacteristicGroup',   // rfq characteristic group data
	rfqCharacteristic: 'RfqCharacteristic',             // rfq characteristic data
	quoteCharacteristic: 'QuoteCharacteristic',          // quote characteristic data
	highlightQtn: 'HighlightQtn',
	deviationColumn: 'DeviationColumn',
	deviationRow: 'DeviationRow',
	generals: 'Generals',
	characteristics: 'Characteristics'
};