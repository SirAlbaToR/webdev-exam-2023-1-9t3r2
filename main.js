let routeNameSelect = '';
let routeObjSelect = String('');
let routePage = 0;
let amountOfPagesForRoutes;
let choosenRoute;
let choosenRouteName;
let guidePage = 0;
let choosenGuide;
let choosenGuideName;
let amountOfPagesForGuides;
let guideLangFilter = '';
let guideExpMinFilter;
let guideExpMaxFilter;
let guidePrice;
let createdExp = 0;
let createdLang = 0;

function errorMsg(error) { //функция вывода ошибки на экран
    let errorPlace = document.querySelector('#error-msg');
    errorPlace.className = 'alert alert-danger';
    errorPlace.innerHTML = error;
    setTimeout(() => {
        errorPlace.innerHTML = ''; 
        errorPlace.className = 'alert alert-danger d-none';
    }, 3000);
}

function modalOpen(event) { //функция работы с модальным окном
    let workingSpace = document.querySelector('.modal-body');
    let guideNamePlace = workingSpace.querySelector('#guide-name');
    guideNamePlace.innerHTML = choosenGuideName;
    let routeNamePlace = workingSpace.querySelector('#route-name');
    routeNamePlace.innerHTML = choosenRouteName;
    let timeExc = workingSpace.querySelector('#excTime');
    let price = guidePrice;
    let pricePlace = workingSpace.querySelector('#all-price');
    pricePlace.innerHTML = price + ' рублей';
    let timeExcursion = 1;
    timeExc.onchange = function(event) {
        price = guidePrice * event.target.value;
        pricePlace.innerHTML = price + ' рублей';
        timeExcursion = event.target.value;
    };
    let datePlace = workingSpace.querySelector('#inputDate');
    let date;
    datePlace.onchange = function(event) {
        date = event.target.value;
    };
    let timeStart;
    let timeStartPlace = workingSpace.querySelector('#inputTime');
    timeStartPlace.onchange = function(event) {
        if (event.target.value.substring(0, 2) < 9) {
            event.target.value = "09:00";
        }
        if (event.target.value.substring(0, 2) > 23) {
            event.target.value = "23:00";
        }
        if ((event.target.value.substring(0, 2) <= 12)
        && (event.target.value.substring(0, 2) >= 9)) {
            price += 400;
        } else if ((event.target.value.substring(0, 2) <= 23) 
        && event.target.value.substring(0, 2) >= 20) {
            price += 1000;
        };
        timeStart = event.target.value;
        pricePlace.innerHTML = price + ' рублей';
    };
    let counterForOpt2 = 0;
    let numbersOfVisitors = 0;
    let numbersOfVisitorsPlace = workingSpace.querySelector('#inputPers');
    numbersOfVisitorsPlace.onchange = function(event) {
        if ((numbersOfVisitors >= 5)
        && (numbersOfVisitors < 10)) {
            price -= 1000;
        } else if ((numbersOfVisitors >= 10) && numbersOfVisitors <= 20) {
            price -= 1500;
        };
        if (counterForOpt2 % 2 == 1) {
            price = price - numbersOfVisitors * 500;
            if (event.target.value > 20) {
                event.target.value = 20;
                errorMsg('tooMuchPeople');
                price += 1500;
            } else if ((event.target.value >= 10) && event.target.value <= 20) {
                price += 1500;
            } else if ((event.target.value >= 5)
            && (event.target.value < 10)) {
                price += 1000;
            }
            numbersOfVisitors = event.target.value;
            price = price + numbersOfVisitors * 500;
            pricePlace.innerHTML = price + ' рублей';
        } else {
            if (event.target.value > 20) {
                event.target.value = 20;
                errorMsg('tooMuchPeople');
                price += 1500;
            } else if ((event.target.value >= 10) && event.target.value <= 20) {
                price += 1500;
            } else if ((event.target.value >= 5)
            && (event.target.value < 10)) {
                price += 1000;
            }
            pricePlace.innerHTML = price + ' рублей';
            numbersOfVisitors = event.target.value;
        }

    };
    let option1Place = workingSpace.querySelector('#option1');
    let counterForOpt1 = 0;
    option1Place.onchange = function(event) {
        counterForOpt1 += 1;
        if (counterForOpt1 % 2 == 1) {
            price = Math.ceil(price / 100 * 130);
        } else {
            price = Math.ceil(price / 1.3);
        }
        pricePlace.innerHTML = price + ' рублей';
    };
    let option2Place = workingSpace.querySelector('#option2');
    option2Place.onchange = function(event) {
        counterForOpt2 += 1;
        if (counterForOpt2 % 2 == 1) {
            price = price + numbersOfVisitors * 500;
        } else {
            price = price - numbersOfVisitors * 500;
        }
        pricePlace.innerHTML = price + ' рублей';
    };
    let sendBtn = document.querySelector('#send-btn');
    sendBtn.onclick = async function() {
        let ur = 'http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/orders';
        let api_key = "?api_key=35a7578a-4292-405f-845e-fce51f65ee57";
        ur += api_key;
        let body = {
            'guide_id' : Number(choosenGuide.substring(5)),
            'route_id' : Number(choosenRoute),
            'date' : date,
            'time' : timeStart,
            'duration' : timeExcursion,
            'persons' : Number(numbersOfVisitors),
            'price' :  price,
            'optionFirst' : counterForOpt1 % 2,
            'optionSecond' : counterForOpt2 % 2,
        };
        let response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(body),
        });
        let result = await response.json();
    };
}

function chooseGuide(event) { //обработчик событий для кнопки в таблице гидов
    choosenGuide = event.target.id;
    event.target.innerHTML = 'Этот гид выбран';
    let modalBtn = document.querySelector('#modalBtn');
    modalBtn.className = 'container text-center';
    choosenGuideName = event.target.name;
    guidePrice = event.target.price;
}

async function guidesForRouteLoad() { //функция отображения гидов для маршрута
    let guides;
    let api_key = "?api_key=35a7578a-4292-405f-845e-fce51f65ee57";
    let guiUrl = 'http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes/'
     + choosenRoute + '/guides' + api_key;
    try {
        let getGuides = await fetch(guiUrl).then(response=>
            response.json().then(data => {
                guides = data;
            }));
        let guidesPlace = document.querySelector('#guides');
        let workingSpace = guidesPlace.querySelector('tbody');
        workingSpace.innerHTML = '';
        if (createdLang == 0) {
            let guidesLangSearched = ['Знание языков гидом'];
            for (let i = 0; i < guides.length; i++) {
                if (!guidesLangSearched.includes(guides[i].language)) {
                    guidesLangSearched.push(guides[i].language);
                }
            }
            guidesLangSearched.push('');
            let guidesTablePlace = document.querySelector('#guides-table');
            let guidesLangSelector = guidesTablePlace.querySelector('select');
            guidesLangSelector.innerHTML = '';
            for (let i = 0; i < guidesLangSearched.length; i++) {
                let option = document.createElement('option');
                let optionText = document.createTextNode(guidesLangSearched[i]);
                option.appendChild(optionText);
                guidesLangSelector.appendChild(option);
            }
            createdLang += 1;
        }
        if (createdExp == 0) {
            let guidesExpSearched = [];
            let expMaxSelector = document.querySelector('#guide-max');
            expMaxSelector.innerHTML = '';
            let expMinSelector = document.querySelector('#guide-min');
            expMinSelector.innerHTML = '';
            for (let i = 0; i < guides.length; i++) {
                if (!guidesExpSearched.includes(guides[i].workExperience)) {
                    guidesExpSearched.push(guides[i].workExperience);
                }
            }
            let minGuideExp = Math.min.apply(Math, guidesExpSearched);
            let maxGuideExp = Math.max.apply(Math, guidesExpSearched);
            let optionMin = document.createElement('option');
            let optionMinText = document.createTextNode('От');
            optionMin.appendChild(optionMinText);
            let optionMax = document.createElement('option');
            let optionMaxText = document.createTextNode('До');
            optionMax.appendChild(optionMaxText);
            expMaxSelector.appendChild(optionMax);
            expMinSelector.appendChild(optionMin);
            for (let i = minGuideExp; i <= maxGuideExp; i++) {
                let optionMin = document.createElement('option');
                let optionMinText = document.createTextNode(i);
                optionMin.appendChild(optionMinText);
                let optionMax = document.createElement('option');
                let optionMaxText = document.createTextNode(i);
                optionMax.appendChild(optionMaxText);
                expMaxSelector.appendChild(optionMax);
                expMinSelector.appendChild(optionMin); 
            };
            createdExp += 1;
        }
        let guidesSearched = [];
        for (let i = 0; i < guides.length; i++) {
            if (guides[i].language.includes(guideLangFilter)) {
                if ((guides[i].workExperience >= guideExpMinFilter) &&
                    (guides[i].workExperience <= guideExpMaxFilter)) {
                    guidesSearched.push(guides[i]);
                }
            }
        }
        let pagination = guidesPlace.querySelector('.pagination');
        amountOfPagesForGuides = Math.ceil(guidesSearched.length / 5);
        if (guidePage == 0) {
            pagination.innerHTML = '';
            if (guides.length == undefined || guidesSearched.length < 6) {
                let classes = 'pagination justify-content-center d-none';
                pagination.className = classes;
            } else {
                pagination.className = 'pagination justify-content-center';
                let end_position;
                if (guidesSearched.length < 11) {
                    end_position = 2;
                } else {
                    end_position = 3;
                }
                for (let i = 0; i < end_position; i++) {
                    let pageBtn = document.createElement('li');
                    pageBtn.className = 'page-item';
                    let pageLink = document.createElement('a');
                    pageLink.className = 'page-link';
                    let pageLinkText = document.createTextNode(i + 1);
                    pageLink.appendChild(pageLinkText);
                    pageBtn.appendChild(pageLink);
                    pagination.appendChild(pageBtn);
                    pageBtn.onclick = pgnGuidesHandler;
                }
            }
        }
        let end_position;
        if (guidePage * 5 + 5 < guidesSearched.length) {
            end_position = 5;
        } else {
            end_position = guidesSearched.length - guidePage * 5;
        }
        for (let i = 0; i < end_position; i++) {
            curentGuide = guidesSearched[guidePage * 5 + i];
            let cell = document.createElement('tr');
            cell.className = 'guide';
            let name = document.createElement('td');
            let nameText = document.createTextNode(curentGuide.name);
            name.className = 'name';
            name.appendChild(nameText);
            cell.appendChild(name);
            let language = document.createElement('td');
            let languageText = document.createTextNode(curentGuide.language);
            language.className = 'lang';
            language.appendChild(languageText);
            cell.appendChild(language);
            let price = document.createElement('td');
            let hourPrice = curentGuide.pricePerHour + ' руб/ч';
            let priceText = document.createTextNode(hourPrice);
            price.className = 'price';
            price.appendChild(priceText);
            cell.appendChild(price);
            let experience = document.createElement('td');
            let expText = document.createTextNode(curentGuide.workExperience);
            experience.className = 'exp';
            experience.appendChild(expText);
            cell.appendChild(experience);
            let btnWrap = document.createElement('td');
            let btn = document.createElement('button');
            let btnText;
            if ('guide' + curentGuide.id == choosenGuide) {
                btnText = document.createTextNode('Этот гид выбран');
            } else {
                btnText = document.createTextNode('Выбрать этого гида');
            }
            btn.price = curentGuide.pricePerHour;
            btn.name = curentGuide.name;
            btn.type = 'button';
            btn.className = 'btn btn-success';
            btn.id = 'guide' + curentGuide.id;
            btn.appendChild(btnText);
            btn.onclick = chooseGuide;
            btnWrap.appendChild(btn);
            cell.appendChild(btnWrap);
            workingSpace.appendChild(cell);
        }
    } catch (err) {
        let workingSpace = document.querySelector('.guides');
        workingSpace.innerHTML = '';
        let pagination = workingSpace.getElementsByClassName('pagination');
        pagination.className = "pagination justify-content-center d-none";
        errorMsg(err);
    }
}

function pgnGuidesHandler(event) { //обработчик событий для пагинации гидов
    guidePage = event.target.innerHTML - 1;
    guidesForRouteLoad();
    let guidesPlace = document.querySelector('.guides');
    let guidePgn = guidesPlace.querySelector('.pagination');
    let guidePgnBtns = guidePgn.getElementsByTagName('a');
    if (amountOfPagesForGuides > 3 && guidePage > 0
         && guidePage < amountOfPagesForGuides - 1) {
        guidePgnBtns[0].innerHTML = guidePage;
        guidePgnBtns[1].innerHTML = guidePage + 1;
        guidePgnBtns[2].innerHTML = guidePage + 2;
    }
}

function chooseRoute(event) { //обработчик событий для кнопок выбора маршрута
    if (choosenRoute != undefined) {
        try {
            let choosenRouteBtn = document.getElementById(String(choosenRoute));
            choosenRouteBtn.innerHTML = 'Выбрать этот маршрут';
        } catch (err) {
            event.target.innerHTML = 'Этот маршрут выбран';
            choosenRoute = event.target.id;
        }
    }
    let guideTable = document.querySelector('#guides-table');
    guideTable.className = 'input-group container';
    choosenGuide = '';
    createdLang = 0;
    createdExp = 0;
    guidePage = 0;
    guideExpMinFilter = 'От';
    guideExpMaxFilter = 'До';
    let guidesPlace = document.querySelector('.guides');
    guidesPlace.className = 'guides container';
    event.target.innerHTML = 'Этот маршрут выбран';
    choosenRoute = event.target.id;
    choosenRouteName = event.target.name;
    guidesForRouteLoad(choosenRoute);
}

function routePgnHandler(event) { //обработчик событий для пагинации маршрутов
    routePage = event.target.innerHTML - 1;
    routesLoad();
    let routePgn = document.querySelector('.pagination');
    let routePgnBtns = routePgn.getElementsByTagName('a');
    if (routePage > 0 && routePage < amountOfPagesForRoutes - 1) {
        routePgnBtns[0].innerHTML = routePage;
        routePgnBtns[1].innerHTML = routePage + 1;
        routePgnBtns[2].innerHTML = routePage + 2;
    }
}

function initPgnRoutes() { //функция настройки отображения пагинации маршрутов
    let routesPgn = document.querySelector('.routePgn');
    let routePgnBtn = routesPgn.getElementsByTagName('a');
    routePgnBtn[0].className = 'page-link routePgn';
    routePgnBtn[1].className = 'page-link routePgn';
    routePgnBtn[2].className = 'page-link routePgn';
    if (amountOfPagesForRoutes == 1 || amountOfPagesForRoutes == 0) {
        routePgnBtn[0].classList.add('d-none');
        routePgnBtn[1].classList.add('d-none');
        routePgnBtn[2].classList.add('d-none');
    } else if (amountOfPagesForRoutes == 2) {
        routePgnBtn[2].classList.add('d-none');
    }
};
routesLoad = async function() { //функция отображения маршрутов
    let routes;
    let routesUrl = 'http://exam-2023-1-api.std-900.ist';
    routesUrl += '.mospolytech.ru/api/routes';
    routesUrl += '?api_key=35a7578a-4292-405f-845e-fce51f65ee57';
    let getRoutes = await fetch(routesUrl).then(response =>
        response.json().then(data => {
            routes = data;
        }));
    let workingSpace = document.querySelector('.routes');
    workingSpace.innerHTML = '';
    let routesSearched = [];
    let routesObjs = [''];
    for (let i = 0; i < routes.length; i++) {
        if (!routesObjs.includes(routes[i].mainObject)) {
            routesObjs.push(routes[i].mainObject.substring(0, 120) + '...');
        }
    }
    routesObjs.push('');
    for (let i = 0; i < routes.length; i++) { 
        if (routes[i].name.includes(routeNameSelect)) {
            if (routes[i].mainObject.includes(routeObjSelect)) {
                routesSearched.push(routes[i]);
            }
        }
    }
    amountOfPagesForRoutes = Math.ceil(routesSearched.length / 3);
    initPgnRoutes();
    let routeObjSelector = document.querySelector('#selectObj');
    routeObjSelector.innerHTML = '';
    for (let i = 0; i < routesObjs.length; i++) {
        let option = document.createElement('option');
        let optionText = document.createTextNode(routesObjs[i]);
        option.appendChild(optionText);
        routeObjSelector.appendChild(option);
    }

    if (amountOfPagesForRoutes != 0) {
        for (let i = 0; i < 3 && routePage * 3 + i < routesSearched.length;
            i++) {
            curentRoute = routesSearched[routePage * 3 + i];
            let cell = document.createElement('div');
            cell.className = 'route text-center';
            let name = document.createElement('div');
            let nameText = document.createTextNode(curentRoute.name);
            name.className = 'name';
            name.appendChild(nameText);
            cell.appendChild(name);
            let desc = document.createElement('div');
            let descText = document.createTextNode(curentRoute.description);
            desc.className = 'desc';
            desc.appendChild(descText);
            cell.appendChild(desc);
            let mainObj = document.createElement('div');
            let mainObjText = document.createTextNode("Достопримечательности: " 
            + curentRoute.mainObject);
            mainObj.className = 'mainObj';
            mainObj.appendChild(mainObjText);
            cell.appendChild(mainObj);
            let btn = document.createElement('button');
            let btnText;
            if (curentRoute.id == choosenRoute) {
                btnText = document.createTextNode('Этот маршрут выбран');
            } else {
                btnText = document.createTextNode('Выбрать этот маршрут');
            }
            btn.appendChild(btnText);
            btn.type = 'button';
            btn.name = curentRoute.name;
            btn.className = 'btn btn-success';
            btn.id = curentRoute.id;
            btn.onclick = chooseRoute;
            cell.appendChild(btn);
            workingSpace.appendChild(cell);
        }
    }
};

function objSelectChange(event) { //обработчик событий для поиска маршрута
    let leng = event.target.value.length;
    routeObjSelect = event.target.value.substring(0, leng - 3);
    routePage = 0;
    routesLoad();
}

function searchNameInput(event) { //обработчик событий для поиска маршрута
    routeNameSelect = event.target.value;
    routePage = 0;
    routesLoad();
}

function guideLangChange(event) { //обработчик событий для поиска гида
    guideLangFilter = event.target.value;
    guidesForRouteLoad();
}

function changeGuideExp(event) { //обработчик событий для поиска гида
    if (event.target.id == 'guide-min') {
        guideExpMinFilter = event.target.value;
        
    } else {
        guideExpMaxFilter = event.target.value;
        
    }
    if ((guideExpMaxFilter != 'До') &&
    (guideExpMinFilter != 'От') &&
    (guideExpMaxFilter - guideExpMinFilter >= 0)) {
        guidesForRouteLoad();
    }
}

window.onload = function() { //обработчик события загрузки страницы
    try {
        routesLoad();
        let routePgn = document.querySelector('.routePgn');
        let routePgnBtn = routePgn.getElementsByTagName('a');
        for (let i = 0; i < 3; i++) {
            routePgnBtn[i].onclick = routePgnHandler;
        };
        let routeNameSearchInput = document.querySelector('input');
        routeNameSearchInput.onchange = searchNameInput;
        let routeObjSelect = document.querySelector('#selectObj');
        routeObjSelect.onchange = objSelectChange;
        let guidesTable = document.querySelector('#guides-table');
        let guideLangSelect = guidesTable.querySelector('select');
        guideLangSelect.onchange = guideLangChange;
        let guideMinExpSelect = document.querySelector('#guide-min');
        guideMinExpSelect.onclick = changeGuideExp;
        let guideMaxExpSelect = document.querySelector('#guide-max');
        guideMaxExpSelect.onclick = changeGuideExp;
        let modalBtn = document.querySelector('#modalBtn');
        modalBtn.onclick = modalOpen;
    } catch (err) {
        errorMsg(err);
    }
    errorMsg(123);
};