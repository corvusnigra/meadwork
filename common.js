var globalPlayer = document.createElement('audio'),
    playingItem;
new Promise(function(resolve) {
    if (document.readyState === 'complete') {
        resolve();
    } else {
        window.onload = resolve;
    }
}).then(function() {
    return new Promise(function(resolve, reject) {
        VK.init({
            apiId: 5695336
        });
        VK.Auth.login(function(response) {
            if (response.session){
                resolve(response);
            } else {
                reject(new Error('Не удалось авторизоваться'));
            }
        }, 8);
    });
}).then(function() {
    return new Promise(function(resolve, reject) {
        VK.api('users.get', {'name_case': 'gen'},
            function(response) {
                if (response.error) {
                    reject(new Error(response.error.error_msg));
                } else {
                    var headerInfo = document.querySelector('#header');
                    headerInfo.textContent = 'Музыка на странице' + ' ' + response.response[0].first_name + ' ' + response.response[0].last_name;
                    resolve();
                }
            });
    })
}).then(function () {

        var prevSongButton = document.querySelector('#prevSongButton');
        var mainSongButton = document.querySelector('#mainSongButton');
        var nextSongButton = document.querySelector('#nextSongButton');

        results.addEventListener('click', function (e) {
            if(e.target.classList.contains('progress')) {
                var currentProgress = e.target.closest('li');
                var progress = e.offsetX;
                var widthProgressBar = e.target.clientWidth;
                var duration = parseInt(100/widthProgressBar * progress);
                var songTime = globalPlayer.duration;
                var audioWidth = songTime * duration/100;
                if(currentProgress === playingItem){
                    globalPlayer.currentTime = audioWidth;
                }

            }
            if(e.target.getAttribute('data-role') === 'playback') {
                var currentItem = e.target.closest('li');
                if(currentItem === playingItem) {
                    if(globalPlayer.paused){
                        globalPlayer.play();
                    } else {
                        globalPlayer.pause();
                    }
                } else {
                    if(!globalPlayer.paused) {
                        onPause();
                    }

                    playingItem = currentItem;

                    globalPlayer.src = e.target.getAttribute('data-src');
                    globalPlayer.play();

                }
            }
        });

        function onProgress(e) {
            var progressBar = playingItem.querySelector('[data-role = progressbar]');
            var duration = e.target.duration;
            var currentTime = e.target.currentTime;
            var progress = parseInt(100/duration * currentTime);

            progressBar.style.width = progress + '%';
        }
        function onPlay() {
            playingItem.querySelector('[data-role = playback]').className = 'glyphicon glyphicon-pause';
            mainSongButton.querySelector('[data-role = playback]').className = 'glyphicon glyphicon-pause';
        }

        function onPause() {
            playingItem.querySelector('[data-role = playback]').className = 'glyphicon glyphicon-play';
            mainSongButton.querySelector('[data-role = playback]').className = 'glyphicon glyphicon-play';
        }


        function toSong(to) {
            if(playingItem){

                    var nextPlayer = to === 'next' ? playingItem.nextElementSibling : playingItem.previousElementSibling;


                if(nextPlayer) {

                    nextPlayer.querySelector('[data-role=playback]').click();

                }
            }
        };

    
        prevSongButton.addEventListener('click', function () {
            toSong('prev')
        });
        mainSongButton.addEventListener('click', function () {

                if (globalPlayer.paused) {
                    globalPlayer.play();
                } else {
                    globalPlayer.pause();
                }
            
        });
        nextSongButton.addEventListener('click', function () {
            toSong('next')
        });



        globalPlayer.addEventListener('play', onPlay);
        globalPlayer.addEventListener('pause', onPause);
        globalPlayer.addEventListener('timeupdate', onProgress);




        return new Promise(function(resolve, reject) {
            VK.api('audio.get',{}, function (response) {
                if(response.error){
                    reject(new Error(response.error.erroe_msg))
                }else{
                    console.log(response);
                    var playerItemTemplate = document.querySelector('#playerItemTemplate');
                    var results = document.querySelector('#results');
                    var source = playerItemTemplate.innerHTML;
                    var templateFn = Handlebars.compile(source);
                    var template = templateFn({list: response.response});
                    results.innerHTML = template;
                    resolve();
                }

            })
        })
}).catch(function(e) {
    alert('Ошибка: ' + e.message);
});/**
 * Created by URIY on 30.10.2016.
 */
