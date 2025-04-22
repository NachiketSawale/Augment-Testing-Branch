/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {


	'use strict';
	var moduleName = 'sales.wip';
	var cloudCommonModule = 'cloud.common';

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

	angular.module(moduleName).factory('salesWipAccrualDetailLayout', ['basicsCommonComplexFormatter',
		function (basicsCommonComplexFormatter) {
			return {
				'fid': 'sales.wip.accrual.detailform',
				'version': '0.1.0',
				'showGrouping': true,
				'addValidationAutomatically': true,
				'groups': [
					{
						'gid': 'basicData',
						'attributes': ['dateeffective', 'companytransactionfk']
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],
				'translationInfos': {
					'extraModules': [moduleName, cloudCommonModule]
				},
				'overloads': {
					'dateeffective': {
						readonly: true
					},
					'companytransactionfk': {
						readonly: true,
						width: 120
					}
				},
				'addition': {
					grid: extendGrouping([
						{
							'id': 'transHeader',
							'field': 'CompanyTransaction.CompanyTransHeader',
							'name': 'Transaction Header',
							'name$tr$': 'sales.wip.transaction.transHeader',
							'formatter': basicsCommonComplexFormatter,
							'sortable': true
						},
						{
							'id': 'transDocType',
							'field': 'CompanyTransaction.DocumentType',
							'name': 'Document Type',
							'name$tr$': 'sales.wip.transaction.documentType',
							'formatter': basicsCommonComplexFormatter,
							'sortable': true
						},
						{
							'id': 'transCurrency',
							'field': 'CompanyTransaction.Currency',
							'name': 'Currency',
							'name$tr$': 'sales.wip.transaction.currency',
							'formatter': basicsCommonComplexFormatter,
							'sortable': true
						},
						{
							'id': 'transPostingDate',
							'field': 'CompanyTransaction',
							'name': 'Posting Date',
							'name$tr$': 'sales.wip.transaction.postingDate',
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
							'name$tr$': 'sales.wip.transaction.voucherNumber',
							'formatter': basicsCommonComplexFormatter,
							'sortable': true
						},
						{
							'id': 'transVoucherDate',
							'field': 'CompanyTransaction',
							'name': 'Voucher Date',
							'name$tr$': 'sales.wip.transaction.voucherDate',
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
							'name$tr$': 'sales.wip.transaction.account',
							'formatter': basicsCommonComplexFormatter,
							'sortable': true
						},
						{
							'id': 'transOffsetAccount',
							'field': 'CompanyTransaction.OffsetAccount',
							'name': 'Offset Account',
							'name$tr$': 'sales.wip.transaction.offsetAccount',
							'formatter': basicsCommonComplexFormatter,
							'sortable': true
						},
						{
							'id': 'transPostingNarritive',
							'field': 'CompanyTransaction.PostingNarritive',
							'name': 'Posting Narritive',
							'name$tr$': 'sales.wip.transaction.postingNarritive',
							'formatter': basicsCommonComplexFormatter,
							'sortable': true
						},
						{
							'id': 'transAmount',
							'field': 'CompanyTransaction',
							'name': 'Amount',
							'name$tr$': 'sales.wip.transaction.amount',
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
							'name$tr$': 'sales.wip.transaction.amountOc',
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
							'name$tr$': 'sales.wip.transaction.quantity',
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
							'name$tr$': 'sales.wip.transaction.controllingUnitCode',
							'formatter': basicsCommonComplexFormatter,
							'sortable': true
						},
						{
							'id': 'transControllingUnitAssign01',
							'field': 'CompanyTransaction.ControllingUnitAssign01',
							'name': 'Controlling Unit Assign 01',
							'name$tr$': 'sales.wip.transaction.controllingUnitAssign01',
							'formatter': basicsCommonComplexFormatter,
							'sortable': true
						},
						{
							'id': 'transControllingUnitAssign01Desc',
							'field': 'CompanyTransaction.ControllingUnitAssign01Desc',
							'name': 'Controlling Unit Assign 01 Description',
							'name$tr$': 'sales.wip.transaction.controllingUnitAssign01Desc',
							'formatter': basicsCommonComplexFormatter,
							'sortable': true
						},
						{
							'id': 'transControllingUnitAssign02',
							'field': 'CompanyTransaction.ControllingUnitAssign02',
							'name': 'Controlling Unit Assign 02',
							'name$tr$': 'sales.wip.transaction.controllingUnitAssign02',
							'formatter': basicsCommonComplexFormatter,
							'sortable': true
						},
						{
							'id': 'transControllingUnitAssign02Desc',
							'field': 'CompanyTransaction.ControllingUnitAssign02Desc',
							'name': 'Controlling Unit Assign 02 Description',
							'name$tr$': 'sales.wip.transaction.controllingUnitAssign02Desc',
							'formatter': basicsCommonComplexFormatter,
							'sortable': true
						},
						{
							'id': 'transControllingUnitAssign03',
							'field': 'CompanyTransaction.ControllingUnitAssign03',
							'name': 'Controlling Unit Assign 03',
							'name$tr$': 'sales.wip.transaction.controllingUnitAssign03',
							'formatter': basicsCommonComplexFormatter,
							'sortable': true
						},
						{
							'id': 'transControllingUnitAssign03Desc',
							'field': 'CompanyTransaction.ControllingUnitAssign03Desc',
							'name': 'Controlling Unit Assign 03 Description',
							'name$tr$': 'sales.wip.transaction.controllingUnitAssign03Desc',
							'formatter': basicsCommonComplexFormatter,
							'sortable': true
						},
						{
							'id': 'transControllingUnitAssign04',
							'field': 'CompanyTransaction.ControllingUnitAssign04',
							'name': 'Controlling Unit Assign 04',
							'name$tr$': 'sales.wip.transaction.controllingUnitAssign04',
							'formatter': basicsCommonComplexFormatter,
							'sortable': true
						},
						{
							'id': 'transControllingUnitAssign04Desc',
							'field': 'CompanyTransaction.ControllingUnitAssign04Desc',
							'name': 'Controlling Unit Assign 04 Description',
							'name$tr$': 'sales.wip.transaction.controllingUnitAssign04Desc',
							'formatter': basicsCommonComplexFormatter,
							'sortable': true
						},
						{
							'id': 'transControllingUnitAssign05',
							'field': 'CompanyTransaction.ControllingUnitAssign05',
							'name': 'Controlling Unit Assign 05',
							'name$tr$': 'sales.wip.transaction.controllingUnitAssign05',
							'formatter': basicsCommonComplexFormatter,
							'sortable': true
						},
						{
							'id': 'transControllingUnitAssign05Desc',
							'field': 'CompanyTransaction.ControllingUnitAssign05Desc',
							'name': 'Controlling Unit Assign 05 Description',
							'name$tr$': 'sales.wip.transaction.controllingUnitAssign05Desc',
							'formatter': basicsCommonComplexFormatter,
							'sortable': true
						},
						{
							'id': 'transControllingUnitAssign06',
							'field': 'CompanyTransaction.ControllingUnitAssign06',
							'name': 'Controlling Unit Assign 06',
							'name$tr$': 'sales.wip.transaction.controllingUnitAssign06',
							'formatter': basicsCommonComplexFormatter,
							'sortable': true
						},
						{
							'id': 'transControllingUnitAssign06Desc',
							'field': 'CompanyTransaction.ControllingUnitAssign06Desc',
							'name': 'Controlling Unit Assign 06 Description',
							'name$tr$': 'sales.wip.transaction.controllingUnitAssign06Desc',
							'formatter': basicsCommonComplexFormatter,
							'sortable': true
						},
						{
							'id': 'transControllingUnitAssign07',
							'field': 'CompanyTransaction.ControllingUnitAssign07',
							'name': 'Controlling Unit Assign 07',
							'name$tr$': 'sales.wip.transaction.controllingUnitAssign07',
							'formatter': basicsCommonComplexFormatter,
							'sortable': true
						},
						{
							'id': 'transControllingUnitAssign07Desc',
							'field': 'CompanyTransaction.ControllingUnitAssign07Desc',
							'name': 'Controlling Unit Assign 07 Description',
							'name$tr$': 'sales.wip.transaction.controllingUnitAssign07Desc',
							'formatter': basicsCommonComplexFormatter,
							'sortable': true
						},
						{
							'id': 'transControllingUnitAssign08',
							'field': 'CompanyTransaction.ControllingUnitAssign08',
							'name': 'Controlling Unit Assign 08',
							'name$tr$': 'sales.wip.transaction.controllingUnitAssign08',
							'formatter': basicsCommonComplexFormatter,
							'sortable': true
						},
						{
							'id': 'transControllingUnitAssign08Desc',
							'field': 'CompanyTransaction.ControllingUnitAssign08Desc',
							'name': 'Controlling Unit Assign 08 Description',
							'name$tr$': 'sales.wip.transaction.controllingUnitAssign08Desc',
							'formatter': basicsCommonComplexFormatter,
							'sortable': true
						},
						{
							'id': 'transControllingUnitAssign09',
							'field': 'CompanyTransaction.ControllingUnitAssign09',
							'name': 'Controlling Unit Assign 09',
							'name$tr$': 'sales.wip.transaction.controllingUnitAssign09',
							'formatter': basicsCommonComplexFormatter,
							'sortable': true
						},
						{
							'id': 'transControllingUnitAssign09Desc',
							'field': 'CompanyTransaction.ControllingUnitAssign09Desc',
							'name': 'Controlling Unit Assign 09 Description',
							'name$tr$': 'sales.wip.transaction.controllingUnitAssign09Desc',
							'formatter': basicsCommonComplexFormatter,
							'sortable': true
						},
						{
							'id': 'transControllingUnitAssign10',
							'field': 'CompanyTransaction.ControllingUnitAssign10',
							'name': 'Controlling Unit Assign 10',
							'name$tr$': 'sales.wip.transaction.controllingUnitAssign10',
							'formatter': basicsCommonComplexFormatter,
							'sortable': true
						},
						{
							'id': 'transControllingUnitAssign10Desc',
							'field': 'CompanyTransaction.ControllingUnitAssign10Desc',
							'name': 'Controlling Unit Assign 10 Description',
							'name$tr$': 'sales.wip.transaction.controllingUnitAssign10Desc',
							'formatter': basicsCommonComplexFormatter,
							'sortable': true
						},
						{
							'id': 'transOffsetContUnitCode',
							'field': 'CompanyTransaction.OffsetContUnitCode',
							'name': 'Offset Controlling Unit Code',
							'name$tr$': 'sales.wip.transaction.offsetContUnitCode',
							'formatter': basicsCommonComplexFormatter,
							'sortable': true
						},
						{
							'id': 'transOffsetContUnitAssign01',
							'field': 'CompanyTransaction.OffsetContUnitAssign01',
							'name': 'Offset Controlling Unit Assign 01',
							'name$tr$': 'sales.wip.transaction.offsetContUnitAssign01',
							'formatter': basicsCommonComplexFormatter,
							'sortable': true
						},
						{
							'id': 'transOffsetContUnitAssign01Desc',
							'field': 'CompanyTransaction.OffsetContUnitAssign01Desc',
							'name': 'Offset Controlling Unit Assign 01 Description',
							'name$tr$': 'sales.wip.transaction.offsetContUnitAssign01Desc',
							'formatter': basicsCommonComplexFormatter,
							'sortable': true
						},
						{
							'id': 'transOffsetContUnitAssign02',
							'field': 'CompanyTransaction.OffsetContUnitAssign02',
							'name': 'Offset Controlling Unit Assign 02',
							'name$tr$': 'sales.wip.transaction.offsetContUnitAssign02',
							'formatter': basicsCommonComplexFormatter,
							'sortable': true
						},
						{
							'id': 'transOffsetContUnitAssign02Desc',
							'field': 'CompanyTransaction.OffsetContUnitAssign02Desc',
							'name': 'Offset Controlling Unit Assign 02 Description',
							'name$tr$': 'sales.wip.transaction.offsetContUnitAssign02Desc',
							'formatter': basicsCommonComplexFormatter,
							'sortable': true
						},
						{
							'id': 'transOffsetContUnitAssign03',
							'field': 'CompanyTransaction.OffsetContUnitAssign03',
							'name': 'Offset Controlling Unit Assign 03',
							'name$tr$': 'sales.wip.transaction.offsetContUnitAssign03',
							'formatter': basicsCommonComplexFormatter,
							'sortable': true
						},
						{
							'id': 'transOffsetContUnitAssign03Desc',
							'field': 'CompanyTransaction.OffsetContUnitAssign03Desc',
							'name': 'Offset Controlling Unit Assign 03 Description',
							'name$tr$': 'sales.wip.transaction.offsetContUnitAssign03Desc',
							'formatter': basicsCommonComplexFormatter,
							'sortable': true
						},
						{
							'id': 'transOffsetContUnitAssign04',
							'field': 'CompanyTransaction.OffsetContUnitAssign04',
							'name': 'Offset Controlling Unit Assign 04',
							'name$tr$': 'sales.wip.transaction.offsetContUnitAssign04',
							'formatter': basicsCommonComplexFormatter,
							'sortable': true
						},
						{
							'id': 'transOffsetContUnitAssign04Desc',
							'field': 'CompanyTransaction.OffsetContUnitAssign04Desc',
							'name': 'Offset Controlling Unit Assign 04 Description',
							'name$tr$': 'sales.wip.transaction.offsetContUnitAssign04Desc',
							'formatter': basicsCommonComplexFormatter,
							'sortable': true
						},
						{
							'id': 'transOffsetContUnitAssign05',
							'field': 'CompanyTransaction.OffsetContUnitAssign05',
							'name': 'Offset Controlling Unit Assign 05',
							'name$tr$': 'sales.wip.transaction.offsetContUnitAssign05',
							'formatter': basicsCommonComplexFormatter,
							'sortable': true
						},
						{
							'id': 'transOffsetContUnitAssign05Desc',
							'field': 'CompanyTransaction.OffsetContUnitAssign05Desc',
							'name': 'Offset Controlling Unit Assign 05 Description',
							'name$tr$': 'sales.wip.transaction.offsetContUnitAssign05Desc',
							'formatter': basicsCommonComplexFormatter,
							'sortable': true
						},
						{
							'id': 'transOffsetContUnitAssign06',
							'field': 'CompanyTransaction.OffsetContUnitAssign06',
							'name': 'Offset Controlling Unit Assign 06',
							'name$tr$': 'sales.wip.transaction.offsetContUnitAssign06',
							'formatter': basicsCommonComplexFormatter,
							'sortable': true
						},
						{
							'id': 'transOffsetContUnitAssign06Desc',
							'field': 'CompanyTransaction.OffsetContUnitAssign06Desc',
							'name': 'Offset Controlling Unit Assign 06 Description',
							'name$tr$': 'sales.wip.transaction.offsetContUnitAssign06Desc',
							'formatter': basicsCommonComplexFormatter,
							'sortable': true
						},
						{
							'id': 'transOffsetContUnitAssign07',
							'field': 'CompanyTransaction.OffsetContUnitAssign07',
							'name': 'Offset Controlling Unit Assign 07',
							'name$tr$': 'sales.wip.transaction.offsetContUnitAssign07',
							'formatter': basicsCommonComplexFormatter,
							'sortable': true
						},
						{
							'id': 'transOffsetContUnitAssign07Desc',
							'field': 'CompanyTransaction.OffsetContUnitAssign07Desc',
							'name': 'Offset Controlling Unit Assign 07 Description',
							'name$tr$': 'sales.wip.transaction.offsetContUnitAssign07Desc',
							'formatter': basicsCommonComplexFormatter,
							'sortable': true
						},
						{
							'id': 'transOffsetContUnitAssign08',
							'field': 'CompanyTransaction.OffsetContUnitAssign08',
							'name': 'Offset Controlling Unit Assign 08',
							'name$tr$': 'sales.wip.transaction.offsetContUnitAssign08',
							'formatter': basicsCommonComplexFormatter,
							'sortable': true
						},
						{
							'id': 'transOffsetContUnitAssign08Desc',
							'field': 'CompanyTransaction.OffsetContUnitAssign08Desc',
							'name': 'Offset Controlling Unit Assign 08 Description',
							'name$tr$': 'sales.wip.transaction.offsetContUnitAssign08Desc',
							'formatter': basicsCommonComplexFormatter,
							'sortable': true
						},
						{
							'id': 'transOffsetContUnitAssign09',
							'field': 'CompanyTransaction.OffsetContUnitAssign09',
							'name': 'Offset Controlling Unit Assign 09',
							'name$tr$': 'sales.wip.transaction.offsetContUnitAssign09',
							'formatter': basicsCommonComplexFormatter,
							'sortable': true
						},
						{
							'id': 'transOffsetContUnitAssign09Desc',
							'field': 'CompanyTransaction.OffsetContUnitAssign09Desc',
							'name': 'Offset Controlling Unit Assign 09 Description',
							'name$tr$': 'sales.wip.transaction.offsetContUnitAssign09Desc',
							'formatter': basicsCommonComplexFormatter,
							'sortable': true
						},
						{
							'id': 'transOffsetContUnitAssign10',
							'field': 'CompanyTransaction.OffsetContUnitAssign10',
							'name': 'Offset Controlling Unit Assign 10',
							'name$tr$': 'sales.wip.transaction.offsetContUnitAssign10',
							'formatter': basicsCommonComplexFormatter,
							'sortable': true
						},
						{
							'id': 'transOffsetContUnitAssign10Desc',
							'field': 'CompanyTransaction.OffsetContUnitAssign10Desc',
							'name': 'Offset Controlling Unit Assign 10 Description',
							'name$tr$': 'sales.wip.transaction.offsetContUnitAssign10Desc',
							'formatter': basicsCommonComplexFormatter,
							'sortable': true
						},
						{
							'id': 'transNominalDimension',
							'field': 'CompanyTransaction.NominalDimension',
							'name': 'Nominal Dimension',
							'name$tr$': 'sales.wip.transaction.nominalDimension',
							'formatter': basicsCommonComplexFormatter,
							'sortable': true
						},
						{
							'id': 'transTaxCode',
							'field': 'CompanyTransaction.TaxCode',
							'name': 'Tax Code',
							'name$tr$': 'sales.wip.transaction.taxCode',
							'formatter': basicsCommonComplexFormatter,
							'sortable': true
						},
						{
							'id': 'transPostingArea',
							'field': 'CompanyTransaction',
							'name': 'Posting Area',
							'name$tr$': 'sales.wip.transaction.postingArea',
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
							'gid': 'baseGroup',
							'model': 'CompanyTransaction.CompanyTransHeader',
							'label': 'Transaction Header',
							'label$tr$': 'sales.wip.transaction.transHeader',
							'type': 'description',
							'readonly': true
						},
						{
							'rid': 'transDocType',
							'gid': 'baseGroup',
							'model': 'CompanyTransaction.DocumentType',
							'label': 'Document Type',
							'label$tr$': 'sales.wip.transaction.documentType',
							'type': 'code',
							'readonly': true
						},
						{
							'rid': 'transCurrency',
							'gid': 'baseGroup',
							'model': 'CompanyTransaction.Currency',
							'label': 'Currency',
							'label$tr$': 'sales.wip.transaction.currency',
							'type': 'code',
							'readonly': true
						},
						{
							'rid': 'transPostingDate',
							'gid': 'baseGroup',
							'model': 'CompanyTransaction.PostingDate',
							'label': 'Posting Date',
							'label$tr$': 'sales.wip.transaction.postingDate',
							'type': 'dateutc',
							'readonly': true
						},
						{
							'rid': 'transVoucherNumber',
							'gid': 'baseGroup',
							'model': 'CompanyTransaction.VoucherNumber',
							'label': 'Voucher Number',
							'label$tr$': 'sales.wip.transaction.voucherNumber',
							'type': 'code',
							'readonly': true
						},
						{
							'rid': 'transVoucherDate',
							'gid': 'baseGroup',
							'model': 'CompanyTransaction.VoucherDate',
							'label': 'Voucher Date',
							'label$tr$': 'sales.wip.transaction.voucherDate',
							'type': 'dateutc',
							'readonly': true
						},
						{
							'rid': 'transAccount',
							'gid': 'baseGroup',
							'model': 'CompanyTransaction.Account',
							'label': 'Account',
							'label$tr$': 'sales.wip.transaction.account',
							'type': 'code',
							'readonly': true
						},
						{
							'rid': 'transOffsetAccount',
							'gid': 'baseGroup',
							'model': 'CompanyTransaction.OffsetAccount',
							'label': 'Offset Account',
							'label$tr$': 'sales.wip.transaction.offsetAccount',
							'type': 'code',
							'readonly': true
						},
						{
							'rid': 'transPostingNarritive',
							'gid': 'baseGroup',
							'model': 'CompanyTransaction.PostingNarritive',
							'label': 'Posting Narritive',
							'label$tr$': 'sales.wip.transaction.postingNarritive',
							'type': 'description',
							'readonly': true
						},
						{
							'rid': 'transAmount',
							'gid': 'baseGroup',
							'model': 'CompanyTransaction.Amount',
							'label': 'Amount',
							'label$tr$': 'sales.wip.transaction.amount',
							'type': 'money',
							'readonly': true
						},
						{
							'rid': 'transAmountOc',
							'gid': 'baseGroup',
							'model': 'CompanyTransaction.AmountOc',
							'label': 'Amount Oc',
							'label$tr$': 'sales.wip.transaction.amountOc',
							'type': 'money',
							'readonly': true
						},
						{
							'rid': 'transQuantity',
							'gid': 'baseGroup',
							'model': 'CompanyTransaction.Quantity',
							'label': 'Quantity',
							'label$tr$': 'sales.wip.transaction.quantity',
							'type': 'quantity',
							'readonly': true
						},
						{
							'rid': 'transControllingUnitCode',
							'gid': 'baseGroup',
							'model': 'CompanyTransaction.ControllingUnitCode',
							'label': 'Controlling Unit Code',
							'label$tr$': 'sales.wip.transaction.controllingUnitCode',
							'type': 'code',
							'readonly': true
						},
						{
							'rid': 'transControllingUnitAssign01',
							'gid': 'baseGroup',
							'model': 'CompanyTransaction.ControllingUnitAssign01',
							'label': 'Controlling Unit Assign 01',
							'label$tr$': 'sales.wip.transaction.controllingUnitAssign01',
							'type': 'code',
							'readonly': true
						},
						{
							'rid': 'transControllingUnitAssign01Desc',
							'gid': 'baseGroup',
							'model': 'CompanyTransaction.ControllingUnitAssign01Desc',
							'label': 'Controlling Unit Assign 01 Description',
							'label$tr$': 'sales.wip.transaction.controllingUnitAssign01Desc',
							'type': 'description',
							'readonly': true
						},
						{
							'rid': 'transControllingUnitAssign02',
							'gid': 'baseGroup',
							'model': 'CompanyTransaction.ControllingUnitAssign02',
							'label': 'Controlling Unit Assign 02',
							'label$tr$': 'sales.wip.transaction.controllingUnitAssign02',
							'type': 'code',
							'readonly': true
						},
						{
							'rid': 'transControllingUnitAssign02Desc',
							'gid': 'baseGroup',
							'model': 'CompanyTransaction.ControllingUnitAssign02Desc',
							'label': 'Controlling Unit Assign 02 Description',
							'label$tr$': 'sales.wip.transaction.controllingUnitAssign02Desc',
							'type': 'description',
							'readonly': true
						},
						{
							'rid': 'transControllingUnitAssign03',
							'gid': 'baseGroup',
							'model': 'CompanyTransaction.ControllingUnitAssign03',
							'label': 'Controlling Unit Assign 03',
							'label$tr$': 'sales.wip.transaction.controllingUnitAssign03',
							'type': 'code',
							'readonly': true
						},
						{
							'rid': 'transControllingUnitAssign03Desc',
							'gid': 'baseGroup',
							'model': 'CompanyTransaction.ControllingUnitAssign03Desc',
							'label': 'Controlling Unit Assign 03 Description',
							'label$tr$': 'sales.wip.transaction.controllingUnitAssign03Desc',
							'type': 'description',
							'readonly': true
						},
						{
							'rid': 'transControllingUnitAssign04',
							'gid': 'baseGroup',
							'model': 'CompanyTransaction.ControllingUnitAssign04',
							'label': 'Controlling Unit Assign 04',
							'label$tr$': 'sales.wip.transaction.controllingUnitAssign04',
							'type': 'code',
							'readonly': true
						},
						{
							'rid': 'transControllingUnitAssign04Desc',
							'gid': 'baseGroup',
							'model': 'CompanyTransaction.ControllingUnitAssign04Desc',
							'label': 'Controlling Unit Assign 04 Description',
							'label$tr$': 'sales.wip.transaction.controllingUnitAssign04Desc',
							'type': 'description',
							'readonly': true
						},
						{
							'rid': 'transControllingUnitAssign05',
							'gid': 'baseGroup',
							'model': 'CompanyTransaction.ControllingUnitAssign05',
							'label': 'Controlling Unit Assign 05',
							'label$tr$': 'sales.wip.transaction.controllingUnitAssign05',
							'type': 'code',
							'readonly': true
						},
						{
							'rid': 'transControllingUnitAssign05Desc',
							'gid': 'baseGroup',
							'model': 'CompanyTransaction.ControllingUnitAssign05Desc',
							'label': 'Controlling Unit Assign 05 Description',
							'label$tr$': 'sales.wip.transaction.controllingUnitAssign05Desc',
							'type': 'description',
							'readonly': true
						},
						{
							'rid': 'transControllingUnitAssign06',
							'gid': 'baseGroup',
							'model': 'CompanyTransaction.ControllingUnitAssign06',
							'label': 'Controlling Unit Assign 06',
							'label$tr$': 'sales.wip.transaction.controllingUnitAssign06',
							'type': 'code',
							'readonly': true
						},
						{
							'rid': 'transControllingUnitAssign06Desc',
							'gid': 'baseGroup',
							'model': 'CompanyTransaction.ControllingUnitAssign06Desc',
							'label': 'Controlling Unit Assign 06 Description',
							'label$tr$': 'sales.wip.transaction.controllingUnitAssign06Desc',
							'type': 'description',
							'readonly': true
						},
						{
							'rid': 'transControllingUnitAssign07',
							'gid': 'baseGroup',
							'model': 'CompanyTransaction.ControllingUnitAssign07',
							'label': 'Controlling Unit Assign 07',
							'label$tr$': 'sales.wip.transaction.controllingUnitAssign07',
							'type': 'code',
							'readonly': true
						},
						{
							'rid': 'transControllingUnitAssign07Desc',
							'gid': 'baseGroup',
							'model': 'CompanyTransaction.ControllingUnitAssign07Desc',
							'label': 'Controlling Unit Assign 07 Description',
							'label$tr$': 'sales.wip.transaction.controllingUnitAssign07Desc',
							'type': 'description',
							'readonly': true
						},
						{
							'rid': 'transControllingUnitAssign08',
							'gid': 'baseGroup',
							'model': 'CompanyTransaction.ControllingUnitAssign08',
							'label': 'Controlling Unit Assign 08',
							'label$tr$': 'sales.wip.transaction.controllingUnitAssign08',
							'type': 'code',
							'readonly': true
						},
						{
							'rid': 'transControllingUnitAssign08Desc',
							'gid': 'baseGroup',
							'model': 'CompanyTransaction.ControllingUnitAssign08Desc',
							'label': 'Controlling Unit Assign 08 Description',
							'label$tr$': 'sales.wip.transaction.controllingUnitAssign08Desc',
							'type': 'description',
							'readonly': true
						},
						{
							'rid': 'transControllingUnitAssign09',
							'gid': 'baseGroup',
							'model': 'CompanyTransaction.ControllingUnitAssign09',
							'label': 'Controlling Unit Assign 09',
							'label$tr$': 'sales.wip.transaction.controllingUnitAssign09',
							'type': 'code',
							'readonly': true
						},
						{
							'rid': 'transControllingUnitAssign09Desc',
							'gid': 'baseGroup',
							'model': 'CompanyTransaction.ControllingUnitAssign09Desc',
							'label': 'Controlling Unit Assign 09 Description',
							'label$tr$': 'sales.wip.transaction.controllingUnitAssign09Desc',
							'type': 'description',
							'readonly': true
						},
						{
							'rid': 'transControllingUnitAssign10',
							'gid': 'baseGroup',
							'model': 'CompanyTransaction.ControllingUnitAssign10',
							'label': 'Controlling Unit Assign 10',
							'label$tr$': 'sales.wip.transaction.controllingUnitAssign10',
							'type': 'code',
							'readonly': true
						},
						{
							'rid': 'transControllingUnitAssign10Desc',
							'gid': 'baseGroup',
							'model': 'CompanyTransaction.ControllingUnitAssign10Desc',
							'label': 'Controlling Unit Assign 10 Description',
							'label$tr$': 'sales.wip.transaction.controllingUnitAssign10Desc',
							'type': 'description',
							'readonly': true
						},
						{
							'rid': 'transOffsetContUnitCode',
							'gid': 'baseGroup',
							'model': 'CompanyTransaction.OffsetContUnitCode',
							'label': 'Offset Controlling Unit Code',
							'label$tr$': 'sales.wip.transaction.offsetContUnitCode',
							'type': 'code',
							'readonly': true
						},
						{
							'rid': 'transOffsetContUnitAssign01',
							'gid': 'baseGroup',
							'model': 'CompanyTransaction.OffsetContUnitAssign01',
							'label': 'Offset Controlling Unit Assign 01',
							'label$tr$': 'sales.wip.transaction.offsetContUnitAssign01',
							'type': 'code',
							'readonly': true
						},
						{
							'rid': 'transOffsetContUnitAssign01Desc',
							'gid': 'baseGroup',
							'model': 'CompanyTransaction.OffsetContUnitAssign01Desc',
							'label': 'Offset Controlling Unit Assign 01 Description',
							'label$tr$': 'sales.wip.transaction.offsetContUnitAssign01Desc',
							'type': 'description',
							'readonly': true
						},
						{
							'rid': 'transOffsetContUnitAssign02',
							'gid': 'baseGroup',
							'model': 'CompanyTransaction.OffsetContUnitAssign02',
							'label': 'Offset Controlling Unit Assign 02',
							'label$tr$': 'sales.wip.transaction.offsetContUnitAssign02',
							'type': 'code',
							'readonly': true
						},
						{
							'rid': 'transOffsetContUnitAssign02Desc',
							'gid': 'baseGroup',
							'model': 'CompanyTransaction.OffsetContUnitAssign02Desc',
							'label': 'Offset Controlling Unit Assign 02 Description',
							'label$tr$': 'sales.wip.transaction.offsetContUnitAssign02Desc',
							'type': 'description',
							'readonly': true
						},
						{
							'rid': 'transOffsetContUnitAssign03',
							'gid': 'baseGroup',
							'model': 'CompanyTransaction.OffsetContUnitAssign03',
							'label': 'Offset Controlling Unit Assign 03',
							'label$tr$': 'sales.wip.transaction.offsetContUnitAssign03',
							'type': 'code',
							'readonly': true
						},
						{
							'rid': 'transOffsetContUnitAssign03Desc',
							'gid': 'baseGroup',
							'model': 'CompanyTransaction.OffsetContUnitAssign03Desc',
							'label': 'Offset Controlling Unit Assign 03 Description',
							'label$tr$': 'sales.wip.transaction.offsetContUnitAssign03Desc',
							'type': 'description',
							'readonly': true
						},
						{
							'rid': 'transOffsetContUnitAssign04',
							'gid': 'baseGroup',
							'model': 'CompanyTransaction.OffsetContUnitAssign04',
							'label': 'Offset Controlling Unit Assign 04',
							'label$tr$': 'sales.wip.transaction.offsetContUnitAssign04',
							'type': 'code',
							'readonly': true
						},
						{
							'rid': 'transOffsetContUnitAssign04Desc',
							'gid': 'baseGroup',
							'model': 'CompanyTransaction.OffsetContUnitAssign04Desc',
							'label': 'Offset Controlling Unit Assign 04 Description',
							'label$tr$': 'sales.wip.transaction.offsetContUnitAssign04Desc',
							'type': 'description',
							'readonly': true
						},
						{
							'rid': 'transOffsetContUnitAssign05',
							'gid': 'baseGroup',
							'model': 'CompanyTransaction.OffsetContUnitAssign05',
							'label': 'Offset Controlling Unit Assign 05',
							'label$tr$': 'sales.wip.transaction.offsetContUnitAssign05',
							'type': 'code',
							'readonly': true
						},
						{
							'rid': 'transOffsetContUnitAssign05Desc',
							'gid': 'baseGroup',
							'model': 'CompanyTransaction.OffsetContUnitAssign05Desc',
							'label': 'Offset Controlling Unit Assign 05 Description',
							'label$tr$': 'sales.wip.transaction.offsetContUnitAssign05Desc',
							'type': 'description',
							'readonly': true
						},
						{
							'rid': 'transOffsetContUnitAssign06',
							'gid': 'baseGroup',
							'model': 'CompanyTransaction.OffsetContUnitAssign06',
							'label': 'Offset Controlling Unit Assign 06',
							'label$tr$': 'sales.wip.transaction.offsetContUnitAssign06',
							'type': 'code',
							'readonly': true
						},
						{
							'rid': 'transOffsetContUnitAssign06Desc',
							'gid': 'baseGroup',
							'model': 'CompanyTransaction.OffsetContUnitAssign06Desc',
							'label': 'Offset Controlling Unit Assign 06 Description',
							'label$tr$': 'sales.wip.transaction.offsetContUnitAssign06Desc',
							'type': 'description',
							'readonly': true
						},
						{
							'rid': 'transOffsetContUnitAssign07',
							'gid': 'baseGroup',
							'model': 'CompanyTransaction.OffsetContUnitAssign07',
							'label': 'Offset Controlling Unit Assign 07',
							'label$tr$': 'sales.wip.transaction.offsetContUnitAssign07',
							'type': 'code',
							'readonly': true
						},
						{
							'rid': 'transOffsetContUnitAssign07Desc',
							'gid': 'baseGroup',
							'model': 'CompanyTransaction.OffsetContUnitAssign07Desc',
							'label': 'Offset Controlling Unit Assign 07 Description',
							'label$tr$': 'sales.wip.transaction.offsetContUnitAssign07Desc',
							'type': 'description',
							'readonly': true
						},
						{
							'rid': 'transOffsetContUnitAssign08',
							'gid': 'baseGroup',
							'model': 'CompanyTransaction.OffsetContUnitAssign08',
							'label': 'Offset Controlling Unit Assign 08',
							'label$tr$': 'sales.wip.transaction.offsetContUnitAssign08',
							'type': 'code',
							'readonly': true
						},
						{
							'rid': 'transOffsetContUnitAssign08Desc',
							'gid': 'baseGroup',
							'model': 'CompanyTransaction.OffsetContUnitAssign08Desc',
							'label': 'Offset Controlling Unit Assign 08 Description',
							'label$tr$': 'sales.wip.transaction.offsetContUnitAssign08Desc',
							'type': 'description',
							'readonly': true
						},
						{
							'rid': 'transOffsetContUnitAssign09',
							'gid': 'baseGroup',
							'model': 'CompanyTransaction.OffsetContUnitAssign09',
							'label': 'Offset Controlling Unit Assign 09',
							'label$tr$': 'sales.wip.transaction.offsetContUnitAssign09',
							'type': 'code',
							'readonly': true
						},
						{
							'rid': 'transOffsetContUnitAssign09Desc',
							'gid': 'baseGroup',
							'model': 'CompanyTransaction.OffsetContUnitAssign09Desc',
							'label': 'Offset Controlling Unit Assign 09 Description',
							'label$tr$': 'sales.wip.transaction.offsetContUnitAssign09Desc',
							'type': 'description',
							'readonly': true
						},
						{
							'rid': 'transOffsetContUnitAssign10',
							'gid': 'baseGroup',
							'model': 'CompanyTransaction.OffsetContUnitAssign10',
							'label': 'Offset Controlling Unit Assign 10',
							'label$tr$': 'sales.wip.transaction.offsetContUnitAssign10',
							'type': 'code',
							'readonly': true
						},
						{
							'rid': 'transOffsetContUnitAssign10Desc',
							'gid': 'baseGroup',
							'model': 'CompanyTransaction.OffsetContUnitAssign10Desc',
							'label': 'Offset Controlling Unit Assign 10 Description',
							'label$tr$': 'sales.wip.transaction.offsetContUnitAssign10Desc',
							'type': 'description',
							'readonly': true
						},
						{
							'rid': 'transNominalDimension',
							'gid': 'baseGroup',
							'model': 'CompanyTransaction.NominalDimension',
							'label': 'Nominal Dimension',
							'label$tr$': 'sales.wip.transaction.nominalDimension',
							'type': 'code',
							'readonly': true
						},
						{
							'rid': 'transTaxCode',
							'gid': 'baseGroup',
							'model': 'CompanyTransaction.TaxCode',
							'label': 'Tax Code',
							'label$tr$': 'sales.wip.transaction.taxCode',
							'type': 'code',
							'readonly': true
						},
						{
							'rid': 'transPostingArea',
							'gid': 'baseGroup',
							'model': 'CompanyTransaction.PostingArea',
							'label': 'Posting Area',
							'label$tr$': 'sales.wip.transaction.postingArea',
							'type': 'integer',
							'readonly': true
						}
					]
				}
			};
		}]);

	angular.module(moduleName).factory('salesWipAccrualConfigurationService',
		['platformUIStandardConfigService', 'salesWipTranslationService', 'platformSchemaService', 'salesWipAccrualDetailLayout', 'platformUIStandardExtentService',
			function (platformUIStandardConfigService, salesWipTranslationService, platformSchemaService, salesWipAccrualDetailLayout, platformUIStandardExtentService) {

				var BaseService = platformUIStandardConfigService;
				var domains = platformSchemaService.getSchemaFromCache({
					typeName: 'WipAccrualDto',
					moduleSubModule: 'Sales.Wip'
				}).properties;
				var service = new BaseService(salesWipAccrualDetailLayout, domains, salesWipTranslationService);
				platformUIStandardExtentService.extend(service, salesWipAccrualDetailLayout.addition, domains);

				return service;
			}
		]);
})();
