var Librarian = Librarian || {};

Librarian.app = Librarian.app || angular.module('librarianApp', []);

Librarian.app
    .service("dialogService", function DialogService() {
        var that = this;

        that.showDialog = function (container) {
            $(container).find("bootstrap-dialog").triggerHandler("displayDialog");
        };

        that.hideDialog = function (container) {
            $(container).find("bootstrap-dialog").triggerHandler("hideDialog");
        };
    })
    .factory("ServiceWithDialogs", function serviceWithDialogsFactory(dialogService) {
        return function ServiceWithDialogs() {
            var that = this;

            that.showDialog = dialogService.showDialog;
            that.hideDialog = dialogService.hideDialog;

            that.showDetails = function () { that.showDialog("#detailPopupContainer"); };
            that.showCreate = function () { that.showDialog("#createPopupContainer"); };
            that.showDelete = function () { that.showDialog("#deletePopupContainer"); };
            that.showEdit = function () { that.showDialog("#editPopupContainer"); };

            that.hideDetails = function () { that.hideDialog("#detailPopupContainer"); };
        };
    })
    .directive("bootstrapDialog", function () {
        return {
            restrict: 'E',
            //scope: {
            //    primaryText: '@',
            //    loadingText: '@',
            //    primaryAction: '&',
            //    closeAction: '&',
            //    include: '?=',
            //    title: '@',
            //    onShown: '&'
            //    onHidden: '&'
            //},
            transclude: true,
            template: function ($element, $attributes) {
                var howToClose = $attributes.closeAction ? 'ng-click="' + $attributes.closeAction + '"' : 'data-dismiss="modal"';
                var include = $attributes.include ? ' ng-include="' + $attributes.include + '"' : '';
                var transclude = $attributes.include ? '' : '<ng-transclude></ng-transclude>';

                return '<div class="modal fade" tabindex="-1" role="dialog">' +
                    '<div class="modal-dialog" tabindex="0">' +
                        '<div class="modal-content">' +
                            '<div class="modal-header">' +
                                '<button type="button" class="close" ' + howToClose + ' aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
                                '<h4 class="modal-title">' + $attributes.title + '</h4>' +
                            '</div>' +
                            '<div class="modal-body"' + include + '>' +
                                transclude +
                            '</div>' +
                            '<div class="modal-footer">' +
                                '<button type="button" class="btn btn-primary" ng-click="' + $attributes.primaryAction + '()">' + $attributes.primaryText + '</button>' +
                                '<button type="button" class="btn btn-default" ' + howToClose + '>Close</button>' +
                            '</div>' +
                        '</div><!-- /.modal-content -->' +
                    '</div><!-- /.modal-dialog -->' +
                '</div><!-- /.modal -->';
            },
            link: function dialogLink($scope, $element, $attributes, noSuchController, $transclude, $injector) {
                //var controllerName = $element.closest('[ng-controller]').attr('ng-controller');
                //if (!controllerName) {
                //    if ($injector.has('$route'))
                //        controllerName = $injector.get('$route').current.controller
                //}
                $transclude($scope, function (clone, $innerScope) {
                    
                });

                function setDefault() {
                    $element.find("input,textarea,select").keypress(function (eventArgs) {
                        if (eventArgs.which == 13) {
                            $scope.$apply($scope.$eval($attributes.primaryAction));
                        } else if (eventArgs.which == 27)
                            $element.find(".modal").modal('hide');
                    });
                }

                //var $transcludedForm = $("form,ng-form");
                //var formName = $transcludedForm.attr("name");
                //if ($transcludedForm.length > 0 && formName) {
                //    $scope[formName] = $transcludedForm.find("input").first().controller(formName);
                //}

                if ($attributes.include || $element.find("ng-include,[ng-include]").length > 0) {
                    $scope.$on("$includeContentLoaded", function () {
                        setDefault();
                    });
                } else {
                    setDefault();
                }

                $element.find(".modal").on("show.bs.modal", function () {
                    if ($attributes.onShow)
                        $scope.$eval($attributes.onShow);
                })
                .on("shown.bs.modal", function () {
                    $element.find("input,textarea,select").first().select();
                })
                .on("hidden.bs.modal", function () {
                    if ($attributes.onHidden)
                        $scope.$eval($attributes.onHidden);
                });

                $element.on("displayDialog", function () {
                    $scope.showDialog();
                });

                $element.on("hideDialog", function () {
                    $scope.hideDialog();
                });

                $scope.showDialog = function () {
                    $element.find(".modal").modal('show');
                };

                $scope.hideDialog = function () {
                    $element.find(".modal").modal('hide');
                };

                $scope.notifyDialogSending = function () {
                    var btns = $element.find(".modal-footer button,.modal-header button");
                    btns.addClass("disabled").attr("disabled", "disabled");
                    $element.find(".modal-footer .btn-primary").html("<i class='glyphicon glyphicon-refresh'></i> " + $attributes.loadingText);
                };

                $scope.notifyDialogSendComplete = function () {
                    var btns = $element.find(".modal-footer button,.modal-header button");
                    btns.removeClass("disabled").removeAttr("disabled");
                    $element.find(".modal-footer .btn-primary").html($attributes.primaryText);
                };
            }

        };

    });
