define(["require", "underscore", "jquery", "knockout", "pubsub", "moment"], function (require, _, $, ko, pubsub, moment) {
  function RightBarModel() {
    var _this = this;
    _this.events = ko.observableArray();

    var url = window.location.origin + "/userevents";

    $.get(url, function (args) {

      args = _.map(args, function(event){
        event.EventTime = moment(event.EventTime).format("MMMM Do YYYY, h:mm:ss a");
        return event;
      });

      _this.events(args);
    });

  }

  return new RightBarModel();
});