$(function () {
    var p = "ws";
    if (location.protocol == 'https:') {
        p = "wss";
    } else {
        p = "ws";
    }
    w = new Ws(p + "://" + HOST + "/ws");

    w.OnConnect(function () {
        console.log("Connected");
        w.Emit("TO", ID)
    });

    w.OnDisconnect(function () {
        console.log("Disconnected")
    });

});

if (window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientation', function (eventData) {
        if (!!eventData.gamma) {
            //w.EmitMessage(JSON.stringify({gamma: eventData.gamma, beta: eventData.beta, alpha: eventData.alpha}));
            w.Emit("Data", JSON.stringify({
                ID: ID,
                gamma: eventData.gamma,
                beta: eventData.beta,
                alpha: eventData.alpha
            }));
        }
    }, false);
}
