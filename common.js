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
