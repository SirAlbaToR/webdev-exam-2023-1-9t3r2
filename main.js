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

function modalOpen(event){
    let workingSpace = document.querySelector('.modal-body');
    let guideNamePlace = workingSpace.querySelector('#guide-name');
    guideNamePlace.innerHTML = choosenGuideName;
    let routeNamePlace = workingSpace.querySelector('#route-name');
    routeNamePlace.innerHTML = choosenRouteName;
    let timeExc = workingSpace.querySelector('#excTime');
    let price = guidePrice;
    let pricePlace = workingSpace.querySelector('#all-price');
    pricePlace.innerHTML = price + ' рублей';
    let timeExcursion;
    timeExc.onchange = function(event){
        price = guidePrice * event.target.value;
        pricePlace.innerHTML = price + ' рублей';
        timeExcursion = event.target.value;
    }
    let datePlace = workingSpace.querySelector('#inputDate');
    let date;
    datePlace.onchange = function(event){
        date = event.target.value;
    }
    let timeStart;
    let timeStartPlace = workingSpace.querySelector('#inputTime')
    timeStartPlace.onchange = function(event){
        if((event.target.value.substring(0,2) <= 12)
        && (event.target.value.substring(0,2) >= 9)){
            price += 400;
        }
        else if((event.target.value.substring(0,2) <= 23) 
        && event.target.value.substring(0,2) >= 20){
            price += 1000;
        }
        timeStart = event.target.value;
        pricePlace.innerHTML = price + ' рублей';
    }
    let numbersOfVisitors;
    let numbersOfVisitorsPlace = workingSpace.querySelector('#inputPers')
    numbersOfVisitorsPlace.onchange = function(event){
        if((event.target.value >= 5)
        && (event.target.value < 10)){
            price += 1000;
        }
        else if((event.target.value >= 10)){
            price += 1500;
        }
        pricePlace.innerHTML = price + ' рублей';
        numbersOfVisitors = event.target.value;
    }
    let option1Place = workingSpace.querySelector('#option1');
    let counterForOpt1 = 0;
    option1Place.onchange = function(event){
        counterForOpt1 += 1;
        if(counterForOpt1 % 2 == 1){
            price = price / 100 * 130;
        }
        else{
            price = (price / 1.3);
        }
        pricePlace.innerHTML = price + ' рублей';
    }
    let option2Place = workingSpace.querySelector('#option2');
    let counterForOpt2 = 0;
    option2Place.onchange = function(event){
        counterForOpt2 += 1;
        if(counterForOpt2 % 2 == 1){
            price = price + numbersOfVisitors * 500;
        }
        else{
            price = price - numbersOfVisitors * 500;
        }
        pricePlace.innerHTML = price + ' рублей';
    }
    let sendBtn = document.querySelector('#send-btn');
    sendBtn.onclick = async function(){
        let url = 'http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/orders'
        let api_key = "?api_key=35a7578a-4292-405f-845e-fce51f65ee57"
        url += api_key;
        let body = {
            'guide_id' : choosenGuide.substring(5),
            'route_id' : choosenRoute,
            'date' : date,
            'time' : timeStart,
            'duration' : timeExcursion,
            'persons' : numbersOfVisitors,
            'price' :  price ,
        }
        let response = await fetch(url,{
            method: 'POST',
            body: JSON.stringify(body),
        });
        let result = await response.json();
        console.log(result.message);
    }
}

function chooseGuide(event){
    choosenGuide = event.target.id;
    event.target.innerHTML = 'Этот гид выбран';
    let modalBtn = document.querySelector('#modalBtn');
    modalBtn.className = 'container text-center';
    choosenGuideName = event.target.name;
    guidePrice = event.target.price;
}

function pgnGuidesHandler(event){
    guidePage = event.target.innerHTML - 1;
    guidesForRouteLoad();
    let guidePgn = document.querySelector('.guides').querySelector('.pagination');
    let guidePgnBtns = guidePgn.getElementsByTagName('a');
    if(amountOfPagesForGuides > 3 && guidePage > 0 && guidePage < amountOfPagesForGuides - 1){
        guidePgnBtns[0].innerHTML = guidePage;
        guidePgnBtns[1].innerHTML = guidePage + 1;
        guidePgnBtns[2].innerHTML = guidePage + 2;
    }
}

async function guidesForRouteLoad(){
    let guides;
    let api_key = "?api_key=35a7578a-4292-405f-845e-fce51f65ee57";
    let guidesUrl = 'http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes/' + choosenRoute + '/guides' + api_key;
    try{
        let getGuides = await fetch(guidesUrl).then(response => response.json().then(data => {
        guides = data;
        }));
        let workingSpace = document.querySelector('#guides').querySelector('tbody');
        workingSpace.innerHTML = '';
        let guidesLangSearched = ['Знание языков гидом'];
        for(let i = 0; i < guides.length; i++){
            if(!guidesLangSearched.includes(guides[i].language)){
                guidesLangSearched.push(guides[i].language);
            }
        }
        guidesLangSearched.push('');
        let guidesLangSelector = document.querySelector('#guides-table').querySelector('select');
        guidesLangSelector.innerHTML = '';
        for(let i = 0; i < guidesLangSearched.length; i++){
            let option = document.createElement('option');
            let optionText = document.createTextNode(guidesLangSearched[i]);
            option.appendChild(optionText);
            guidesLangSelector.appendChild(option);
        }
        let guidesExpSearched = [];
        let expMaxSelector = document.querySelector('#guide-max');
        expMaxSelector.innerHTML = '';
        let expMinSelector = document.querySelector('#guide-min');
        expMinSelector.innerHTML = '';
        for(let i = 0; i < guides.length; i++){
            if(!guidesExpSearched.includes(guides[i].workExperience)){
                guidesExpSearched.push(guides[i].workExperience);
            }
        }
        console.log(guidesExpSearched);
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
        for(let i = minGuideExp; i <= maxGuideExp; i++){
            let optionMin = document.createElement('option');
            let optionMinText = document.createTextNode(i);
            optionMin.appendChild(optionMinText);
            let optionMax = document.createElement('option');
            let optionMaxText = document.createTextNode(i);
            optionMax.appendChild(optionMaxText);
            expMaxSelector.appendChild(optionMax);
            expMinSelector.appendChild(optionMin); 
        };
        let guidesSearched = [];
        for(let i = 0; i < guides.length; i++){
            if(guides[i].language.includes(guideLangFilter)){
                if((guides[i].workExperience >= guideExpMinFilter) &&
                    (guides[i].workExperience <= guideExpMaxFilter)){
                        guidesSearched.push(guides[i]);
                }
            }
        }
        console.log(guidesSearched);
        let pagination = document.querySelector('#guides').querySelector('.pagination');
        console.log(pagination);
        amountOfPagesForGuides = Math.ceil(guidesSearched.length/5);
        if(guidePage == 0){
            pagination.innerHTML = '';
            if(guides.length == undefined || guidesSearched.length < 6){
                pagination.className = 'pagination justify-content-center d-none';
            }
            else{
                pagination.className = 'pagination justify-content-center';
                let end_position;
                if(guides.length < 11){
                    end_position = 2;
                }
                else{
                    end_position = 3;
                }
                    for(let i = 0; i < end_position; i++){
                        let pageBtn = document.createElement('li');
                        pageBtn.className = 'page-item';
                        let pageLink = document.createElement('a');
                        pageLink.className = 'page-link';
                        let pageLinkText = document.createTextNode(i+1);
                        pageLink.appendChild(pageLinkText);
                        pageBtn.appendChild(pageLink);
                        pagination.appendChild(pageBtn);
                        pageBtn.onclick = pgnGuidesHandler;
                    }
            }
        }
            let end_position;
            if(guidePage*5 + 5 < guidesSearched.length){
                end_position = 5;
            }
            else{
                end_position = guidesSearched.length - guidePage*5;
            }
            for(let i = 0; i < end_position; i++){
                curentGuide = guidesSearched[guidePage*5 + i];
                let cell = document.createElement('tr');
                cell.className = 'guide'
                let name = document.createElement('td');
                let nameText = document.createTextNode(curentGuide.name);
                name.className = 'name';
                name.appendChild(nameText);
                cell.appendChild(name);
                let language = document.createElement('td');
                let languageText = document.createTextNode(curentGuide.language);
                language.className = 'lang';
                language.appendChild(languageText)
                cell.appendChild(language);
                let price = document.createElement('td');
                let priceText = document.createTextNode(curentGuide.pricePerHour + ' руб/ч');
                price.className = 'price';
                price.appendChild(priceText);
                cell.appendChild(price);
                let experience = document.createElement('td');
                let experienceText = document.createTextNode(curentGuide.workExperience);
                experience.className = 'exp';
                experience.appendChild(experienceText);
                cell.appendChild(experience);
                let btnWrap = document.createElement('td')
                let btn = document.createElement('button');
                let btnText;
                if('guide' + curentGuide.id == choosenGuide){
                    btnText = document.createTextNode('Этот гид выбран');
                }
                else{
                    btnText = document.createTextNode('Выбрать этого гида')
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
    } catch(err){
        let workingSpace = document.querySelector('.guides');
        workingSpace.innerHTML = '';
        let pagination = workingSpace.getElementsByClassName('pagination');
        pagination.className = "pagination justify-content-center d-none";
        console.log(err);
    }
}

function chooseRoute(event){
    if(choosenRoute != undefined){
        try {
            let choosenRouteBtnPlace = document.getElementById(String(choosenRoute));
            choosenRouteBtnPlace.innerHTML = 'Выбрать этот маршрут';
        }   catch(err){
            event.target.innerHTML = 'Этот маршрут выбран';
            choosenRoute = event.target.id;
        }
    }
    let guideTable = document.querySelector('#guides-table')
    guideTable.className = 'input-group container';
    choosenGuide = '';
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

function routePgnHandler(event){
    routePage = event.target.innerHTML - 1;
    routesLoad();
    let routePgn = document.querySelector('.pagination');
    let routePgnBtns = routePgn.getElementsByTagName('a');
    if(routePage > 0 && routePage < amountOfPagesForRoutes - 1){
        routePgnBtns[0].innerHTML = routePage;
        routePgnBtns[1].innerHTML = routePage + 1;
        routePgnBtns[2].innerHTML = routePage + 2;
    }
}

function initPgnRoutes(){
    let routesPgn = document.querySelector('.routePgn');
    let routePgnBtn = routesPgn.getElementsByTagName('a')
    routePgnBtn[0].className = 'page-link routePgn';
    routePgnBtn[1].className = 'page-link routePgn';
    routePgnBtn[2].className = 'page-link routePgn';
    if(amountOfPagesForRoutes == 1 || amountOfPagesForRoutes == 0){
        routePgnBtn[0].classList.add('d-none');
        routePgnBtn[1].classList.add('d-none');
        routePgnBtn[2].classList.add('d-none');
    }
    else if(amountOfPagesForRoutes == 2){
        routePgnBtn[2].classList.add('d-none')
    }
};
routesLoad = async function(){
    let routes;
    let routesUrl = 'http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes?api_key=35a7578a-4292-405f-845e-fce51f65ee57';
    let getRoutes = await fetch(routesUrl).then(response => response.json().then(data => {
        routes = data;
    }));
    let workingSpace = document.querySelector('.routes');
    workingSpace.innerHTML = '';
    let routesSearched = [];
    let routesObjs = [''];
    for(let i = 0; i < routes.length; i++){
        if(!routesObjs.includes(routes[i].mainObject)){
            routesObjs.push(routes[i].mainObject.substring(0,120) + '...');
        }
    }
    routesObjs.push('');
    for(let i = 0; i < routes.length; i++){
        if(routes[i].name.includes(routeNameSelect)){
            if(routes[i].mainObject.includes(routeObjSelect)){
                routesSearched.push(routes[i]);
            }
        }
    }
    amountOfPagesForRoutes = Math.ceil(routesSearched.length/3);
    initPgnRoutes();
    let routeObjSelector = document.querySelector('#selectObj');
    routeObjSelector.innerHTML = '';
    for(let i = 0; i < routesObjs.length; i++){
        let option = document.createElement('option');
        let optionText = document.createTextNode(routesObjs[i]);
        option.appendChild(optionText);
        routeObjSelector.appendChild(option);
    }

    if(amountOfPagesForRoutes != 0){
        for(let i = 0; i < 3 && routePage*3 + i < routesSearched.length; i++){
            curentRoute = routesSearched[routePage*3 + i]
            let cell =  document.createElement('div');
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
            let mainObjText = document.createTextNode("Достопримечательности: " + curentRoute.mainObject);
            mainObj.className = 'mainObj';
            mainObj.appendChild(mainObjText);
            cell.appendChild(mainObj);
            let btn = document.createElement('button');
            let btnText;
            if(curentRoute.id == choosenRoute){
                btnText = document.createTextNode('Этот маршрут выбран');
            }
            else{
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
}

function objSelectChange(event){
    routeObjSelect = event.target.value.substring(0,event.target.value.length - 3);
    routePage = 0;
    routesLoad();
}

function searchNameInput(event){
    routeNameSelect = event.target.value;
    routePage = 0;
    routesLoad();
}

function guideLangChange(event){
    guideLangFilter = event.target.value;
    guidesForRouteLoad();
}

function changeGuideExp(event){

    if(event.target.id == 'guide-min'){
        guideExpMinFilter = event.target.value;
    }
    else{
        guideExpMaxFilter = event.target.value;
    }
    if((guideExpMaxFilter != 'До' && guideExpMaxFilter != '') &&
    (guideExpMinFilter != 'От' && guideExpMinFilter != '') &&
    (guideExpMaxFilter >= guideExpMinFilter)){
        guidesForRouteLoad();
    }
    console.log(guideExpMaxFilter);
    console.log(guideExpMinFilter);
}

window.onload = function(){
    try {
        let api_key = "35a7578a-4292-405f-845e-fce51f65ee57";
        routesLoad();
        let routePgn = document.querySelector('.routePgn');
        let routePgnBtn = routePgn.getElementsByTagName('a')
        for(let i = 0; i < 3; i++){
            routePgnBtn[i].onclick = routePgnHandler;
        };
        let routeNameSearchInput = document.querySelector('input');
        routeNameSearchInput.onchange = searchNameInput;
        let routeObjSelect = document.querySelector('#selectObj');
        routeObjSelect.onchange = objSelectChange;
        let guideLangSelect = document.querySelector('#guides-table').querySelector('select');
        guideLangSelect.onchange = guideLangChange;
        let guideMinExpSelect = document.querySelector('#guide-min');
        guideMinExpSelect.onchange = changeGuideExp;
        let guideMaxExpSelect = document.querySelector('#guide-max');
        guideMaxExpSelect.onclick = changeGuideExp;
        let modalBtn = document.querySelector('#modalBtn');
        modalBtn.onclick = modalOpen;
    } catch(err){

    }
}