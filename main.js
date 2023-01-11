function clickHandler(event){
    console.log(event);
}


routesLoad = async function(nameSelect = '', objSelect = '', page = 0){
    console.log(1);
    let routes;
    let routesUrl = 'http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes?api_key=35a7578a-4292-405f-845e-fce51f65ee57';
    let abc = await fetch(routesUrl).then(response => response.json().then(data => {
        routes = data;
    }));
    let workingSpace = document.querySelector('.routes');
    workingSpace.innerHTML = '';
    for(let i = 0; i < 3; i++){
        curentRoute = routes[page*3 + i]
        console.log(curentRoute);
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
        let btnText = document.createTextNode('Выбрать этот маршрут');
        btn.appendChild(btnText);
        btn.type = 'button';
        btn.className = 'btn btn-success';
        btn.id = 'route';
        btn.onclick = clickHandler;
        cell.appendChild(btn);
        workingSpace.appendChild(cell);
    }
}


window.onload = function(){
    let api_key = "35a7578a-4292-405f-845e-fce51f65ee57";
    routesLoad();
    let routePgn = document.querySelector('.routePgn');
    let routePgnBtn = routePgn.querySelector('a');
    routePgn.addEventListener('click', clickHandler);
}