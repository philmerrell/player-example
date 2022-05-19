(function(){
    var audio = new Audio('sound.wav');
    
    init();

    function init() {
        addAudioListeners();
        addPlayerControlListener();
        addProgressClickHandlerListener();
        addSpectrogramClickHandlerListener();
    }


    function addAudioListeners() {
        audio.addEventListener('progress', calculatePercentLoaded);
        audio.addEventListener('timeupdate', timeupdateHandler);
        audio.addEventListener('ended', endedHandler);
    }


    function addPlayerControlListener() {
        var button = document.getElementById('playerControl');
        button.addEventListener('click', function() {
            togglePlay();
        })
    }

    function addProgressClickHandlerListener() {
        document.getElementById('progress').addEventListener('click', function(event){
            var percent = (event.clientX-this.offsetLeft) / this.offsetWidth;
            var element = document.getElementById('clickProgress');
            element.innerHTML = 'You clicked ' + percent + '%';
            seekToPercent(percent);
        });
    }

    function addSpectrogramClickHandlerListener() {
        document.getElementById('spectrogram-container').addEventListener('click', function(event){
            var percent = (event.clientX-this.offsetLeft) / this.offsetWidth;
            var element = document.getElementById('spectrogramProgressInfo');
            element.innerHTML = 'You clicked ' + percent + '%';
            seekToPercent(percent);
        });
    }

    function seekToPercent(percent) {
        var duration = audio.duration;
        var seekTime = duration * percent;
        audio.currentTime = seekTime;
    }


    function calculatePercentLoaded() {
        try {
            var b = audio.buffered.end(0);
            var d = audio.duration;
            let percentLoaded = b / d;
            var element = document.getElementById('percentLoaded');
            element.innerHTML = 'Percent Loaded: ' + percentLoaded;
        } catch (err) {
            this.setPercentLoaded(0);
        }
        
    }

    function calculateMinutes(currentTime) {
        var minutes = Math.floor((currentTime / 60) % 60);
        // Pads with a 0 when less than 10.
        var displayMins = (minutes < 10) ? '0' + minutes : minutes;
        var element = document.getElementById('minutes');
        element.innerHTML = 'Minutes: ' + displayMins;
    }

    function calculatePercentElapsed(currentTime, duration) {
        var percent = currentTime / duration || 0;
        var element = document.getElementById('percentElapsed');
        element.innerHTML = 'Percent Elapsed: ' + percent;
        var progressBar = document.getElementById('progressBar');
        progressBar.style.width = percent * 100 + '%';
    }

    function calculateSeconds(currentTime) {
        var seconds = Math.floor(currentTime % 60);
        // Pads with a 0 when less than 10.
        var displaySecs = (seconds < 10) ? '0' + seconds : seconds;
        var element = document.getElementById('seconds');
        element.innerHTML = 'Seconds: ' + displaySecs;
    }

    function calculateSpectrogramProgressMarkerPosition(currentTime, duration) {
        var percent = currentTime / duration || 0;
        var spectrogramContainerElement = document.getElementById('spectrogram-container');
        var containerWidth = spectrogramContainerElement.offsetWidth;
        var position = containerWidth * percent;
        var element = document.getElementById('spectrogram-progress-marker');
        element.style.left = position + 'px';
    }

    function endedHandler() {
        var button = document.getElementById('playerControl');
        button.innerHTML = 'Play';
    }

    function timeupdateHandler() {
        var currentTime = audio.currentTime;
        var duration = audio.duration;
        calculateSeconds(currentTime);
        calculateMinutes(currentTime);
        calculatePercentElapsed(currentTime, duration);
        calculateSpectrogramProgressMarkerPosition(currentTime, duration);
    }

    function togglePlay() {
        var button = document.getElementById('playerControl');
        if (!audio.paused) {
            audio.pause();
            button.innerHTML = 'Play'
        } else {
            audio.play();
            button.innerHTML = 'Pause'
        }
    }
    
})();