$(function () {
    var p = "ws";
    if (location.protocol == 'https:') {
        p = "wss";
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

// if (window.DeviceOrientationEvent) {
//     window.addEventListener('deviceorientation', function (eventData) {
//         if (!!eventData.gamma) {
//             //w.EmitMessage(JSON.stringify({gamma: eventData.gamma, beta: eventData.beta, alpha: eventData.alpha}));
//             w.Emit("Data", JSON.stringify({
//                 gamma: eventData.gamma,
//                 beta: eventData.beta,
//                 alpha: eventData.alpha
//             }));
//         }
//     }, false);
// }
var args = {
    frequency: 1,					// ( How often the object sends the values - milliseconds )
    gravityNormalized: true,			// ( If the gravity related values to be normalized )
    orientationBase: GyroNorm.GAME,		// ( Can be GyroNorm.GAME or GyroNorm.WORLD. gn.GAME returns orientation values with respect to the head direction of the device. gn.WORLD returns the orientation values with respect to the actual north direction of the world. )
    decimalCount: 2,					// ( How many digits after the decimal point will there be in the return values )
    logger: null,					// ( Function to be called to log messages from gyronorm.js )
    screenAdjusted: true			// ( If set to true it will return screen adjusted values. )
};

var gn = new GyroNorm();

gn.init(args).then(function () {
    gn.start(function (data) {
        w.Emit("Data", JSON.stringify({
            gamma: data.do.gamma,
            beta: data.do.beta,
            alpha: data.do.alpha
        }));
        // Process:
        // data.do.alpha	( deviceorientation event alpha value )
        // data.do.beta		( deviceorientation event beta value )
        // data.do.gamma	( deviceorientation event gamma value )
        // data.do.absolute	( deviceorientation event absolute value )

        // data.dm.x		( devicemotion event acceleration x value )
        // data.dm.y		( devicemotion event acceleration y value )
        // data.dm.z		( devicemotion event acceleration z value )

        // data.dm.gx		( devicemotion event accelerationIncludingGravity x value )
        // data.dm.gy		( devicemotion event accelerationIncludingGravity y value )
        // data.dm.gz		( devicemotion event accelerationIncludingGravity z value )

        // data.dm.alpha	( devicemotion event rotationRate alpha value )
        // data.dm.beta		( devicemotion event rotationRate beta value )
        // data.dm.gamma	( devicemotion event rotationRate gamma value )
    });
}).catch(function (e) {
    // Catch if the DeviceOrientation or DeviceMotion is not supported by the browser or device
    alert(e);
});