var Librarian = Librarian || {};

Librarian.app = Librarian.app || angular.module('librarianApp', ['ngRoute', 'infinite-scroll']);

Librarian.app.service("librarian", function LibrarianService() {
    this.removeByID = function (arr, id, fieldName) {
        fieldName = fieldName || 'ID';

        for (var i = 0; i < arr.length; i++)
            if (arr[i][fieldName] == id) {
                arr.splice(i, 1);
                break;
            }
    };
});