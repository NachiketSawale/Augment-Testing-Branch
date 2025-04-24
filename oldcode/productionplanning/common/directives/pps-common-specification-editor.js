/**
 * Created by reimer on 08.12.2016
 */
(function () {

    /* global angular */
    'use strict';

    /**
     * @ngdoc directive
     * @name
     * @description
     */
    var moduleName = 'productionplanning.common';
    angular.module(moduleName).directive('ppsCommonSpecificationEditor', [
        function () {

            // var template = '<textarea class="flex-element form-control noresize" ng-model="entity.Content" ng-change="ngChange()" ng-readonly="readonly"></textarea>';
            var template = '<textarea class="flex-element" ng-model="entity.Content" ng-readonly="readonly"></textarea>';

            function getPos(element) {
                if ('selectionStart' in element) {
                    return element.selectionStart;
                } else if (document.selection) {
                    element.focus();
                    var sel = document.selection.createRange();
                    var selLen = document.selection.createRange().text.length;
                    sel.moveStart('character', -element.value.length);
                    return sel.text.length - selLen;
                }
            }

            // function setPos(element, caretPos) {
            //	if (element.createTextRange) {
            //		var range = element.createTextRange();
            //		range.move('character', caretPos);
            //		range.select();
            //	} else {
            //		element.focus();
            //		if (element.selectionStart !== undefined) {
            //			element.setSelectionRange(caretPos, caretPos);
            //		}
            //	}
            // }

            return {

                restrict: 'A',

                scope: {
                    ngModel: '=',
                    ngChange: '&',
                    entity: '=',
                    addTextComplement: '=', // changes force directive to add a text complement at the current pos
                    selectTextComplement: '=',
                    readonly: '=',
                    options: '='
                },

                template: template,

                link: linker
            };

            function linker(scope, element, attrs, controller) {  // jshint ignore:line

                var textArea = element[0].childNodes[0];

                if (!scope.options.cursorPos) {
                    scope.cursorPos = {
                        get: 0
                    };
                }

            // remove boqMainTextComplementHelperService.canEditContent() in alm 140141(svn revision 80375)
            function canEditContent(content, pos) {
                if (content && pos) {
                    let complements = content.match(/\[[\s\S]*?\['[\s\S]*?'\][\s\S]*?]/gi);
                    if (complements) {
                        for (var i = 0; i < complements.length; i++) {
                            var start = content.indexOf(complements[i]);
                            if (start !== -1) {
                                if (pos > start && pos < start + complements[i].length) {
                                    return false;
                                }
                            }
                        }
                    }
                }
                return true;
            }

                // handle input of printable characters and paste
                element.on('keypress paste', function (e) {
                    var pos = getPos(textArea);
                    if (!canEditContent(textArea.value, pos)) {
                        e.preventDefault();
                        return;
                    }
                });

                // handle backspace, delete keys
                element.bind('keydown click', function (e) {

                    // update current cursor pos
                    var pos = getPos(textArea);
                    scope.$apply(function () {
                        scope.options.cursorPos.get = pos;
                    });

                    if (e.keyCode === 8) // backspace key
                    {
                        if (!canEditContent(textArea.value, pos) || !canEditContent(textArea.value, pos - 1)) {
                            e.preventDefault();
                            return;
                        }
                    }

                    if (e.keyCode === 46)   // delete key
                    {
                        if (!canEditContent(textArea.value, pos) || !canEditContent(textArea.value, pos + 1)) {
                            e.preventDefault();
                            return;
                        }
                    }

                });

                // scope.$watch('cursorPos.set', function(newVal) {
                //	if (typeof newVal === 'undefined') { return; }
                //	setPos(textElement, newVal);
                // });

                // need watch for entity since binding does not properly work!
                scope.$watch('entity', function (newValue, oldValue) {
                    if (scope.ngChange) {
                        if (newValue.Id === oldValue.Id && newValue.Version === oldValue.Version && newValue.Content !== oldValue.Content) {
                            scope.ngChange();
                        }
                    }
                }, true);

                scope.$watch('addTextComplement', function (newVal) {
                    if (newVal) {
                        var pos = getPos(textArea);
                        // var content = scope.entity.Content || ''; --> removes last linefeed?
                        if (!canEditContent(textArea.value, pos)) {
                            return;
                        }
                        scope.entity.Content = textArea.value.substring(0, pos) + newVal + textArea.value.substring(pos + 1, textArea.value.length);
                        scope.addTextComplement = null; // must clear value - otherwise watch will not be fired after next insertion of a text complement
                        // scope.ngChange(); // must call change callback to trigger set modified flag (binding does not work properly?)
                    }
                });

                scope.$watch('selectTextComplement', function (newVal) {
                    if (newVal) {
                        var content = (scope.entity.Content || '');
                        var start = content.indexOf(newVal);	// doesn't ignore spaces!
                        if (start !== -1) {
                            textArea.focus();
                            // textArea.setSelectionRange(start === 0 ? 0 : start - 1, start + newVal.length);
                            textArea.setSelectionRange(start, start + newVal.length);

                            // we need the number of chars in a row
                            var charsPerRow = textArea.cols;
                            // we need to know at which row our selection starts
                            var selectionRow = (start - (start % charsPerRow)) / charsPerRow;
                            // we need to scroll to this row but scrolls are in pixels,
                            // so we need to know a row's height, in pixels
                            var lineHeight = textArea.clientHeight / textArea.rows;
                            // scroll !!
                            textArea.scrollTop = lineHeight * selectionRow;

                        }
                    }
                });

                element.on('$destroy', function () {
                });

            }
        }
    ]);
})();
