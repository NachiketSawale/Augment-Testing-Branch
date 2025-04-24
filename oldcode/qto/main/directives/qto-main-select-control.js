( function (angular) {
	'use strict';
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('qto.main').directive('qtoMainSelectCellControl', ['_','$','$compile', '$timeout',
		'qtoMainLineType','qtoMainFormControlChangeService', 'basicsLookupdataLookupDescriptorService',
		'qtoMainFormulaType', 'qtoMainHeaderDataService', 'qtoMainDetailGridValidationService','qtoMainDetailService',
		function (_,$, $compile, $timeout, qtoMainLineType, controlChangeService, lookupDescriptorService, qtoMainFormulaType,
			qtoMainHeaderDataService, validationService,qtoMainDetailService) {
			let directive = {};
			directive.restrict = 'A';
			directive.replace = true;
			directive.scope = true;
			directive.link = function (scope, element) {
				// eslint-disable-next-line no-prototype-builtins
				if (scope.entity !== null && scope.entity.hasOwnProperty('Id')) {
					changeControlByType(scope, scope.entity.QtoLineTypeFk, element, true);
					changeControlByFormulaType(scope, element, scope.entity.QtoLineTypeFk, scope.entity.QtoFormulaFk);
				}

				let unwatchQtoLineTypeFk = scope.$watch('entity.QtoLineTypeFk', function (newLineTypeFk, oldLineTypeFk) {
					if (!scope.entity) {
						return;
					}
					// eslint-disable-next-line no-prototype-builtins
					if (!scope.entity.hasOwnProperty('Id')) {
						return;
					}
					if (parseInt(newLineTypeFk) !== parseInt(oldLineTypeFk)) {
						changeControlByType(scope, newLineTypeFk, element, true);
						changeControlByFormulaType(scope, element, scope.entity.QtoLineTypeFk, scope.entity.QtoFormulaFk);
					}
				});

				let unwatchQtoFormulaFk = scope.$watch('entity.QtoFormulaFk', function (newFormulaFk, oldFormulaFk) {
					if (!scope.entity) {
						return;
					}
					if (newFormulaFk === null || parseInt(newFormulaFk) === parseInt(oldFormulaFk)) {
						return;
					}
					let qtoLineType = scope.entity.QtoLineTypeFk;

					changeControlByFormulaType(scope, element, qtoLineType, newFormulaFk);

					let nowQtoFormula = _.find(lookupDescriptorService.getData('QtoFormula'), {Id: newFormulaFk});
					if (nowQtoFormula !== null && nowQtoFormula !== undefined && nowQtoFormula.QtoFormulaTypeFk !== qtoMainFormulaType.FreeInput) {
						changeControlByType(scope, scope.entity.QtoLineTypeFk, element, true);
					}
				});

				scope.$on('$destroy', function () {
					unwatchQtoLineTypeFk();
					unwatchQtoFormulaFk();
				});
			};

			// if FormulaType=FreeInput and QtoLineType=1,3,4 and FormulaType='FreeInput', Merge all Value1~OP5 and not show Formula
			function changeControlByFormulaType(scope, element, qtoLineType, qtoFormulaFk) {
				if (qtoLineType !== qtoMainLineType.Standard && qtoLineType !== qtoMainLineType.Subtotal &&
					qtoLineType !== qtoMainLineType.ItemTotal && qtoLineType !== qtoMainLineType.Hilfswert) {
					return;
				}

				let nowQtoFormula = _.find(lookupDescriptorService.getData('QtoFormula'), {Id: qtoFormulaFk});
				if (nowQtoFormula !== null && nowQtoFormula !== undefined && nowQtoFormula.QtoFormulaTypeFk === qtoMainFormulaType.FreeInput) {
					changeControlByType(scope, qtoFormulaFk, element, false);
				}
			}

			function changeControlByType(scope, type, element, isLineType) {
				let parent = $(element);
				let children = parent.children();
				if (children) {
					children.remove();
				}

				let getMaxLabelWidthByElement = function getMaxLabelWidthByElement(panel) {
					let label = panel.find('.platform-form-label').sort(
						function (labelA, labelB) {
							return angular.element(labelB).width() - angular.element(labelA).width();
						}
					)[0];

					return angular.element(label).width();
				};

				let otherElementWidth = parseInt($('.platform-form-label').css('min-width'));
				let rows = [];


				if (isLineType) {
					// if isLineType===true,say the qto_line-type lookup has changed,else is the formula lookup has changed
					switch (type) {
						case qtoMainLineType.CommentLine:
							// show Factor~OP5 merge and for LINE_TEXT field for the comment and not show formula
							rows = [
								{
									'rid': 'LineText',
									'gid': 'Location',
									'label$tr$': 'qto.main.Comment',
									'model': 'LineText',
									'type': 'directive',
									'directive': 'qto-comment-combobox',
									'options': {
										isTextEditable: true,
										filterKey: 'qto-main-comment-filter'
									}
								}
							];
							break;
						case qtoMainLineType.RRefrence:
							// show QTO_DETAIL_REFERENCE_FK lookup QTO_DETAIL_REFERENCE(Value1~OP1),  V2~OP5 merge and readonly
							rows = [
								{
									'rid': 'Factor',
									'gid': 'Location',
									'label$tr$': 'qto.main.Factor',
									'model': 'Factor',
									'type': 'factor'
								},
								{
									'rid': 'QtoDetailReferenceFk',
									'gid': 'Location',
									'label$tr$': 'qto.main.QtoDetailReference',
									'type': 'directive',
									'model': 'QtoDetailReferenceFk',
									'directive': 'qto-detail-reference-lookup',
									'options': {
										filterKey: 'qto-detail-reference-filter'
									}
								},
								{
									'rid': 'LineText',
									'gid': 'Location',
									'label$tr$': 'qto.main.Comment',
									'model': 'LineText',
									'type': 'remark'
								}
							];
							break;
						case qtoMainLineType.LRefrence:
							// show BOQ_ITEM_REFERENCE_FK ,BOQ_ITEM(V1~OP1)
							// show PRJ_LOCATION_REFERENCE_FK lookup ,PRJ_LOCATION(V2~OP2)
							// V3~OP5 merge and readonly
							rows = [
								{
									'rid': 'Factor',
									'gid': 'Location',
									'label$tr$': 'qto.main.Factor',
									'model': 'Factor',
									'type': 'factor'
								},
								{
									'rid': 'BoqItemFk',
									'gid': 'Location',
									'label$tr$': 'qto.main.boqItemReference',
									'model': 'BoqItemReferenceFk',
									'type': 'directive',
									'directive': 'basics-lookupdata-lookup-composite',
									'options': {
										lookupDirective: 'basics-lookup-data-by-custom-data-service',
										descriptionMember: 'BriefInfo.Description',
										lookupOptions: {
											'lookupType': 'boqItemLookupDataService',
											'dataServiceName': 'boqItemLookupDataService',
											'valueMember': 'Id',
											'displayMember': 'Reference',
											'filter': function () {
												if(qtoMainHeaderDataService.getSelected()){
													return qtoMainHeaderDataService.getSelected().BoqHeaderFk;
												}
											},
											filterKey: 'boq-item-reference-filter',
											'lookupModuleQualifier': 'boqItemLookupDataService',
											'columns': [
												{
													'id': 'Brief',
													'field': 'BriefInfo.Description',
													'name': 'Brief',
													'formatter': 'description',
													'name$tr$': 'cloud.common.entityBrief'
												},
												{
													'id': 'Reference',
													'field': 'Reference',
													'name': 'Reference',
													'formatter': 'description',
													'name$tr$': 'cloud.common.entityReference'
												},
												{
													'id': 'BasUomFk',
													'field': 'BasUomFk',
													'name': 'Uom',
													'formatter': 'lookup',
													'formatterOptions': {
														lookupType: 'uom',
														displayMember: 'Unit'
													},
													'name$tr$': 'cloud.common.entityUoM'
												}
											],
											'treeOptions': {
												'parentProp': 'BoqItemFk', 'childProp': 'BoqItems'
											}
										}
									}
								},
								{
									'rid': 'PrjLocationFk',
									'gid': 'Location',
									'label$tr$': 'qto.main.PrjLocationReference',
									'model': 'PrjLocationReferenceFk',
									'type': 'directive',
									'directive': 'basics-lookupdata-lookup-composite',
									'options': {
										'lookupDirective': 'basics-lookup-data-by-custom-data-service',
										'descriptionMember': 'DescriptionInfo.Translated',
										'lookupOptions': {
											'lookupType': 'projectLocationLookupDataService',
											'dataServiceName': 'projectLocationLookupDataService',
											'valueMember': 'Id',
											'displayMember': 'Code',
											'descriptionMember': 'DescriptionInfo.Translated',
											'filter': function () {
												var projectId = qtoMainDetailService.getSelectedProjectId();
												return projectId === null ? -1 : projectId;
											},
											filterKey: 'location-reference-filter',
											'lookupModuleQualifier': 'projectLocationLookupDataService',
											'lookupOptions': {
												'lookupType': 'projectLocationLookupDataService'
											},
											'columns': [
												{
													'id': 'Code',
													'field': 'Code',
													'name': 'Code',
													'formatter': 'code',
													'name$tr$': 'cloud.common.entityCode'
												},
												{
													'id': 'Description',
													'field': 'DescriptionInfo.Translated',
													'name': 'Description',
													'formatter': 'description',
													'name$tr$': 'cloud.common.entityDescription'
												}
											],
											'treeOptions': {'parentProp': 'LocationParentFk', 'childProp': 'Locations'},
											'showClearButton': true
										}
									}
								},
								{
									'rid': 'LineText',
									'gid': 'Location',
									'label$tr$': 'qto.main.Comment',
									'model': 'LineText',
									'type': 'remark'
								}
							];
							break;

						// Value1 and OP1 merged as a lookup for the boq item.
						case qtoMainLineType.IRefrence:
							rows = [
								{
									'rid': 'Factor',
									'gid': 'Location',
									'label$tr$': 'qto.main.Factor',
									'model': 'Factor',
									'type': 'factor'
								},
								{
									'rid': 'BoqItemFk',
									'gid': 'Location',
									'label$tr$': 'qto.main.boqItemReference',
									'model': 'BoqItemReferenceFk',
									'type': 'directive',
									'directive': 'basics-lookupdata-lookup-composite',
									'options': {
										lookupDirective: 'basics-lookup-data-by-custom-data-service',
										descriptionMember: 'BriefInfo.Description',
										lookupOptions: {
											'lookupType': 'boqItemLookupDataService',
											'dataServiceName': 'boqItemLookupDataService',
											'valueMember': 'Id',
											'displayMember': 'Reference',
											'filter': function () {
												if(qtoMainHeaderDataService.getSelected()){
													return qtoMainHeaderDataService.getSelected().BoqHeaderFk;
												}
											},
											filterKey: 'boq-item-reference-filter',
											'lookupModuleQualifier': 'boqItemLookupDataService',
											'columns': [
												{
													'id': 'Brief',
													'field': 'BriefInfo.Description',
													'name': 'Brief',
													'formatter': 'description',
													'name$tr$': 'cloud.common.entityBrief'
												},
												{
													'id': 'Reference',
													'field': 'Reference',
													'name': 'Reference',
													'formatter': 'description',
													'name$tr$': 'cloud.common.entityReference'
												},
												{
													'id': 'BasUomFk',
													'field': 'BasUomFk',
													'name': 'Uom',
													'formatter': 'lookup',
													'formatterOptions': {
														lookupType: 'uom',
														displayMember: 'Unit'
													},
													'name$tr$': 'cloud.common.entityUoM'
												}
											],
											'treeOptions': {
												'parentProp': 'BoqItemFk', 'childProp': 'BoqItems'
											}
										}
									}
								},
								{
									'rid': 'LineText',
									'gid': 'Location',
									'label$tr$': 'qto.main.Comment',
									'model': 'LineText',
									'type': 'remark'
								}
							];
							break;

						default:
							var qtoFormulaFk = scope.entity.QtoFormulaFk;
							var nowQtoFormula = _.find(lookupDescriptorService.getData('QtoFormula'), {Id: qtoFormulaFk}),
								qtoFormulaTypeFk;
							if (nowQtoFormula !== null && nowQtoFormula !== undefined) {
								qtoFormulaTypeFk = nowQtoFormula.QtoFormulaTypeFk;
							}

							if (qtoFormulaTypeFk === qtoMainFormulaType.FreeInput) {
								rows = [
									{
										'rid': 'Factor',
										'gid': 'Location',
										'label$tr$': 'qto.main.Factor',
										'model': 'Factor',
										'type': 'factor'
									},
									{
										'rid': 'LineText',
										'gid': 'Location',
										'label$tr$': 'qto.main.Comment',
										'model': 'LineText',
										'type': 'remark'
									}
								];
							}
							else {
								rows = [
									{
										'rid': 'Factor',
										'gid': 'Location',
										'label$tr$': 'qto.main.Factor',
										'model': 'Factor',
										'type': 'factor'
									},
									{
										'rid': 'Value1',
										'gid': 'Location',
										'label$tr$': 'qto.main.Value1',
										'model': 'Value1',
										'type': 'quantity'
									},
									{
										'rid': 'Operator1',
										'gid': 'Location',
										'label$tr$': 'qto.main.Operator1',
										'model': 'Operator1',
										'type': 'description'
									},
									{
										'rid': 'Value2',
										'gid': 'Location',
										'label$tr$': 'qto.main.Value2',
										'model': 'Value2',
										'type': 'quantity'
									},
									{
										'rid': 'Operator2',
										'gid': 'Location',
										'label$tr$': 'qto.main.Operator2',
										'model': 'Operator2',
										'type': 'description'
									},
									{
										'rid': 'Value3',
										'gid': 'Location',
										'label$tr$': 'qto.main.Value3',
										'model': 'Value3',
										'type': 'quantity'
									},
									{
										'rid': 'Operator3',
										'gid': 'Location',
										'label$tr$': 'qto.main.Operator3',
										'model': 'Operator3',
										'type': 'description'
									},
									{
										'rid': 'Value4',
										'gid': 'Location',
										'label$tr$': 'qto.main.Value4',
										'model': 'Value4',
										'type': 'quantity'
									},
									{
										'rid': 'Operator4',
										'gid': 'Location',
										'label$tr$': 'qto.main.Operator4',
										'model': 'Operator4',
										'type': 'description'
									},
									{
										'rid': 'Value5',
										'gid': 'Location',
										'label$tr$': 'qto.main.Value5',
										'model': 'Value5',
										'type': 'quantity'
									},
									{
										'rid': 'Operator5',
										'gid': 'Location',
										'label$tr$': 'qto.main.Operator5',
										'model': 'Operator5',
										'type': 'description'
									}
								];
							}
							break;
					}
				} else {
					rows = [
						{
							'rid': 'Factor',
							'gid': 'Location',
							'label$tr$': 'qto.main.Factor',
							'model': 'Factor',
							'type': 'factor'
						},
						{
							'rid': 'LineText',
							'gid': 'Location',
							'label$tr$': 'qto.main.Comment',
							'model': 'LineText',
							'type': 'remark'
						}
					];
				}


				let html = controlChangeService.getContextHtml(scope, rows, 1, validationService);
				element.append($compile(html)(scope));

				let adjustLabelWidth = function () {
					let labelWidth = getMaxLabelWidthByElement(element);
					let maxWidth = (labelWidth - otherElementWidth) > 0 ? labelWidth : otherElementWidth;
					$('.platform-form-label').css('min-width', maxWidth + 'px');
				};

				$timeout(function () {
					adjustLabelWidth();
				});
			}

			return directive;
		}]);
})(angular);

