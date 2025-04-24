/**
 * $Id$
 * Copyright (c) RIB Software SE
 */


(function(angular) {
	/* global globals */
	'use strict';

	let modulename = 'controlling.configuration';
	angular.module(modulename).directive('conditionFormatConfigDialog',['_','$http', '$compile', 'platformModalService','platformGridAPI',
		function (_, $http, $compile, platformModalService, platformGridAPI)   {
			return{
				restrict: 'AE',
				scope: false,
				link: function(scope, elem, attrs){
					let value = '';
					let htm ='<div class="input-group lookup-container grid-container ng-scope">';
					htm += '<input data-ng-readonly="true" type="text" class="input-group-content ng-pristine ng-valid ng-empty ng-touched" data-ng-model="' + (attrs.model || attrs.ngModel) + '">\n' +
						'    <span class="input-group-btn">\n' +
						'         <button class="btn btn-default control-icons ico-input-delete " data-ng-click="clearValue()"> </button>\n' +
						'         <button class="btn btn-default " data-ng-click="showDialog()">\n' +
						'             <div data-ng-class="getEditIcon()" class="control-icons ico-input-lookup lookup-ico-dialog"></div>\n' +
						'         </button>\n' +
						'    </span>';
					htm += '</div>';

					scope.clickEvent = function (event){
						event.stopPropagation();
					};

					let content = $compile(htm)(scope);

					elem.replaceWith(content);

					scope.clearValue = function (){
						scope.entity[scope.config.field] = '';
					};

					scope.showDialog = function showDialog(){
						let entity = scope.entity;
						let newScope = scope.$new(true);
						newScope.conditionalFormat = entity ? entity[scope.config.field] : '';
						newScope.onOK = function () {
							scope.$close({isOK: true, data: {}});
						};

						platformModalService.showDialog({
							templateUrl: globals.appBaseUrl + 'controlling.configuration/templates/comparison-format-config.html',
							backdrop: false,
							width: '640px',
							resizeable: true,
							scope: newScope
						}).then(function (result) {
							if (result.isOK) {
								entity[scope.config.field] = result.data;
								platformGridAPI.rows.refreshRow({gridId: scope.$parent.$parent.gridId, item: entity});
							}
						});
					};

					scope.$on('$destroy', function() {

					});
				}
			};
		}
	]);

})(angular);