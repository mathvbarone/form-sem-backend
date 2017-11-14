(() => {
  // DECLARANDO AS VARIÁVEIS REFERENTES À INTERFACE
  const form = document.querySelector(".form");
  const fields = document.querySelectorAll(".input-field");
  const nameInput = document.querySelector("#name");
  const emailInput = document.querySelector("#email");
  const messageInput = document.querySelector("#message");
  const submitButton = document.querySelector("#submit-button");
  const container = document.querySelector(".container");

  // FUNÇÃO DE VALIDAÇÃO DO FORM
  const validateForm = () => {
    const nameRegexp = /[a-zA-Z\-'\s]+/;
    const emailRegexp = /^[A-z0-9.-]{1,}@\w+\.[A-z]{2,3}(\.[a-z]{2})?$/;
    const msgRegexp = /.*\S.*/;

    submitButton.disabled = false;

    // FUNÇÃO DE VALIDAÇÃO DO CAMPO
    const validateField = (regExp, field) => {
      if (regExp.test(field.value)) {
        field.classList.remove("is-danger");
        field.nextElementSibling.classList.add("is-hidden");
      } else {
        field.classList.add("is-danger");
        field.nextElementSibling.classList.remove("is-hidden");
        submitButton.disabled = true;
      }
    };

    const regExpFieldObject = [
      { regExp: nameRegexp, field: nameInput },
      { regExp: emailRegexp, field: emailInput },
      { regExp: msgRegexp, field: messageInput },
    ];

    regExpFieldObject.forEach(regExpField => validateField(regExpField.regExp, regExpField.field));
  };

  // FUNÇÃO REFERENTE ÀS MENSAGENS DE NOTIFICAÇÃO
  const displayMessage = (status) => {
    let message = "";
    switch (status) {
      case "loading":
        message = `
                    <figure class="is-loading-img">
                        <svg width="66px"  height="66px"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" class="lds-dual-ring" style="background: none;">
                          <circle cx="50" cy="50" ng-attr-r="{{config.radius}}" ng-attr-stroke-width="{{config.width}}" ng-attr-stroke="{{config.c1}}" ng-attr-stroke-dasharray="{{config.dasharray}}" fill="none" stroke-linecap="round" r="40" stroke-width="5" stroke="#23d160" stroke-dasharray="62.83185307179586 62.83185307179586" transform="rotate(258 50 50)">
                              <animateTransform attributeName="transform" type="rotate" calcMode="linear" values="0 50 50;360 50 50" keyTimes="0;1" dur="1s" begin="0s" repeatCount="indefinite"></animateTransform>
                          </circle>
                          <circle cx="50" cy="50" ng-attr-r="{{config.radius2}}" ng-attr-stroke-width="{{config.width}}" ng-attr-stroke="{{config.c2}}" ng-attr-stroke-dasharray="{{config.dasharray2}}" ng-attr-stroke-dashoffset="{{config.dashoffset2}}" fill="none" stroke-linecap="round" r="34" stroke-width="5" stroke="#209cee" stroke-dasharray="53.40707511102649 53.40707511102649" stroke-dashoffset="53.40707511102649" transform="rotate(-258 50 50)">
                              <animateTransform attributeName="transform" type="rotate" calcMode="linear" values="0 50 50;-360 50 50" keyTimes="0;1" dur="1s" begin="0s" repeatCount="indefinite"></animateTransform>
                          </circle>
                        </svg>
                    <figure>
                  `;
        break;
      case "success":
        message = `
                    <div class="success-box">
                        <svg class="checkmark checkmark-success" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                            <circle class="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
                                <path class="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                        </svg>
                        <strong>Sua mensagem foi enviada!</strong>
                        <div class="column is-narrow has-text-centered">
                            <button type="button" title="Retornar" class="button is-info back-button">Retornar</button>
                        </div>
                    </div>
                  `;
        break;
      case "fail":
        message = `
                    <div class="error-box">
                        <svg class="checkmark  checkmark-error" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                            <circle class="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
                            <path class="checkmark-check" fill="none" d="M16 16 36 36 M36 16 16 36"/>
                        </svg>
                        <strong>Ocorreu um erro :( <br/> Tente novamente mais tarde</strong>
                        <div class="column is-narrow has-text-centered">
                            <button type="button" title="Retornar" class="button is-info back-button">Retornar</button>
                        </div>
                    </div>
                  `;
        break;
      // no default
    }
    container.insertAdjacentHTML(
      "beforeend",
      `
        <div class="message-alert">
            <div class="is-${status}">
                    ${message}
            </div>
        </div>
    `,
    );
  };

  // FUNÇÃO REFERENTE AO BOTÂO DE RETORNAR
  const returnButtonAction = () => {
    const messagesAlert = document.querySelectorAll(".message-alert");

    form.style.display = "block";

    fields.forEach((field) => {
      field.value = "";
    });

    messagesAlert.forEach((message) => {
      message.remove();
    });
  };

  // FUNÇÃO REFERENTE ÀS AÇÕES DEPOIS QUE O FORM TIVER SIDO ENVIADO
  const afterMsgSent = () => {
    form.style.display = "none";

    document.querySelectorAll(".is-loading").forEach((loadBox) => {
      loadBox.style.display = "none";
    });

    const backButton = document.querySelector(".back-button");
    backButton.addEventListener("click", returnButtonAction);
  };

  // FUNÇÃO DE ENVIO DO FORMULÁRIO
  const submitMessage = (event) => {
    event.preventDefault();
    const request = new XMLHttpRequest();
    request.open("POST", "https://formspree.io/matheusbaroneteste@gmail.com", true);
    request.setRequestHeader("accept", "apliccation/json");

    const formData = new FormData(form);
    request.send(formData);

    request.onreadystatechange = () => {
      const { readyState, status } = request;
      if (readyState === 3) {
        form.style.display = "none";
        displayMessage("loading");
      } else if (readyState === 4) {
        if (status === 200) {
          //  SET TIME OUT PARA O LOADING APARECER
          setTimeout(() => {
            displayMessage("success");
            afterMsgSent();
          }, 1000);
        } else {
          //  SET TIME OUT PARA O LOADING APARECER
          setTimeout(() => {
            displayMessage("fail");
            afterMsgSent();
          }, 1000);
        }
      }
    };
  };

  // FUNÇÃO DE INICIALIZAÇÃO
  const init = () => {
    fields.forEach((field) => {
      field.addEventListener("input", validateForm);
    });
    form.addEventListener("submit", submitMessage);
  };

  init();
})();
