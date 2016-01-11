var Librarian = Librarian || {};

Librarian.app = Librarian.app || angular.module('librarianApp', []);

Librarian.app
.factory("Lookup", function LookupFactory() {
    return function Lookup() {
        this.Text = '';
        this.Value = -1;
    };
})
.service("lookupService", function LookupService($http, $filter, $rootScope, Lookup) {
    var that = this;

    that.lookup = {};
    that.init = function (lookupName, valuesContainer) {
        if (that.lookup[lookupName]) return;

        that.lookup[lookupName] = angular.fromJson($(valuesContainer).val());
    };

    that.selectedListToUpdate = null;

    that.createUrl = $(".url-container.create-lookup-view").val();
    that.addUrl = $(".url-container.create-lookup").val();
    that.editUrl = $(".url-container.edit-lookup").val();
    that.updateUrl = $(".url-container.update-lookup").val();

    that.createContent = $("#createLookupPopupContainer .modal");
    that.editContent = $("#editLookupPopupContainer .modal");

    that.createContent.add(that.editContent).on("shown.bs.modal", function () {
        $(this).find("#text").select();
    });

    var modalByUrl = {};
    modalByUrl[that.createUrl] = that.createContent;
    modalByUrl[that.editUrl] = that.editContent;

    that.setDefaultButton = function (url) {
        var defaultButton = modalByUrl[url].find("button.btn-primary");
        modalByUrl[url].find("input").keypress(function (eventArgs) {
            if (eventArgs.which == 13)
                defaultButton.click();
            if (eventArgs.which == 27)
                modalByUrl[url].modal('hide');
        });
    };

    that.lookupData = {
        newLookup: new Lookup(),
        currLookup: {}
    };

    var $addScope;
    that.registerAddItemScope = function ($scope) {
        $addScope = $scope;
    };

    that.displayAddLookup = function (lookupName) {
        that.lookupData.lookupToUpdate = lookupName;
        that.createContent.modal();
        $addScope.$apply(function () {
            that.lookupData.newLookup = new Lookup();
        });
    }

    that.displayEditLookup = function (lookupName, lookup) {
        that.lookupData.lookupToUpdate = lookupName;
        if (lookup)
            that.lookupData.currLookup = lookup;
        //otherwise use currently set currLookup

        that.editContent.modal();
    };
})

.controller("lookupCreateCtrl", function LookupCreateCtrl($scope, $http, lookupService, validationService) {
    var that = this;
    that.form = function () { return $scope.createForm; };

    that.lookupData = lookupService.lookupData;
    that.createLookupUrl = lookupService.createUrl;

    lookupService.registerAddItemScope($scope);

    $scope.$on('$includeContentLoaded', function (eventArgs, src) {
        lookupService.setDefaultButton(src);
    });

    that.invalidFieldClass = function (field) {
        return validationService.invalidFieldClass(that.form(), field);
    };

    that.invalidIconClass = function (field) {
        return validationService.invalidIconClass(that.form(), field);
    };

    that.addLookup = function () {
        if (!validationService.validateForm(that.form()))
            return;
        var name = lookupData.lookupToUpdate;
        $http.post(lookupService.addUrl,
                   { name: name,
                     text: that.lookupData.newLookup.name})
             .then(function (addedLookup) {
                 var newLookup = addedLookup.data;
                 newLookup.RowState = 1; // 'Added';
                 lookupService.lookup[name].push({
                     name: newLookup.Text,
                     id: newLookup.Value
                 });
                 lookupService.selectedListToUpdate.push(newLookup);
                 lookupService.createContent.modal('hide');
                 that.form().$setPristine(); //not submitted for next use
             });
    };
})

.controller("lookupEditCtrl", function LookupEditCtrl(lookupService, $http, $scope, validationService) {
    var that = this;
    that.form = function () { return $scope.editForm; };

    that.editLookupUrl = lookupService.editUrl;
    that.lookupData = lookupService.lookupData;

    lookupService.editContent.on("show.bs.modal", function () {
        that.lookupData.currLookup = angular.copy(lookupService.lookupData.currLookup);
    });

    that.invalidFieldClass = function (field) {
        if (!field) return '';
        return validationService.invalidFieldClass(that.form(), field);
    };

    that.invalidIconClass = function (field) {
        if (!field) return '';
        return validationService.invalidIconClass(that.form(), field);
    };

    that.updateLookup = function () {
        if (!validationService.validateForm(that.form()))
            return;

        var name = lookupData.lookupToUpdate;
        $http.post(lookupService.updateUrl,
                   {
                       name: name,
                       entry: {
                           Text: that.lookupData.currLookup.name,
                           Value: that.lookupData.currLookup.id
                       }
                   })
             .then(function (updatedLookup) {
                 angular.copy(updatedLookup.data, lookupService.lookupData.currLookup);
                 lookupService.editContent.modal('hide');
                 that.form().$setPristine(); //not submitted for next use
             });
    };
});
