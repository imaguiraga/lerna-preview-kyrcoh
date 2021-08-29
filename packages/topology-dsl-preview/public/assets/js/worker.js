onconnect = function (event) {
  var port = event.ports[0];

  port.onmessage = function (event) {
    port.postMessage(event.data);
  };
//*/
/*
  port.addEventListener('message', function (event) {
    port.postMessage(event.data);
  });

  port.start(); // Required when using addEventListener. Otherwise called implicitly by onmessage setter.
  //*/
}