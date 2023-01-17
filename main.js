let routeNameSelect = '';
let routeObjSelect = '';
let routePage = 0;
let amountOfPagesForRoutes;
let choosenRoute;
let guidePage = 0;
let choosenGuide;
let amountOfPagesForGuides;

function chooseGuide(event){
    console.log(event.target.id);
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
        let workingSpace = document.querySelector('.guides-list');
        workingSpace.innerHTML = '';
        console.log(guides.length);
        let pagination = document.querySelector('.guides').querySelector('.pagination');
        amountOfPagesForGuides = Math.ceil(guides.length/5);
        if(guidePage == 0){
            pagination.innerHTML = '';
            if(guides.length == undefined || guides.length < 6){
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
            if(guidePage*5 + 5 < guides.length){
                end_position = 5;
            }
            else{
                end_position = guides.length - guidePage*5;
            }
            for(let i = 0; i < end_position; i++){
                curentGuide = guides[guidePage*5 + i];
                let cell = document.createElement('li');
                cell.className = 'guide d-flex justify-content-between list-group-item'
                let name = document.createElement('div');
                let nameText = document.createTextNode(curentGuide.name);
                name.className = 'name';
                name.appendChild(nameText);
                cell.appendChild(name);
                let language = document.createElement('div');
                let languageText = document.createTextNode(curentGuide.language);
                language.className = 'lang';
                language.appendChild(languageText)
                cell.appendChild(language);
                let price = document.createElement('div');
                let priceText = document.createTextNode(curentGuide.pricePerHour + ' руб/ч');
                price.className = 'price';
                price.appendChild(priceText);
                cell.appendChild(price);
                let experience = document.createElement('div');
                let experienceText = document.createTextNode(curentGuide.workExperience);
                experience.className = 'exp';
                cell.appendChild(experience);
                let btn = document.createElement('button');
                let btnText;
                if(guidePage*3 + i == choosenGuide){
                    btnText = document.createTextNode('Этот гид выбран');
                }
                else{
                    btnText = document.createTextNode('Выбрать этого гида')
                }
                btn.type = 'button';
                btn.className = 'btn btn-success';
                btn.id = 'guide' + String(guidePage*3 + i);
                btn.appendChild(btnText);
                btn.onclick = chooseGuide;
                cell.appendChild(btn);
                workingSpace.appendChild(cell);
        }
    } catch(err){
        let workingSpace = document.querySelector('.guides-list');
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
    guidePage = 0;
    let guidesPlace = document.querySelector('.guides');
    guidesPlace.className = 'guides container';
    event.target.innerHTML = 'Этот маршрут выбран';
    choosenRoute = event.target.id;
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


routesLoad = async function(){
    let routes;
    let routesUrl = 'http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes?api_key=35a7578a-4292-405f-845e-fce51f65ee57';
    let getRoutes = await fetch(routesUrl).then(response => response.json().then(data => {
        routes = data;
    }));
    let workingSpace = document.querySelector('.routes');
    workingSpace.innerHTML = '';
    let routesSearched = [];
    for(let i = 0; i < routes.length; i++){
        if(routes[i].name.includes(routeNameSelect)){
            routesSearched.push(routes[i]);
        }
    }
    amountOfPagesForRoutes = Math.ceil(routesSearched.length/3);
    for(let i = 0; i < 3; i++){
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
        if(routePage*3 + i == choosenRoute){
            btnText = document.createTextNode('Этот маршрут выбран');
        }
        else{
            btnText = document.createTextNode('Выбрать этот маршрут');
        }
        btn.appendChild(btnText);
        btn.type = 'button';
        btn.className = 'btn btn-success';
        btn.id = routePage*3 + i;
        btn.onclick = chooseRoute;
        cell.appendChild(btn);
        workingSpace.appendChild(cell);
    }
}

function searchNameInput(event){
    routeNameSelect = event.target.value;
    routesLoad()
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
    } catch(err){

    }
}