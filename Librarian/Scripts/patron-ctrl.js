var Librarian = Librarian || {};

Librarian.app = Librarian.app || angular.module('librarianApp', []);

Librarian.app.service("patronService", function PatronService() {
    var that = this;

    that.patrons = JSON.parse($(".model-container").val());
    that.patronTypes = JSON.parse($("#lookupPatronType").val());

    that.detailsUrl = $(".url-container.details").val();
    that.createUrl = $(".url-container.create-view").val();
    that.addUrl = $(".url-container.create").val();
    that.deleteUrl = $(".url-container.delete").val();
    that.editUrl = $(".url-container.edit").val();
    that.updateUrl = $(".url-container.update").val();

    that.detailsContent = $("#detailPopupContainer .modal");
    that.createContent = $("#createPopupContainer .modal");
    that.deleteContent = $("#deletePopupContainer .modal");
    that.editContent = $("#editPopupContainer .modal");

    that.createContent.add(that.editContent).on("shown.bs.modal", function () {
        $(this).find("#title").select();
    });

    var modalByUrl = {};
    modalByUrl[that.createUrl] = that.createContent;
    modalByUrl[that.detailsUrl] = that.detailsContent;
    modalByUrl[that.deleteUrl] = that.deleteContent;
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

    that.patronData = {
        newPatron: new Patron(),
        currPatron: {}
    };

    that.displayPatron = function (patron) {
        if (patron)
            that.patronData.currPatron = patron;

        that.detailsContent.modal();
    };

    that.createPatron = function () {
        that.createContent.modal();
    }

    that.displayDeletePatron = function (patron) {
        that.patronData.currPatron = patron;
        //TODO merge/remove PatronItem
        that.deleteContent.modal();
    };

    that.displayEditPatron = function (patron) {
        that.detailsContent.modal('hide');

        if (patron)
            that.patronData.currPatron = patron;
        //otherwise use currently set currPatron

        that.editContent.modal();
    };
})

.controller("patronCtrl", function PatronCtrl(patronService, $scope) {
    var that = this;

    that.patrons = patronService.patrons;

    that.displayPatron = patronService.displayPatron;
    that.createPatron = patronService.createPatron;
    that.displayDeletePatron = patronService.displayDeletePatron;
    that.displayEditPatron = patronService.displayEditPatron;

    $scope.$on('$includeContentLoaded', function (eventArgs, src) {
        patronService.setDefaultButton(src);
    });
})

.controller("patronDetailCtrl", function PatronDetailCtrl(patronService) {
    var that = this;

    that.patronData = patronService.patronData;
    that.displayPatronUrl = patronService.detailsUrl;
    that.displayEditPatron = patronService.displayEditPatron;
})

.controller("patronDeleteCtrl", function PatronDeleteCtrl(patronService, $http, $scope) {
    var that = this;

    that.patronData = patronService.patronData;
    that.displayPatronUrl = patronService.detailsUrl;

    that.deletePatron = function () {
        var id = that.patronData.currPatron.ID;
        $http.post(patronService.deleteUrl,
                   { id: id })
             .then(function (deletedID) {
                 Librarian.removeByID(patronService.patrons, deletedID.data);
                 patronService.deleteContent.modal('hide');
             })
    };
})

.controller("patronCreateCtrl", function PatronCreateCtrl($scope, $http, patronService, validationService) {
    var that = this;
    that.form = function () { return $scope.createForm; };

    that.patronData = patronService.patronData;
    that.patronTypes = patronService.patronTypes;
    that.createPatronUrl = patronService.createUrl;

    that.invalidFieldClass = function (field) {
        return validationService.invalidFieldClass(that.form(), field);
    };

    that.invalidIconClass = function (field) {
        return validationService.invalidIconClass(that.form(), field);
    };

    that.addPatron = function () {
        if (!validationService.validateForm(that.form()))
            return;

        $http.post(patronService.addUrl,
                   patronService.patronData.newPatron)
             .then(function (addedPatron) {
                 patronService.patrons.push(addedPatron.data);
                 patronService.patronData.newPatron = new Patron();
                 patronService.patronData.currPatron = addedPatron.data;
                 patronService.createContent.modal('hide');
                 that.form().$setPristine(); //not submitted for next use
                 patronService.displayPatron();
             });
    };
})

.controller("patronEditCtrl", function PatronEditCtrl(patronService, $http, $scope, validationService) {
    var that = this;
    that.form = function () { return $scope.editForm; };

    that.editPatronUrl = patronService.editUrl;
    that.patronData = {};
    that.patronTypes = patronService.patronTypes;

    patronService.editContent.on("show.bs.modal", function () {
        that.patronData.currPatron = angular.copy(patronService.patronData.currPatron);
    });

    that.invalidFieldClass = function (field) {
        if (!field) return '';
        return validationService.invalidFieldClass(that.form(), field);
    };

    that.invalidIconClass = function (field) {
        if (!field) return '';
        return validationService.invalidIconClass(that.form(), field);
    };

    that.updatePatron = function () {
        if (!validationService.validateForm(that.form()))
            return;

        $http.post(patronService.updateUrl,
                   that.patronData.currPatron)
             .then(function (updatedPatron) {
                 angular.copy(updatedPatron.data, patronService.patronData.currPatron);
                 patronService.editContent.modal('hide');
                 that.form().$setPristine(); //not submitted for next use
                 patronService.displayPatron();
             });
    };
});

function Patron() {
    this.ID = 0;
    this.FirstName = "";
    this.LastName = "";
    this.Title = "";
    this.PatronType = { Key: 4, Value: "Student"},
    this.RowState = 0;
}
