async function checkOrd(event) { //функция для работы с модальным окном
    let url = "http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/orders";
    let api_key = "?api_key=35a7578a-4292-405f-845e-fce51f65ee57";
    let allUrl = url + '/' + event.target.id + api_key;
    let responseOrdId;
    let getOrderById = await fetch(allUrl).then(
        data => data.json()).then(answer => responseOrdId = answer);
    console.log(responseOrdId);
    const modal = new bootstrap.Modal(document.querySelector('#MyModal'));
    document.querySelector('#guide-name').innerHTML = responseOrdId.guide_id;
    document.querySelector('#route-name').innerHTML = responseOrdId.route_id;
    document.querySelector('#inputDate').innerHTML = responseOrdId.date;
    document.querySelector('#inputTime').innerHTML = responseOrdId.time;
    document.querySelector('#excTime').innerHTML = responseOrdId.duration;
    document.querySelector('#inputPers').innerHTML = responseOrdId.persons;
    if (document.querySelector('#option1').hasAttribute('checked')) {
        document.querySelector('#option1').removeAttribute('checked');
    }
    if (document.querySelector('#option2').hasAttribute('checked')) {
        document.querySelector('#option2').removeAttribute('checked');
    }
    if (responseOrdId.optionFirst) {
        document.querySelector('#option1').setAttribute('checked', '');
    }
    if (responseOrdId.optionSecond) {
        document.querySelector('#option2').setAttribute('checked', '');
    }
    modal.show();
}

async function makeTableOrd() { //функция для загрузки таблицы заказов
    let url = "http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/orders";
    let api_key = "?api_key=35a7578a-4292-405f-845e-fce51f65ee57";
    let allUrl = url + api_key;
    let responseOrd;
    let getOrders = await fetch(allUrl).then(
        data => data.json()).then(answer => responseOrd = answer);
    console.log(responseOrd);
    let workingSpace = document.querySelector('tbody');
    workingSpace.innerHTML = '';
    for (let i = 0; i < responseOrd.length; i++) {
        let cell = document.createElement('tr');
        let date = document.createElement('td');
        let dateText = document.createTextNode(responseOrd[i].date);
        date.appendChild(dateText);
        cell.appendChild(date);
        let duration = document.createElement('td');
        let durationText = document.createTextNode(responseOrd[i].duration);
        duration.appendChild(durationText);
        cell.appendChild(duration);
        let time = document.createElement('td');
        let timeText = document.createTextNode(responseOrd[i].time);
        time.appendChild(timeText);
        cell.appendChild(time);
        let price = document.createElement('td');
        let priceText = document.createTextNode(responseOrd[i].price);
        price.appendChild(priceText);
        cell.appendChild(price);
        let eye = document.createElement('i');
        eye.id = responseOrd[i].id;
        eye.className = "fa-solid fa-eye";
        eye.onclick = checkOrd;
        cell.appendChild(eye);
        workingSpace.appendChild(cell);
    }
};

window.onload = function() {
    makeTableOrd();
};