// eslint-disable-next-line no-redeclare
/* global angular */

(function (angular) {
	'use strict';

	var modName = 'procurement.common';
	angular.module(modName).factory('procurementCommonAccrualLayoutService', ['basicsCommonComplexFormatter',
		function (basicsCommonComplexFormatter) {
			return {
				addition: function () {

					var array = {
						grid: extendGrouping([
							{
								'id': 'transHeader',
								'field': 'CompanyTransaction.CompanyTransHeader',
								'name': 'Transaction Header',
								'name$tr$': 'procurement.pes.transaction.transHeader',
								'formatter': basicsCommonComplexFormatter,
								'sortable': true
							},
							{
								'id': 'transDocType',
								'field': 'CompanyTransaction.DocumentType',
								'name': 'Document Type',
								'name$tr$': 'procurement.pes.transaction.documentType',
								'formatter': basicsCommonComplexFormatter,
								'sortable': true
							},
							{
								'id': 'transCurrency',
								'field': 'CompanyTransaction.Currency',
								'name': 'Currency',
								'name$tr$': 'procurement.pes.transaction.currency',
								'formatter': basicsCommonComplexFormatter,
								'sortable': true
							},
							{
								'id': 'transPostingDate',
								'field': 'CompanyTransaction',
								'name': 'Posting Date',
								'name$tr$': 'procurement.pes.transaction.postingDate',
								'formatter': basicsCommonComplexFormatter,
								'formatterOptions': {
									'displayMember': 'PostingDate',
									'domainType': 'dateutc'
								},
								'sortable': true
							},
							{
								'id': 'transVoucherNumber',
								'field': 'CompanyTransaction.VoucherNumber',
								'name': 'Voucher Number',
								'name$tr$': 'procurement.pes.transaction.voucherNumber',
								'formatter': basicsCommonComplexFormatter,
								'sortable': true
							},
							{
								'id': 'transVoucherDate',
								'field': 'CompanyTransaction',
								'name': 'Voucher Date',
								'name$tr$': 'procurement.pes.transaction.voucherDate',
								'formatter': basicsCommonComplexFormatter,
								'formatterOptions': {
									'displayMember': 'VoucherDate',
									'domainType': 'dateutc'
								},
								'sortable': true
							},
							{
								'id': 'transAccount',
								'field': 'CompanyTransaction.Account',
								'name': 'Account',
								'name$tr$': 'procurement.pes.transaction.account',
								'formatter': basicsCommonComplexFormatter,
								'sortable': true
							},
							{
								'id': 'transOffsetAccount',
								'field': 'CompanyTransaction.OffsetAccount',
								'name': 'Offset Account',
								'name$tr$': 'procurement.pes.transaction.offsetAccount',
								'formatter': basicsCommonComplexFormatter,
								'sortable': true
							},
							{
								'id': 'transPostingNarritive',
								'field': 'CompanyTransaction.PostingNarritive',
								'name': 'Posting Narritive',
								'name$tr$': 'procurement.pes.transaction.postingNarritive',
								'formatter': basicsCommonComplexFormatter,
								'sortable': true
							},
							{
								'id': 'transAmount',
								'field': 'CompanyTransaction',
								'name': 'Amount',
								'name$tr$': 'procurement.pes.transaction.amount',
								'formatter': basicsCommonComplexFormatter,
								'formatterOptions': {
									'displayMember': 'Amount',
									'domainType': 'money'
								},
								'sortable': true
							},
							{
								'id': 'transAmountOc',
								'field': 'CompanyTransaction',
								'name': 'Amount Oc',
								'name$tr$': 'procurement.pes.transaction.amountOc',
								'formatter': basicsCommonComplexFormatter,
								'formatterOptions': {
									'displayMember': 'AmountOc',
									'domainType': 'money'
								},
								'sortable': true
							},
							{
								'id': 'transQuantity',
								'field': 'CompanyTransaction',
								'name': 'Quantity',
								'name$tr$': 'procurement.pes.transaction.quantity',
								'formatter': basicsCommonComplexFormatter,
								'formatterOptions': {
									'displayMember': 'Quantity',
									'domainType': 'quantity'
								},
								'sortable': true
							},
							{
								'id': 'transControllingUnitCode',
								'field': 'CompanyTransaction.ControllingUnitCode',
								'name': 'Controlling Unit Code',
								'name$tr$': 'procurement.pes.transaction.controllingUnitCode',
								'formatter': basicsCommonComplexFormatter,
								'sortable': true
							},
							{
								'id': 'transControllingUnitAssign01',
								'field': 'CompanyTransaction.ControllingUnitAssign01',
								'name': 'Controlling Unit Assign 01',
								'name$tr$': 'procurement.pes.transaction.controllingUnitAssign01',
								'formatter': basicsCommonComplexFormatter,
								'sortable': true
							},
							{
								'id': 'transControllingUnitAssign01Desc',
								'field': 'CompanyTransaction.ControllingUnitAssign01Desc',
								'name': 'Controlling Unit Assign 01 Description',
								'name$tr$': 'procurement.pes.transaction.controllingUnitAssign01Desc',
								'formatter': basicsCommonComplexFormatter,
								'sortable': true
							},
							{
								'id': 'transControllingUnitAssign02',
								'field': 'CompanyTransaction.ControllingUnitAssign02',
								'name': 'Controlling Unit Assign 02',
								'name$tr$': 'procurement.pes.transaction.controllingUnitAssign02',
								'formatter': basicsCommonComplexFormatter,
								'sortable': true
							},
							{
								'id': 'transControllingUnitAssign02Desc',
								'field': 'CompanyTransaction.ControllingUnitAssign02Desc',
								'name': 'Controlling Unit Assign 02 Description',
								'name$tr$': 'procurement.pes.transaction.controllingUnitAssign02Desc',
								'formatter': basicsCommonComplexFormatter,
								'sortable': true
							},
							{
								'id': 'transControllingUnitAssign03',
								'field': 'CompanyTransaction.ControllingUnitAssign03',
								'name': 'Controlling Unit Assign 03',
								'name$tr$': 'procurement.pes.transaction.controllingUnitAssign03',
								'formatter': basicsCommonComplexFormatter,
								'sortable': true
							},
							{
								'id': 'transControllingUnitAssign03Desc',
								'field': 'CompanyTransaction.ControllingUnitAssign03Desc',
								'name': 'Controlling Unit Assign 03 Description',
								'name$tr$': 'procurement.pes.transaction.controllingUnitAssign03Desc',
								'formatter': basicsCommonComplexFormatter,
								'sortable': true
							},
							{
								'id': 'transControllingUnitAssign04',
								'field': 'CompanyTransaction.ControllingUnitAssign04',
								'name': 'Controlling Unit Assign 04',
								'name$tr$': 'procurement.pes.transaction.controllingUnitAssign04',
								'formatter': basicsCommonComplexFormatter,
								'sortable': true
							},
							{
								'id': 'transControllingUnitAssign04Desc',
								'field': 'CompanyTransaction.ControllingUnitAssign04Desc',
								'name': 'Controlling Unit Assign 04 Description',
								'name$tr$': 'procurement.pes.transaction.controllingUnitAssign04Desc',
								'formatter': basicsCommonComplexFormatter,
								'sortable': true
							},
							{
								'id': 'transControllingUnitAssign05',
								'field': 'CompanyTransaction.ControllingUnitAssign05',
								'name': 'Controlling Unit Assign 05',
								'name$tr$': 'procurement.pes.transaction.controllingUnitAssign05',
								'formatter': basicsCommonComplexFormatter,
								'sortable': true
							},
							{
								'id': 'transControllingUnitAssign05Desc',
								'field': 'CompanyTransaction.ControllingUnitAssign05Desc',
								'name': 'Controlling Unit Assign 05 Description',
								'name$tr$': 'procurement.pes.transaction.controllingUnitAssign05Desc',
								'formatter': basicsCommonComplexFormatter,
								'sortable': true
							},
							{
								'id': 'transControllingUnitAssign06',
								'field': 'CompanyTransaction.ControllingUnitAssign06',
								'name': 'Controlling Unit Assign 06',
								'name$tr$': 'procurement.pes.transaction.controllingUnitAssign06',
								'formatter': basicsCommonComplexFormatter,
								'sortable': true
							},
							{
								'id': 'transControllingUnitAssign06Desc',
								'field': 'CompanyTransaction.ControllingUnitAssign06Desc',
								'name': 'Controlling Unit Assign 06 Description',
								'name$tr$': 'procurement.pes.transaction.controllingUnitAssign06Desc',
								'formatter': basicsCommonComplexFormatter,
								'sortable': true
							},
							{
								'id': 'transControllingUnitAssign07',
								'field': 'CompanyTransaction.ControllingUnitAssign07',
								'name': 'Controlling Unit Assign 07',
								'name$tr$': 'procurement.pes.transaction.controllingUnitAssign07',
								'formatter': basicsCommonComplexFormatter,
								'sortable': true
							},
							{
								'id': 'transControllingUnitAssign07Desc',
								'field': 'CompanyTransaction.ControllingUnitAssign07Desc',
								'name': 'Controlling Unit Assign 07 Description',
								'name$tr$': 'procurement.pes.transaction.controllingUnitAssign07Desc',
								'formatter': basicsCommonComplexFormatter,
								'sortable': true
							},
							{
								'id': 'transControllingUnitAssign08',
								'field': 'CompanyTransaction.ControllingUnitAssign08',
								'name': 'Controlling Unit Assign 08',
								'name$tr$': 'procurement.pes.transaction.controllingUnitAssign08',
								'formatter': basicsCommonComplexFormatter,
								'sortable': true
							},
							{
								'id': 'transControllingUnitAssign08Desc',
								'field': 'CompanyTransaction.ControllingUnitAssign08Desc',
								'name': 'Controlling Unit Assign 08 Description',
								'name$tr$': 'procurement.pes.transaction.controllingUnitAssign08Desc',
								'formatter': basicsCommonComplexFormatter,
								'sortable': true
							},
							{
								'id': 'transControllingUnitAssign09',
								'field': 'CompanyTransaction.ControllingUnitAssign09',
								'name': 'Controlling Unit Assign 09',
								'name$tr$': 'procurement.pes.transaction.controllingUnitAssign09',
								'formatter': basicsCommonComplexFormatter,
								'sortable': true
							},
							{
								'id': 'transControllingUnitAssign09Desc',
								'field': 'CompanyTransaction.ControllingUnitAssign09Desc',
								'name': 'Controlling Unit Assign 09 Description',
								'name$tr$': 'procurement.pes.transaction.controllingUnitAssign09Desc',
								'formatter': basicsCommonComplexFormatter,
								'sortable': true
							},
							{
								'id': 'transControllingUnitAssign10',
								'field': 'CompanyTransaction.ControllingUnitAssign10',
								'name': 'Controlling Unit Assign 10',
								'name$tr$': 'procurement.pes.transaction.controllingUnitAssign10',
								'formatter': basicsCommonComplexFormatter,
								'sortable': true
							},
							{
								'id': 'transControllingUnitAssign10Desc',
								'field': 'CompanyTransaction.ControllingUnitAssign10Desc',
								'name': 'Controlling Unit Assign 10 Description',
								'name$tr$': 'procurement.pes.transaction.controllingUnitAssign10Desc',
								'formatter': basicsCommonComplexFormatter,
								'sortable': true
							},
							{
								'id': 'transOffsetContUnitCode',
								'field': 'CompanyTransaction.OffsetContUnitCode',
								'name': 'Offset Controlling Unit Code',
								'name$tr$': 'procurement.pes.transaction.offsetContUnitCode',
								'formatter': basicsCommonComplexFormatter,
								'sortable': true
							},
							{
								'id': 'transOffsetContUnitAssign01',
								'field': 'CompanyTransaction.OffsetContUnitAssign01',
								'name': 'Offset Controlling Unit Assign 01',
								'name$tr$': 'procurement.pes.transaction.offsetContUnitAssign01',
								'formatter': basicsCommonComplexFormatter,
								'sortable': true
							},
							{
								'id': 'transOffsetContUnitAssign01Desc',
								'field': 'CompanyTransaction.OffsetContUnitAssign01Desc',
								'name': 'Offset Controlling Unit Assign 01 Description',
								'name$tr$': 'procurement.pes.transaction.offsetContUnitAssign01Desc',
								'formatter': basicsCommonComplexFormatter,
								'sortable': true
							},
							{
								'id': 'transOffsetContUnitAssign02',
								'field': 'CompanyTransaction.OffsetContUnitAssign02',
								'name': 'Offset Controlling Unit Assign 02',
								'name$tr$': 'procurement.pes.transaction.offsetContUnitAssign02',
								'formatter': basicsCommonComplexFormatter,
								'sortable': true
							},
							{
								'id': 'transOffsetContUnitAssign02Desc',
								'field': 'CompanyTransaction.OffsetContUnitAssign02Desc',
								'name': 'Offset Controlling Unit Assign 02 Description',
								'name$tr$': 'procurement.pes.transaction.offsetContUnitAssign02Desc',
								'formatter': basicsCommonComplexFormatter,
								'sortable': true
							},
							{
								'id': 'transOffsetContUnitAssign03',
								'field': 'CompanyTransaction.OffsetContUnitAssign03',
								'name': 'Offset Controlling Unit Assign 03',
								'name$tr$': 'procurement.pes.transaction.offsetContUnitAssign03',
								'formatter': basicsCommonComplexFormatter,
								'sortable': true
							},
							{
								'id': 'transOffsetContUnitAssign03Desc',
								'field': 'CompanyTransaction.OffsetContUnitAssign03Desc',
								'name': 'Offset Controlling Unit Assign 03 Description',
								'name$tr$': 'procurement.pes.transaction.offsetContUnitAssign03Desc',
								'formatter': basicsCommonComplexFormatter,
								'sortable': true
							},
							{
								'id': 'transOffsetContUnitAssign04',
								'field': 'CompanyTransaction.OffsetContUnitAssign04',
								'name': 'Offset Controlling Unit Assign 04',
								'name$tr$': 'procurement.pes.transaction.offsetContUnitAssign04',
								'formatter': basicsCommonComplexFormatter,
								'sortable': true
							},
							{
								'id': 'transOffsetContUnitAssign04Desc',
								'field': 'CompanyTransaction.OffsetContUnitAssign04Desc',
								'name': 'Offset Controlling Unit Assign 04 Description',
								'name$tr$': 'procurement.pes.transaction.offsetContUnitAssign04Desc',
								'formatter': basicsCommonComplexFormatter,
								'sortable': true
							},
							{
								'id': 'transOffsetContUnitAssign05',
								'field': 'CompanyTransaction.OffsetContUnitAssign05',
								'name': 'Offset Controlling Unit Assign 05',
								'name$tr$': 'procurement.pes.transaction.offsetContUnitAssign05',
								'formatter': basicsCommonComplexFormatter,
								'sortable': true
							},
							{
								'id': 'transOffsetContUnitAssign05Desc',
								'field': 'CompanyTransaction.OffsetContUnitAssign05Desc',
								'name': 'Offset Controlling Unit Assign 05 Description',
								'name$tr$': 'procurement.pes.transaction.offsetContUnitAssign05Desc',
								'formatter': basicsCommonComplexFormatter,
								'sortable': true
							},
							{
								'id': 'transOffsetContUnitAssign06',
								'field': 'CompanyTransaction.OffsetContUnitAssign06',
								'name': 'Offset Controlling Unit Assign 06',
								'name$tr$': 'procurement.pes.transaction.offsetContUnitAssign06',
								'formatter': basicsCommonComplexFormatter,
								'sortable': true
							},
							{
								'id': 'transOffsetContUnitAssign06Desc',
								'field': 'CompanyTransaction.OffsetContUnitAssign06Desc',
								'name': 'Offset Controlling Unit Assign 06 Description',
								'name$tr$': 'procurement.pes.transaction.offsetContUnitAssign06Desc',
								'formatter': basicsCommonComplexFormatter,
								'sortable': true
							},
							{
								'id': 'transOffsetContUnitAssign07',
								'field': 'CompanyTransaction.OffsetContUnitAssign07',
								'name': 'Offset Controlling Unit Assign 07',
								'name$tr$': 'procurement.pes.transaction.offsetContUnitAssign07',
								'formatter': basicsCommonComplexFormatter,
								'sortable': true
							},
							{
								'id': 'transOffsetContUnitAssign07Desc',
								'field': 'CompanyTransaction.OffsetContUnitAssign07Desc',
								'name': 'Offset Controlling Unit Assign 07 Description',
								'name$tr$': 'procurement.pes.transaction.offsetContUnitAssign07Desc',
								'formatter': basicsCommonComplexFormatter,
								'sortable': true
							},
							{
								'id': 'transOffsetContUnitAssign08',
								'field': 'CompanyTransaction.OffsetContUnitAssign08',
								'name': 'Offset Controlling Unit Assign 08',
								'name$tr$': 'procurement.pes.transaction.offsetContUnitAssign08',
								'formatter': basicsCommonComplexFormatter,
								'sortable': true
							},
							{
								'id': 'transOffsetContUnitAssign08Desc',
								'field': 'CompanyTransaction.OffsetContUnitAssign08Desc',
								'name': 'Offset Controlling Unit Assign 08 Description',
								'name$tr$': 'procurement.pes.transaction.offsetContUnitAssign08Desc',
								'formatter': basicsCommonComplexFormatter,
								'sortable': true
							},
							{
								'id': 'transOffsetContUnitAssign09',
								'field': 'CompanyTransaction.OffsetContUnitAssign09',
								'name': 'Offset Controlling Unit Assign 09',
								'name$tr$': 'procurement.pes.transaction.offsetContUnitAssign09',
								'formatter': basicsCommonComplexFormatter,
								'sortable': true
							},
							{
								'id': 'transOffsetContUnitAssign09Desc',
								'field': 'CompanyTransaction.OffsetContUnitAssign09Desc',
								'name': 'Offset Controlling Unit Assign 09 Description',
								'name$tr$': 'procurement.pes.transaction.offsetContUnitAssign09Desc',
								'formatter': basicsCommonComplexFormatter,
								'sortable': true
							},
							{
								'id': 'transOffsetContUnitAssign10',
								'field': 'CompanyTransaction.OffsetContUnitAssign10',
								'name': 'Offset Controlling Unit Assign 10',
								'name$tr$': 'procurement.pes.transaction.offsetContUnitAssign10',
								'formatter': basicsCommonComplexFormatter,
								'sortable': true
							},
							{
								'id': 'transOffsetContUnitAssign10Desc',
								'field': 'CompanyTransaction.OffsetContUnitAssign10Desc',
								'name': 'Offset Controlling Unit Assign 10 Description',
								'name$tr$': 'procurement.pes.transaction.offsetContUnitAssign10Desc',
								'formatter': basicsCommonComplexFormatter,
								'sortable': true
							},
							{
								'id': 'transNominalDimension',
								'field': 'CompanyTransaction.NominalDimension',
								'name': 'Nominal Dimension',
								'name$tr$': 'procurement.pes.transaction.nominalDimension',
								'formatter': basicsCommonComplexFormatter,
								'sortable': true
							},
							{
								'id': 'transNominalDimension2',
								'field': 'CompanyTransaction.NominalDimension2',
								'name': 'Nominal Dimension2',
								'name$tr$': 'procurement.pes.transaction.nominalDimension2',
								'formatter': basicsCommonComplexFormatter,
								'sortable': true
							},
							{
								'id': 'transNominalDimension3',
								'field': 'CompanyTransaction.NominalDimension3',
								'name': 'Nominal Dimension3',
								'name$tr$': 'procurement.pes.transaction.nominalDimension3',
								'formatter': basicsCommonComplexFormatter,
								'sortable': true
							},
							{
								'id': 'transTaxCode',
								'field': 'CompanyTransaction.TaxCode',
								'name': 'Tax Code',
								'name$tr$': 'procurement.pes.transaction.taxCode',
								'formatter': basicsCommonComplexFormatter,
								'sortable': true
							},
							{
								'id': 'transPostingArea',
								'field': 'CompanyTransaction',
								'name': 'Posting Area',
								'name$tr$': 'procurement.pes.transaction.postingArea',
								'formatter': basicsCommonComplexFormatter,
								'formatterOptions': {
									'displayMember': 'PostingArea',
									'domainType': 'integer'
								},
								'sortable': true
							}
						]),
						detail: [
							{
								'rid': 'transHeader',
								'gid': 'basicData',
								'model': 'CompanyTransaction.CompanyTransHeader',
								'label': 'Transaction Header',
								'label$tr$': 'procurement.pes.transaction.transHeader',
								'type': 'description',
								'readonly': true
							},
							{
								'rid': 'transDocType',
								'gid': 'basicData',
								'model': 'CompanyTransaction.DocumentType',
								'label': 'Document Type',
								'label$tr$': 'procurement.pes.transaction.documentType',
								'type': 'code',
								'readonly': true
							},
							{
								'rid': 'transCurrency',
								'gid': 'basicData',
								'model': 'CompanyTransaction.Currency',
								'label': 'Currency',
								'label$tr$': 'procurement.pes.transaction.currency',
								'type': 'code',
								'readonly': true
							},
							{
								'rid': 'transPostingDate',
								'gid': 'basicData',
								'model': 'CompanyTransaction.PostingDate',
								'label': 'Posting Date',
								'label$tr$': 'procurement.pes.transaction.postingDate',
								'type': 'dateutc',
								'readonly': true
							},
							{
								'rid': 'transVoucherNumber',
								'gid': 'basicData',
								'model': 'CompanyTransaction.VoucherNumber',
								'label': 'Voucher Number',
								'label$tr$': 'procurement.pes.transaction.voucherNumber',
								'type': 'code',
								'readonly': true
							},
							{
								'rid': 'transVoucherDate',
								'gid': 'basicData',
								'model': 'CompanyTransaction.VoucherDate',
								'label': 'Voucher Date',
								'label$tr$': 'procurement.pes.transaction.voucherDate',
								'type': 'dateutc',
								'readonly': true
							},
							{
								'rid': 'transAccount',
								'gid': 'basicData',
								'model': 'CompanyTransaction.Account',
								'label': 'Account',
								'label$tr$': 'procurement.pes.transaction.account',
								'type': 'code',
								'readonly': true
							},
							{
								'rid': 'transOffsetAccount',
								'gid': 'basicData',
								'model': 'CompanyTransaction.OffsetAccount',
								'label': 'Offset Account',
								'label$tr$': 'procurement.pes.transaction.offsetAccount',
								'type': 'code',
								'readonly': true
							},
							{
								'rid': 'transPostingNarritive',
								'gid': 'basicData',
								'model': 'CompanyTransaction.PostingNarritive',
								'label': 'Posting Narritive',
								'label$tr$': 'procurement.pes.transaction.postingNarritive',
								'type': 'description',
								'readonly': true
							},
							{
								'rid': 'transAmount',
								'gid': 'basicData',
								'model': 'CompanyTransaction.Amount',
								'label': 'Amount',
								'label$tr$': 'procurement.pes.transaction.amount',
								'type': 'money',
								'readonly': true
							},
							{
								'rid': 'transAmountOc',
								'gid': 'basicData',
								'model': 'CompanyTransaction.AmountOc',
								'label': 'Amount Oc',
								'label$tr$': 'procurement.pes.transaction.amountOc',
								'type': 'money',
								'readonly': true
							},
							{
								'rid': 'transQuantity',
								'gid': 'basicData',
								'model': 'CompanyTransaction.Quantity',
								'label': 'Quantity',
								'label$tr$': 'procurement.pes.transaction.quantity',
								'type': 'quantity',
								'readonly': true
							},
							{
								'rid': 'transControllingUnitCode',
								'gid': 'basicData',
								'model': 'CompanyTransaction.ControllingUnitCode',
								'label': 'Controlling Unit Code',
								'label$tr$': 'procurement.pes.transaction.controllingUnitCode',
								'type': 'code',
								'readonly': true
							},
							{
								'rid': 'transControllingUnitAssign01',
								'gid': 'basicData',
								'model': 'CompanyTransaction.ControllingUnitAssign01',
								'label': 'Controlling Unit Assign 01',
								'label$tr$': 'procurement.pes.transaction.controllingUnitAssign01',
								'type': 'code',
								'readonly': true
							},
							{
								'rid': 'transControllingUnitAssign01Desc',
								'gid': 'basicData',
								'model': 'CompanyTransaction.ControllingUnitAssign01Desc',
								'label': 'Controlling Unit Assign 01 Description',
								'label$tr$': 'procurement.pes.transaction.controllingUnitAssign01Desc',
								'type': 'description',
								'readonly': true
							},
							{
								'rid': 'transControllingUnitAssign02',
								'gid': 'basicData',
								'model': 'CompanyTransaction.ControllingUnitAssign02',
								'label': 'Controlling Unit Assign 02',
								'label$tr$': 'procurement.pes.transaction.controllingUnitAssign02',
								'type': 'code',
								'readonly': true
							},
							{
								'rid': 'transControllingUnitAssign02Desc',
								'gid': 'basicData',
								'model': 'CompanyTransaction.ControllingUnitAssign02Desc',
								'label': 'Controlling Unit Assign 02 Description',
								'label$tr$': 'procurement.pes.transaction.controllingUnitAssign02Desc',
								'type': 'description',
								'readonly': true
							},
							{
								'rid': 'transControllingUnitAssign03',
								'gid': 'basicData',
								'model': 'CompanyTransaction.ControllingUnitAssign03',
								'label': 'Controlling Unit Assign 03',
								'label$tr$': 'procurement.pes.transaction.controllingUnitAssign03',
								'type': 'code',
								'readonly': true
							},
							{
								'rid': 'transControllingUnitAssign03Desc',
								'gid': 'basicData',
								'model': 'CompanyTransaction.ControllingUnitAssign03Desc',
								'label': 'Controlling Unit Assign 03 Description',
								'label$tr$': 'procurement.pes.transaction.controllingUnitAssign03Desc',
								'type': 'description',
								'readonly': true
							},
							{
								'rid': 'transControllingUnitAssign04',
								'gid': 'basicData',
								'model': 'CompanyTransaction.ControllingUnitAssign04',
								'label': 'Controlling Unit Assign 04',
								'label$tr$': 'procurement.pes.transaction.controllingUnitAssign04',
								'type': 'code',
								'readonly': true
							},
							{
								'rid': 'transControllingUnitAssign04Desc',
								'gid': 'basicData',
								'model': 'CompanyTransaction.ControllingUnitAssign04Desc',
								'label': 'Controlling Unit Assign 04 Description',
								'label$tr$': 'procurement.pes.transaction.controllingUnitAssign04Desc',
								'type': 'description',
								'readonly': true
							},
							{
								'rid': 'transControllingUnitAssign05',
								'gid': 'basicData',
								'model': 'CompanyTransaction.ControllingUnitAssign05',
								'label': 'Controlling Unit Assign 05',
								'label$tr$': 'procurement.pes.transaction.controllingUnitAssign05',
								'type': 'code',
								'readonly': true
							},
							{
								'rid': 'transControllingUnitAssign05Desc',
								'gid': 'basicData',
								'model': 'CompanyTransaction.ControllingUnitAssign05Desc',
								'label': 'Controlling Unit Assign 05 Description',
								'label$tr$': 'procurement.pes.transaction.controllingUnitAssign05Desc',
								'type': 'description',
								'readonly': true
							},
							{
								'rid': 'transControllingUnitAssign06',
								'gid': 'basicData',
								'model': 'CompanyTransaction.ControllingUnitAssign06',
								'label': 'Controlling Unit Assign 06',
								'label$tr$': 'procurement.pes.transaction.controllingUnitAssign06',
								'type': 'code',
								'readonly': true
							},
							{
								'rid': 'transControllingUnitAssign06Desc',
								'gid': 'basicData',
								'model': 'CompanyTransaction.ControllingUnitAssign06Desc',
								'label': 'Controlling Unit Assign 06 Description',
								'label$tr$': 'procurement.pes.transaction.controllingUnitAssign06Desc',
								'type': 'description',
								'readonly': true
							},
							{
								'rid': 'transControllingUnitAssign07',
								'gid': 'basicData',
								'model': 'CompanyTransaction.ControllingUnitAssign07',
								'label': 'Controlling Unit Assign 07',
								'label$tr$': 'procurement.pes.transaction.controllingUnitAssign07',
								'type': 'code',
								'readonly': true
							},
							{
								'rid': 'transControllingUnitAssign07Desc',
								'gid': 'basicData',
								'model': 'CompanyTransaction.ControllingUnitAssign07Desc',
								'label': 'Controlling Unit Assign 07 Description',
								'label$tr$': 'procurement.pes.transaction.controllingUnitAssign07Desc',
								'type': 'description',
								'readonly': true
							},
							{
								'rid': 'transControllingUnitAssign08',
								'gid': 'basicData',
								'model': 'CompanyTransaction.ControllingUnitAssign08',
								'label': 'Controlling Unit Assign 08',
								'label$tr$': 'procurement.pes.transaction.controllingUnitAssign08',
								'type': 'code',
								'readonly': true
							},
							{
								'rid': 'transControllingUnitAssign08Desc',
								'gid': 'basicData',
								'model': 'CompanyTransaction.ControllingUnitAssign08Desc',
								'label': 'Controlling Unit Assign 08 Description',
								'label$tr$': 'procurement.pes.transaction.controllingUnitAssign08Desc',
								'type': 'description',
								'readonly': true
							},
							{
								'rid': 'transControllingUnitAssign09',
								'gid': 'basicData',
								'model': 'CompanyTransaction.ControllingUnitAssign09',
								'label': 'Controlling Unit Assign 09',
								'label$tr$': 'procurement.pes.transaction.controllingUnitAssign09',
								'type': 'code',
								'readonly': true
							},
							{
								'rid': 'transControllingUnitAssign09Desc',
								'gid': 'basicData',
								'model': 'CompanyTransaction.ControllingUnitAssign09Desc',
								'label': 'Controlling Unit Assign 09 Description',
								'label$tr$': 'procurement.pes.transaction.controllingUnitAssign09Desc',
								'type': 'description',
								'readonly': true
							},
							{
								'rid': 'transControllingUnitAssign10',
								'gid': 'basicData',
								'model': 'CompanyTransaction.ControllingUnitAssign10',
								'label': 'Controlling Unit Assign 10',
								'label$tr$': 'procurement.pes.transaction.controllingUnitAssign10',
								'type': 'code',
								'readonly': true
							},
							{
								'rid': 'transControllingUnitAssign10Desc',
								'gid': 'basicData',
								'model': 'CompanyTransaction.ControllingUnitAssign10Desc',
								'label': 'Controlling Unit Assign 10 Description',
								'label$tr$': 'procurement.pes.transaction.controllingUnitAssign10Desc',
								'type': 'description',
								'readonly': true
							},
							{
								'rid': 'transOffsetContUnitCode',
								'gid': 'basicData',
								'model': 'CompanyTransaction.OffsetContUnitCode',
								'label': 'Offset Controlling Unit Code',
								'label$tr$': 'procurement.pes.transaction.offsetContUnitCode',
								'type': 'code',
								'readonly': true
							},
							{
								'rid': 'transOffsetContUnitAssign01',
								'gid': 'basicData',
								'model': 'CompanyTransaction.OffsetContUnitAssign01',
								'label': 'Offset Controlling Unit Assign 01',
								'label$tr$': 'procurement.pes.transaction.offsetContUnitAssign01',
								'type': 'code',
								'readonly': true
							},
							{
								'rid': 'transOffsetContUnitAssign01Desc',
								'gid': 'basicData',
								'model': 'CompanyTransaction.OffsetContUnitAssign01Desc',
								'label': 'Offset Controlling Unit Assign 01 Description',
								'label$tr$': 'procurement.pes.transaction.offsetContUnitAssign01Desc',
								'type': 'description',
								'readonly': true
							},
							{
								'rid': 'transOffsetContUnitAssign02',
								'gid': 'basicData',
								'model': 'CompanyTransaction.OffsetContUnitAssign02',
								'label': 'Offset Controlling Unit Assign 02',
								'label$tr$': 'procurement.pes.transaction.offsetContUnitAssign02',
								'type': 'code',
								'readonly': true
							},
							{
								'rid': 'transOffsetContUnitAssign02Desc',
								'gid': 'basicData',
								'model': 'CompanyTransaction.OffsetContUnitAssign02Desc',
								'label': 'Offset Controlling Unit Assign 02 Description',
								'label$tr$': 'procurement.pes.transaction.offsetContUnitAssign02Desc',
								'type': 'description',
								'readonly': true
							},
							{
								'rid': 'transOffsetContUnitAssign03',
								'gid': 'basicData',
								'model': 'CompanyTransaction.OffsetContUnitAssign03',
								'label': 'Offset Controlling Unit Assign 03',
								'label$tr$': 'procurement.pes.transaction.offsetContUnitAssign03',
								'type': 'code',
								'readonly': true
							},
							{
								'rid': 'transOffsetContUnitAssign03Desc',
								'gid': 'basicData',
								'model': 'CompanyTransaction.OffsetContUnitAssign03Desc',
								'label': 'Offset Controlling Unit Assign 03 Description',
								'label$tr$': 'procurement.pes.transaction.offsetContUnitAssign03Desc',
								'type': 'description',
								'readonly': true
							},
							{
								'rid': 'transOffsetContUnitAssign04',
								'gid': 'basicData',
								'model': 'CompanyTransaction.OffsetContUnitAssign04',
								'label': 'Offset Controlling Unit Assign 04',
								'label$tr$': 'procurement.pes.transaction.offsetContUnitAssign04',
								'type': 'code',
								'readonly': true
							},
							{
								'rid': 'transOffsetContUnitAssign04Desc',
								'gid': 'basicData',
								'model': 'CompanyTransaction.OffsetContUnitAssign04Desc',
								'label': 'Offset Controlling Unit Assign 04 Description',
								'label$tr$': 'procurement.pes.transaction.offsetContUnitAssign04Desc',
								'type': 'description',
								'readonly': true
							},
							{
								'rid': 'transOffsetContUnitAssign05',
								'gid': 'basicData',
								'model': 'CompanyTransaction.OffsetContUnitAssign05',
								'label': 'Offset Controlling Unit Assign 05',
								'label$tr$': 'procurement.pes.transaction.offsetContUnitAssign05',
								'type': 'code',
								'readonly': true
							},
							{
								'rid': 'transOffsetContUnitAssign05Desc',
								'gid': 'basicData',
								'model': 'CompanyTransaction.OffsetContUnitAssign05Desc',
								'label': 'Offset Controlling Unit Assign 05 Description',
								'label$tr$': 'procurement.pes.transaction.offsetContUnitAssign05Desc',
								'type': 'description',
								'readonly': true
							},
							{
								'rid': 'transOffsetContUnitAssign06',
								'gid': 'basicData',
								'model': 'CompanyTransaction.OffsetContUnitAssign06',
								'label': 'Offset Controlling Unit Assign 06',
								'label$tr$': 'procurement.pes.transaction.offsetContUnitAssign06',
								'type': 'code',
								'readonly': true
							},
							{
								'rid': 'transOffsetContUnitAssign06Desc',
								'gid': 'basicData',
								'model': 'CompanyTransaction.OffsetContUnitAssign06Desc',
								'label': 'Offset Controlling Unit Assign 06 Description',
								'label$tr$': 'procurement.pes.transaction.offsetContUnitAssign06Desc',
								'type': 'description',
								'readonly': true
							},
							{
								'rid': 'transOffsetContUnitAssign07',
								'gid': 'basicData',
								'model': 'CompanyTransaction.OffsetContUnitAssign07',
								'label': 'Offset Controlling Unit Assign 07',
								'label$tr$': 'procurement.pes.transaction.offsetContUnitAssign07',
								'type': 'code',
								'readonly': true
							},
							{
								'rid': 'transOffsetContUnitAssign07Desc',
								'gid': 'basicData',
								'model': 'CompanyTransaction.OffsetContUnitAssign07Desc',
								'label': 'Offset Controlling Unit Assign 07 Description',
								'label$tr$': 'procurement.pes.transaction.offsetContUnitAssign07Desc',
								'type': 'description',
								'readonly': true
							},
							{
								'rid': 'transOffsetContUnitAssign08',
								'gid': 'basicData',
								'model': 'CompanyTransaction.OffsetContUnitAssign08',
								'label': 'Offset Controlling Unit Assign 08',
								'label$tr$': 'procurement.pes.transaction.offsetContUnitAssign08',
								'type': 'code',
								'readonly': true
							},
							{
								'rid': 'transOffsetContUnitAssign08Desc',
								'gid': 'basicData',
								'model': 'CompanyTransaction.OffsetContUnitAssign08Desc',
								'label': 'Offset Controlling Unit Assign 08 Description',
								'label$tr$': 'procurement.pes.transaction.offsetContUnitAssign08Desc',
								'type': 'description',
								'readonly': true
							},
							{
								'rid': 'transOffsetContUnitAssign09',
								'gid': 'basicData',
								'model': 'CompanyTransaction.OffsetContUnitAssign09',
								'label': 'Offset Controlling Unit Assign 09',
								'label$tr$': 'procurement.pes.transaction.offsetContUnitAssign09',
								'type': 'code',
								'readonly': true
							},
							{
								'rid': 'transOffsetContUnitAssign09Desc',
								'gid': 'basicData',
								'model': 'CompanyTransaction.OffsetContUnitAssign09Desc',
								'label': 'Offset Controlling Unit Assign 09 Description',
								'label$tr$': 'procurement.pes.transaction.offsetContUnitAssign09Desc',
								'type': 'description',
								'readonly': true
							},
							{
								'rid': 'transOffsetContUnitAssign10',
								'gid': 'basicData',
								'model': 'CompanyTransaction.OffsetContUnitAssign10',
								'label': 'Offset Controlling Unit Assign 10',
								'label$tr$': 'procurement.pes.transaction.offsetContUnitAssign10',
								'type': 'code',
								'readonly': true
							},
							{
								'rid': 'transOffsetContUnitAssign10Desc',
								'gid': 'basicData',
								'model': 'CompanyTransaction.OffsetContUnitAssign10Desc',
								'label': 'Offset Controlling Unit Assign 10 Description',
								'label$tr$': 'procurement.pes.transaction.offsetContUnitAssign10Desc',
								'type': 'description',
								'readonly': true
							},
							{
								'rid': 'transNominalDimension',
								'gid': 'basicData',
								'model': 'CompanyTransaction.NominalDimension',
								'label': 'Nominal Dimension',
								'label$tr$': 'procurement.pes.transaction.nominalDimension',
								'type': 'code',
								'readonly': true
							},
							{
								'rid': 'transTaxCode',
								'gid': 'basicData',
								'model': 'CompanyTransaction.TaxCode',
								'label': 'Tax Code',
								'label$tr$': 'procurement.pes.transaction.taxCode',
								'type': 'code',
								'readonly': true
							},
							{
								'rid': 'transPostingArea',
								'gid': 'basicData',
								'model': 'CompanyTransaction.PostingArea',
								'label': 'Posting Area',
								'label$tr$': 'procurement.pes.transaction.postingArea',
								'type': 'integer',
								'readonly': true
							}
						]
					};

					function extendGrouping(gridColumns) {
						angular.forEach(gridColumns, function (column) {
							angular.extend(column, {
								grouping: {
									title: column.name$tr$,
									getter: column.field,
									aggregators: [],
									aggregateCollapsed: true
								}
							});
						});

						return gridColumns;
					}

					return array;
				}
			};
		}]);
})(angular);