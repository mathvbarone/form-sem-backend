const startForm = {
    // UI DECLARATION
    ui: {
        form: document.querySelector(".form"),
        fields: document.querySelectorAll(".input-field"),
        inputs: {
            name: document.querySelector(".name"),
            email: document.querySelector(".email"),
            message: document.querySelector(".message")
        },
        button: document.querySelector(".button"),
        backButton: document.querySelector(".back-button")
    },

    // FUNCTIONS
    functions: {
        formValidation: () => {
            const name = startForm.ui.inputs.name;
            const email = startForm.ui.inputs.email;
            const message = startForm.ui.inputs.message;
            const input = startForm.ui.fields;
            const button = startForm.ui.button;
            let erros = 0;

            const nameRegex = /[a-zA-Z\-'\s]+/;
            const emailRegex = /^[A-z0-9\.\-]{1,}\@\w+\.[A-z]{2,3}(\.[a-z]{2})?$/;
            const msgRegex = /.*\S.*/;

            const regexValidation = (regexValue, input) => {
                if (regexValue.test(input.value)) {
                    input.classList.remove("is-danger");
                    input.nextElementSibling.classList.add("is-hidden");
                } else {
                    input.classList.add("is-danger");
                    input.nextElementSibling.classList.remove("is-hidden");
                    erros++
                }
            };

            regexValidation(nameRegex, name);
            regexValidation(emailRegex, email);
            regexValidation(msgRegex, message);

            erros === 0 ? button.disabled = false : button.disabled = true;

        },

        formMessage: status => {
            const container = document.querySelector(".container");

            if(status == "loading"){
                messageText = `<figure class="is-loading-img">
                                    <svg width="66px"  height="66px"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" class="lds-dual-ring" style="background: none;">
                                        <circle cx="50" cy="50" ng-attr-r="{{config.radius}}" ng-attr-stroke-width="{{config.width}}" ng-attr-stroke="{{config.c1}}" ng-attr-stroke-dasharray="{{config.dasharray}}" fill="none" stroke-linecap="round" r="40" stroke-width="5" stroke="#fff" stroke-dasharray="62.83185307179586 62.83185307179586" transform="rotate(258 50 50)">
                                        <animateTransform attributeName="transform" type="rotate" calcMode="linear" values="0 50 50;360 50 50" keyTimes="0;1" dur="1s" begin="0s" repeatCount="indefinite"></animateTransform>
                                        </circle>
                                        <circle cx="50" cy="50" ng-attr-r="{{config.radius2}}" ng-attr-stroke-width="{{config.width}}" ng-attr-stroke="{{config.c2}}" ng-attr-stroke-dasharray="{{config.dasharray2}}" ng-attr-stroke-dashoffset="{{config.dashoffset2}}" fill="none" stroke-linecap="round" r="34" stroke-width="5" stroke="#2ab7cd" stroke-dasharray="53.40707511102649 53.40707511102649" stroke-dashoffset="53.40707511102649" transform="rotate(-258 50 50)">
                                        <animateTransform attributeName="transform" type="rotate" calcMode="linear" values="0 50 50;-360 50 50" keyTimes="0;1" dur="1s" begin="0s" repeatCount="indefinite"></animateTransform>
                                        </circle>
                                    </svg>
                                <figure>`;
                ajaxStatus = "loading";
            }
            if(status == "success"){
                messageText = `<div class="success-box">
                                    <svg class="checkmark checkmark-success" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                                        <circle class="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
                                            <path class="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                                    </svg>
                                    <strong>Sua mensagem foi enviada!</strong>
                                    <div class="column is-narrow has-text-centered">
                                        <button type="button" title="retornar" class="button back-button">Retornar</button>
                                    </div>
                                </div>`;
                ajaxStatus = "success";
            }
            if(status == "fail"){
                messageText = `<div class="error-box">
                                    <svg class="checkmark  checkmark-error" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                                        <circle class="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
                                        <path class="checkmark-check" fill="none" d="M16 16 36 36 M36 16 16 36"/>
                                    </svg>
                                    <strong>Ocorreu um erro :( <br/> Tente novamente mais tarde</strong>
                                    <div class="column is-narrow has-text-centered">
                                        <button type="button" title="retornar" class="button back-button">Retornar</button>
                                    </div>
                                </div>`;
                ajaxStatus = "fail";
            }

            msgBox = `<div class="message-alert">
                        <div class="is-${ajaxStatus}">
                                ${messageText}
                        </div>
                     </div>`;

            return container.innerHTML += msgBox;

        },

        return: () => {
            const form = document.querySelector(".form");
            const fields = startForm.ui.fields;
            const messageBox = document.querySelectorAll(".message-alert");

            form.classList.remove("is-hidden");

            messageBox.forEach(box =>{
                box.classList.add("is-hidden");
            })
        },

        sendData: e => {
            e.preventDefault();

            const form = startForm.ui.form;

            const request = new XMLHttpRequest();
            request.open('POST', '//formspree.io/matheusbaroneteste@gmail.com', true);
            request.setRequestHeader('accept', 'application/json');

            const formData = new FormData(form);
            request.send(formData);

            request.onreadystatechange = function () {
                if (request.readyState === 3) {
                    form.classList.add("is-hidden");
                    startForm.functions.formMessage("loading");
                }
                else if (request.readyState === 4) {
                    if (request.status == 200 && request.status < 300) {
                        setTimeout(function () {
                            document.querySelector(".is-loading").classList.add("is-hidden");
                            startForm.functions.formMessage("success");

                            const backButton = document.querySelector(".back-button");
                            backButton.addEventListener("click", startForm.functions.return);

                            return;
                        }, 100);
                    }
                    else {
                        startForm.functions.formMessage("fail");
                    }

                }
            }
        }

    },

    //EVENTS
    events: {
        init: () => {
            const initUi = startForm.ui;
            const initFunctions = startForm.functions;
            const button = initUi.button;



            initUi.fields.forEach(field => {
                field.addEventListener("input", initFunctions.formValidation);
            });

            button.addEventListener("click", initFunctions.sendData);
        }
    }
};


startForm.events.init();